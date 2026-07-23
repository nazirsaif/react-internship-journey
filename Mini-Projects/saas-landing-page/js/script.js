"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (moonIcon)
            moonIcon.style.display = 'none';
        if (sunIcon)
            sunIcon.style.display = 'block';
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            if (isLight) {
                localStorage.setItem('theme', 'light');
                if (moonIcon)
                    moonIcon.style.display = 'none';
                if (sunIcon)
                    sunIcon.style.display = 'block';
            }
            else {
                localStorage.setItem('theme', 'dark');
                if (moonIcon)
                    moonIcon.style.display = 'block';
                if (sunIcon)
                    sunIcon.style.display = 'none';
            }
        });
    }
    function toggleMenu() {
        if (!hamburger || !navMenu)
            return;
        const isActive = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive.toString());
    }
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }
    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', () => {
            if (hamburger) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });
    // Data Arrays
    const pricingPlans = [
        {
            name: "Starter",
            price: 19,
            period: "/mo",
            features: [
                "Up to 5 projects",
                "Basic analytics",
                "24-hour support response time"
            ],
            highlighted: false
        },
        {
            name: "Professional",
            price: 49,
            period: "/mo",
            features: [
                "Unlimited projects",
                "Advanced analytics & reports",
                "1-hour support response time",
                "Custom domain"
            ],
            highlighted: true
        },
        {
            name: "Enterprise",
            price: 99,
            period: "/mo",
            features: [
                "Everything in Professional",
                "Dedicated account manager",
                "Phone support 24/7",
                "Custom integration",
                "SLA"
            ],
            highlighted: false
        }
    ];
    const faqData = [
        {
            question: "How does pricing work?",
            answer: "Our pricing is tier-based depending on the number of projects and features you need. You can start with our $19/mo plan and upgrade at any time. There are no hidden fees or long-term contracts."
        },
        {
            question: "Can I cancel my subscription at any time?",
            answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to your plan until the end of your billing cycle."
        },
        {
            question: "Do you offer a free trial?",
            answer: "We don't offer a free trial, but we do have a 14-day money-back guarantee. If you're not satisfied with AIFlow within the first 14 days, we'll give you a full refund."
        },
        {
            question: "What kind of support do you provide?",
            answer: "All plans include email support. The Professional plan includes faster response times, and our Enterprise plan includes a dedicated account manager and 24/7 phone support."
        }
    ];
    // Dynamic Rendering
    const pricingGrid = document.querySelector('.pricing-grid');
    if (pricingGrid) {
        pricingGrid.innerHTML = '';
        pricingPlans.forEach((plan) => {
            const card = document.createElement('div');
            card.className = `card pricing-card ${plan.highlighted ? 'popular reveal active' : 'reveal active'}`;
            let badge = '';
            if (plan.highlighted) {
                badge = '<div class="popular-badge">Most Popular</div>';
            }
            const featuresHtml = plan.features.map(feature => `<li><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> ${feature}</li>`).join('');
            const btnClass = plan.highlighted ? 'btn-primary' : 'btn-outline';
            const btnText = plan.name === 'Enterprise' ? 'Contact Sales' : `Choose ${plan.name}`;
            card.innerHTML = `
                ${badge}
                <h3>${plan.name}</h3>
                <div class="price"><span>$</span>${plan.price}<span>${plan.period}</span></div>
                <ul class="features-list">
                    ${featuresHtml}
                </ul>
                <a href="#" class="btn ${btnClass}" style="width: 100%; text-align: center;">${btnText}</a>
            `;
            pricingGrid.appendChild(card);
        });
    }
    const faqList = document.querySelector('.faq-list');
    if (faqList) {
        faqList.innerHTML = '';
        faqData.forEach((item, index) => {
            const faqDiv = document.createElement('div');
            faqDiv.className = 'faq-item';
            const answerId = `faq-answer-${index}`;
            faqDiv.innerHTML = `
                <button class="faq-question" aria-expanded="false" aria-controls="${answerId}">
                    ${item.question}
                    <svg class="faq-icon" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div class="faq-answer" id="${answerId}">
                    <p>${item.answer}</p>
                </div>
            `;
            faqList.appendChild(faqDiv);
        });
    }
    // FAQ Accordion logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (otherAnswer)
                        otherAnswer.style.maxHeight = '';
                    if (otherQuestion)
                        otherQuestion.setAttribute('aria-expanded', 'false');
                });
                // If it wasn't active, open it
                if (!isActive) {
                    item.classList.add('active');
                    if (answer)
                        answer.style.maxHeight = answer.scrollHeight + "px";
                    if (question)
                        question.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });
    // Newsletter Form Validation
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    const errorMsg = document.getElementById('newsletter-error');
    const successMsg = document.getElementById('newsletter-success');
    if (newsletterForm && emailInput && errorMsg && successMsg) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const email = emailInput.value.trim();
            if (!emailRegex.test(email)) {
                emailInput.classList.add('error');
                emailInput.classList.remove('success');
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
                emailInput.setAttribute('aria-invalid', 'true');
            }
            else {
                emailInput.classList.remove('error');
                emailInput.classList.add('success');
                errorMsg.style.display = 'none';
                emailInput.setAttribute('aria-invalid', 'false');
                const btn = newsletterForm.querySelector('button');
                if (btn) {
                    btn.disabled = true;
                    btn.textContent = 'Subscribing...';
                }
                setTimeout(() => {
                    successMsg.style.display = 'block';
                    newsletterForm.style.display = 'none';
                }, 1000);
            }
        });
        emailInput.addEventListener('input', () => {
            emailInput.classList.remove('error');
            errorMsg.style.display = 'none';
            emailInput.removeAttribute('aria-invalid');
        });
    }
    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    revealElements.forEach((el) => {
        revealObserver.observe(el);
    });
});
