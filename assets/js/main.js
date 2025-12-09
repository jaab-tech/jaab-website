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
document.addEventListener('DOMContentLoaded', function () {
    // Attach Calendly toggle button event listener
    const scheduleBtn = document.getElementById('schedule-btn');
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleCalendly();
        });
    }

    // Attach close button event listener
    const closeBtn = document.getElementById('close-calendly');
    if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            closeCalendly();
        });
    }

    // Close modal when clicking outside (on overlay)
    const calendlyModal = document.getElementById('calendly-modal');
    if (calendlyModal) {
        calendlyModal.addEventListener('click', function (e) {
            // Only close if clicking directly on the modal (overlay), not on content
            if (e.target === calendlyModal || e.target.classList.contains('calendly-modal-overlay')) {
                closeCalendly();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
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
        setTimeout(function () {
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
        link.addEventListener('click', function (e) {
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
        mobileMenuToggle.addEventListener('click', function () {
            // Toggle mobile menu visibility
            navbar.classList.toggle('mobile-menu-open');

            // Animate hamburger icon
            this.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    const mobileNavLinks = document.querySelectorAll('.nav-links a, .language-switcher a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function () {
            navbar.classList.remove('mobile-menu-open');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
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
    window.addEventListener('scroll', function () {
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

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('.identity-hero, .services-section, .solutions-section, .insights-section, .about-section, .contact-section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Contact form modal (Google Form)
    const contactModal = document.getElementById('contact-form-modal');
    const openContactBtn = document.getElementById('open-contact-modal');
    const closeContactBtn = document.getElementById('close-contact-modal');
    const contactOverlay = contactModal ? contactModal.querySelector('.contact-modal-overlay') : null;

    function openContactModal() {
        if (!contactModal) return;
        contactModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => contactModal.classList.add('show'), 10);
    }

    function closeContactModal() {
        if (!contactModal) return;
        contactModal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            contactModal.style.display = 'none';
        }, 250);
    }

    if (openContactBtn && contactModal) {
        openContactBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openContactModal();
        });
    }

    if (closeContactBtn) {
        closeContactBtn.addEventListener('click', function (e) {
            e.preventDefault();
            closeContactModal();
        });
    }

    if (contactOverlay) {
        contactOverlay.addEventListener('click', closeContactModal);
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modalVisible = contactModal && contactModal.style.display === 'flex';
            if (modalVisible) {
                closeContactModal();
            }
        }
    });


    // Credits Modal
    const creditsLink = document.getElementById('credits-link');
    const creditsModal = document.getElementById('credits-modal');
    const closeCredits = document.getElementById('close-credits');
    const creditsOverlay = document.querySelector('.credits-modal-overlay');

    if (creditsLink && creditsModal) {
        // Open modal
        creditsLink.addEventListener('click', function (e) {
            e.preventDefault();
            creditsModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        // Close modal - X button
        if (closeCredits) {
            closeCredits.addEventListener('click', function () {
                creditsModal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scroll
            });
        }

        // Close modal - Click overlay
        if (creditsOverlay) {
            creditsOverlay.addEventListener('click', function () {
                creditsModal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scroll
            });
        }

        // Close modal - ESC key
        document.addEventListener('keydown', function (e) {
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
        backToTopButton.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Continuous Blog Carousel
    const track = document.querySelector('.insights-track');
    const prevBtn = document.querySelector('.prev-control');
    const nextBtn = document.querySelector('.next-control');

    if (track && prevBtn && nextBtn) {
        let currentOffset = 0;
        let speed = 0.5; // Base scroll speed
        const cardWidth = 400; // Updated to match CSS
        const gap = 32; // 2rem
        const cardFullWidth = cardWidth + gap;
        const totalCards = track.children.length;
        const halfCards = totalCards / 2;
        const singleLoopWidth = halfCards * cardFullWidth;

        let isHovered = false;
        let overrideSpeed = 0; // Set by hover on arrows

        // Animation Loop
        function animate() {
            let effectiveSpeed = isHovered ? 0 : speed;

            // If arrow is hovered, it overrides the 'pause' and forces direction
            if (overrideSpeed !== 0) {
                effectiveSpeed = overrideSpeed;
            }

            currentOffset -= effectiveSpeed;

            // Infinite Loop Logic
            // If moved too far left (offset negative)
            if (currentOffset <= -singleLoopWidth) {
                currentOffset += singleLoopWidth;
            }
            // If moved too far right (offset positive)
            else if (currentOffset > 0) {
                currentOffset -= singleLoopWidth;
            }

            track.style.transform = `translateX(${currentOffset}px)`;
            requestAnimationFrame(animate);
        }

        // Start animation
        requestAnimationFrame(animate);

        // Hover Logic (Track)
        track.addEventListener('mouseenter', () => isHovered = true);
        track.addEventListener('mouseleave', () => isHovered = false);

        // Hover Logic (Arrows) - Force Direction
        prevBtn.addEventListener('mouseenter', () => overrideSpeed = -2); // Move Right (negative offset decrease = increase)
        prevBtn.addEventListener('mouseleave', () => overrideSpeed = 0);

        nextBtn.addEventListener('mouseenter', () => overrideSpeed = 2); // Move Left (increase offset decrease)
        nextBtn.addEventListener('mouseleave', () => overrideSpeed = 0);

        // Click Logic (Jump)
        prevBtn.addEventListener('click', () => {
            currentOffset += cardFullWidth;
            // Immediate bounds check to keep it smooth
            if (currentOffset > 0) {
                currentOffset -= singleLoopWidth;
            }
        });

        nextBtn.addEventListener('click', () => {
            currentOffset -= cardFullWidth;
            if (currentOffset <= -singleLoopWidth) {
                currentOffset += singleLoopWidth;
            }
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
