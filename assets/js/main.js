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

// Toggle Calendly modal
function toggleCalendly() {
    const modal = document.getElementById('calendly-modal');
    const btn = document.getElementById('schedule-btn');
    
    if (!modal) {
        console.error('Calendly modal not found!');
        return;
    }
    
    if (modal.style.display === 'none' || modal.style.display === '') {
        // Show modal
        modal.style.display = 'flex';
        if (btn) btn.classList.add('active');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        // Add animation class
        setTimeout(() => modal.classList.add('show'), 10);
    } else {
        // Hide modal
        closeCalendly();
    }
}

// Close Calendly modal
function closeCalendly() {
    const modal = document.getElementById('calendly-modal');
    const btn = document.getElementById('schedule-btn');
    
    if (!modal) return;
    
    modal.classList.remove('show');
    if (btn) btn.classList.remove('active');
    // Restore body scroll
    document.body.style.overflow = '';
    // Wait for animation to finish before hiding
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Make functions globally accessible
window.toggleCalendly = toggleCalendly;
window.closeCalendly = closeCalendly;

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Attach Calendly toggle button event listener
    const scheduleBtn = document.getElementById('schedule-btn');
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCalendly();
        });
    }

    // Attach close button event listener
    const closeBtn = document.getElementById('close-calendly');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeCalendly();
        });
    }

    // Close modal when clicking outside (on overlay)
    const calendlyModal = document.getElementById('calendly-modal');
    if (calendlyModal) {
        calendlyModal.addEventListener('click', function(e) {
            // Only close if clicking directly on the modal (overlay), not on content
            if (e.target === calendlyModal || e.target.classList.contains('calendly-modal-overlay')) {
                closeCalendly();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('calendly-modal');
            if (modal && modal.style.display === 'flex') {
                closeCalendly();
            }
        }
    });

    // Auto-open Calendly modal if ?meet=true parameter is present
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('meet') === 'true') {
        // Wait a moment for the page to render, then open modal
        setTimeout(function() {
            toggleCalendly();
        }, 300);
    }

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

    // Blog preview carousel functionality
    const blogCarousel = document.querySelector('.blog-preview-carousel');
    if (blogCarousel) {
        const cards = blogCarousel.querySelectorAll('.blog-preview-card');
        const prevBtn = document.querySelector('.blog-preview-prev');
        const nextBtn = document.querySelector('.blog-preview-next');
        const dots = document.querySelectorAll('.blog-preview-dot');
        let currentIndex = 0;
        let autoRotateInterval = null;

        // Show card at specific index
        function showCard(index) {
            cards.forEach((card, i) => {
                if (i === index) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });

            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            currentIndex = index;
        }

        // Next card
        function nextCard() {
            const nextIndex = (currentIndex + 1) % cards.length;
            showCard(nextIndex);
        }

        // Previous card
        function prevCard() {
            const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
            showCard(prevIndex);
        }

        // Start auto-rotation
        function startAutoRotate() {
            if (cards.length > 1) {
                autoRotateInterval = setInterval(nextCard, 5000); // Rotate every 5 seconds
            }
        }

        // Stop auto-rotation
        function stopAutoRotate() {
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
                autoRotateInterval = null;
            }
        }

        // Event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevCard();
                stopAutoRotate();
                startAutoRotate(); // Restart auto-rotation after manual interaction
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextCard();
                stopAutoRotate();
                startAutoRotate();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showCard(index);
                stopAutoRotate();
                startAutoRotate();
            });
        });

        // Pause auto-rotation on hover
        blogCarousel.addEventListener('mouseenter', stopAutoRotate);
        blogCarousel.addEventListener('mouseleave', startAutoRotate);

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        blogCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        blogCarousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const horizontalDistance = Math.abs(touchEndX - touchStartX);
            const verticalDistance = Math.abs(touchEndY - touchStartY);
            
            // Only trigger if horizontal swipe is more significant than vertical
            if (horizontalDistance > verticalDistance && horizontalDistance > swipeThreshold) {
                if (touchEndX < touchStartX) {
                    // Swipe left - next card
                    nextCard();
                    stopAutoRotate();
                    startAutoRotate();
                }
                if (touchEndX > touchStartX) {
                    // Swipe right - previous card
                    prevCard();
                    stopAutoRotate();
                    startAutoRotate();
                }
            }
        }

        // Initialize first card as active
        if (cards.length > 0) {
            showCard(0);
            startAutoRotate();
        }
    }

    // Credits Modal
    const creditsLink = document.getElementById('credits-link');
    const creditsModal = document.getElementById('credits-modal');
    const closeCredits = document.getElementById('close-credits');
    const creditsOverlay = document.querySelector('.credits-modal-overlay');

    if (creditsLink && creditsModal) {
        // Open modal
        creditsLink.addEventListener('click', function(e) {
            e.preventDefault();
            creditsModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        // Close modal - X button
        if (closeCredits) {
            closeCredits.addEventListener('click', function() {
                creditsModal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scroll
            });
        }

        // Close modal - Click overlay
        if (creditsOverlay) {
            creditsOverlay.addEventListener('click', function() {
                creditsModal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scroll
            });
        }

        // Close modal - ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && creditsModal.style.display === 'flex') {
                creditsModal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scroll
            }
        });
    }

    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        function toggleBackToTop() {
            const scrollThreshold = 300; // Show after scrolling 300px (reduced for better UX)
            if (window.pageYOffset > scrollThreshold) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }

        // Check on scroll
        window.addEventListener('scroll', toggleBackToTop, { passive: true });

        // Check on page load
        toggleBackToTop();

        // Smooth scroll to top when clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Mark external links with a class so CSS can add an external-link icon.
