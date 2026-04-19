/* ============================================
   SAK Health Consult — Premium Animation Engine
   GSAP + ScrollTrigger + Lenis
   
   PROGRESSIVE ENHANCEMENT: All content is visible
   by default. Animations only apply when GSAP is
   confirmed loaded. If GSAP fails, content remains
   fully visible and usable.
   ============================================ */

(function () {
    'use strict';

    var MAX_WAIT = 8000; // Max ms to wait for libraries before giving up
    var startTime = Date.now();

    // Wait for all libraries to load (with timeout safety)
    function init() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Lenis === 'undefined') {
            if (Date.now() - startTime > MAX_WAIT) {
                // Libraries failed to load — ensure content is visible
                showAllContent();
                return;
            }
            setTimeout(init, 50);
            return;
        }

        // Libraries loaded — mark document so CSS can apply initial hidden states
        document.documentElement.classList.add('gsap-ready');

        gsap.registerPlugin(ScrollTrigger);
        if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);

        try {
            initLenis();
            initScrollAnimations();
            initParallax();
            initTextReveals();
            initCounterAnimations();
            initSwiperCarousels();
            initMagneticButtons();
            initCustomCursor();
            initScrollProgress();
        } catch (e) {
            // If any animation init fails, make sure content is visible
            console.warn('SAK Animations: init error, ensuring content visibility', e);
            showAllContent();
        }
    }

    // Safety net: make all content visible if animations fail
    function showAllContent() {
        document.documentElement.classList.remove('gsap-ready');
        // Force all potentially hidden elements visible
        var els = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
        for (var i = 0; i < els.length; i++) {
            els[i].style.opacity = '1';
            els[i].style.transform = 'none';
        }
        // Make word-reveal text visible
        var words = document.querySelectorAll('.word-wrap .word');
        for (var j = 0; j < words.length; j++) {
            words[j].style.opacity = '1';
            words[j].style.transform = 'none';
        }
        // Hide page loader
        var loader = document.getElementById('pageLoader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
            setTimeout(function () { loader.style.display = 'none'; }, 600);
        }
    }

    /* --- Lenis Smooth Scroll --- */
    function initLenis() {
        var lenis = new Lenis({
            duration: 1.2,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            orientation: 'vertical',
            smoothWheel: true,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);

        // Store for global access
        window.lenisInstance = lenis;
    }

    /* --- Scroll-Triggered Fade Animations --- */
    function initScrollAnimations() {
        // Fade animations using fromTo() for explicit start/end states
        gsap.utils.toArray('.fade-in, .fade-in-left, .fade-in-right').forEach(function (el) {
            var direction = el.classList.contains('fade-in-left') ? -60 :
                el.classList.contains('fade-in-right') ? 60 : 0;

            gsap.fromTo(el,
                {
                    y: direction === 0 ? 50 : 0,
                    x: direction,
                    opacity: 0,
                },
                {
                    y: 0,
                    x: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        end: 'top 60%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });

        // Staggered card entrances
        gsap.utils.toArray('.grid-2, .grid-3, .grid-4, .bento-grid').forEach(function (grid) {
            var cards = grid.children;
            if (!cards.length) return;

            gsap.fromTo(cards,
                {
                    y: 60,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: grid,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });
    }

    /* --- Parallax Effects --- */
    function initParallax() {
        gsap.utils.toArray('[data-parallax]').forEach(function (el) {
            var speed = parseFloat(el.dataset.parallax) || 0.2;
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el.parentElement || el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
                y: function () { return speed * 100; },
                ease: 'none',
            });
        });

        // Hero parallax
        var heroImg = document.querySelector('.hero-bg-img');
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
        gsap.utils.toArray('[data-text-reveal]').forEach(function (el) {
            // Split text into words
            var text = el.textContent;
            var words = text.split(' ');
            el.innerHTML = words.map(function (w) {
                return '<span class="word-wrap"><span class="word">' + w + '</span></span>';
            }).join(' ');

            var wordEls = el.querySelectorAll('.word');
            gsap.fromTo(wordEls,
                {
                    y: '110%',
                    opacity: 0,
                },
                {
                    y: '0%',
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.04,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });
    }

    /* --- Counter Animations --- */
    function initCounterAnimations() {
        gsap.utils.toArray('[data-count]').forEach(function (el) {
            var target = parseInt(el.dataset.count, 10);
            var suffix = el.dataset.suffix || '';
            var prefix = el.dataset.prefix || '';

            gsap.fromTo(el,
                { textContent: 0 },
                {
                    textContent: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                    onUpdate: function () {
                        el.textContent = prefix + Math.ceil(parseFloat(el.textContent)) + suffix;
                    },
                    onComplete: function () {
                        el.textContent = prefix + target + suffix;
                    },
                }
            );
        });
    }

    /* --- Swiper Carousels --- */
    function initSwiperCarousels() {
        if (typeof Swiper === 'undefined') return;

        var testimonialSwiper = document.querySelector('.testimonial-swiper');
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

        gsap.utils.toArray('.btn-magnetic, .btn-lg').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: 'power2.out',
                });
            });

            btn.addEventListener('mouseleave', function () {
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

        var cursor = document.querySelector('.custom-cursor');
        var cursorDot = document.querySelector('.custom-cursor-dot');
        if (!cursor || !cursorDot) return;

        document.addEventListener('mousemove', function (e) {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power3.out' });
            gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
        });

        // Scale up on interactive elements
        var interactives = document.querySelectorAll('a, button, input, textarea, select, .card, .product-card');
        interactives.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursor.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', function () {
                cursor.classList.remove('cursor-hover');
            });
        });
    }

    /* --- Scroll Progress Bar --- */
    function initScrollProgress() {
        var bar = document.querySelector('.scroll-progress-bar');
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
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
