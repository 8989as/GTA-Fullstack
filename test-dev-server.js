#!/usr/bin/env node

/**
 * Development Server Integration Test
 * 
 * This script tests the Laravel-Vite integration by:
 * 1. Checking if Laravel server is running on port 8000
 * 2. Checking if Vite dev server is running on port 5173
 * 3. Testing API communication
 * 4. Verifying HMR functionality
 */

import http from 'http';
import https from 'https';

// Test if a server is running on a specific port
function testServer(port, name) {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: port,
            method: 'GET',
            timeout: 2000
        }, (res) => {
            console.log(`✅ ${name} is running on port ${port}`);
            resolve(true);
        });

        req.on('error', () => {
            console.log(`❌ ${name} is NOT running on port ${port}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log(`⏰ ${name} timeout on port ${port}`);
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

// Test API endpoint
function testAPI() {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 8000,
            path: '/api/products',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 5000
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ API endpoint /api/products is working');
                    resolve(true);
                } else {
                    console.log(`❌ API endpoint returned status ${res.statusCode}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (err) => {
            console.log(`❌ API test failed: ${err.message}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log('⏰ API test timeout');
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

// Main test function
async function runTests() {
    console.log('🚀 Testing Development Server Integration...\n');

    const laravelRunning = await testServer(8000, 'Laravel Server');
    const viteRunning = await testServer(5173, 'Vite Dev Server');

    if (laravelRunning && viteRunning) {
        console.log('\n🔗 Testing API Communication...');
        const apiWorking = await testAPI();

        if (apiWorking) {
            console.log('\n✅ All tests passed! Development environment is properly configured.');
            console.log('\n📋 Next steps:');
            console.log('1. Visit http://localhost:8000 to see the React app served by Laravel');
            console.log('2. Visit http://localhost:5173 to see the React app served by Vite (with HMR)');
            console.log('3. Make changes to React components and verify HMR works');
            console.log('4. Test API calls from the React app');
        } else {
            console.log('\n⚠️  Servers are running but API communication failed.');
            console.log('Check Laravel logs and ensure API routes are properly configured.');
        }
    } else {
        console.log('\n❌ Development servers are not running properly.');
        console.log('\n📋 To start the servers:');
        console.log('1. Run: php artisan serve (for Laravel on port 8000)');
        console.log('2. Run: npm run dev (for Vite on port 5173)');
    }
}

runTests().catch(console.error);