# JAAB - Boutique Technology Consulting

A modern, multilingual static website for JAAB (jaab.tech), a boutique technology consulting firm specializing in technology risk mitigation, business continuity, and enterprise operations in Latin America.

## Features

- **Multilingual Support**: Spanish (default), English, and Portuguese with context-aware language switching
- **Data-Driven Architecture**: Content separated from design using YAML data files
- **Modern Design**: Clean, professional grey-scale aesthetics with smooth animations and hover effects
- **Responsive**: Mobile-first design that works on all devices (including Samsung S24+)
- **Smart Contact Form**: Integrated Google Forms with 214+ country codes and embedded Google Maps
- **Bot Protection**: Honeypot and time-based protection against spam
- **SEO Optimized**: Built with Jekyll for optimal search engine performance
- **GitHub Pages Ready**: Automated deployment via GitHub Actions
- **Fast & Secure**: Static site with no database dependencies
- **DRY Architecture**: Single template per page type, reused across all languages

## Technologies Used

- **Jekyll 4.3.4**: Static site generator
- **Sass/SCSS**: Modern CSS with variables and mixins
- **Inter Font**: Clean, professional typography from Google Fonts
- **Vanilla JavaScript**: No framework dependencies
- **GitHub Actions**: CI/CD pipeline for automated deployment

## Development

### Prerequisites

- Ruby 3.1+
- Bundler

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/jaabtech/jaab.tech.git
cd jaab.tech
```

2. Install dependencies:
```bash
bundle install
```

3. Serve locally:
```bash
bundle exec jekyll serve
```

4. Open http://localhost:4000 in your browser

### Languages

The site supports three languages:
- **Spanish** (`/`): Default language
- **English** (`/en/`): English version
- **Portuguese** (`/pt/`): Portuguese version

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### Manual Deployment

To build the site manually:

```bash
bundle exec jekyll build
```

The built site will be in the `_site/` directory.

## Project Structure

```
/
├── _config.yml              # Jekyll configuration
├── _data/
│   ├── home-es.yml          # Spanish homepage content
│   ├── home-en.yml          # English homepage content
│   ├── home-pt.yml          # Portuguese homepage content
│   ├── solutions/
│   │   ├── ebs-es.yml       # Spanish EBS solution content
│   │   ├── ebs-en.yml       # English EBS solution content
│   │   └── ebs-pt.yml       # Portuguese EBS solution content
│   ├── translations.yml     # Navigation & footer translations
│   ├── countries.yml        # Country codes & names (214+ countries)
│   └── page-mappings.yml    # Language switching configuration
├── _includes/
│   ├── homepage.html        # Shared homepage template (all languages)
│   └── solution-ebs.html    # Shared EBS solution template (all languages)
├── _layouts/
│   └── default.html         # Main layout with navigation
├── assets/
│   ├── css/
│   │   └── style.scss       # Main stylesheet with Jekyll front matter
│   ├── js/
│   │   └── main.js          # JavaScript (mobile menu, form validation, language switching)
│   └── images/              # Images and assets
├── en/                      # English pages
│   ├── index.html           # English homepage (minimal, includes template)
│   └── solutions/
│       └── ebs-modernization.html
├── pt/                      # Portuguese pages
│   ├── index.html           # Portuguese homepage (minimal, includes template)
│   └── solucoes/
│       └── ebs-modernizacao.html
├── soluciones/              # Spanish solution pages
│   └── ebs-modernizacion.html
├── index.html               # Spanish homepage (minimal, includes template)
├── .github/
│   └── workflows/
│       └── jekyll.yml       # GitHub Actions CI/CD pipeline
└── README.md                # This file
```

## Architecture

### Data-Driven Content Management

This site uses a **data-driven architecture** where content is completely separated from design:

- **Content**: Stored in YAML files (`_data/home-*.yml`, `_data/solutions/*.yml`)
- **Design**: Stored in shared templates (`_includes/*.html`)
- **Configuration**: Minimal page files (9 lines each) that set language and include templates

**Benefits:**
- Edit content without touching HTML
- Single template change applies to all languages
- Easy to maintain and scale
- Non-technical users can edit YAML files
- Reduced code duplication (774 lines removed!)

### Adding New Languages

1. Create content files:
   ```bash
   _data/home-fr.yml
   _data/solutions/ebs-fr.yml
   ```

2. Add translations to `_data/translations.yml` (nav & footer only)

3. Create minimal page files (9 lines each):
   ```yaml
   # fr/index.html
   ---
   layout: default
   title: "JAAB - Conseil Technologique Boutique"
   lang: fr
   permalink: /fr/
   ---
   {% include homepage.html %}
   ```

4. Update `_data/page-mappings.yml` for language switching

### Adding New Solution Pages

1. Create content files:
   ```bash
   _data/solutions/newsolution-es.yml
   _data/solutions/newsolution-en.yml
   _data/solutions/newsolution-pt.yml
   ```

2. Create shared template:
   ```bash
   _includes/solution-newsolution.html
   ```

3. Create minimal page files (9 lines each) that include the template

4. Update `_data/page-mappings.yml` and homepage YAML files

### Modifying Content

- **Homepage content**: Edit `_data/home-{lang}.yml`
- **Solution pages**: Edit `_data/solutions/{solution}-{lang}.yml`
- **Navigation & footer**: Edit `_data/translations.yml`
- **Styles**: Edit `assets/css/style.scss`
- **Behavior**: Edit `assets/js/main.js`

**Important**: Never edit the `_includes/*.html` templates unless changing design/structure for ALL languages.

## Contact

For questions or support, please use the contact form on the website:
- **Website**: [https://jaab.tech](https://jaab.tech)
- **LinkedIn**: [JAAB Tech](https://www.linkedin.com/company/jaab-tech)
- **Location**: Casa El Globo, Montevideo, Uruguay

---

© 2025 JAAB TECH SAS. All rights reserved.
