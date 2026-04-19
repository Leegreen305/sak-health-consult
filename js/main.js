/* ============================================================
   SAK Health Consult — Main JavaScript
   Vanilla JS · No Dependencies · IIFE Pattern
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       PAGE LOADER
       ---------------------------------------------------------- */
    function initPageLoader() {
        var loader = document.getElementById('pageLoader');
        var fill = document.getElementById('loaderFill');
        if (!loader) return;

        var progress = 0;
        var interval = setInterval(function () {
            progress += Math.random() * 30;
            if (progress > 90) progress = 90;
            if (fill) fill.style.width = progress + '%';
        }, 200);

        window.addEventListener('load', function () {
            clearInterval(interval);
            if (fill) fill.style.width = '100%';
            setTimeout(function () {
                if (typeof gsap !== 'undefined') {
                    gsap.to(loader, {
                        opacity: 0,
                        duration: 0.6,
                        ease: 'power2.inOut',
                        onComplete: function () {
                            loader.style.display = 'none';
                            document.body.classList.add('page-loaded');
                        }
                    });
                } else {
                    loader.classList.add('loaded');
                    setTimeout(function () { loader.style.display = 'none'; }, 500);
                    document.body.classList.add('page-loaded');
                }
            }, 300);
        });
    }

    /* ----------------------------------------------------------
       DARK MODE TOGGLE
       ---------------------------------------------------------- */
    function initDarkMode() {
        var toggle = document.getElementById('darkModeToggle');
        if (!toggle) return;

        var icon = toggle.querySelector('i');
        var savedTheme = localStorage.getItem('sak-theme');

        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
        }

        toggle.addEventListener('click', function () {
            var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('sak-theme', 'light');
                if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('sak-theme', 'dark');
                if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
            }
        });
    }

    // Run page loader immediately (before DOMContentLoaded)
    initPageLoader();

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
       (Removed — now handled by GSAP ScrollTrigger in js/animations.js)
       ---------------------------------------------------------- */
    function initScrollAnimations() {
        // No-op: GSAP ScrollTrigger handles all scroll animations now.
        // Keeping function stub so DOMContentLoaded call doesn't error.
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
        var MINIMUM_QTY_PER_PRODUCT = 10;

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
            renderCartModal();
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

        function removeFromCart(productId) {
            var cart = getCart().filter(function (item) { return item.id !== productId; });
            saveCart(cart);
            updateCartBadge();
            renderCartModal();
        }

        function updateQty(productId, newQty) {
            var cart = getCart();
            var item = cart.find(function (i) { return i.id === productId; });
            if (item) {
                item.qty = Math.max(1, parseInt(newQty) || 1);
            }
            saveCart(cart);
            updateCartBadge();
            renderCartModal();
        }

        // Cart Modal
        var cartModal = document.getElementById('cart-modal');
        var cartOverlay = document.getElementById('cart-overlay');
        var cartToggle = document.getElementById('cart-toggle');
        var cartClose = document.getElementById('cart-close');
        var cartItemsEl = document.getElementById('cart-items');
        var cartTotalEl = document.getElementById('cart-total');
        var cartCheckoutBtn = document.getElementById('cart-checkout');

        function openCart() {
            if (!cartModal) return;
            cartModal.classList.add('open');
            cartModal.setAttribute('aria-hidden', 'false');
            if (cartOverlay) cartOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            renderCartModal();
        }

        function closeCart() {
            if (!cartModal) return;
            cartModal.classList.remove('open');
            cartModal.setAttribute('aria-hidden', 'true');
            if (cartOverlay) cartOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        function renderCartModal() {
            if (!cartItemsEl) return;
            var cart = getCart();

            if (cart.length === 0) {
                cartItemsEl.innerHTML =
                    '<div class="cart-empty">' +
                    '<i class="fas fa-shopping-bag"></i>' +
                    '<p>Your cart is empty</p>' +
                    '<p class="cart-empty-sub">Browse our catalog and add items to get started.</p>' +
                    '</div>';
                if (cartTotalEl) cartTotalEl.innerHTML = '';
                return;
            }

            var html = '';
            var totalItems = 0;
            cart.forEach(function (item) {
                totalItems += item.qty;
                var belowMin = item.qty < MINIMUM_QTY_PER_PRODUCT;
                html +=
                    '<div class="cart-item" data-cart-id="' + item.id + '">' +
                    '<div class="cart-item-info">' +
                    '<span class="cart-item-name">' + item.name + '</span>' +
                    '<span class="cart-item-price">' + (item.price ? 'GHS ' + item.price.toFixed(2) : 'Contact for Price') + '</span>' +
                    (belowMin ? '<span class="cart-item-warning"><i class="fas fa-exclamation-triangle"></i> Min. 10 units required</span>' : '') +
                    '</div>' +
                    '<div class="cart-item-actions">' +
                    '<button type="button" class="cart-qty-btn cart-qty-minus" data-id="' + item.id + '" aria-label="Decrease quantity">−</button>' +
                    '<input type="number" class="cart-qty-input" value="' + item.qty + '" min="1" data-id="' + item.id + '" aria-label="Quantity">' +
                    '<button type="button" class="cart-qty-btn cart-qty-plus" data-id="' + item.id + '" aria-label="Increase quantity">+</button>' +
                    '<button type="button" class="cart-remove-btn" data-id="' + item.id + '" aria-label="Remove item"><i class="fas fa-trash-alt"></i></button>' +
                    '</div>' +
                    '</div>';
            });
            cartItemsEl.innerHTML = html;

            if (cartTotalEl) {
                cartTotalEl.innerHTML = '<strong>Total items: ' + totalItems + '</strong> (' + cart.length + ' product' + (cart.length > 1 ? 's' : '') + ')';
            }
        }

        // Cart modal event listeners
        if (cartToggle) {
            cartToggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                openCart();
            });
        }
        if (cartClose) cartClose.addEventListener('click', closeCart);
        if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

        // Handle cart item interactions (delegated)
        if (cartItemsEl) {
            cartItemsEl.addEventListener('click', function (e) {
                e.stopPropagation();
                var target = e.target.closest('button');
                if (!target) return;
                var id = target.getAttribute('data-id');
                if (!id) return;

                if (target.classList.contains('cart-qty-minus')) {
                    var cart = getCart();
                    var item = cart.find(function (i) { return i.id === id; });
                    if (item && item.qty > 1) {
                        updateQty(id, item.qty - 1);
                    }
                } else if (target.classList.contains('cart-qty-plus')) {
                    var cart = getCart();
                    var item = cart.find(function (i) { return i.id === id; });
                    if (item) {
                        updateQty(id, item.qty + 1);
                    }
                } else if (target.classList.contains('cart-remove-btn')) {
                    removeFromCart(id);
                }
            });

            cartItemsEl.addEventListener('change', function (e) {
                if (e.target.classList.contains('cart-qty-input')) {
                    var id = e.target.getAttribute('data-id');
                    updateQty(id, e.target.value);
                }
            });
        }

        // Checkout validation with minimum order
        if (cartCheckoutBtn) {
            cartCheckoutBtn.addEventListener('click', function () {
                var cart = getCart();
                if (cart.length === 0) {
                    alert('Your cart is empty. Please add items before submitting an order.');
                    return;
                }

                var belowMin = cart.filter(function (item) { return item.qty < MINIMUM_QTY_PER_PRODUCT; });
                if (belowMin.length > 0) {
                    var names = belowMin.map(function (item) { return item.name + ' (' + item.qty + ' units)'; }).join('\n• ');
                    alert('Minimum order not met.\n\nThe following products require at least ' + MINIMUM_QTY_PER_PRODUCT + ' units each:\n\n• ' + names + '\n\nPlease increase quantities to meet the minimum order requirement for retail customers.');
                    return;
                }

                // Build WhatsApp message with order details
                var msg = 'Hello SAK Health Consult, I would like to place an order:\n\n';
                cart.forEach(function (item) {
                    msg += '• ' + item.name + ' — Qty: ' + item.qty + '\n';
                });
                msg += '\nPlease confirm availability and pricing. Thank you!';
                var whatsappUrl = 'https://wa.me/233598981022?text=' + encodeURIComponent(msg);
                window.open(whatsappUrl, '_blank');
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

        // Expose cart API globally for other pages
        window.SAKCart = {
            addToCart: addToCart,
            getCart: getCart,
            updateCartBadge: updateCartBadge,
            openCart: openCart,
            closeCart: closeCart,
        };

        // Initial badge update
        updateCartBadge();
    }

    /* ----------------------------------------------------------
       BACK TO TOP BUTTON
       ---------------------------------------------------------- */
    function initBackToTop() {
        var btn = document.getElementById('backToTop');
        if (!btn) return;
        window.addEventListener('scroll', function () {
            if (window.scrollY > 600) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });
        btn.addEventListener('click', function () {
            if (window.lenisInstance) {
                window.lenisInstance.scrollTo(0);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    /* ----------------------------------------------------------
       INITIALIZE EVERYTHING ON DOM READY
       ---------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        initDarkMode();
        initHeaderScroll();
        initMobileMenu();
        initScrollAnimations(); // Stub — GSAP handles animations now
        initActiveNavLink();
        initSmoothScroll();
        initContactForm();
        initBookingForm();
        initShop();
        initBackToTop();
    });
})();
