/* ============================================================
   SAK Health Consult — Main JavaScript
   Vanilla JS · No Dependencies · IIFE Pattern
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       HEADER SCROLL BEHAVIOR
       ---------------------------------------------------------- */
    function initHeaderScroll() {
        var header = document.querySelector('.site-header');
        if (!header) return;

        function onScroll() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run on load
    }

    /* ----------------------------------------------------------
       MOBILE MENU
       ---------------------------------------------------------- */
    function initMobileMenu() {
        var toggle = document.querySelector('.mobile-menu-toggle');
        var mobileNav = document.querySelector('.mobile-nav');
        var overlay = document.querySelector('.mobile-nav-overlay');
        if (!toggle || !mobileNav) return;

        function openMenu() {
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            mobileNav.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        toggle.addEventListener('click', function () {
            if (mobileNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        // Close on link click
        var mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });
    }

    /* ----------------------------------------------------------
       SCROLL FADE-IN ANIMATIONS
       ---------------------------------------------------------- */
    function initScrollAnimations() {
        var elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
        if (!elements.length) return;

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.15 }
            );

            elements.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: show everything
            elements.forEach(function (el) {
                el.classList.add('visible');
            });
        }
    }

    /* ----------------------------------------------------------
       ACTIVE NAV LINK
       ---------------------------------------------------------- */
    function initActiveNavLink() {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage === '') currentPage = 'index.html';

        var navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href) return;
            var linkPage = href.split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }

    /* ----------------------------------------------------------
       SMOOTH SCROLL FOR ANCHOR LINKS
       ---------------------------------------------------------- */
    function initSmoothScroll() {
        document.addEventListener('click', function (e) {
            var anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;
            var targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = document.querySelector('.site-header')
                    ? document.querySelector('.site-header').offsetHeight
                    : 0;
                var top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    }

    /* ----------------------------------------------------------
       FORM VALIDATION UTILITIES
       ---------------------------------------------------------- */
    function showError(input, message) {
        input.classList.add('error');
        input.classList.remove('success');
        input.setAttribute('aria-invalid', 'true');
        var errorEl = input.parentElement.querySelector('.form-error');
        if (errorEl) {
            if (!errorEl.id) {
                errorEl.id = 'error-' + (input.id || Math.random().toString(36).slice(2));
            }
            errorEl.textContent = message;
            errorEl.classList.add('visible');
            input.setAttribute('aria-describedby', errorEl.id);
        }
    }

    function clearError(input) {
        input.classList.remove('error');
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
        var errorEl = input.parentElement.querySelector('.form-error');
        if (errorEl) {
            errorEl.classList.remove('visible');
            errorEl.textContent = '';
        }
    }

    function validateRequired(input) {
        var value = input.value.trim();
        if (!value) {
            showError(input, 'This field is required');
            return false;
        }
        clearError(input);
        return true;
    }

    function validateEmail(input) {
        var value = input.value.trim();
        if (!value) {
            showError(input, 'Email is required');
            return false;
        }
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(value)) {
            showError(input, 'Please enter a valid email address');
            return false;
        }
        clearError(input);
        return true;
    }

    function validatePhone(input) {
        var value = input.value.trim();
        if (!value) {
            showError(input, 'Phone number is required');
            return false;
        }
        var re = /^[\+]?[\d\s\-\(\)]{7,20}$/;
        if (!re.test(value)) {
            showError(input, 'Please enter a valid phone number');
            return false;
        }
        clearError(input);
        return true;
    }

    function validateForm(form) {
        var isValid = true;
        var requiredInputs = form.querySelectorAll('[required]');
        requiredInputs.forEach(function (input) {
            var type = input.getAttribute('type') || input.tagName.toLowerCase();
            if (type === 'email') {
                if (!validateEmail(input)) isValid = false;
            } else if (type === 'tel') {
                if (!validatePhone(input)) isValid = false;
            } else {
                if (!validateRequired(input)) isValid = false;
            }
        });
        return isValid;
    }

    // Clear errors on input
    document.addEventListener('input', function (e) {
        if (e.target.classList.contains('error')) {
            clearError(e.target);
        }
    });

    /* ----------------------------------------------------------
       CONTACT FORM HANDLER
       ---------------------------------------------------------- */
    function initContactForm() {
        var form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateForm(form)) return;

            // Simulate submission success
            var parent = form.parentElement;
            form.style.display = 'none';

            var successDiv = document.createElement('div');
            successDiv.className = 'form-success';
            successDiv.innerHTML =
                '<div class="success-icon"><i class="fas fa-check"></i></div>' +
                '<h3>Message Sent!</h3>' +
                '<p>Thank you for reaching out. We\'ll get back to you within 24 hours.</p>';
            parent.appendChild(successDiv);
        });
    }

    /* ----------------------------------------------------------
       MULTI-STEP BOOKING FORM
       ---------------------------------------------------------- */
    function initBookingForm() {
        var bookingForm = document.getElementById('booking-form');
        if (!bookingForm) return;

        var currentStep = 1;
        var totalSteps = 4;
        var steps = bookingForm.querySelectorAll('.booking-step');
        var progressSteps = document.querySelectorAll('.progress-step');

        function updateProgress() {
            progressSteps.forEach(function (step, index) {
                var stepNum = index + 1;
                step.classList.remove('active', 'completed');
                if (stepNum === currentStep) {
                    step.classList.add('active');
                } else if (stepNum < currentStep) {
                    step.classList.add('completed');
                    // Replace number with checkmark
                    var numEl = step.querySelector('.step-number');
                    if (numEl) numEl.innerHTML = '<i class="fas fa-check"></i>';
                }
            });
        }

        function showStep(stepNum) {
            steps.forEach(function (step) {
                step.classList.remove('active');
            });
            var target = bookingForm.querySelector('[data-step="' + stepNum + '"]');
            if (target) target.classList.add('active');
            currentStep = stepNum;
            updateProgress();
        }

        function validateStep(stepNum) {
            if (stepNum === 1) {
                var selected = bookingForm.querySelector('.service-option.selected');
                if (!selected) {
                    alert('Please select a service type');
                    return false;
                }
                return true;
            }
            if (stepNum === 2) {
                var dateInput = bookingForm.querySelector('#booking-date');
                var timeInput = bookingForm.querySelector('#booking-time');
                var valid = true;
                if (dateInput && !validateRequired(dateInput)) valid = false;
                if (timeInput && !validateRequired(timeInput)) valid = false;
                return valid;
            }
            if (stepNum === 3) {
                var nameInput = bookingForm.querySelector('#booking-name');
                var phoneInput = bookingForm.querySelector('#booking-phone');
                var emailInput = bookingForm.querySelector('#booking-email');
                var valid = true;
                if (nameInput && !validateRequired(nameInput)) valid = false;
                if (phoneInput && !validatePhone(phoneInput)) valid = false;
                if (emailInput && !validateEmail(emailInput)) valid = false;
                return valid;
            }
            return true;
        }

        function buildSummary() {
            var summaryEl = bookingForm.querySelector('.booking-summary');
            if (!summaryEl) return;

            var selectedService = bookingForm.querySelector('.service-option.selected');
            var serviceName = selectedService
                ? selectedService.querySelector('h4').textContent
                : 'N/A';
            var date = bookingForm.querySelector('#booking-date');
            var time = bookingForm.querySelector('#booking-time');
            var name = bookingForm.querySelector('#booking-name');
            var phone = bookingForm.querySelector('#booking-phone');
            var email = bookingForm.querySelector('#booking-email');
            var notes = bookingForm.querySelector('#booking-notes');

            summaryEl.innerHTML =
                '<div style="text-align:left; max-width:400px; margin:0 auto;">' +
                '<p><strong>Service:</strong> ' + serviceName + '</p>' +
                '<p><strong>Date:</strong> ' + (date ? date.value : '') + '</p>' +
                '<p><strong>Time:</strong> ' + (time ? time.value : '') + '</p>' +
                '<p><strong>Name:</strong> ' + (name ? name.value : '') + '</p>' +
                '<p><strong>Phone:</strong> ' + (phone ? phone.value : '') + '</p>' +
                '<p><strong>Email:</strong> ' + (email ? email.value : '') + '</p>' +
                (notes && notes.value ? '<p><strong>Notes:</strong> ' + notes.value + '</p>' : '') +
                '</div>';
        }

        // Service option selection
        var serviceOptions = bookingForm.querySelectorAll('.service-option');
        serviceOptions.forEach(function (option) {
            option.addEventListener('click', function () {
                serviceOptions.forEach(function (o) { o.classList.remove('selected'); });
                option.classList.add('selected');
                var radio = option.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });

        // Next / Prev buttons
        bookingForm.addEventListener('click', function (e) {
            if (e.target.closest('.btn-next')) {
                e.preventDefault();
                if (validateStep(currentStep)) {
                    if (currentStep === 3) buildSummary();
                    if (currentStep < totalSteps) showStep(currentStep + 1);
                }
            }
            if (e.target.closest('.btn-prev')) {
                e.preventDefault();
                if (currentStep > 1) showStep(currentStep - 1);
            }
            if (e.target.closest('.btn-confirm')) {
                e.preventDefault();
                // Show confirmation
                var allSteps = bookingForm.querySelectorAll('.booking-step');
                allSteps.forEach(function (s) { s.classList.remove('active'); });
                var progress = document.querySelector('.booking-progress');
                if (progress) progress.style.display = 'none';

                var confirmDiv = document.createElement('div');
                confirmDiv.className = 'booking-confirmation';
                confirmDiv.innerHTML =
                    '<div class="confirm-icon"><i class="fas fa-check"></i></div>' +
                    '<h3>Appointment Booked!</h3>' +
                    '<p>Thank you for booking with SAK Health Consult. We will contact you shortly to confirm your appointment details.</p>';
                bookingForm.appendChild(confirmDiv);
            }
        });

        // Initialize
        showStep(1);
    }

    /* ----------------------------------------------------------
       SHOP FUNCTIONALITY
       ---------------------------------------------------------- */
    function initShop() {
        // Category filter
        var filterBtns = document.querySelectorAll('.filter-btn');
        var productCards = document.querySelectorAll('.product-card[data-category]');

        if (filterBtns.length) {
            filterBtns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var category = btn.getAttribute('data-filter');

                    filterBtns.forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');

                    productCards.forEach(function (card) {
                        if (category === 'all' || card.getAttribute('data-category') === category) {
                            card.style.display = '';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
        }

        // Cart — sessionStorage
        function getCart() {
            try {
                return JSON.parse(sessionStorage.getItem('sak_cart')) || [];
            } catch (e) {
                return [];
            }
        }

        function saveCart(cart) {
            sessionStorage.setItem('sak_cart', JSON.stringify(cart));
        }

        function addToCart(productId, name, price) {
            var cart = getCart();
            var existing = cart.find(function (item) { return item.id === productId; });
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ id: productId, name: name, price: price, qty: 1 });
            }
            saveCart(cart);
            updateCartBadge();
        }

        function updateCartBadge() {
            var badges = document.querySelectorAll('.cart-badge');
            var cart = getCart();
            var count = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
            badges.forEach(function (badge) {
                badge.textContent = count;
                if (count > 0) {
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            });
        }

        // Add to cart buttons
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('.btn-add-cart');
            if (!btn) return;
            var card = btn.closest('.product-card');
            if (!card) return;

            var id = card.getAttribute('data-id') || card.getAttribute('data-product-id') || Math.random().toString(36).slice(2);
            var name = card.querySelector('.product-name')
                ? card.querySelector('.product-name').textContent
                : 'Product';
            var priceText = card.querySelector('.product-price')
                ? card.querySelector('.product-price').textContent
                : '0';
            var price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

            addToCart(id, name, price);

            // Visual feedback
            var originalText = btn.textContent;
            btn.textContent = 'Added!';
            btn.style.backgroundColor = '#27ae60';
            setTimeout(function () {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 1200);
        });

        // Expose updateCartBadge globally for other pages
        window.SAKCart = {
            addToCart: addToCart,
            getCart: getCart,
            updateCartBadge: updateCartBadge,
        };

        // Initial badge update
        updateCartBadge();
    }

    /* ----------------------------------------------------------
       INITIALIZE EVERYTHING ON DOM READY
       ---------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        initHeaderScroll();
        initMobileMenu();
        initScrollAnimations();
        initActiveNavLink();
        initSmoothScroll();
        initContactForm();
        initBookingForm();
        initShop();
    });
})();
