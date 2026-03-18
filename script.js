// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close menu when tapping outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Close menu on link click
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu on scroll
window.addEventListener('scroll', () => {
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < bottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}
window.addEventListener('scroll', updateActiveLink);

// ===== BACK TO TOP =====
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SCROLL ANIMATIONS =====
const fadeElements = document.querySelectorAll(
    '.about__card, .service-card, .why__item, .process__step, .accepted__item'
);

fadeElements.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeElements.forEach(el => observer.observe(el));

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn__text');
const btnLoader = submitBtn.querySelector('.btn__loader');

// Inline validation helpers
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    input.classList.add('error');
    input.classList.remove('success');
    if (error) error.textContent = message;
}

function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    input.classList.remove('error');
    if (error) error.textContent = '';
}

function markSuccess(fieldId) {
    const input = document.getElementById(fieldId);
    input.classList.remove('error');
    input.classList.add('success');
    clearError(fieldId);
}

// Real-time validation on blur
document.getElementById('name').addEventListener('blur', function() {
    if (!this.value.trim()) showError('name', 'Please enter your name');
    else markSuccess('name');
});

document.getElementById('email').addEventListener('blur', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.value.trim()) showError('email', 'Please enter your email');
    else if (!emailRegex.test(this.value.trim())) showError('email', 'Please enter a valid email address');
    else markSuccess('email');
});

document.getElementById('phone').addEventListener('blur', function() {
    const phoneClean = this.value.replace(/[\s\-\+\(\)]/g, '');
    if (!this.value.trim()) showError('phone', 'Please enter your phone number');
    else if (phoneClean.length < 10) showError('phone', 'Please enter a valid 10+ digit phone number');
    else markSuccess('phone');
});

document.getElementById('service').addEventListener('change', function() {
    if (!this.value) showError('service', 'Please select a service');
    else markSuccess('service');
});

// Clear errors on input
['name', 'email', 'phone'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => clearError(id));
});

function validateForm() {
    let valid = true;
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneClean = phone.replace(/[\s\-\+\(\)]/g, '');

    if (!name) { showError('name', 'Please enter your name'); valid = false; }
    else markSuccess('name');

    if (!email) { showError('email', 'Please enter your email'); valid = false; }
    else if (!emailRegex.test(email)) { showError('email', 'Please enter a valid email address'); valid = false; }
    else markSuccess('email');

    if (!phone) { showError('phone', 'Please enter your phone number'); valid = false; }
    else if (phoneClean.length < 10) { showError('phone', 'Please enter a valid 10+ digit phone number'); valid = false; }
    else markSuccess('phone');

    if (!service) { showError('service', 'Please select a service'); valid = false; }
    else markSuccess('service');

    return valid;
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Remove any previous error banner
    const oldBanner = contactForm.querySelector('.form-error-banner');
    if (oldBanner) oldBanner.remove();

    if (!validateForm()) {
        // Scroll to first error
        const firstError = contactForm.querySelector('.form__input.error');
        if (firstError) firstError.focus();
        return;
    }

    // Collect form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const service = formData.get('service');

    // Show loading state
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';
    submitBtn.disabled = true;

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Success
            contactForm.innerHTML = `
                <div class="form-success">
                    <div class="form-success__icon">✅</div>
                    <h3>Thank You, ${name}!</h3>
                    <p>Your enquiry for <strong>${service}</strong> has been submitted successfully. Our team will contact you within 24 hours with a detailed quote.</p>
                </div>
            `;
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        // Show error banner
        const banner = document.createElement('div');
        banner.className = 'form-error-banner';
        banner.textContent = 'Something went wrong. Please try again or contact us directly by phone.';
        contactForm.insertBefore(banner, contactForm.firstChild);

        // Reset button
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
