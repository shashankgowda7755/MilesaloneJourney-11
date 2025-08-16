#!/usr/bin/env node
// Custom build script for Vercel deployment

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting build process for travel blog...');

// Step 1: Build the frontend
console.log('📦 Building frontend...');
execSync('vite build', { stdio: 'inherit' });

// Step 2: Build the backend
console.log('🔧 Building backend...');
execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=cjs --outdir=dist', { stdio: 'inherit' });
execSync('esbuild server/routes.ts --platform=node --packages=external --bundle --format=cjs --outdir=dist', { stdio: 'inherit' });

// Step 3: Copy necessary files
console.log('📁 Copying necessary files...');
if (!fs.existsSync('dist/shared')) {
  fs.mkdirSync('dist/shared', { recursive: true });
}

// Copy schema file
fs.copyFileSync('shared/schema.ts', 'dist/shared/schema.ts');

console.log('✅ Build complete!');