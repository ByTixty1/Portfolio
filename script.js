/* ═══════════════════════════════════════════════════════════════
   SCRIPT.JS — Personal Portfolio Interactive Features
   Table of Contents:
   1. DOM References
   2. Navbar — scroll background & active link highlighting
   3. Smooth Scrolling
   4. Scroll Reveal Animations
   5. Mobile Hamburger Menu
   6. Dark / Light Mode Toggle
   7. Project Category Filter
   8. Contact Form Validation
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ─────────────────────────────────────────
       1. DOM REFERENCES
       ───────────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    const themeToggle = document.getElementById('themeToggle');
    const contactForm = document.getElementById('contactForm');
    const navLinks = document.querySelectorAll('[data-nav]');
    const filterBtns = document.querySelectorAll('[data-filter]');
    const projectCards = document.querySelectorAll('.project-card');
    const revealEls = document.querySelectorAll('.reveal');
    const sections = document.querySelectorAll('section[id]');

    // Create the mobile overlay element dynamically
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    /* ─────────────────────────────────────────
       2. NAVBAR — scroll background & active link
       ───────────────────────────────────────── */

    /**
     * Adds a solid background to the navbar once the user
     * scrolls past 80px from the top.
     */
    function handleNavbarScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    /**
     * Highlights the nav link corresponding to the section
     * currently visible in the viewport.
     */
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            'active',
                            link.getAttribute('href') === `#${id}`
                        );
                    });
                }
            });
        },
        {
            rootMargin: '-30% 0px -70% 0px', // fires when section is ~30% into viewport
        }
    );

    sections.forEach((section) => sectionObserver.observe(section));
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    /* ─────────────────────────────────────────
       3. SMOOTH SCROLLING
       ───────────────────────────────────────── */

    /**
     * Handles smooth scroll for all anchor links that point
     * to an on-page section.
     */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });

            // Close mobile menu if open
            closeMobileMenu();
        });
    });

    /* ─────────────────────────────────────────
       4. SCROLL REVEAL ANIMATIONS
       ───────────────────────────────────────── */

    /**
     * Uses IntersectionObserver to add a "revealed" class to
     * elements with .reveal, triggering CSS transitions.
     */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once revealed — one-time animation
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.05, // trigger when 5% visible
        }
    );

    // Observe all reveal elements
    revealEls.forEach((el) => revealObserver.observe(el));

    // Immediately reveal elements already visible in the viewport on page load
    requestAnimationFrame(() => {
        revealEls.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('revealed');
                revealObserver.unobserve(el);
            }
        });
    });

    /* ─────────────────────────────────────────
       5. MOBILE HAMBURGER MENU
       ───────────────────────────────────────── */

    function openMobileMenu() {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent bg scroll
    }

    function closeMobileMenu() {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.contains('open');
        isOpen ? closeMobileMenu() : openMobileMenu();
    });

    // Close on overlay click
    overlay.addEventListener('click', closeMobileMenu);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    /* ─────────────────────────────────────────
       6. DARK / LIGHT MODE TOGGLE
       ───────────────────────────────────────── */

    const THEME_KEY = 'portfolio-theme';
    const iconEl = themeToggle.querySelector('.theme-toggle__icon');

    /**
     * Applies the theme to the document and updates
     * the toggle icon accordingly.
     * @param {'dark'|'light'} theme
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        iconEl.textContent = theme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem(THEME_KEY, theme);
    }

    // Initialise from localStorage or default to dark
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    /* ─────────────────────────────────────────
       7. PROJECT CATEGORY FILTER
       ───────────────────────────────────────── */

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card) => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    // Re-trigger reveal animation
                    card.style.animation = 'none';
                    /* eslint-disable-next-line no-unused-expressions */
                    card.offsetHeight; // force reflow
                    card.style.animation = '';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* ─────────────────────────────────────────
       8. CONTACT FORM VALIDATION
       ───────────────────────────────────────── */

    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const subjectInput = document.getElementById('formSubject');
    const messageInput = document.getElementById('formMessage');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');
    const formSuccess = document.getElementById('formSuccess');

    /**
     * Basic email regex (covers most common formats).
     */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /**
     * Clears previous error state from all fields.
     */
    function clearErrors() {
        [nameInput, emailInput, subjectInput, messageInput].forEach((input) =>
            input.classList.remove('error')
        );
        nameError.textContent = '';
        emailError.textContent = '';
        subjectError.textContent = '';
        messageError.textContent = '';
        formSuccess.textContent = '';
    }

    /**
     * Sets an error on a specific input field.
     * @param {HTMLElement} input
     * @param {HTMLElement} errorEl
     * @param {string} message
     */
    function setError(input, errorEl, message) {
        input.classList.add('error');
        errorEl.textContent = message;
    }

    /**
     * Validates the form and returns true if valid.
     * @returns {boolean}
     */
    function validateForm() {
        let isValid = true;
        clearErrors();

        // Name
        if (!nameInput.value.trim()) {
            setError(nameInput, nameError, 'Please enter your name.');
            isValid = false;
        }

        // Email
        if (!emailInput.value.trim()) {
            setError(emailInput, emailError, 'Please enter your email.');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            setError(emailInput, emailError, 'Please enter a valid email address.');
            isValid = false;
        }

        // Subject
        if (!subjectInput.value.trim()) {
            setError(subjectInput, subjectError, 'Please enter a subject.');
            isValid = false;
        }

        // Message
        if (!messageInput.value.trim()) {
            setError(messageInput, messageError, 'Please enter a message.');
            isValid = false;
        }

        return isValid;
    }

    // Clear individual field errors on input
    [
        [nameInput, nameError],
        [emailInput, emailError],
        [subjectInput, subjectError],
        [messageInput, messageError],
    ].forEach(([input, errorEl]) => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            errorEl.textContent = '';
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Simulated submission (no backend)
            formSuccess.textContent = '\u2705 Message sent successfully! I will get back to you soon.';
            contactForm.reset();

            // Auto-clear success message after 5s
            setTimeout(() => {
                formSuccess.textContent = '';
            }, 5000);
        }
    });

    /* ─────────────────────────────────────────
       INITIAL NAVBAR STATE
       ───────────────────────────────────────── */
    handleNavbarScroll();
});
