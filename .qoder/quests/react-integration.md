# React SPA Integration with Laravel API Backend

## Overview

This design outlines the transformation of a Laravel Livewire-based e-commerce application into a React Single Page Application (SPA) that consumes Laravel APIs. The system will maintain the existing Lunar e-commerce functionality while providing a modern, responsive frontend experience with improved performance and user interaction.

### Current Architecture
- **Frontend**: Laravel Livewire components with Blade templates
- **Backend**: Laravel with Lunar e-commerce package
- **Authentication**: Laravel Sanctum (already configured)
- **State Management**: Server-side state via Livewire

### Target Architecture
- **Frontend**: React SPA with client-side routing
- **Backend**: Laravel API-only backend serving JSON responses
- **Authentication**: Laravel Sanctum token-based authentication
- **State Management**: React Context API with persistent storage

## Technology Stack & Dependencies

### Frontend Stack
- **React 18+**: Modern React with hooks and concurrent features
- **React Router v6**: Client-side routing and navigation
- **React Context API**: Global state management for auth, cart, and products
- **Axios**: HTTP client with interceptors for API communication
- **Bootstrap 5**: UI framework with RTL/LTR support
- **Vite**: Build tool and development server

### Backend Stack  
- **Laravel 10+**: API backend framework
- **Laravel Sanctum**: Token-based authentication
- **Lunar Package**: E-commerce functionality and models
- **Laravel CORS**: Cross-origin resource sharing configuration

### Development Tools
- **Vite**: Frontend build system and hot reload
- **Laravel Vite Plugin**: Integration between Laravel and Vite
- **Jest + React Testing Library**: Frontend testing framework

## Architecture Design

### Application Structure

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React SPA] --> B[React Router]
        A --> C[Context Providers]
        C --> D[Auth Context]
        C --> E[Cart Context]
        C --> F[Products Context]
        C --> G[Language Context]
    end
    
    subgraph "Service Layer"
        H[API Service] --> I[Auth Service]
        H --> J[Product Service]
        H --> K[Cart Service]
        H --> L[Checkout Service]
    end
    
    subgraph "Backend Layer"
        M[Laravel API] --> N[Auth Controller]
        M --> O[Product Controller]
        M --> P[Cart Controller]
        M --> Q[Checkout Controller]
    end
    
    A --> H
    H --> M
    
    subgraph "Data Layer"
        R[Lunar Models] --> S[Products]
        R --> T[Cart]
        R --> U[Orders]
        R --> V[Customers]
    end
    
    M --> R
```

### Component Architecture

```mermaid
graph TD
    A[App Component] --> B[Router]
    B --> C[Public Routes]
    B --> D[Protected Routes]
    
    C --> E[Homepage]
    C --> F[Products Page]
    C --> G[Product Detail]
    C --> H[Auth Pages]
    
    D --> I[Checkout]
    D --> J[Profile]
    D --> K[Order History]
    
    A --> L[Global Providers]
    L --> M[AuthProvider]
    L --> N[CartProvider]
    L --> O[ProductsProvider]
    L --> P[LanguageProvider]
    
    A --> Q[Shared Components]
    Q --> R[Navbar]
    Q --> S[Footer]
    Q --> T[Loading Spinner]
    Q --> U[Error Boundary]
