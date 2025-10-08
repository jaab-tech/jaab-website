# Auto-Generated Redirect System

## Overview

All redirect pages are **automatically generated at build time** from a central configuration file. No need to manually create individual HTML files!

## How It Works

### 1. Configuration File: `_data/redirects.yml`

All redirect rules are defined in a single YAML file:

```yaml
contact:
  - from: /contact/
    to: null  # null = language detection
    title: "Contact / Contacto / Contato"
    fallback: "/#contact"
  
  - from: /contacto/
    to: "/#contact"
    title: "Contacto"
    lang: es
```

### 2. Generator Plugin: `_plugins/redirect_generator.rb`

A Jekyll plugin reads the YAML configuration and generates all redirect HTML files at build time.

### 3. Build Process

When Jekyll builds the site:
1. Plugin reads `_data/redirects.yml`
2. Creates HTML pages for each redirect rule
3. Pages are served at the specified paths

## Adding New Redirects

Simply edit `_data/redirects.yml` and add new entries:

```yaml
# Example: Adding a new contact variation
contact:
  - from: /get-in-touch/
    to: "/en/#contact"
    title: "Get in Touch"
    lang: en
```

Jekyll will automatically generate the redirect page on next build!

## Current Redirects

### Contact Redirects (12 URLs)

| URL | Redirects To | Type |
|-----|--------------|------|
| `/contact/` | Language detection | Smart |
| `/contacto/` | `/#contact` | Spanish |
| `/contato/` | `/pt/#contact` | Portuguese |
| `/en/contact/` | `/en/#contact` | English |
| `/en/contacto/` | `/en/#contact` | English |
| `/en/contato/` | `/en/#contact` | English |
| `/es/contact/` | `/#contact` | Spanish |
| `/es/contacto/` | `/#contact` | Spanish |
| `/es/contato/` | `/#contact` | Spanish |
| `/pt/contact/` | `/pt/#contact` | Portuguese |
| `/pt/contacto/` | `/pt/#contact` | Portuguese |
| `/pt/contato/` | `/pt/#contact` | Portuguese |

### COBOL Redirects (3 URLs)

| URL | Redirects To | Type |
|-----|--------------|------|
| `/cobol/` | Language detection → `#cobolcloud` | Smart |
| `/en/cobol/` | `/en/solutions/modernization#cobolcloud` | English |
| `/pt/cobol/` | `/pt/solucoes/modernizacao#cobolcloud` | Portuguese |

### External Redirects (1 URL)

| URL | Redirects To | Type |
|-----|--------------|------|
| `/ebs/` | `https://www.europebs.com/en/` | External |

## Redirect Types

### 1. Simple Redirects
Direct URL → URL mapping with instant redirect.

```yaml
- from: /contacto/
  to: "/#contact"
  title: "Contacto"
  lang: es
```

### 2. Language Detection Redirects
Smart redirects that detect user's language preference.

```yaml
- from: /contact/
  to: null  # triggers language detection
  title: "Contact"
  fallback: "/#contact"
```

Detection order:
1. Saved preference (`localStorage.jaab_preferred_lang`)
2. Browser language (`navigator.language`)
3. Fallback to Spanish

### 3. Section-Specific Redirects
Redirects to specific page sections (e.g., `#cobolcloud`, `#contact`).

```yaml
- from: /cobol/
  to: null
  section: "cobolcloud"
  fallback: "/soluciones/modernizacion#cobolcloud"
```

### 4. External Redirects
Redirects to external websites (different domain).

```yaml
- from: /ebs/
  to: "https://www.europebs.com/en/"
  title: "EBS - European Business Solutions"
  lang: en
  external: true
```

**Features:**
- Automatically detects external URLs (starting with `http://` or `https://`)
- Sets correct canonical URL to external destination
- Works the same as internal redirects for users
- Useful for partner sites, old domains, or external resources

## Benefits

### ✅ **Maintainability**
- Single source of truth (`redirects.yml`)
- Easy to add/modify/remove redirects
- No duplicate HTML files to maintain

### ✅ **Consistency**
- All redirects use same template
- Uniform behavior across all URLs
- Consistent SEO tags (`noindex`, `canonical`)

### ✅ **Scalability**
- Add dozens of redirects without creating files
- Bulk operations (e.g., add all language variations)
- Easy to test and validate

### ✅ **Version Control**
- One file to track changes
- Clear diff history
- Easy code reviews

## File Structure

```
_data/
  └── redirects.yml          # Redirect configuration
_plugins/
  └── redirect_generator.rb  # Generator plugin
_site/
  ├── contact/
  │   └── index.html        # Auto-generated
  ├── contacto/
  │   └── index.html        # Auto-generated
  ├── cobol/
  │   └── index.html        # Auto-generated
  └── ...                   # All auto-generated
```

## Testing

All redirects can be tested locally:

```bash
# Test contact redirects
curl -I http://localhost:4000/contact/
curl -I http://localhost:4000/contacto/
curl -I http://localhost:4000/en/contact/

# Test COBOL redirects
curl -I http://localhost:4000/cobol/
curl -I http://localhost:4000/en/cobol/
```

All should return `HTTP 200 OK`.

## Deployment

No special deployment steps needed! The redirects are generated as static HTML files during the Jekyll build process.

## Extending the System

### Adding New Redirect Groups

Edit `_data/redirects.yml`:

```yaml
# Example: Schedule/Calendly redirects
schedule:
  - from: /schedule/
    to: null
    title: "Schedule"
    calendly: true  # Custom flag
  
  - from: /agendar/
    to: "/#contact?tab=calendly"
    title: "Agendar"
    lang: es
```

Then update `_plugins/redirect_generator.rb` to process the new group.

### Custom Redirect Logic

Modify the `generate_html` method in the plugin to add custom behavior:

```ruby
def generate_html(config)
  if config['calendly']
    # Custom logic for Calendly redirects
    # Open calendly tab after redirect
  end
  # ...
end
```

## Migration Notes

### Before (Manual System)
- 15+ individual HTML files
- Duplicated code across files
- Hard to maintain consistency
- Time-consuming to add variations

### After (Auto-Generated)
- 1 YAML configuration file
- 1 generator plugin
- All redirects auto-generated
- Add new variations in seconds

## Troubleshooting

### Redirects Not Working?

1. **Restart Jekyll**: Plugin changes require server restart
   ```bash
   pkill -f "jekyll serve"
   bundle exec jekyll serve
   ```

2. **Check YAML Syntax**: Validate `redirects.yml`
   ```bash
   ruby -ryaml -e "YAML.load_file('_data/redirects.yml')"
   ```

3. **Check Generated Files**: Look in `_site/` directory
   ```bash
   ls -la _site/contact/
   ls -la _site/cobol/
   ```

4. **Check Jekyll Output**: Look for plugin errors
   ```bash
   # Check build output for errors
   ```

---

**Total Redirects Generated:** 16  
**Configuration Lines:** ~105  
**Manual HTML Files Replaced:** 16  
**Maintenance Overhead:** 🔻 Dramatically reduced

