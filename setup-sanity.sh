#!/bin/bash

# 🚀 Sanity CMS Setup Script
# Automated installation for Test Agency project

echo "================================================"
echo "🚀 SANITY CMS SETUP - TEST AGENCY"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "studio" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the sanitycms root directory"
    exit 1
fi

echo "${BLUE}📦 Installing Dependencies...${NC}"
echo ""

# Install Studio dependencies
echo "${YELLOW}1/3 Installing Sanity Studio...${NC}"
cd studio
npm install
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Studio dependencies installed${NC}"
else
    echo "❌ Failed to install Studio dependencies"
    exit 1
fi
echo ""

# Install Backend dependencies
echo "${YELLOW}2/3 Installing Backend...${NC}"
cd ../backend
npm install
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo "❌ Failed to install Backend dependencies"
    exit 1
fi
echo ""

# Install Frontend dependencies
echo "${YELLOW}3/3 Installing Frontend...${NC}"
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo "❌ Failed to install Frontend dependencies"
    exit 1
fi
echo ""

# Create environment files if they don't exist
cd ..
echo "${BLUE}🔧 Setting up environment files...${NC}"
echo ""

# Studio .env
if [ ! -f "studio/.env.local" ]; then
    echo "Creating studio/.env.local..."
    cp studio/.env.example studio/.env.local
    echo "${YELLOW}⚠️  IMPORTANT: Edit studio/.env.local with your Sanity Project ID${NC}"
else
    echo "studio/.env.local already exists, skipping..."
fi

# Backend .env
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env..."
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo "${YELLOW}⚠️  IMPORTANT: Edit backend/.env with your Sanity credentials${NC}"
    fi
else
    echo "backend/.env already exists, skipping..."
fi

# Frontend .env
if [ ! -f "frontend/.env.local" ]; then
    echo "Creating frontend/.env.local..."
    if [ -f "frontend/.env.example" ]; then
        cp frontend/.env.example frontend/.env.local
        echo "${YELLOW}⚠️  IMPORTANT: Edit frontend/.env.local with your Sanity Project ID${NC}"
    fi
else
    echo "frontend/.env.local already exists, skipping..."
fi

echo ""
echo "================================================"
echo "${GREEN}✅ INSTALLATION COMPLETE!${NC}"
echo "================================================"
echo ""
echo "${BLUE}📚 Next Steps:${NC}"
echo ""
echo "1️⃣  Setup Sanity:"
echo "   • Go to https://sanity.io"
echo "   • Create account and new project"
echo "   • Get your Project ID"
echo ""
echo "2️⃣  Configure Environment:"
echo "   • Edit studio/.env.local with your Project ID"
echo "   • Edit backend/.env with Sanity credentials"
echo "   • Edit frontend/.env.local with Project ID"
echo ""
echo "3️⃣  Start Development:"
echo "   ${YELLOW}cd studio && npm run dev${NC}     # Sanity Studio at :3333"
echo "   ${YELLOW}cd backend && npm run dev${NC}    # API Server at :3000"
echo "   ${YELLOW}cd frontend && npm run dev${NC}   # Website at :3001"
echo ""
echo "4️⃣  Deploy Studio:"
echo "   ${YELLOW}cd studio && npm run deploy${NC}  # Get hosted Studio URL"
echo ""
echo "================================================"
echo "${GREEN}📖 Full Documentation:${NC}"
echo "   • SANITY_CMS_SETUP.md - Complete setup guide"
echo "   • CLIENT_HANDOVER.md - Client instructions"
echo "   • README_SANITY.md - Project overview"
echo "================================================"
echo ""
echo "${GREEN}🎉 Ready to build something amazing!${NC}"
echo ""
