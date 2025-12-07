#!/bin/bash

# Quick script to check if server is running and test endpoints

echo "🔍 Checking SNACK BOX Server Status..."
echo ""

# Check if server is running
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Server is running on port 3000"
    echo ""
    
    # Test health endpoint
    echo "📊 Health Check:"
    curl -s http://localhost:3000/api/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3000/api/health
    echo ""
    echo ""
    
    # Test send-otp endpoint
    echo "📧 Testing send-otp endpoint:"
    curl -s -X POST http://localhost:3000/api/auth/send-otp \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com"}' | python3 -m json.tool 2>/dev/null || \
    curl -s -X POST http://localhost:3000/api/auth/send-otp \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com"}'
    echo ""
    
else
    echo "❌ Server is NOT running on port 3000"
    echo ""
    echo "To start the server, run:"
    echo "  npm run server"
    echo ""
    echo "Then keep that terminal open and try again."
fi

