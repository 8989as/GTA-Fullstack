import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const APITest = () => {
    const [apiStatus, setApiStatus] = useState('testing');
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        testAPI();
    }, []);

    const testAPI = async () => {
        try {
            setApiStatus('testing');
            setError(null);

            // Test API connection
            const response = await api.get('/products');

            if (response.data) {
                setProducts(response.data.data || response.data);
                setApiStatus('success');
            }
        } catch (err) {
            console.error('API Test Error:', err);
            setError(err.message);
            setApiStatus('error');
        }
    };

    const getStatusColor = () => {
        switch (apiStatus) {
            case 'testing': return 'warning';
            case 'success': return 'success';
            case 'error': return 'danger';
            default: return 'secondary';
        }
    };

    const getStatusText = () => {
        switch (apiStatus) {
            case 'testing': return 'Testing API Connection...';
            case 'success': return 'API Connection Successful';
            case 'error': return 'API Connection Failed';
            default: return 'Unknown Status';
        }
    };

    return (
        <div className="card m-3 p-3">
            <h3 className="text-primary">API Integration Test</h3>

            <div className={`alert alert-${getStatusColor()}`} role="alert">
                <strong>{getStatusText()}</strong>
                {error && <div className="mt-2">Error: {error}</div>}
            </div>

            {apiStatus === 'success' && (
                <div>
                    <p className="text-success">
                        ✅ Successfully connected to Laravel API
                    </p>
                    <p className="text-muted">
                        Found {products.length} products in the database
                    </p>
                    {products.length > 0 && (
                        <div className="mt-3">
                            <h5>Sample Products:</h5>
                            <ul className="list-group">
                                {products.slice(0, 3).map((product, index) => (
                                    <li key={index} className="list-group-item">
                                        {product.name || product.title || `Product ${index + 1}`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-3">
                <button
                    className="btn btn-primary"
                    onClick={testAPI}
                    disabled={apiStatus === 'testing'}
                >
                    {apiStatus === 'testing' ? 'Testing...' : 'Test API Again'}
                </button>
            </div>

            <div className="mt-3">
                <small className="text-muted">
                    <strong>Base URL:</strong> {api.defaults.baseURL}
                </small>
            </div>
        </div>
    );
};

export default APITest;