# JAAB TECH - Testing Suite

This directory contains automated tests for the JAAB TECH website.

## Test Scripts

### 1. `validate.sh` - Pre-commit Validation Suite

Comprehensive validation that should be run **before every commit**.

**What it tests:**
- ✅ Required files exist
- ✅ Translation completeness (ES/EN/PT)
- ✅ No hardcoded text in templates
- ✅ JavaScript syntax validation
- ✅ Modal ID reference consistency
- ✅ CSS class consistency
- ✅ Jekyll build succeeds
- ✅ TODO/FIXME comments
- ✅ Debug statements (console.log)
- ✅ YAML syntax validation

**Usage:**
```bash
./test/validate.sh
```

**Requirements:**
- Node.js (for JS validation)
- Ruby/Bundle (for Jekyll build)

**Exit codes:**
- `0` - All tests passed (safe to commit)
- `1` - Tests failed (fix before committing)

---

### 2. `test-urls.sh` - URL Testing Suite

Tests URLs and functionality with a running Jekyll server.

**What it tests:**
- ✅ Server is running
- ✅ Homepage variants (ES/EN/PT)
- ✅ Blog pages load correctly
- ✅ Redirects work properly
- ✅ Assets are accessible
- ✅ No broken links

**Usage:**
```bash
# Start Jekyll server first
bundle exec jekyll serve --host 0.0.0.0 --port 4000

# In another terminal
./test/test-urls.sh
```

**Requirements:**
- Jekyll server running on http://localhost:4000
- curl (for HTTP requests)
- wget (optional, for link checking)

---

## Recommended Workflow

### Before Committing

1. **Run validation suite:**
   ```bash
   ./test/validate.sh
   ```

2. **Fix any errors** reported by the script

3. **Review warnings** and address if needed

4. **Commit your changes** when validation passes

### After Major Changes

1. **Start Jekyll server:**
   ```bash
   bundle exec jekyll serve --host 0.0.0.0 --port 4000
   ```

2. **Run URL tests:**
   ```bash
   ./test/test-urls.sh
   ```

3. **Manual testing:**
   - Test credits modal in all languages
   - Test Calendly integration
   - Test contact forms
   - Test blog navigation
   - Test mobile responsiveness

---

## Git Pre-commit Hook (Optional)

To automatically run validation before every commit, create a Git hook:

```bash
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit validation..."
./test/validate.sh
if [ $? -ne 0 ]; then
    echo "❌ Validation failed. Commit aborted."
    exit 1
fi
EOF

chmod +x .git/hooks/pre-commit
```

---

## CI/CD Integration

These scripts can be integrated into GitHub Actions:

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: bundle install
      - run: chmod +x test/validate.sh
      - run: ./test/validate.sh
```

---

## Adding New Tests

When adding new features, update the validation scripts:

1. **For new translations:**
   - Add keys to `REQUIRED_KEYS` array in `validate.sh`

2. **For new modals/components:**
   - Add IDs to `MODAL_IDS` array
   - Add classes to `CSS_CLASSES` array

3. **For new pages:**
   - Add URLs to `PAGES` array in `test-urls.sh`

---

## Troubleshooting

### "Node.js not found"
Install Node.js: `sudo apt install nodejs` or `brew install node`

### "Bundle not found"
Install bundler: `gem install bundler`

### "Server not running"
Start Jekyll: `bundle exec jekyll serve --host 0.0.0.0 --port 4000`

### Tests fail on macOS
Some commands may differ on macOS. Install GNU tools:
```bash
brew install coreutils grep
```

---

## Test Coverage

Current test coverage:
- ✅ Structure validation
- ✅ Translation completeness
- ✅ Syntax validation
- ✅ Build validation
- ✅ Basic URL testing
- ⚠️ Visual regression (manual)
- ⚠️ JavaScript functionality (manual)
- ⚠️ Cross-browser testing (manual)

---

## Contributing

When contributing, ensure:
1. All tests pass
2. New features have corresponding tests
3. Update this README if adding new test scripts

