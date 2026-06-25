#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Banner
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║     Mohammad Nasim Safi - Portfolio Setup                ║"
echo "║     Full Stack Developer & IT/Networking Engineer        ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check Node.js
echo -e "${BLUE}[1/8]${NC} Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ is required. Current version: $(node --version)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version) detected${NC}"

# Install dependencies
echo ""
echo -e "${BLUE}[2/8]${NC} Installing dependencies..."
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Create .env.local if not exists
echo ""
echo -e "${BLUE}[3/8]${NC} Setting up environment variables..."
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    
    # Generate random secret
    RANDOM_SECRET=$(openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
    
    cat > .env.local << EOL
# Database
DATABASE_URL="postgresql://neondb_owner:npg_HanIfq63SsEN@ep-odd-darkness-atflkg1q-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${RANDOM_SECRET}"

# GitHub
GITHUB_USERNAME="nasimsafi30"
GITHUB_TOKEN=""

# Admin (change after first login!)
ADMIN_EMAIL="admin@nasimsafi.com"
ADMIN_PASSWORD="admin123"
EOL
    
    echo -e "${GREEN}✅ .env.local created with default values${NC}"
    echo -e "${YELLOW}⚠️  Please update .env.local with your actual values:${NC}"
    echo -e "   - DATABASE_URL (if using different database)"
    echo -e "   - GITHUB_TOKEN (for project auto-sync)"
    echo -e "   - ADMIN_EMAIL and ADMIN_PASSWORD (change defaults)"
else
    echo -e "${GREEN}✅ .env.local exists${NC}"
fi

# Create public directory if not exists
echo ""
echo -e "${BLUE}[4/8]${NC} Setting up assets..."
mkdir -p public
mkdir -p scripts
mkdir -p src/lib/db/migrations

# Create placeholder files
touch public/favicon.ico
touch public/favicon-16x16.png
touch public/favicon-32x32.png
touch public/apple-touch-icon.png
touch public/icon-192x192.png
touch public/icon-512x512.png
touch public/og-image.png
touch src/lib/db/migrations/.gitkeep
echo -e "${GREEN}✅ Asset directories created${NC}"
echo -e "${YELLOW}⚠️  Remember to replace favicon and image files with actual ones${NC}"

# Push database schema
echo ""
echo -e "${BLUE}[5/8]${NC} Setting up database..."
npm run db:push
echo -e "${GREEN}✅ Database schema pushed${NC}"

# Seed database
echo ""
echo -e "${BLUE}[6/8]${NC} Seeding initial data..."
npm run db:seed
echo -e "${GREEN}✅ Database seeded${NC}"

# Build project
echo ""
echo -e "${BLUE}[7/8]${NC} Building project..."
npm run build
echo -e "${GREEN}✅ Build complete${NC}"

# Final message
echo ""
echo -e "${BLUE}[8/8]${NC} Setup complete!"
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║   ✅ Portfolio setup complete!                           ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📝 Quick Start:${NC}"
echo -e "   ${MAGENTA}npm run dev${NC}"
echo ""
echo -e "${CYAN}🌐 URLs:${NC}"
echo -e "   Frontend: ${MAGENTA}http://localhost:3000${NC}"
echo -e "   Admin:    ${MAGENTA}http://localhost:3000/login${NC}"
echo ""
echo -e "${CYAN}🔑 Default Admin Credentials:${NC}"
echo -e "   Email:    ${MAGENTA}admin@nasimsafi.com${NC}"
echo -e "   Password: ${MAGENTA}admin123${NC}"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo -e "   1. Update ${MAGENTA}.env.local${NC} with your real values"
echo -e "   2. Change admin password after first login"
echo -e "   3. Add your GitHub token for project auto-sync"
echo -e "   4. Replace favicon files in ${MAGENTA}public/${NC} directory"
echo -e "   5. Update ${MAGENTA}sitemap.ts${NC} and ${MAGENTA}robots.ts${NC} with your domain"
echo ""
echo -e "${CYAN}📦 Available Commands:${NC}"
echo -e "   ${MAGENTA}npm run dev${NC}       - Start development server"
echo -e "   ${MAGENTA}npm run build${NC}     - Build for production"
echo -e "   ${MAGENTA}npm run start${NC}     - Start production server"
echo -e "   ${MAGENTA}npm run db:push${NC}   - Push database changes"
echo -e "   ${MAGENTA}npm run db:seed${NC}   - Re-seed database"
echo -e "   ${MAGENTA}npm run db:studio${NC} - Open Drizzle Studio"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"