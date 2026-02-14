#!/bin/bash

# Script to create a new release of .NET Notepad
# This automates the release process by:
# 1. Updating version in package.json
# 2. Committing the change
# 3. Creating and pushing a git tag
# 4. GitHub Actions will automatically build and create the release

set -e

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}.NET Notepad Release Creator${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}Warning: You are on branch '${CURRENT_BRANCH}', not 'main'${NC}"
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}Current version: ${CURRENT_VERSION}${NC}"
echo ""

# Prompt for new version
echo "Enter new version number (e.g., 1.0.0.1, 1.1.0.0):"
echo "  - Major.Minor.Patch.Build format"
echo "  - Increment Build for small updates"
echo "  - Increment Patch for bug fixes"
echo "  - Increment Minor for new features"
echo "  - Increment Major for breaking changes"
read -p "New version: " NEW_VERSION

# Validate version format
if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}Error: Invalid version format. Use Major.Minor.Patch.Build (e.g., 1.0.0.1)${NC}"
    exit 1
fi

# Confirm
echo ""
echo -e "${YELLOW}This will:${NC}"
echo "  1. Update package.json version to ${NEW_VERSION}"
echo "  2. Commit the change"
echo "  3. Create tag v${NEW_VERSION}"
echo "  4. Push tag to GitHub"
echo "  5. Trigger automatic build and release"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

echo ""
echo -e "${BLUE}Step 1: Updating package.json...${NC}"
# Update version in package.json using node
node -e "const fs = require('fs'); const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); pkg.version = '${NEW_VERSION}'; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');"
echo -e "${GREEN}✓ Updated package.json${NC}"

echo ""
echo -e "${BLUE}Step 2: Committing changes...${NC}"
git add package.json
git commit -m "Bump version to ${NEW_VERSION}"
echo -e "${GREEN}✓ Committed${NC}"

echo ""
echo -e "${BLUE}Step 3: Pushing to main...${NC}"
git push origin $CURRENT_BRANCH
echo -e "${GREEN}✓ Pushed to ${CURRENT_BRANCH}${NC}"

echo ""
echo -e "${BLUE}Step 4: Creating tag v${NEW_VERSION}...${NC}"
git tag "v${NEW_VERSION}"
echo -e "${GREEN}✓ Created tag v${NEW_VERSION}${NC}"

echo ""
echo -e "${BLUE}Step 5: Pushing tag to GitHub...${NC}"
git push origin "v${NEW_VERSION}"
echo -e "${GREEN}✓ Pushed tag${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Release process started successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "GitHub Actions is now building:"
echo "  • Web version (ZIP)"
echo "  • Windows installers (EXE)"
echo "  • Linux packages (AppImage, DEB)"
echo "  • macOS disk image (DMG)"
echo ""
echo "Monitor progress at:"
echo -e "${BLUE}https://github.com/dotnetappdev/dotnetnotepad/actions${NC}"
echo ""
echo "Release will be available at:"
echo -e "${BLUE}https://github.com/dotnetappdev/dotnetnotepad/releases/tag/v${NEW_VERSION}${NC}"
echo ""
