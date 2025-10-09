# Modernization URL Redirects

This document details all URL redirects for the EBS Modernization solutions page.

## Redirect Matrix

| URL Pattern | Redirects To | Language | Notes |
|------------|--------------|----------|-------|
| `/modernization/` | *language detection* | Auto | Detects browser/localStorage language preference |
| `/modernizacion/` | `/soluciones/modernizacion` | ES | Spanish variant |
| `/modernizacao/` | `/pt/solucoes/modernizacao` | PT | Portuguese variant |
| `/en/modernization/` | `/en/solutions/modernization` | EN | English path |
| `/en/modernizacion/` | `/en/solutions/modernization` | EN | Spanish word in EN path |
| `/en/modernizacao/` | `/en/solutions/modernization` | EN | Portuguese word in EN path |
| `/es/modernization/` | `/soluciones/modernizacion` | ES | English word in ES path |
| `/es/modernizacion/` | `/soluciones/modernizacion` | ES | Spanish path |
| `/es/modernizacao/` | `/soluciones/modernizacion` | ES | Portuguese word in ES path |
| `/pt/modernization/` | `/pt/solucoes/modernizacao` | PT | English word in PT path |
| `/pt/modernizacion/` | `/pt/solucoes/modernizacao` | PT | Spanish word in PT path |
| `/pt/modernizacao/` | `/pt/solucoes/modernizacao` | PT | Portuguese path |

## Target Pages

- **Spanish (Default)**: `/soluciones/modernizacion`
- **English**: `/en/solutions/modernization`
- **Portuguese**: `/pt/solucoes/modernizacao`

## Language Detection Logic

The root `/modernization/` URL uses the following detection logic:

1. **localStorage**: Checks `jaab_preferred_lang` (set by language switcher)
2. **Browser Language**: Falls back to `navigator.language`
3. **Default**: Spanish (ES) if no preference detected

## Implementation Files

- **Configuration**: `_data/redirects.yml` (modernization section)
- **Generator Plugin**: `_plugins/redirect_generator.rb`
- **Generated Files**: Auto-created during Jekyll build

## Testing

Test the redirects:

```bash
# Root (language detection)
curl -I http://localhost:4000/modernization/

# English variants
curl -I http://localhost:4000/en/modernization/

# Spanish variants
curl -I http://localhost:4000/modernizacion/
curl -I http://localhost:4000/es/modernizacion/

# Portuguese variants
curl -I http://localhost:4000/modernizacao/
curl -I http://localhost:4000/pt/modernizacao/
```

## SEO Considerations

All redirect pages include:
- `<meta name="robots" content="noindex">` - Prevents indexing of redirect pages
- `<link rel="canonical">` - Points to the canonical Spanish version
- `sitemap: false` - Excluded from sitemap.xml

## Related Documentation

- `CONTACT-URLS.md` - Contact section URL redirects
- `REDIRECT-SYSTEM.md` - Overview of the redirect generation system
