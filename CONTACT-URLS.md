# Contact & Meeting URL Redirect Matrix

> **Note:** All redirects are now **auto-generated** from `_data/redirects.yml`. See [REDIRECT-SYSTEM.md](REDIRECT-SYSTEM.md) for details.

## Complete URL Coverage

This document shows **ALL** possible contact and meeting URL combinations and where they redirect.

## 📊 Redirect Matrix

### Contact URLs

| URL Pattern | Redirects To | Language | Notes |
|-------------|--------------|----------|-------|
| `/contact` | Smart detection | Auto | Detects browser/saved language |
| `/contacto` | `/#contact` | 🇪🇸 Spanish | Spanish word → Spanish page |
| `/contato` | `/pt/#contact` | 🇧🇷 Portuguese | Portuguese word → Portuguese page |
| `/en/contact` | `/en/#contact` | 🇬🇧 English | English path |
| `/en/contacto` | `/en/#contact` | 🇬🇧 English | Path language overrides word |
| `/en/contato` | `/en/#contact` | 🇬🇧 English | Path language overrides word |
| `/es/contact` | `/#contact` | 🇪🇸 Spanish | Spanish path (explicit) |
| `/es/contacto` | `/#contact` | 🇪🇸 Spanish | Spanish path + word |
| `/es/contato` | `/#contact` | 🇪🇸 Spanish | Path language overrides word |
| `/pt/contact` | `/pt/#contact` | 🇧🇷 Portuguese | Portuguese path |
| `/pt/contacto` | `/pt/#contact` | 🇧🇷 Portuguese | Path language overrides word |
| `/pt/contato` | `/pt/#contact` | 🇧🇷 Portuguese | Portuguese path + word |

### Meeting/Schedule URLs (with Calendly Modal)

| URL Pattern | Redirects To | Language | Notes |
|-------------|--------------|----------|-------|
| `/meet` | Smart detection + `?meet=true#contact` | Auto | Opens Calendly modal automatically |
| `/en/meet` | `/en/?meet=true#contact` | 🇬🇧 English | English meeting scheduler |
| `/es/meet` | `/?meet=true#contact` | 🇪🇸 Spanish | Spanish meeting scheduler |
| `/pt/meet` | `/pt/?meet=true#contact` | 🇧🇷 Portuguese | Portuguese meeting scheduler |

## 🎯 Design Philosophy

### 1. **Language Prefix Priority**
When a URL has a language prefix (`/en/`, `/es/`, `/pt/`), that language **always wins**, regardless of the contact word used.

**Examples:**
- `/en/contacto/` → `/en/#contact` (English, not Spanish)
- `/pt/contact/` → `/pt/#contact` (Portuguese, not English)

### 2. **Word-Based Detection (Root Level)**
At the root level (no language prefix), the contact word determines the language:
- `contact` → Smart detection (browser/saved preference)
- `contacto` → Spanish
- `contato` → Portuguese

### 3. **Smart Language Detection**
The `/contact` URL uses intelligent detection:
1. **Saved preference** (`localStorage.jaab_preferred_lang`)
2. **Browser language** (`navigator.language`)
3. **Default** (Spanish)

## 🧪 Testing

All URLs work with or without trailing slash:

```bash
# Contact URLs - Root level (word determines language)
http://localhost:4000/contact/      # Smart detection
http://localhost:4000/contacto/     # → Spanish
http://localhost:4000/contato/      # → Portuguese

# Contact URLs - English (path language wins)
http://localhost:4000/en/contact/   # → English
http://localhost:4000/en/contacto/  # → English
http://localhost:4000/en/contato/   # → English

# Contact URLs - Spanish (path language wins)
http://localhost:4000/es/contact/   # → Spanish
http://localhost:4000/es/contacto/  # → Spanish
http://localhost:4000/es/contato/   # → Spanish

# Contact URLs - Portuguese (path language wins)
http://localhost:4000/pt/contact/   # → Portuguese
http://localhost:4000/pt/contacto/  # → Portuguese
http://localhost:4000/pt/contato/   # → Portuguese

# Meeting URLs - Auto-opens Calendly modal
http://localhost:4000/meet/         # Smart detection → ?meet=true#contact
http://localhost:4000/en/meet/      # → /en/?meet=true#contact
http://localhost:4000/es/meet/      # → /?meet=true#contact
http://localhost:4000/pt/meet/      # → /pt/?meet=true#contact
```

## 📝 Implementation Files

### Contact Redirects

#### Root Level
- `/contact.html` - Smart language detection
- `/contacto.html` - Spanish redirect
- `/contato.html` - Portuguese redirect

#### English (/en/)
- `/en/contact.html`
- `/en/contacto.html`
- `/en/contato.html`

#### Spanish (/es/)
- `/es/contact.html`
- `/es/contacto.html`
- `/es/contato.html`

#### Portuguese (/pt/)
- `/pt/contact.html`
- `/pt/contacto.html`
- `/pt/contato.html`

### Meeting Redirects (with Calendly Modal)

#### Root Level
- `/meet.html` - Smart language detection + auto-opens Calendly

#### Language-Specific
- `/en/meet.html` - English + Calendly modal
- `/es/meet.html` - Spanish + Calendly modal
- `/pt/meet.html` - Portuguese + Calendly modal

## 🌐 Production URLs

All of these will work on production:

### Contact URLs
```
https://jaab.tech/contact/
https://jaab.tech/contacto/
https://jaab.tech/contato/

https://jaab.tech/en/contact/
https://jaab.tech/en/contacto/
https://jaab.tech/en/contato/

https://jaab.tech/es/contact/
https://jaab.tech/es/contacto/
https://jaab.tech/es/contato/

https://jaab.tech/pt/contact/
https://jaab.tech/pt/contacto/
https://jaab.tech/pt/contato/
```

### Meeting URLs (Auto-opens Calendly)
```
https://jaab.tech/meet/       → ?meet=true#contact

https://jaab.tech/en/meet/    → /en/?meet=true#contact
https://jaab.tech/es/meet/    → /?meet=true#contact
https://jaab.tech/pt/meet/    → /pt/?meet=true#contact
```

## ✅ Benefits

1. **User-Friendly**: Works no matter how users type the URL
2. **Language-Aware**: Respects user preferences and browser settings
3. **SEO-Safe**: All use `noindex` to prevent duplicate content issues
4. **Flexible**: Path language always takes priority over word choice
5. **Comprehensive**: Covers all possible language/word combinations
6. **Direct Scheduling**: `/meet` URLs automatically open Calendly modal

## 🔍 Edge Cases Handled

### Contact URLs
- ✅ Spanish speaker on English site typing `/en/contacto`
- ✅ Portuguese speaker typing generic `/contact`
- ✅ English speaker on Portuguese site typing `/pt/contact`
- ✅ Direct navigation to `/es/` paths (explicit Spanish)
- ✅ Mixed language inputs (path vs. word mismatch)

### Meeting URLs
- ✅ Direct `/meet` link shared via email or social media
- ✅ Language-specific meeting links (`/en/meet`, `/pt/meet`, `/es/meet`)
- ✅ Automatic modal opening with `?meet=true` parameter
- ✅ Proper language detection for root `/meet` URL

---

**Total URLs Covered:** 16 unique patterns (12 contact + 4 meeting)  
**Languages Supported:** 3 (Spanish, English, Portuguese)  
**Contact Words Covered:** 3 (contact, contacto, contato)  
**Meeting URLs:** 4 (1 smart detection + 3 language-specific)

