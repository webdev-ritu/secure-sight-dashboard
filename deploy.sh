#!/bin/bash

# Secure Sight Dashboard Deployment Script

echo "🚀 Starting deployment of Secure Sight Dashboard..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Creating from template..."
    cp .env.production .env
    echo "⚠️  Please edit .env file with your production values before proceeding!"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️  Setting up database..."
npx prisma db push

# Seed database if needed
echo "🌱 Seeding database..."
npx prisma db seed

# Build the application
echo "🏗️  Building application..."
npm run build

# Start the production server
echo "✅ Build complete! Starting production server..."
npm start

echo "🎉 Deployment complete! Application should be running on http://localhost:3000"