// Toggle service sections
function toggleService(serviceId) {
    const serviceContent = document.getElementById(serviceId);
    const serviceCard = serviceContent.closest('.service-card');
    
    // Toggle show class
    serviceContent.classList.toggle('show');
    serviceCard.classList.toggle('active');
}

// Make toggleService globally accessible
window.toggleService = toggleService;

// Toggle technology category sections
function toggleTechCategory(categoryId) {
    console.log('toggleTechCategory called with ID:', categoryId);
    const categoryContent = document.getElementById(categoryId);
    
    if (!categoryContent) {
        console.error('Could not find element with ID:', categoryId);
        return;
    }
    
    const categoryCard = categoryContent.closest('.tech-category');
    
    if (!categoryCard) {
        console.error('Could not find parent .tech-category for:', categoryId);
        return;
    }
    
    // Toggle show class
    categoryContent.classList.toggle('show');
    categoryCard.classList.toggle('active');
    
    console.log('Toggled - Content has .show:', categoryContent.classList.contains('show'), 
                'Card has .active:', categoryCard.classList.contains('active'));
}

// Make toggleTechCategory globally accessible
window.toggleTechCategory = toggleTechCategory;

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    const languageSwitcher = document.querySelector('.language-switcher');

    // Context-aware language switching
    const langSwitchLinks = document.querySelectorAll('.lang-switch-link');
    langSwitchLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetLang = this.getAttribute('data-lang');
            const currentHash = window.location.hash;
            const currentPath = window.location.pathname;
            let targetUrl = this.getAttribute('href');
            
            // Store user's language preference for auto-translation
            localStorage.setItem('jaab_preferred_lang', targetLang);
            
            // Build reverse lookup map from YAML configuration
            const pageMappings = window.pageMappings || {};
            const pathToPageMap = {};
            
            // Map all solution pages from YAML
            if (pageMappings.solutions) {
                Object.keys(pageMappings.solutions).forEach(solutionKey => {
                    const solution = pageMappings.solutions[solutionKey];
                    // Create reverse mapping: each URL points to its language variants
                    ['es', 'en', 'pt'].forEach(lang => {
                        if (solution[lang]) {
                            pathToPageMap[solution[lang]] = solution;
                        }
                    });
                });
            }
            
            // Check if we're on a mapped page (solution page, etc.)
            if (pathToPageMap[currentPath]) {
                targetUrl = pathToPageMap[currentPath][targetLang];
            } else {
                // We're on home page, preserve the hash/anchor
                targetUrl = targetUrl + currentHash;
            }
            
            window.location.href = targetUrl;
        });
    });

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            console.log('Mobile menu toggle clicked');
            // Toggle mobile menu visibility
            navbar.classList.toggle('mobile-menu-open');

            // Animate hamburger icon
            this.classList.toggle('active');
            
            console.log('Navbar classes:', navbar.className);
        });
    } else {
        console.log('Mobile menu toggle not found!');
    }

    // Close mobile menu when clicking on links
    const mobileNavLinks = document.querySelectorAll('.nav-links a, .language-switcher a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbar.classList.remove('mobile-menu-open');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Add animation on scroll for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('.about, .contact');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Handle contact form submission with bot protection
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    let formLoadTime = Date.now(); // Track when form was loaded
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            console.log('Form submitted');
            
            // HONEYPOT CHECK: If honeypot field is filled, it's a bot
            const honeypotField = document.getElementById('website');
            if (honeypotField && honeypotField.value !== '') {
                console.log('Bot detected via honeypot');
                e.preventDefault();
                return false;
            }
            
            // TIME-BASED CHECK: If form submitted too quickly (< 3 seconds), it's likely a bot
            const timeSinceLoad = (Date.now() - formLoadTime) / 1000; // in seconds
            if (timeSinceLoad < 3) {
                console.log('Bot detected: form submitted too quickly (' + timeSinceLoad + ' seconds)');
                e.preventDefault();
                alert('Please take your time to fill out the form.');
                return false;
            }
            
            // Combine country code and phone number before submission
            const countryCodeField = document.getElementById('country-code');
            const phoneField = document.getElementById('phone');
            
            if (countryCodeField && phoneField && phoneField.value) {
                // Ensure phone field includes country code
                const phoneValue = phoneField.value.trim();
                const countryCode = countryCodeField.value;
                
                // If phone doesn't start with country code, add it
                if (!phoneValue.startsWith(countryCode)) {
                    phoneField.value = countryCode + ' ' + phoneValue.replace(/^\+\d{1,4}\s*/, '');
                }
            }
            
            // Show success message after a short delay
            setTimeout(function() {
                successMessage.style.display = 'block';
                contactForm.reset();
                
                // Reset phone field with default country code
                if (countryCodeField && phoneField) {
                    phoneField.value = countryCodeField.value + ' ';
                }
                
                // Reset form load time for next submission
                formLoadTime = Date.now();
                
                // Hide success message after 5 seconds
                setTimeout(function() {
                    successMessage.style.display = 'none';
                }, 5000);
            }, 500);
        });
    }

    // Phone country code synchronization
    const countrySelect = document.getElementById('country-code');
    const phoneInput = document.getElementById('phone');
    
    if (countrySelect && phoneInput) {
        // Create a map of country codes
        const countryCodes = {};
        Array.from(countrySelect.options).forEach(option => {
            if (option.value) {
                countryCodes[option.value] = option;
            }
        });

        // When country is selected, update phone input prefix
        countrySelect.addEventListener('change', function() {
            const selectedCode = this.value;
            const currentPhone = phoneInput.value.trim();
            
            // Remove any existing country code from phone number
            let phoneNumber = currentPhone.replace(/^\+\d{1,4}\s*/, '');
            
            // Add new country code
            phoneInput.value = selectedCode + ' ' + phoneNumber;
            phoneInput.focus();
        });

        // When user types in phone, detect and update country selector
        phoneInput.addEventListener('input', function() {
            const value = this.value.trim();
            
            // Try to match country code at the start
            const match = value.match(/^\+(\d{1,4})/);
            if (match) {
                const detectedCode = '+' + match[1];
                
                // Check if we have this country code
                if (countryCodes[detectedCode]) {
                    countrySelect.value = detectedCode;
                }
            }
        });

        // Initialize with default country code
        if (phoneInput.value.trim() === '') {
            phoneInput.value = countrySelect.value + ' ';
        }
    }
});
