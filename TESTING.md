# Testing Before Commit - Quick Guide

## Run Pre-Commit Validation

**ALWAYS run this before committing:**

```bash
./test/validate.sh
```

**What it checks:**
- ✅ Required files exist
- ✅ Translations complete (ES/EN/PT)
- ✅ No hardcoded text
- ✅ Modal/component IDs consistent
- ✅ CSS classes defined
- ✅ Jekyll builds successfully
- ✅ YAML syntax valid
- ⚠️  TODO/FIXME comments
- ⚠️  console.log statements

**Exit codes:**
- `0` = ✅ Safe to commit
- `1` = ❌ Fix errors first

---

## Run URL Tests (Optional)

**With Jekyll server running:**

```bash
./test/test-urls.sh
```

**What it checks:**
- Server is running
- All language variants work
- Blog pages load
- Redirects function
- Assets are accessible

---

## Typical Workflow

```bash
# 1. Make your changes
git add .

# 2. Run validation
./test/validate.sh

# 3. If validation passes, commit
git commit -m "Your message"

# 4. Push
git push
```

---

## If Tests Fail

### "Validation failed with X errors"
1. Read the error messages
2. Fix the issues
3. Run `./test/validate.sh` again
4. Commit when it passes

### "Translation key missing"
- Add the key to all languages in `_data/translations.yml`

### "Hardcoded text found"
- Replace with Liquid template: `{{ site.data.translations[page.lang].key }}`

### "Jekyll build failed"
- Check the error message
- Usually a syntax error in HTML/YAML

---

## See Full Documentation

Read `test/README.md` for complete documentation.
