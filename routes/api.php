<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
    });
});

// Public product routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/search', [ProductController::class, 'search']);
    Route::get('/{slug}', [ProductController::class, 'show']);
});

// Collection routes
Route::get('collections/{slug}', [ProductController::class, 'collection']);

// Cart routes (stateful for guest users)
Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index']);
    Route::post('/', [CartController::class, 'store']);
    Route::put('/{lineId}', [CartController::class, 'update']);
    Route::delete('/{lineId}', [CartController::class, 'destroy']);
    Route::delete('/', [CartController::class, 'clear']);
});

// Checkout routes
Route::prefix('checkout')->group(function () {
    Route::get('/', [CheckoutController::class, 'index']);
    Route::post('/shipping-address', [CheckoutController::class, 'setShippingAddress']);
    Route::post('/billing-address', [CheckoutController::class, 'setBillingAddress']);
    Route::post('/shipping-option', [CheckoutController::class, 'setShippingOption']);
    Route::post('/payment', [CheckoutController::class, 'processPayment']);
});

// Test route for React integration
Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Laravel API is working!',
        'timestamp' => now()->toISOString(),
        'server' => 'Laravel ' . app()->version(),
    ]);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