```

### State Management Architecture

| Context | Purpose | Persistent Storage | Scope |
|---------|---------|-------------------|-------|
| **AuthContext** | User authentication state, login/logout actions | localStorage (auth_token, user) | Global |
| **CartContext** | Shopping cart items, quantities, totals | sessionStorage (guest), API (authenticated) | Global |
| **ProductsContext** | Product listings, filters, search results | URL parameters, sessionStorage (filters) | Products pages |
| **LanguageContext** | UI language, RTL/LTR direction | localStorage (language preference) | Global |

## Routing & Navigation

### Route Structure

| Route Pattern | Component | Access Level | API Endpoints |
|---------------|-----------|--------------|---------------|
| `/` | Homepage | Public | `/api/products` (featured) |
| `/products` | ProductsPage | Public | `/api/products` |
| `/products/:slug` | ProductDetail | Public | `/api/products/{slug}` |
| `/collections/:slug` | CollectionPage | Public | `/api/collections/{slug}` |
| `/search` | SearchPage | Public | `/api/products/search` |
| `/cart` | CartPage | Public | `/api/cart` |
| `/checkout` | CheckoutPage | Protected | `/api/checkout/*` |
| `/profile` | ProfilePage | Protected | `/api/auth/user` |
| `/orders` | OrdersPage | Protected | `/api/orders` |

### Navigation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant R as React Router
    participant A as Auth Guard
    participant C as Component
    participant API as Laravel API
    
    U->>R: Navigate to route
    R->>A: Check route protection
    alt Protected Route
        A->>A: Verify auth token
        alt Token valid
            A->>C: Render component
        else Token invalid
            A->>R: Redirect to login
        end
    else Public Route
        R->>C: Render component
    end
    C->>API: Fetch required data
    API-->>C: Return JSON response
    C->>U: Display content
```

## API Integration Layer

### Authentication Flow

```mermaid
sequenceDiagram
    participant F as Frontend
    participant L as Laravel API
    participant S as Sanctum
    participant DB as Database
    
    F->>L: POST /api/auth/login
    L->>S: Validate credentials
    S->>DB: Check user credentials
    DB-->>S: User verified
    S-->>L: Generate token
    L-->>F: Return token + user data
    F->>F: Store token in localStorage
    
    Note over F,L: Subsequent API requests
    F->>L: API request with Bearer token
    L->>S: Validate token
    S-->>L: Token valid
    L-->>F: Return protected data
```

### API Service Configuration

The API service layer provides a centralized HTTP client with the following features:

- **Base Configuration**: Axios instance with default headers and CSRF protection
- **Token Management**: Automatic Bearer token attachment from localStorage
- **Error Handling**: Global error interceptors for 401/422 responses
- **Request Interceptors**: CSRF token and authentication headers
- **Response Interceptors**: Token refresh and validation error handling

### Service Layer Architecture

| Service | Responsibilities | Key Methods |
|---------|------------------|-------------|
| **AuthService** | Login, logout, registration, user profile | `login()`, `logout()`, `register()`, `getUser()` |
| **ProductService** | Product listings, search, filtering | `getProducts()`, `searchProducts()`, `getProduct()` |
| **CartService** | Cart management, line items | `getCart()`, `addItem()`, `updateItem()`, `removeItem()` |
| **CheckoutService** | Checkout process, payment | `getCheckout()`, `setAddress()`, `processPayment()` |

## Data Flow Between Layers

### Product Browsing Flow

```mermaid
sequenceDiagram
    participant U as User
    participant PC as Products Component
    participant PS as ProductService
    participant API as Laravel API
    participant DB as Lunar Database
    
    U->>PC: Apply filters/search
    PC->>PS: getProducts(filters)
    PS->>API: GET /api/products?filters
    API->>DB: Query products with filters
    DB-->>API: Return product collection
    API-->>PS: JSON response
    PS-->>PC: Product data
    PC->>PC: Update component state
    PC-->>U: Display filtered products
```

### Cart Management Flow

```mermaid
sequenceDiagram
    participant U as User
    participant CC as Cart Component
    participant CS as CartService
    participant API as Laravel API
    participant Session as Laravel Session
    
    U->>CC: Add product to cart
    CC->>CS: addItem(productId, quantity)
    CS->>API: POST /api/cart
    API->>Session: Update cart session
    Session-->>API: Cart updated
    API-->>CS: Updated cart data
    CS-->>CC: New cart state
    CC->>CC: Update cart count/total
    CC-->>U: Visual confirmation
```

## Authentication & Security

### Authentication Strategy

The system implements token-based authentication using Laravel Sanctum:

1. **Guest State**: Users can browse products and manage cart without authentication
2. **Login Process**: Username/password exchanged for Bearer token
3. **Token Storage**: Secure storage in localStorage with automatic cleanup
4. **Protected Routes**: Checkout and profile features require authentication
5. **Token Refresh**: Automatic token validation and logout on expiry

### Security Measures

| Security Layer | Implementation | Purpose |
|----------------|----------------|---------|
| **CSRF Protection** | Laravel CSRF tokens in API headers | Prevent cross-site request forgery |
| **CORS Configuration** | Configured for React development server | Control cross-origin requests |
| **Token Validation** | Sanctum middleware on protected routes | Ensure authenticated access |
| **Input Validation** | Laravel form requests and validation rules | Sanitize and validate user input |
| **Rate Limiting** | Laravel throttling on auth endpoints | Prevent brute force attacks |

## Styling Strategy

### Bootstrap 5 Integration

- **Responsive Grid**: Mobile-first responsive layout system
- **Component Library**: Pre-built UI components (buttons, forms, modals)
- **RTL/LTR Support**: Automatic text direction switching for Arabic/English
- **Theme Customization**: Custom CSS variables for brand colors and spacing
- **Icon Integration**: Bootstrap Icons for consistent iconography

### Layout Structure

```mermaid
graph TB
    A[App Container] --> B[Navbar]
    A --> C[Main Content Area]
    A --> D[Footer]
    
    C --> E[Route Components]
    E --> F[Page Layout]
    F --> G[Content Sections]
    
    G --> H[Product Grid]
    G --> I[Sidebar Filters]
    G --> J[Pagination]
    
    A --> K[Global Modals]
    K --> L[Auth Modal]
    K --> M[Cart Modal]
    K --> N[Confirmation Modals]
```

## Testing Strategy

### Frontend Testing Approach

| Test Type | Framework | Scope | Coverage |
|-----------|-----------|-------|----------|
| **Unit Tests** | Jest + React Testing Library | Individual components and utilities | Component logic, state management |
| **Integration Tests** | Jest + MSW (Mock Service Worker) | API service interactions | Service layer functionality |
| **Component Tests** | React Testing Library | User interactions and UI behavior | User workflows and form validation |
| **E2E Tests** | Cypress (future enhancement) | Complete user journeys | Critical business flows |

### Backend API Testing

The existing Laravel test suite should be extended to cover API endpoints:

- **Feature Tests**: API endpoint responses and authentication
- **Unit Tests**: Controller logic and service classes
- **Database Tests**: Data persistence and relationships

## Migration Strategy

### Phase 1: Infrastructure Setup
1. Configure Vite build system for React development
2. Set up React Router and basic component structure
3. Implement API service layer with authentication
4. Create global state management contexts

### Phase 2: Core Functionality Migration
1. Migrate product browsing functionality
2. Implement cart management with session persistence
3. Set up authentication flow with login/logout
4. Create responsive layout with Bootstrap integration

### Phase 3: Advanced Features
1. Implement checkout process with payment integration
2. Add user profile and order history
3. Implement search and filtering capabilities
4. Add multilingual support with RTL/LTR switching

### Phase 4: Testing & Optimization
1. Comprehensive testing suite implementation
2. Performance optimization and code splitting
3. SEO improvements and meta tag management
4. Production deployment configuration

## Route Configuration Changes

### Laravel Routes Transformation

**Current Web Routes** (to be removed):
- All Livewire component routes will be replaced with API endpoints
- Web routes will only serve the React SPA entry point

**New API Routes** (already implemented):
- Authentication endpoints (`/api/auth/*`)
- Product endpoints (`/api/products/*`)  
- Cart endpoints (`/api/cart/*`)
- Checkout endpoints (`/api/checkout/*`)

**SPA Entry Point**:
- All web routes will serve the React application
- React Router handles client-side routing
- Laravel serves static React build files

### Build System Integration

The Vite configuration needs to be updated to:
1. Build React application for production
2. Generate manifest for Laravel asset helpers
3. Handle hot module replacement in development
4. Optimize bundle size with code splitting

This transformation will result in a modern, performant e-commerce platform that leverages the best of both Laravel's robust backend capabilities and React's dynamic frontend experience.