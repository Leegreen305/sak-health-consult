document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.frosted-header');
    const mobileTrigger = document.querySelector('.mobile-menu-trigger');
    const overlayMenu = document.querySelector('.overlay-menu');
    const overlayClose = document.querySelector('.overlay-close');
    const revealItems = document.querySelectorAll('.reveal');
    const serviceOptions = document.querySelectorAll('.service-option');
    const datePickers = document.querySelectorAll('.date-picker');
    const timeSlots = document.querySelectorAll('.time-slot');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.step-next');
    const prevButtons = document.querySelectorAll('.step-back');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLabels = document.querySelectorAll('.progress-label');
    const whatsappFloat = document.querySelector('.whatsapp-float');

    // Form data store
    let formData = {
        service: '',
        reason: '',
        date: '',
        time: '',
        name: '',
        phone: '',
        email: '',
        notes: ''
    };

    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 60);
        });
    }

    if (mobileTrigger && overlayMenu && overlayClose) {
        mobileTrigger.addEventListener('click', () => overlayMenu.classList.add('open'));
        overlayClose.addEventListener('click', () => overlayMenu.classList.remove('open'));
        overlayMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => overlayMenu.classList.remove('open'));
        });
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        revealObserver.observe(item);
    });

    serviceOptions.forEach(option => {
        option.addEventListener('click', () => {
            serviceOptions.forEach(card => card.classList.remove('selected'));
            option.classList.add('selected');
            const input = option.querySelector('input[type="radio"]');
            if (input) {
                input.checked = true;
                formData.service = input.value;
            }
        });
    });

    datePickers.forEach(date => {
        date.addEventListener('click', () => {
            datePickers.forEach(item => item.classList.remove('selected'));
            date.classList.add('selected');
            formData.date = date.getAttribute('data-date') || date.textContent.trim();
        });
    });

    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(item => item.classList.remove('selected'));
            slot.classList.add('selected');
            formData.time = slot.textContent.trim();
        });
    });

    // Capture form field inputs
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const reasonSelect = document.getElementById('reason');
    const notesInput = document.getElementById('notes');

    if (nameInput) nameInput.addEventListener('input', (e) => { formData.name = e.target.value; });
    if (phoneInput) phoneInput.addEventListener('input', (e) => { formData.phone = e.target.value; });
    if (emailInput) emailInput.addEventListener('input', (e) => { formData.email = e.target.value; });
    if (reasonSelect) reasonSelect.addEventListener('change', (e) => { formData.reason = e.target.value; });
    if (notesInput) notesInput.addEventListener('input', (e) => { formData.notes = e.target.value; });

    let currentStep = 0;

    const updateStepState = () => {
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });
        progressSteps.forEach((progress, index) => {
            progress.classList.toggle('active', index <= currentStep);
        });
        progressLabels.forEach((label, index) => {
            label.style.fontWeight = index === currentStep ? '700' : '400';
        });

        // Update confirmation panel when reaching step 4
        if (currentStep === 3) {
            updateConfirmationPanel();
        }
    };

    const updateConfirmationPanel = () => {
        document.getElementById('confirm-service').textContent = formData.service || '-';
        document.getElementById('confirm-reason').textContent = formData.reason || '-';
        document.getElementById('confirm-date').textContent = formData.date || '-';
        document.getElementById('confirm-time').textContent = formData.time || '-';
        
        const contactDiv = document.getElementById('confirm-contact');
        if (contactDiv) {
            contactDiv.innerHTML = `
                <p style="margin:0 0 8px;"><strong>${formData.name || '-'}</strong></p>
                <p style="margin:0 0 4px;"><strong>Phone:</strong> ${formData.phone || '-'}</p>
                <p style="margin:0 0 4px;"><strong>Email:</strong> ${formData.email || '-'}</p>
                ${formData.notes ? `<p style="margin:0; margin-top:8px;"><strong>Additional Notes:</strong><br/>${formData.notes}</p>` : ''}
            `;
        }
    };

    nextButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            if (currentStep < formSteps.length - 1) {
                currentStep += 1;
                updateStepState();
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            if (currentStep > 0) {
                currentStep -= 1;
                updateStepState();
            }
        });
    });

    // Confirm booking button
    const confirmBtn = document.getElementById('confirm-booking');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const reviewPanel = document.querySelector('.confirmation-panel');
            const successPanel = document.getElementById('success-panel');
            if (reviewPanel) reviewPanel.style.display = 'none';
            if (successPanel) successPanel.style.display = 'block';
        });
    }

    updateStepState();

    if (whatsappFloat) {
        whatsappFloat.addEventListener('mouseenter', () => {
            const tooltip = whatsappFloat.querySelector('.whatsapp-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            }
        });
        whatsappFloat.addEventListener('mouseleave', () => {
            const tooltip = whatsappFloat.querySelector('.whatsapp-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '';
                tooltip.style.visibility = '';
            }
        });
    }
});
