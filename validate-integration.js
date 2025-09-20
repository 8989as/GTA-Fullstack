#!/usr/bin/env node

/**
 * Comprehensive Integration Validation Script
 * Tests React-Laravel integration, context providers, and API communication
 */

import http from 'http';
import { spawn } from 'child_process';
import { readFileSync } from 'fs';

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
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
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    log(`✓ ${description} - Status: ${res.statusCode}`, colors.green);
                    resolve({ success: true, data, statusCode: res.statusCode });
                } else {
                    log(`✗ ${description} - Status: ${res.statusCode}`, colors.red);
                    resolve({ success: false, statusCode: res.statusCode });
                }
            });
        });

        req.on('error', (error) => {
            log(`✗ ${description} - Error: ${error.message}`, colors.red);
            resolve({ success: false, error: error.message });
        });

        req.setTimeout(5000, () => {
            log(`✗ ${description} - Timeout`, colors.red);
            req.destroy();
            resolve({ success: false, error: 'timeout' });
        });

        req.end();
    });
};

const checkFileExists = (filePath, description) => {
    try {
        readFileSync(filePath, 'utf8');
        log(`✓ ${description}`, colors.green);
        return true;
    } catch (error) {
        log(`✗ ${description} - File not found`, colors.red);
        return false;
    }
};

const checkFileContent = (filePath, searchText, description) => {
    try {
        const content = readFileSync(filePath, 'utf8');
        if (content.includes(searchText)) {
            log(`✓ ${description}`, colors.green);
            return true;
        } else {
            log(`✗ ${description} - Content not found`, colors.red);
            return false;
        }
    } catch (error) {
        log(`✗ ${description} - File error: ${error.message}`, colors.red);
        return false;
    }
};

const main = async () => {
    log(`${colors.bold}${colors.cyan}React-Laravel Integration Validation${colors.reset}`);
    log('='.repeat(60));

    let totalTests = 0;
    let passedTests = 0;

    // 1. File Structure Tests
    log(`\n${colors.bold}1. File Structure Validation${colors.reset}`, colors.blue);
    log('-'.repeat(40));

    const fileTests = [
        ['resources/js/main.jsx', 'React entry point exists'],
        ['resources/js/App.jsx', 'Main App component exists'],
        ['resources/js/src/components/TestComponent.jsx', 'Test component exists'],
        ['resources/js/src/context/index.jsx', 'Context index exists'],
        ['resources/js/src/context/LanguageContext.jsx', 'Language context exists'],
        ['resources/js/src/context/AuthContext.jsx', 'Auth context exists'],
        ['resources/js/src/context/CartContext.jsx', 'Cart context exists'],
        ['resources/js/src/services/api.js', 'API service exists'],
        ['vite.config.js', 'Vite configuration exists'],
        ['package.json', 'Package.json exists'],
        ['routes/api.php', 'API routes exist'],
        ['resources/views/app.blade.php', 'Laravel view template exists']
    ];

    fileTests.forEach(([file, desc]) => {
        totalTests++;
        if (checkFileExists(file, desc)) passedTests++;
    });

    // 2. Configuration Tests
    log(`\n${colors.bold}2. Configuration Validation${colors.reset}`, colors.blue);
    log('-'.repeat(40));

    const configTests = [
        ['vite.config.js', '@vitejs/plugin-react', 'Vite React plugin configured'],
        ['vite.config.js', 'laravel-vite-plugin', 'Laravel Vite plugin configured'],
        ['package.json', '"react":', 'React dependency exists'],
        ['package.json', '"@vitejs/plugin-react":', 'Vite React plugin dependency exists'],
        ['resources/js/src/context/index.jsx', 'AppProvider', 'App provider configured'],
        ['resources/js/App.jsx', 'TestComponent', 'Test component imported'],
        ['routes/api.php', '/api/test', 'Test API route exists']
    ];

    configTests.forEach(([file, search, desc]) => {
        totalTests++;
        if (checkFileContent(file, search, desc)) passedTests++;
    });

    // 3. Server Tests
    log(`\n${colors.bold}3. Server Integration Tests${colors.reset}`, colors.blue);
    log('-'.repeat(40));

    const serverTests = [
        ['http://localhost:8000/api/test', 'Laravel API endpoint'],
        ['http://localhost:8000/test', 'React test route through Laravel'],
        ['http://localhost:8000/', 'Laravel root route']
    ];

    for (const [url, desc] of serverTests) {
        totalTests++;
        const result = await testEndpoint(url, desc);
        if (result.success) passedTests++;
    }

    // 4. Context Provider Tests
    log(`\n${colors.bold}4. Context Provider Validation${colors.reset}`, colors.blue);
    log('-'.repeat(40));

    const contextTests = [
        ['resources/js/src/context/LanguageContext.jsx', 'useLanguage', 'Language context hook exists'],
        ['resources/js/src/context/AuthContext.jsx', 'useAuth', 'Auth context hook exists'],
        ['resources/js/src/context/CartContext.jsx', 'useCart', 'Cart context hook exists'],
        ['resources/js/src/context/LanguageContext.jsx', 'toggleLanguage', 'Language toggle function exists'],
        ['resources/js/src/context/AuthContext.jsx', 'login', 'Auth login function exists'],
        ['resources/js/src/context/CartContext.jsx', 'addToCart', 'Cart add function exists']
    ];

    contextTests.forEach(([file, search, desc]) => {
        totalTests++;
        if (checkFileContent(file, search, desc)) passedTests++;
    });

    // 5. Build Test
    log(`\n${colors.bold}5. Build Process Validation${colors.reset}`, colors.blue);
    log('-'.repeat(40));

    totalTests++;
    if (checkFileExists('public/build/manifest.json', 'Build manifest exists (run npm run build if missing)')) {
        passedTests++;
    }

    // Summary
    log(`\n${'='.repeat(60)}`);
    log(`${colors.bold}Integration Test Summary${colors.reset}`);
    log(`Total Tests: ${totalTests}`);
    log(`Passed: ${colors.green}${passedTests}${colors.reset}`);
    log(`Failed: ${colors.red}${totalTests - passedTests}${colors.reset}`);

    const successRate = Math.round((passedTests / totalTests) * 100);
    log(`Success Rate: ${successRate >= 80 ? colors.green : colors.yellow}${successRate}%${colors.reset}`);

    if (successRate >= 80) {
        log(`\n🎉 ${colors.green}Integration validation successful!${colors.reset}`);
        log(`\n${colors.cyan}Next steps:${colors.reset}`);
        log(`• Visit http://localhost:8000/test to see the test component`);
        log(`• Test language switching functionality`);
        log(`• Test API communication with the test button`);
        log(`• Verify HMR by editing React components`);
    } else {
        log(`\n❌ ${colors.red}Integration validation failed.${colors.reset}`);
        log(`\n${colors.yellow}Please check the failed tests above and:${colors.reset}`);
        log(`• Ensure Laravel server is running: php artisan serve`);
        log(`• Ensure Vite dev server is running: npm run dev`);
        log(`• Run npm run build to generate production assets`);
    }
};

main().catch(console.error);