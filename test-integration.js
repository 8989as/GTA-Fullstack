#!/usr/bin/env node

/**
 * Integration Test Script
 * Tests that Laravel and Vite development servers work together
 */

import http from 'http';

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

const log = (message, color = colors.reset) => {
    console.log(`${color}${message}${colors.reset}`);
};

const testEndpoint = async (url, description) => {
    return new Promise((resolve) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Integration-Test/1.0'
            }
        };

        const req = http.request(options, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                log(`✓ ${description} - Status: ${res.statusCode}`, colors.green);
                resolve(true);
            } else {
                log(`✗ ${description} - Status: ${res.statusCode}`, colors.red);
                resolve(false);
            }
        });

        req.on('error', (error) => {
            log(`✗ ${description} - Error: ${error.message}`, colors.red);
            resolve(false);
        });

        req.setTimeout(5000, () => {
            log(`✗ ${description} - Timeout`, colors.red);
            req.destroy();
            resolve(false);
        });

        req.end();
    });
};

const main = async () => {
    log(`${colors.bold}React-Laravel Integration Test${colors.reset}`);
    log('='.repeat(50));

    // Test Laravel server
    log('\n1. Testing Laravel Server (port 8000)...', colors.blue);
    const laravelWorking = await testEndpoint('http://localhost:8000/api/test', 'Laravel API endpoint');

    if (!laravelWorking) {
        log('\n⚠️  Laravel server might not be running. Start it with:', colors.yellow);
        log('   php artisan serve', colors.yellow);
    }

    // Test Vite dev server
    log('\n2. Testing Vite Dev Server (port 5173)...', colors.blue);
    const viteWorking = await testEndpoint('http://localhost:5173', 'Vite dev server');

    if (!viteWorking) {
        log('\n⚠️  Vite dev server might not be running. Start it with:', colors.yellow);
        log('   npm run dev', colors.yellow);
    }

    // Test API proxy through Vite
    if (viteWorking) {
        log('\n3. Testing API Proxy through Vite...', colors.blue);
        await testEndpoint('http://localhost:5173/api/test', 'API proxy through Vite');
    }

    // Test React app serving
    if (laravelWorking) {
        log('\n4. Testing React App through Laravel...', colors.blue);
        await testEndpoint('http://localhost:8000/test', 'React test route through Laravel');
    }

    log('\n' + '='.repeat(50));

    if (laravelWorking && viteWorking) {
        log('🎉 Integration test completed successfully!', colors.green);
        log('\nYou can now:', colors.blue);
        log('• Visit http://localhost:8000 for the full app', colors.blue);
        log('• Visit http://localhost:8000/test for the test component', colors.blue);
        log('• Visit http://localhost:5173 for Vite dev server with HMR', colors.blue);
    } else {
        log('❌ Some services are not running. Please check the servers.', colors.red);
    }
};

main().catch(console.error);