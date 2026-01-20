// DOM ready
document.addEventListener('DOMContentLoaded', function () {

    // Navigation mobile
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Fermer le menu au clic sur un lien
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');

                // Mettre à jour la classe active
                navLinks.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Animation des nombres (compteurs)
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-count'));
                const duration = 1500; // 1.5 secondes
                const step = Math.ceil(target / (duration / 16)); // 60 FPS
                let current = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    element.textContent = current;
                }, 16);

                observer.unobserve(element);
            }
        });
    }, observerOptions);

    statNumbers.forEach(number => observer.observe(number));

    // Navigation active selon la section visible
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        let scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // Animation au scroll des éléments
    const animatedElements = document.querySelectorAll('.project-card, .service-card, .video-card');
    const fadeInObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeInObserver.observe(element);
    });

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Récupération des données du formulaire
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                company: document.getElementById('company').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };

            // Ici, normalement on enverrait les données à un serveur
            // Pour cet exemple, on simule un envoi réussi
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;

            // Simulation d'envoi
            setTimeout(() => {
                alert('Merci pour votre message ! Je vous répondrai dans les plus brefs délais.');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    // Effet de parallaxe léger sur l'héro
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.code-snippet');

        parallaxElements.forEach(element => {
            const speed = 0.3;
            const yPos = -(scrolled * speed);
            element.style.transform = `perspective(1000px) rotateY(-5deg) translateY(${yPos}px)`;
        });
    });

    // Animation du gradient du texte
    const gradientText = document.querySelector('.gradient-text');
    if (gradientText) {
        let hue = 220;

        function animateGradient() {
            hue = (hue + 0.5) % 360;
            gradientText.style.background = `linear-gradient(135deg, hsl(${hue}, 100%, 60%), hsl(${(hue + 60) % 360}, 100%, 60%))`;
            gradientText.style.webkitBackgroundClip = 'text';
            gradientText.style.webkitTextFillColor = 'transparent';
            requestAnimationFrame(animateGradient);
        }

        // Animation discrète, démarre après 2 secondes
        setTimeout(() => {
            requestAnimationFrame(animateGradient);
        }, 2000);
    }
});