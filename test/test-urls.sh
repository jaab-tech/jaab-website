#!/bin/bash

# Test URLs and basic functionality
# Requires Jekyll server to be running

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
BASE_URL="http://localhost:4000"

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🌐 URL Testing Suite${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Check if server is running
echo -e "${BLUE}🔍 Checking if Jekyll server is running...${NC}"
if ! curl -s "$BASE_URL" > /dev/null; then
    echo -e "${RED}❌ Jekyll server not running at $BASE_URL${NC}"
    echo -e "${YELLOW}   Start server with: bundle exec jekyll serve --host 0.0.0.0 --port 4000${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Test homepage variants
echo -e "${BLUE}📄 Testing language variants...${NC}"
PAGES=(
    "/:Spanish Homepage"
    "/en/:English Homepage"
    "/pt/:Portuguese Homepage"
    "/blog/:Blog Listing"
    "/privacy/:Privacy Policy"
)

for page_info in "${PAGES[@]}"; do
    IFS=':' read -r url name <<< "$page_info"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url")
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo -e "${GREEN}  ✓ $name ($url) - HTTP $HTTP_CODE${NC}"
    else
        echo -e "${RED}  ❌ $name ($url) - HTTP $HTTP_CODE${NC}"
        ((ERRORS++))
    fi
done
echo ""

# Test redirects
echo -e "${BLUE}🔀 Testing redirects...${NC}"
REDIRECTS=(
    "/meet:Meet redirect"
    "/modernization:Modernization redirect"
    "/modernizacion:Modernizacion redirect (ES)"
    "/modernizacao:Modernização redirect (PT)"
)

for redirect_info in "${REDIRECTS[@]}"; do
    IFS=':' read -r url name <<< "$redirect_info"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url")
    if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 301 ] || [ "$HTTP_CODE" -eq 302 ]; then
        echo -e "${GREEN}  ✓ $name ($url) - HTTP $HTTP_CODE${NC}"
    else
        echo -e "${YELLOW}  ⚠ $name ($url) - HTTP $HTTP_CODE${NC}"
    fi
done
echo ""

# Test assets
echo -e "${BLUE}🎨 Testing assets...${NC}"
ASSETS=(
    "/assets/css/style.css:Main stylesheet"
    "/assets/js/main.js:Main JavaScript"
    "/assets/images/logo.svg:Logo"
)

for asset_info in "${ASSETS[@]}"; do
    IFS=':' read -r url name <<< "$asset_info"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url")
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo -e "${GREEN}  ✓ $name - HTTP $HTTP_CODE${NC}"
    else
        echo -e "${YELLOW}  ⚠ $name - HTTP $HTTP_CODE (may be expected)${NC}"
    fi
done
echo ""

# Check for broken links (basic check)
echo -e "${BLUE}🔗 Testing internal links...${NC}"
if command -v wget &> /dev/null; then
    echo -e "${YELLOW}  Running wget spider check (this may take a moment)...${NC}"
    if wget --spider -r -nd -nv -l 2 "$BASE_URL" 2>&1 | grep -i "broken link" > /dev/null; then
        echo -e "${RED}  ❌ Found broken links${NC}"
        wget --spider -r -nd -nv -l 2 "$BASE_URL" 2>&1 | grep -i "broken link"
        ((ERRORS++))
    else
        echo -e "${GREEN}  ✓ No broken links found (depth 2)${NC}"
    fi
else
    echo -e "${YELLOW}  ⚠ wget not found, skipping link check${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All URL tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS error(s) in URL tests${NC}"
    exit 1
fi

