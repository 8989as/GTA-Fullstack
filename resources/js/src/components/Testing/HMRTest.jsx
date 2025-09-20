import React, { useState } from 'react';

const HMRTest = () => {
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState('HMR Test Component');

    return (
        <div className="card m-3 p-3">
            <h3 className="text-primary">{message}</h3>
            <p className="text-muted">
                This component tests Hot Module Replacement (HMR) functionality.
                Try editing this file and see if changes appear without page refresh.
            </p>
            <div className="d-flex align-items-center gap-3">
                <button
                    className="btn btn-primary"
                    onClick={() => setCount(count + 1)}
                >
                    Count: {count}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => setMessage(message === 'HMR Test Component' ? 'HMR is Working!' : 'HMR Test Component')}
                >
                    Toggle Message
                </button>
            </div>
            <small className="text-success mt-2">
                ✅ If you can see changes without page refresh, HMR is working correctly!
            </small>
        </div>
    );
};

export default HMRTest;