#!/bin/bash

echo "╔══════════════════════════════════════════╗"
echo "║   Portfolio Quick Start Script           ║"
echo "║   Mohammad Nasim Safi                    ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check Node.js
echo -e "${BLUE}[1/6]${NC} Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Step 2: Install dependencies
echo -e "${BLUE}[2/6]${NC} Installing dependencies..."
npm install --silent
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 3: Setup environment
echo -e "${BLUE}[3/6]${NC} Setting up environment..."
if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo -e "${YELLOW}⚠️  Created .env.local from template${NC}"
        echo -e "${YELLOW}⚠️  Please update .env.local with your actual values${NC}"
    else
        echo -e "${RED}❌ .env.example not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ .env.local exists${NC}"
fi

# Step 4: Database setup
echo -e "${BLUE}[4/6]${NC} Setting up database..."
npm run db:push --silent
echo -e "${GREEN}✅ Database schema pushed${NC}"

# Step 5: Seed data
echo -e "${BLUE}[5/6]${NC} Seeding initial data..."
npm run db:seed --silent
echo -e "${GREEN}✅ Data seeded${NC}"

# Step 6: Build
echo -e "${BLUE}[6/6]${NC} Building project..."
npm run build
echo -e "${GREEN}✅ Build complete${NC}"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Setup Complete!                     ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo "📝 To start development:"
echo "   npm run dev"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Admin:    http://localhost:3000/login"
echo ""
echo "🔑 Default Admin Credentials:"
echo "   Email:    admin@nasimsafi.com"
echo "   Password: admin123"
echo ""
echo "⚠️  Don't forget to:"
echo "   1. Update .env.local with real values"
echo "   2. Change admin password after first login"
echo "   3. Replace favicon files in /public"
echo ""