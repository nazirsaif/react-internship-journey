interface PricingPlan {
    name: string;
    price: number;
    period: string;
    features: string[];
    highlighted: boolean;
}

interface FAQItem {
    question: string;
    answer: string;
}

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
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        
        if (isLight) {
            localStorage.setItem('theme', 'light');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            localStorage.setItem('theme', 'dark');
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    });

    function toggleMenu() {
        const isActive = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
    }

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Dynamically add IDs and aria-controls for accessibility
        const answerId = `faq-answer-${index}`;
        answer.id = answerId;
        question.setAttribute('aria-controls', answerId);

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            
            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Newsletter Form Validation
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    const errorMsg = document.getElementById('newsletter-error');
    const successMsg = document.getElementById('newsletter-success');

    if (newsletterForm) {
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
            } else {
                emailInput.classList.remove('error');
                emailInput.classList.add('success');
                errorMsg.style.display = 'none';
                emailInput.setAttribute('aria-invalid', 'false');
                
                const btn = newsletterForm.querySelector('button');
                btn.disabled = true;
                btn.textContent = 'Subscribing...';
                
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
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
