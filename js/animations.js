/* ============================================
   SAK Health Consult — Premium Animation Engine
   GSAP + ScrollTrigger + Lenis
   ============================================ */

(function () {
    'use strict';

    // Wait for all libraries to load
    function init() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Lenis === 'undefined') {
            setTimeout(init, 50);
            return;
        }

        gsap.registerPlugin(ScrollTrigger);
        if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);

        initLenis();
        initScrollAnimations();
        initParallax();
        initTextReveals();
        initCounterAnimations();
        initSwiperCarousels();
        initMagneticButtons();
        initCustomCursor();
        initScrollProgress();
    }

    /* --- Lenis Smooth Scroll --- */
    function initLenis() {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        // Store for global access
        window.lenisInstance = lenis;
    }

    /* --- Scroll-Triggered Fade Animations --- */
    function initScrollAnimations() {
        // Fade up animations (replaces old IntersectionObserver)
        gsap.utils.toArray('.fade-in, .fade-in-left, .fade-in-right').forEach((el) => {
            const direction = el.classList.contains('fade-in-left') ? -60 :
                el.classList.contains('fade-in-right') ? 60 : 0;

            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    end: 'top 60%',
                    toggleActions: 'play none none none',
                },
                y: direction === 0 ? 50 : 0,
                x: direction,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out',
            });
        });

        // Staggered card entrances
        gsap.utils.toArray('.grid-2, .grid-3, .grid-4, .bento-grid').forEach((grid) => {
            const cards = grid.children;
            if (!cards.length) return;

            gsap.from(cards, {
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
            });
        });
    }

    /* --- Parallax Effects --- */
    function initParallax() {
        gsap.utils.toArray('[data-parallax]').forEach((el) => {
            const speed = parseFloat(el.dataset.parallax) || 0.2;
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el.parentElement || el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
                y: () => speed * 100,
                ease: 'none',
            });
        });

        // Hero parallax
        const heroImg = document.querySelector('.hero-bg-img');
        if (heroImg) {
            gsap.to(heroImg, {
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
                y: 120,
                scale: 1.08,
                ease: 'none',
            });
        }
    }

    /* --- Text Reveal Animations --- */
    function initTextReveals() {
        gsap.utils.toArray('[data-text-reveal]').forEach((el) => {
            // Split text into words
            const text = el.textContent;
            const words = text.split(' ');
            el.innerHTML = words.map(w => `<span class="word-wrap"><span class="word">${w}</span></span>`).join(' ');

            const wordEls = el.querySelectorAll('.word');
            gsap.from(wordEls, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                y: '110%',
                opacity: 0,
                duration: 0.7,
                stagger: 0.04,
                ease: 'power4.out',
            });
        });
    }

    /* --- Counter Animations --- */
    function initCounterAnimations() {
        gsap.utils.toArray('[data-count]').forEach((el) => {
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            const prefix = el.dataset.prefix || '';

            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                textContent: 0,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: 1 },
                onUpdate: function () {
                    el.textContent = prefix + Math.ceil(parseFloat(el.textContent)) + suffix;
                },
                onComplete: function () {
                    el.textContent = prefix + target + suffix;
                },
            });
        });
    }

    /* --- Swiper Carousels --- */
    function initSwiperCarousels() {
        if (typeof Swiper === 'undefined') return;

        const testimonialSwiper = document.querySelector('.testimonial-swiper');
        if (testimonialSwiper) {
            new Swiper('.testimonial-swiper', {
                slidesPerView: 1,
                spaceBetween: 24,
                loop: true,
                autoplay: { delay: 5000, disableOnInteraction: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                breakpoints: {
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                },
            });
        }
    }

    /* --- Magnetic Button Effect --- */
    function initMagneticButtons() {
        if (window.matchMedia('(pointer: fine)').matches === false) return; // Skip on touch

        gsap.utils.toArray('.btn-magnetic, .btn-lg').forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: 'power2.out',
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.4)',
                });
            });
        });
    }

    /* --- Custom Cursor --- */
    function initCustomCursor() {
        if (window.matchMedia('(pointer: fine)').matches === false) return;

        const cursor = document.querySelector('.custom-cursor');
        const cursorDot = document.querySelector('.custom-cursor-dot');
        if (!cursor || !cursorDot) return;

        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power3.out' });
            gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
        });

        // Scale up on interactive elements
        const interactives = document.querySelectorAll('a, button, input, textarea, select, .card, .product-card');
        interactives.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
    }

    /* --- Scroll Progress Bar --- */
    function initScrollProgress() {
        const bar = document.querySelector('.scroll-progress-bar');
        if (!bar) return;

        gsap.to(bar, {
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3,
            },
            scaleX: 1,
            transformOrigin: 'left center',
            ease: 'none',
        });
    }

    /* --- Reduced Motion Check --- */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        // Make all elements visible without animation
        document.documentElement.classList.add('reduced-motion');
    } else {
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }
})();