// Robust version: handles dynamic content via MutationObserver and logs when
// window.JAAB_DEBUG === true.
(function markExternalLinksRobust() {
    if (typeof document === 'undefined') return;

    const DEBUG = Boolean(window.JAAB_DEBUG);

    function log() {
        if (DEBUG && console && console.debug) console.debug.apply(console, arguments);
    }

    function isExternalAnchor(a) {
        try {
            if (!a || !a.getAttribute) return false;
            let href = a.getAttribute('href');
            if (!href) return false;
            href = href.trim();
            // Skip empty, hash-only, and protocol-less anchors used as JS hooks
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href === 'javascript:void(0)') return false;
            if (a.hasAttribute('data-no-external')) return false;

            // Normalize and build absolute URL relative to the document
            const url = new URL(href, window.location.origin);
            return url.origin !== window.location.origin;
        } catch (e) {
            // If URL parsing fails, consider non-external to avoid false positives
            log('isExternalAnchor parse error for', a, e && e.message);
            return false;
        }
    }

    function processAnchor(a) {
        if (!a || !a.getAttribute) return;
        try {
            if (isExternalAnchor(a)) {
                if (!a.classList.contains('external-link')) {
                    a.classList.add('external-link');
                    log('Marked external link:', a.href);
                }

                // If the author explicitly set a target, respect it
                if (!a.hasAttribute('target') && !a.hasAttribute('data-preserve-target')) {
                    a.setAttribute('target', '_blank');
                }

                // Ensure safe rel attributes
                const rel = a.getAttribute('rel') || '';
                const tokens = new Set(rel.split(/\s+/).filter(Boolean));
                tokens.add('noopener');
                tokens.add('noreferrer');
                a.setAttribute('rel', Array.from(tokens).join(' '));
            }
        } catch (e) {
            log('processAnchor error', e && e.message);
        }
    }

    function scanAllAnchors() {
        const anchors = document.querySelectorAll('a[href]');
        anchors.forEach(processAnchor);
    }

    // Run once on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scanAllAnchors);
    } else {
        // run async to allow any inline scripts to finish
        setTimeout(scanAllAnchors, 0);
    }

    // Observe DOM mutations and process newly added anchors (covers dynamic content)
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            if (!m.addedNodes) return;
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return; // element
                if (node.tagName && node.tagName.toLowerCase() === 'a') {
                    processAnchor(node);
                } else {
                    // Process anchors inside the added subtree
                    const nested = node.querySelectorAll ? node.querySelectorAll('a[href]') : [];
                    nested.forEach(processAnchor);
                }
            });
        });
    });

    try {
        observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    } catch (e) {
        log('MutationObserver failed to observe:', e && e.message);
    }
})();
