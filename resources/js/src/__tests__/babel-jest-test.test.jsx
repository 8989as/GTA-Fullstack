import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test component to verify Babel and Jest configuration
const TestComponent = ({ message = 'Hello World' }) => {
    return (
        <div data-testid="test-component">
            <h1>{message}</h1>
            <p>This is a test component to verify Babel JSX transformation works.</p>
        </div>
    );
};

describe('Babel and Jest Configuration Test', () => {
    test('should render React component with JSX transformation', () => {
        render(<TestComponent message="Babel and Jest are working!" />);

        expect(screen.getByTestId('test-component')).toBeInTheDocument();
        expect(screen.getByText('Babel and Jest are working!')).toBeInTheDocument();
        expect(screen.getByText('This is a test component to verify Babel JSX transformation works.')).toBeInTheDocument();
    });

    test('should handle React hooks and state', () => {
        const ComponentWithState = () => {
            const [count, setCount] = React.useState(0);

            return (
                <div>
                    <span data-testid="count">{count}</span>
                    <button onClick={() => setCount(count + 1)}>Increment</button>
                </div>
            );
        };

        render(<ComponentWithState />);

        expect(screen.getByTestId('count')).toHaveTextContent('0');

        const button = screen.getByText('Increment');
        button.click();

        expect(screen.getByTestId('count')).toHaveTextContent('1');
    });

    test('should support modern JavaScript features', () => {
        const ModernComponent = () => {
            const data = [1, 2, 3, 4, 5];
            const doubled = data.map(x => x * 2);
            const { length } = doubled;

            return (
                <div>
                    <span data-testid="array-length">{length}</span>
                    <span data-testid="first-doubled">{doubled[0]}</span>
                </div>
            );
        };

        render(<ModernComponent />);

        expect(screen.getByTestId('array-length')).toHaveTextContent('5');
        expect(screen.getByTestId('first-doubled')).toHaveTextContent('2');
    });
});