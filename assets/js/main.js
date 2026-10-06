/* ==========================================================================
                    MENU MOBILE 
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');

    let mobileToggle = document.querySelector('.mobile-toggle');

    if (!mobileToggle) {
        mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-toggle';
        mobileToggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        const navbarContent = document.querySelector('.navbar-content');
        if (navbarContent) {
            navbarContent.appendChild(mobileToggle);
        }
    }

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});


// Función para abrir WhatsApp directo
function openDirectWhatsapp() {
    window.open('https://api.whatsapp.com/send?phone=34933004024&text=Hola,%20quiero%20informacion%20sobre%20las%20alarmes%20INSA', '_blank');
}

// Función para enviar presupuesto formateada por WhatsApp
function sendWhatsappQuote() {
    if (!window.leadData) return;
    const text = encodeURIComponent(`Hola INSA, soy ${window.leadData.nome}. He completado el pre-registro (${window.leadData.telefone}, ${window.leadData.email}) y quiero finalizar mi presupuesto de alarmas.`);
    window.open(`https://api.whatsapp.com/send?phone=34933004024&text=${text}`, '_blank');
}


// ==========================================================================
// FUNÇÃO GLOBAL DE TRADUÇÃO (I18N) - UNIFICADA (SUPORTA CHAVES SIMPLES E ANINHADAS)
// ==========================================================================
async function applyLanguage(lang) {
    try {
        const isSubfolder = window.location.pathname.includes('/servicios/');
        const jsonPath = isSubfolder ? `../assets/locales/${lang}.json` : `assets/locales/${lang}.json`;

        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`No se pudo cargar el archivo de idioma: ${lang}`);

        const translations = await response.json();

        localStorage.setItem('preferred_lang', lang);
        document.documentElement.lang = lang;

        // Função auxiliar para buscar chaves aninhadas (ex: "services.sistemas-alarma.titulo")
        function getNestedTranslation(obj, path) {
            return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
        }

        // Recorremos y traducimos los elementos del DOM (suporta aninhado e simples)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');

            // 1. Tenta buscar como chave aninhada
            let translation = getNestedTranslation(translations, key);

            // 2. Se não achar, tenta buscar como chave simples (ex: ser_1_title da index)
            if (!translation && translations[key]) {
                translation = translations[key];
            }

            if (translation) {
                el.innerHTML = translation;
            } else {
                console.warn(`Clave no encontrada: ${key}`);
            }
        });
    } catch (error) {
        console.error("Error al aplicar el idioma:", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {

    // 1. CONTROL WIDGET WHATSAPP
    const waToggleBtn = document.getElementById('waToggleBtn');
    const waMenu = document.getElementById('waMenu');

    if (waToggleBtn && waMenu) {
        waToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            waMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!waMenu.contains(e.target) && !waToggleBtn.contains(e.target)) {
                waMenu.classList.remove('active');
            }
        });
    }

    // 2. BANNER DE COOKIES (RGPD)
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (localStorage.getItem('cookiesAccepted') === 'true') {
        if (cookieBanner) {
            cookieBanner.style.display = 'none';
        }
    }

    if (acceptCookiesBtn && cookieBanner) {
        acceptCookiesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // 3. ROLAGEM SUAVE (SMOOTH SCROLL)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            if (targetId !== '#' && targetId !== '') {
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();

                    if (waMenu) {
                        waMenu.classList.remove('active');
                    }

                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 4. ANIMACIÓN DE CONTADORES NUMÉRICOS
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.getElementById('stats-section');
    let animated = false;

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.innerText = target;
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.ceil(current);
                }
            }, stepTime);
        });
    };

    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    startCounters();
                    animated = true;
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }

    // 5. GESTÃO DO SELETOR DE IDIOMAS
    const langSelect = document.getElementById('langSelect');
    const savedLang = localStorage.getItem('preferred_lang') || 'es';

    if (langSelect) {
        langSelect.value = savedLang;

        langSelect.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            localStorage.setItem('preferred_lang', selectedLang);
            applyLanguage(selectedLang); // Aplica direto sem precisar recarregar a página inteira, se quiser
        });
    }

    if (typeof applyLanguage === 'function') {
        applyLanguage(savedLang);
    }




    // 6. MODAL Y DESBLOQUEO DEL SIMULADOR
    const preRegModal = document.getElementById('preRegModal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const preRegForm = document.getElementById('preRegForm');
    const openSimBtns = document.querySelectorAll('.btn-open-sim');

    window.openPreRegisterModal = function () {
        if (preRegModal) {
            preRegModal.style.display = 'flex';
        }
    };

    window.closePreRegisterModal = function () {
        if (preRegModal) {
            preRegModal.style.display = 'none';
        }
    };

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closePreRegisterModal);
    }

    openSimBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openPreRegisterModal();
        });
    });

    if (preRegForm) {
        preRegForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('regName');
            const emailInput = document.getElementById('regEmail');
            const phoneInput = document.getElementById('regPhone');

            const nameErr = document.getElementById('nameErr');
            const emailErr = document.getElementById('emailErr');
            const phoneErr = document.getElementById('phoneErr');

            let isValid = true;

            if (!nameInput || nameInput.value.trim().split(' ').length < 2) {
                if (nameErr) nameErr.style.display = 'block';
                isValid = false;
            } else {
                if (nameErr) nameErr.style.display = 'none';
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
                if (emailErr) emailErr.style.display = 'block';
                isValid = false;
            } else {
                if (emailErr) emailErr.style.display = 'none';
            }

            const phoneClean = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
            if (phoneClean.length < 8) {
                if (phoneErr) phoneErr.style.display = 'block';
                isValid = false;
            } else {
                if (phoneErr) phoneErr.style.display = 'none';
            }

            if (isValid) {
                window.leadData = {
                    nome: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    telefone: phoneInput.value.trim()
                };

                const simLockBox = document.getElementById('simLockBox');
                const simContent = document.getElementById('simContent');

                if (simLockBox) simLockBox.style.display = 'none';
                if (simContent) simContent.style.display = 'block';

                closePreRegisterModal();

                const simSection = document.getElementById('simulador');
                if (simSection) {
                    simSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // 7. EFECTO DINÁMICO DE SCROLL EN LA NAVBAR
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    function enviarPorEmail(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const area = document.getElementById('area').value;
        const fileInput = document.getElementById('cvFile');
        const mensaje = document.getElementById('mensaje').value;

        const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'Ningún archivo seleccionado';

        // E-mail de destino da INSA (substitua pelo e-mail oficial se necessário)
        const emailDestino = "info@alarmasinsa.com";
        const asunto = `Candidatura - ${area} - ${nombre}`;

        const cuerpo = `Hola Departamento de Selección,\n\n` +
            `Me gustaría postularme para la posición de: ${area}.\n\n` +
            `DATOS DEL CANDIDATO:\n` +
            `- Nombre: ${nombre}\n` +
            `- Teléfono: ${telefono}\n` +
            `- Email: ${email}\n` +
            `- Archivo de CV adjunto indicado: ${fileName}\n\n` +
            `PRESENTACIÓN:\n${mensaje}\n\n` +
            `*(Nota: Por favor, adjunte manualmente el archivo "${fileName}" en este correo antes de enviarlo).*`;

        const mailtoUrl = `mailto:${emailDestino}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

        // Alerta informativa para o usuário anexar o arquivo no seu aplicativo de e-mail que vai abrir
        alert(`Se abrirá tu cliente de correo electrónico para enviar la candidatura.\n\nPor favor, recuerda adjuntar tu archivo (${fileName}) en el mensaje antes de pulsar Enviar.`);

        // Abre o cliente de e-mail padrão (Outlook, Gmail, Apple Mail, etc.)
        window.location.href = mailtoUrl;
    }

});