#!/bin/bash

# Pre-commit validation script for JAAB TECH website
# Usage: ./test/validate.sh

# Note: We don't use 'set -e' because we want to collect all errors

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🧪 JAAB TECH - Pre-Commit Validation Suite${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Test 1: Check required files exist
echo -e "${BLUE}📁 Test 1: Checking required files...${NC}"
REQUIRED_FILES=(
    "_config.yml"
    "_layouts/default.html"
    "assets/css/style.scss"
    "assets/js/main.js"
    "_data/translations.yml"
    "_includes/homepage.html"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}  ❌ Missing required file: $file${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}  ✓ $file${NC}"
    fi
done
echo ""

# Test 2: Validate translations completeness
echo -e "${BLUE}📝 Test 2: Validating translations...${NC}"

# Check all languages have the same keys
LANGUAGES=("es" "en" "pt")
REQUIRED_KEYS=(
    "nav.home"
    "footer.tagline"
    "footer.contact"
    "footer.rights"
    "footer.privacy"
    "footer.credits"
    "credits_modal.title"
    "credits_modal.intro"
    "credits_modal.jekyll_desc"
    "credits_modal.github_desc"
    "credits_modal.cursor_desc"
    "credits_modal.claude_desc"
    "credits_modal.thanks"
)

for lang in "${LANGUAGES[@]}"; do
    echo -e "  Checking ${lang}..."
    for key in "${REQUIRED_KEYS[@]}"; do
        # Convert dot notation to grep pattern
        grep_key=$(echo "$key" | sed 's/\./:/g')
        if ! grep -q "${lang}:" _data/translations.yml; then
            echo -e "${RED}    ❌ Language '$lang' not found${NC}"
            ((ERRORS++))
            break
        fi
    done
    echo -e "${GREEN}    ✓ ${lang} translations present${NC}"
done
echo ""

# Test 3: Check for hardcoded text in HTML
echo -e "${BLUE}🔍 Test 3: Checking for hardcoded text...${NC}"

# Patterns that should NOT appear (should use translations instead)
HARDCODED_PATTERNS=(
    "Créditos del Sitio"
    "Site Credits"
    "Créditos do Site"
    "Todos los derechos reservados"
    "All rights reserved"
    "Política de Privacidad"
    "Privacy Policy"
)

HARDCODED_FOUND=false
for pattern in "${HARDCODED_PATTERNS[@]}"; do
    # Check if pattern exists WITHOUT site.data.translations on the same line
    if grep -n "$pattern" _layouts/default.html | grep -v "site.data.translations" | grep -v "default:" > /dev/null 2>&1; then
        if [ "$HARDCODED_FOUND" = false ]; then
            echo -e "${RED}  ❌ Found hardcoded text (should use translations):${NC}"
            HARDCODED_FOUND=true
        fi
        grep -n "$pattern" _layouts/default.html | grep -v "site.data.translations" | grep -v "default:" | sed 's/^/    /'
        ((WARNINGS++))
    fi
done

if [ "$HARDCODED_FOUND" = false ]; then
    echo -e "${GREEN}  ✓ No hardcoded text found${NC}"
fi
echo ""

# Test 4: Validate JavaScript syntax
echo -e "${BLUE}🔧 Test 4: Validating JavaScript syntax...${NC}"
if command -v node &> /dev/null; then
    if node -c assets/js/main.js 2>/dev/null; then
        echo -e "${GREEN}  ✓ JavaScript syntax is valid${NC}"
    else
        echo -e "${RED}  ❌ JavaScript has syntax errors${NC}"
        node -c assets/js/main.js
        ((ERRORS++))
    fi
else
    echo -e "${YELLOW}  ⚠ Node.js not found, skipping JS validation${NC}"
    ((WARNINGS++))
fi
echo ""

# Test 5: Check modal ID references consistency
echo -e "${BLUE}🔗 Test 5: Checking modal ID references...${NC}"
MODAL_IDS=("credits-modal" "close-credits" "credits-link")

for id in "${MODAL_IDS[@]}"; do
    HTML_COUNT=$(grep -c "id=\"$id\"" _layouts/default.html || echo 0)
    JS_COUNT=$(grep -c "$id" assets/js/main.js || echo 0)
    
    if [ "$HTML_COUNT" -gt 0 ] && [ "$JS_COUNT" -gt 0 ]; then
        echo -e "${GREEN}  ✓ '$id' referenced in HTML and JS${NC}"
    else
        echo -e "${RED}  ❌ '$id' missing: HTML=$HTML_COUNT, JS=$JS_COUNT${NC}"
        ((ERRORS++))
    fi
done
echo ""

# Test 6: Check CSS class consistency
echo -e "${BLUE}🎨 Test 6: Checking CSS class consistency...${NC}"
CSS_CLASSES=("credits-modal" "credits-modal-overlay" "credits-modal-content" "credits-modal-close" "credit-item")

for class in "${CSS_CLASSES[@]}"; do
    HTML_COUNT=$(grep -c "class=\"$class\|class=.*$class" _layouts/default.html || echo 0)
    CSS_COUNT=$(grep -c "\.$class" assets/css/style.scss || echo 0)
    
    if [ "$CSS_COUNT" -gt 0 ]; then
        echo -e "${GREEN}  ✓ '.$class' defined in CSS (HTML refs: $HTML_COUNT)${NC}"
    else
        echo -e "${YELLOW}  ⚠ '.$class' not found in CSS${NC}"
        ((WARNINGS++))
    fi
done
echo ""

# Test 7: Validate Jekyll build
echo -e "${BLUE}🏗️  Test 7: Validating Jekyll build...${NC}"
if command -v bundle &> /dev/null; then
    if bundle exec jekyll build --trace 2>&1 | grep -q "done in"; then
        echo -e "${GREEN}  ✓ Jekyll builds successfully${NC}"
        # Clean up build artifacts
        rm -rf _site 2>/dev/null || true
    else
        echo -e "${RED}  ❌ Jekyll build failed${NC}"
        bundle exec jekyll build --trace
        ((ERRORS++))
    fi
else
    echo -e "${YELLOW}  ⚠ Bundle not found, skipping Jekyll build validation${NC}"
    ((WARNINGS++))
fi
echo ""

# Test 8: Check for TODO/FIXME comments
echo -e "${BLUE}📌 Test 8: Checking for TODO/FIXME comments...${NC}"
TODO_COUNT=$(grep -r "TODO\|FIXME" --include="*.html" --include="*.js" --include="*.scss" --include="*.yml" . 2>/dev/null | grep -v "test/validate.sh" | wc -l || echo 0)
if [ "$TODO_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}  ⚠ Found $TODO_COUNT TODO/FIXME comments${NC}"
    grep -rn "TODO\|FIXME" --include="*.html" --include="*.js" --include="*.scss" --include="*.yml" . 2>/dev/null | grep -v "test/validate.sh" | sed 's/^/    /'
    ((WARNINGS++))
else
    echo -e "${GREEN}  ✓ No TODO/FIXME comments found${NC}"
fi
echo ""

# Test 9: Check for console.log statements (shouldn't be in production)
echo -e "${BLUE}🐛 Test 9: Checking for debug statements...${NC}"
DEBUG_COUNT=$(grep -n "console\\.log\|debugger" assets/js/main.js | wc -l || echo 0)
if [ "$DEBUG_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}  ⚠ Found $DEBUG_COUNT console.log/debugger statements${NC}"
    grep -n "console\\.log\|debugger" assets/js/main.js | sed 's/^/    /'
    ((WARNINGS++))
else
    echo -e "${GREEN}  ✓ No debug statements found${NC}"
fi
echo ""

# Test 10: Validate YAML syntax
echo -e "${BLUE}📄 Test 10: Validating YAML syntax...${NC}"
if command -v ruby &> /dev/null; then
    YAML_FILES=("_config.yml" "_data/translations.yml" "_data/redirects.yml")
    for yaml_file in "${YAML_FILES[@]}"; do
        if [ -f "$yaml_file" ]; then
            if ruby -ryaml -e "YAML.load_file('$yaml_file')" 2>/dev/null; then
                echo -e "${GREEN}  ✓ $yaml_file syntax is valid${NC}"
            else
                echo -e "${RED}  ❌ $yaml_file has syntax errors${NC}"
                ruby -ryaml -e "YAML.load_file('$yaml_file')"
                ((ERRORS++))
            fi
        fi
    done
else
    echo -e "${YELLOW}  ⚠ Ruby not found, skipping YAML validation${NC}"
    ((WARNINGS++))
fi
echo ""

# Final summary
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📊 Validation Summary${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Ready to commit.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  All tests passed with $WARNINGS warning(s).${NC}"
    echo -e "${YELLOW}   Review warnings before committing.${NC}"
    exit 0
else
    echo -e "${RED}❌ Validation failed with $ERRORS error(s) and $WARNINGS warning(s).${NC}"
    echo -e "${RED}   Fix errors before committing.${NC}"
    exit 1
fi

