// Configuration
const EMAIL_CONFIG = {
    serviceId: 'service_2r1zgow', // À créer sur EmailJS
    templateId: 'template_k9maxks', // À créer sur EmailJS
    userId: 'VnUwlw8uvuFQ8A6qG', // Ton User ID EmailJS
    emailTo: 'fodeuniverse@gmail.com' // Ton email de réception
};

// Initialiser EmailJS
(function () {
    // Charger EmailJS SDK
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = function () {
        emailjs.init(EMAIL_CONFIG.userId);
        console.log('📧 EmailJS initialisé');
    };
    document.head.appendChild(script);
})();

// Fonction principale d'envoi d'email
async function sendContactEmail(formData) {
    try {
        // Préparer les données pour EmailJS
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            company: formData.company || 'Non spécifié',
            phone: formData.phone || 'Non spécifié',
            service_type: formData.service || 'Non spécifié',
            budget: formData.budget || 'Non spécifié',
            message: formData.message,
            to_email: EMAIL_CONFIG.emailTo,
            date: new Date().toLocaleDateString('fr-FR'),
            time: new Date().toLocaleTimeString('fr-FR')
        };

        // Envoyer l'email via EmailJS
        const response = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId,
            templateParams
        );

        return {
            success: true,
            message: 'Message envoyé avec succès !',
            response: response
        };

    } catch (error) {
        console.error('❌ Erreur EmailJS:', error);
        return {
            success: false,
            message: `Erreur d'envoi: ${error.text || error.message}`,
            error: error
        };
    }
}

// Fonction de validation du formulaire
function validateContactForm(formData) {
    const errors = [];

    // Validation du nom
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères');
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.push('Veuillez entrer une adresse email valide');
    }

    // Validation du message
    if (!formData.message || formData.message.trim().length < 10) {
        errors.push('Le message doit contenir au moins 10 caractères');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Fonction pour afficher les messages
function showMessage(message, type = 'info') {
    // Supprimer les anciens messages
    const oldMessages = document.querySelectorAll('.form-message');
    oldMessages.forEach(msg => msg.remove());

    // Créer le nouveau message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;

    // Icône selon le type
    const icon = type === 'success' ? '✅' :
        type === 'error' ? '❌' :
            type === 'warning' ? '⚠️' : 'ℹ️';

    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${icon}</span>
            <span class="message-text">${message}</span>
            <button class="message-close">&times;</button>
        </div>
    `;

    // Styles du message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' :
            type === 'error' ? '#ef4444' :
                type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: var(--z-tooltip);
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(messageDiv);

    // Bouton de fermeture
    const closeBtn = messageDiv.querySelector('.message-close');
    closeBtn.addEventListener('click', () => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    });

    // Fermeture automatique après 5 secondes
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 5000);
}

// Gestionnaire d'événement pour le formulaire
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Récupérer les données du formulaire
        const formData = {
            name: document.getElementById('name')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            company: document.getElementById('company')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            service: getSelectedServices(),
            budget: document.getElementById('budget')?.value || '',
            message: document.getElementById('message')?.value.trim() || ''
        };

        // Validation
        const validation = validateContactForm(formData);
        if (!validation.isValid) {
            showMessage(validation.errors.join('<br>'), 'error');
            return;
        }

        // Récupérer le bouton d'envoi
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        const originalState = {
            text: submitButton.innerHTML,
            disabled: submitButton.disabled
        };

        // Mettre à jour le bouton
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitButton.disabled = true;

        try {
            // Envoyer l'email
            const result = await sendContactEmail(formData);

            if (result.success) {
                // Succès
                showMessage('✅ Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');

                // Réinitialiser le formulaire
                contactForm.reset();

                // Analytics
                trackFormSubmission(formData);

                // Focus sur le premier champ
                document.getElementById('name')?.focus();

            } else {
                // Échec
                showMessage(`❌ ${result.message}`, 'error');
            }

        } catch (error) {
            // Erreur
            showMessage('❌ Une erreur est survenue lors de l\'envoi. Veuillez réessayer.', 'error');
            console.error('Erreur:', error);

        } finally {
            // Restaurer le bouton
            submitButton.innerHTML = originalState.text;
            submitButton.disabled = originalState.disabled;
        }
    });
}

// Fonction utilitaire pour récupérer les services sélectionnés
function getSelectedServices() {
    const checkboxes = document.querySelectorAll('input[name="service"]:checked');
    if (checkboxes.length === 0) return 'Non spécifié';

    const services = Array.from(checkboxes).map(cb => {
        switch (cb.value) {
            case 'development': return 'Développement sur mesure';
            case 'data': return 'Analyse & Data';
            case 'training': return 'Formation & Conseil';
            case 'other': return 'Autre projet';
            default: return cb.value;
        }
    });

    return services.join(', ');
}

// Fonction pour suivre les soumissions
function trackFormSubmission(formData) {
    try {
        const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
        submissions.push({
            timestamp: new Date().toISOString(),
            name: formData.name,
            email: formData.email,
            service: formData.service
        });
        localStorage.setItem('contact_submissions', JSON.stringify(submissions));
    } catch (error) {
        console.error('Erreur tracking:', error);
    }
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function () {
    setupContactForm();
    console.log('📧 Système de contact initialisé');
});

// Animation CSS pour les messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .message-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .message-icon {
        font-size: 1.25rem;
    }
    
    .message-text {
        flex: 1;
        font-size: 0.875rem;
        line-height: 1.4;
    }
    
    .message-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .message-close:hover {
        opacity: 1;
    }
    
    /* Animation du spinner */
    .fa-spin {
        animation: fa-spin 1s linear infinite;
    }
    
    @keyframes fa-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);