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
            const duration = 1500;
            const stepTime = 20;
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

    // 5. TRADUCCIONES TRILINGÜES (CA / ES / EN)
    const translations = {
        ca: {
            nav_start: "Inici",
            nav_solutions: "Solucions",
            nav_services: "Serveis",
            nav_simulator: "Simulador",
            nav_contact: "Contacte",
            btn_quote: "Sol·licitar Pressupost",
            btn_call: "Truca Ara",
            btn_call_hero: "Trucar a un Tècnic",
            hero_title: "Sistemes de Seguretat i Alarmes de <span>Última Generació</span>",
            hero_desc: "Protecció intel·ligent 24/7 per a la teva llar, negoci o gran empresa. Resposta immediata i tecnologia avançada anti-inhibició.",
            btn_free_study: "Estudi de Seguretat Gratuït",
            btn_view_solutions: "Veure Solucions",
            
            stat_1: "ANYS D'EXPERIÈNCIA",
            stat_2: "CLIENTS SATISFETS",
            stat_3: "INSTAL·LACIONS",
            stat_4: "HORES DE SUPORT",
            tag_process: "PROCES",
            title_process: "COM FUNCIONA",
            proc_1_title: "Consulta Gratuïta",
            proc_1_desc: "Contacta'ns per WhatsApp. Avaluem les teves necessitats sense cap cost.",
            proc_2_title: "Proposta Personalitzada",
            proc_2_desc: "Elaborem un pressupost amb l'equip exacte per a la teva propietat.",
            proc_3_title: "Instal·lació Professional",
            proc_3_desc: "El nostre equip instal·la i configura tot amb garantia inclosa.",
            proc_4_title: "Monitoratge Continu",
            proc_4_desc: "Rep alertes en temps real i accedeix a les teves càmeres des de qualsevol dispositiu.",

            tag_solutions: "SOLUCIONS",
            title_solutions: "Protecció a Mida per a Cada Immoble",
            sol_1_title: "Alarmes per a la Llar",
            sol_1_desc: "Sistemes anti-okupa, detecció d'intrusió instantània i verificació per vídeo des del teu smartphone.",
            sol_2_title: "Seguretat per a Negocis",
            sol_2_desc: "Protegeix el teu local comercial amb videovigilància HD, control d'accessos i connexió a Central Receptora.",
            sol_3_title: "Industria i Empreses",
            sol_3_desc: "Projectes d'enginyeria de seguretat a mida, analítica de vídeo amb IA i protecció contra incendis.",

            tag_services: "SERVEIS",
            title_services: "ELS NOSTRES SERVEIS DE SEGURETAT",
            ser_1_title: "Càmeres IP 4K POE",
            ser_1_desc: "Resolució Ultra HD, visió nocturna infraroja, accés remot des del teu smartphone. Resistents IP67.",
            ser_2_title: "CCTV Analògic",
            ser_2_desc: "Sistemes analògics fiables i rendibles per a llars i petites empreses. Gravació contínua.",
            ser_3_title: "Sistemes d'Alarma",
            ser_3_desc: "Sensors de moviment, contactes en portes i finestres, sirenes i comunicació amb central.",
            ser_4_title: "Monitoratge Remot 24/7",
            ser_4_desc: "Veu les teves càmeres en temps real des de qualsevol lloc. Alertes instantànies per WhatsApp.",

            title_sim: "Simulador  i Càlcul de pressupost",
            sim_locked_msg: "Per accedir al simulador i calcular la teva pressupost personalitzada, realitza un pre-registre ràpid.",
            btn_unlock_sim: "Desbloquejar Simulador",
            modal_title: "Pre-Registre per a la pressupost",
            lbl_name: "Nom i Cognoms *",
            lbl_email: "Correu Electrònic *",
            lbl_phone: "Telèfon de Contacte *",
            err_name: "Si us plau, indica el teu nom i cognom.",
            err_email: "Indica un correu electrònic vàlid.",
            err_phone: "Indica un telèfon vàlid (mínim 8 dígits).",
            btn_access_sim: "Accedir al Simulador"
        }, 
        es: {
            nav_start: "Inicio",
            nav_solutions: "Soluciones",
            nav_services: "Servicios",
            nav_simulator: "Simulador",
            nav_contact: "Contacto",
            btn_quote: "Solicitar Presupuesto",
            btn_call: "Llama Ahora",
            btn_call_hero: "Llamar a un Técnico",
            hero_title: "Sistemas de Seguridad y Alarmas de <span>Última Generación</span>",
            hero_desc: "Protección inteligente 24/7 para tu hogar, negocio o gran empresa. Respuesta inmediata y tecnología avanzada anti-inhibición.",
            btn_free_study: "Estudio de Seguridad Gratuito",
            btn_view_solutions: "Ver Soluciones",
            
            stat_1: "AÑOS DE EXPERIENCIA",
            stat_2: "CLIENTES SATISFECHOS",
            stat_3: "INSTALACIONES",
            stat_4: "HORAS DE SOPORTE",
            tag_process: "PROCESO",
            title_process: "CÓMO FUNCIONA",
            proc_1_title: "Consulta Gratuita",
            proc_1_desc: "Contáctenos por WhatsApp. Evaluamos sus necesidades sin ningún costo.",
            proc_2_title: "Propuesta Personalizada",
            proc_2_desc: "Elaboramos un presupuesto con el equipo exacto para su propiedad.",
            proc_3_title: "Instalación Profesional",
            proc_3_desc: "Nuestro equipo instala y configura todo con garantía incluida.",
            proc_4_title: "Monitoreo Continuo",
            proc_4_desc: "Reciba alertas en tiempo real y acceda a sus cámaras desde cualquier dispositivo.",

            tag_solutions: "SOLUCIONES",
            title_solutions: "Protección a Medida para Cada Inmueble",
            sol_1_title: "Alarmas para el Hogar",
            sol_1_desc: "Sistemas anti-okupa, detección de intrusión instantánea y verificación por vídeo desde tu smartphone.",
            sol_2_title: "Seguridad para Negocios",
            sol_2_desc: "Protege tu local comercial con videovigilancia HD, control de accesos y conexión a Central Receptora.",
            sol_3_title: "Industria y Empresas",
            sol_3_desc: "Proyectos de ingeniería de seguridad a medida, analítica de vídeo con IA y protección contra incendios.",

            tag_services: "SOLUCIONES",
            title_services: "NUESTROS SERVICIOS DE SEGURIDAD",
            ser_1_title: "Cámaras IP 4K POE",
            ser_1_desc: "Resolución Ultra HD, visión nocturna infrarroja, acceso remoto desde su smartphone. Resistentes IP67.",
            ser_2_title: "CCTV Analógico",
            ser_2_desc: "Sistemas analógicos confiables y rentables para hogares y pequeñas empresas. Grabación continua.",
            ser_3_title: "Sistemas de Alarma",
            ser_3_desc: "Sensores de movimiento, contactos en puertas y ventanas, sirenas y comunicación con central.",
            ser_4_title: "Monitoreo Remoto 24/7",
            ser_4_desc: "Vea sus cámaras en tiempo real desde cualquier lugar. Alertas instantáneas por WhatsApp.",

            title_sim: "Simulador y Cálculo de presupuesto",
            sim_locked_msg: "Para acceder al simulador y calcular tu presupuesto personalizada, realiza un pre-registro rápido.",
            btn_unlock_sim: "Desbloquear Simulador",
            modal_title: "Pre-Registro para Presupuesto",
            lbl_name: "Nombre y Apellidos *",
            lbl_email: "Correo Electrónico *",
            lbl_phone: "Teléfono de Contacto *",
            err_name: "Por favor, indica tu nombre y apellidos.",
            err_email: "Indica un correo electrónico válido.",
            err_phone: "Indica un teléfono válido (mínimo 8 dígitos).",
            btn_access_sim: "Acceder al Simulador"
        },
        en: {
            nav_start: "Home",
            nav_solutions: "Solutions",
            nav_services: "Services",
            nav_simulator: "Simulator",
            nav_contact: "Contact",
            btn_quote: "Request Quote",
            btn_call: "Call Now",
            btn_call_hero: "Call a Technician",
            hero_title: "Next Generation <span>Security Systems</span> and Alarms",
            hero_desc: "24/7 intelligent protection for your home, business, or enterprise. Immediate response and advanced anti-jamming technology.",
            btn_free_study: "Free Security Assessment",
            btn_view_solutions: "View Solutions",
            
            stat_1: "YEARS OF EXPERIENCE",
            stat_2: "SATISFIED CLIENTS",
            stat_3: "INSTALLATIONS",
            stat_4: "HOURS OF SUPPORT",
            tag_process: "PROCESS",
            title_process: "HOW IT WORKS",
            proc_1_title: "Free Consultation",
            proc_1_desc: "Contact us via WhatsApp. We evaluate your needs at no cost.",
            proc_2_title: "Custom Proposal",
            proc_2_desc: "We prepare a budget tailored for your property.",
            proc_3_title: "Professional Installation",
            proc_3_desc: "Our team installs and configures everything with warranty included.",
            proc_4_title: "Continuous Monitoring",
            proc_4_desc: "Get real-time alerts and access your cameras from any device.",

            tag_solutions: "SOLUTIONS",
            title_solutions: "Tailored Protection for Every Property",
            sol_1_title: "Home Alarms",
            sol_1_desc: "Anti-squatter systems, instant intrusion detection, and video verification from your smartphone.",
            sol_2_title: "Business Security",
            sol_2_desc: "Protect your commercial venue with HD video surveillance, access control, and Central Station connection.",
            sol_3_title: "Industrial & Corporate",
            sol_3_desc: "Custom security engineering projects, AI video analytics, and fire protection.",

            tag_services: "SERVICES",
            title_services: "OUR SECURITY SERVICES",
            ser_1_title: "4K POE IP Cameras",
            ser_1_desc: "Ultra HD resolution, infrared night vision, remote access from smartphone. IP67 weather resistant.",
            ser_2_title: "Analog CCTV",
            ser_2_desc: "Reliable and cost-effective analog systems for homes and small businesses. Continuous recording.",
            ser_3_title: "Alarm Systems",
            ser_3_desc: "Motion sensors, door/window contacts, sirens, and central communication.",
            ser_4_title: "24/7 Remote Monitoring",
            ser_4_desc: "Watch live feed from anywhere. Instant alerts via WhatsApp.",

            title_sim: "Simulator & Instant Quote",
            sim_locked_msg: "To access the simulator and get your custom quote, please complete a quick pre-registration.",
            btn_unlock_sim: "Unlock Simulator",
            modal_title: "Pre-Registration for Quote",
            lbl_name: "Full Name *",
            lbl_email: "Email Address *",
            lbl_phone: "Contact Phone *",
            err_name: "Please enter your full name.",
            err_email: "Please enter a valid email address.",
            err_phone: "Please enter a valid phone number (min. 8 digits).",
            btn_access_sim: "Access Simulator"
        }
    };

    const langSelect = document.getElementById('langSelect');

    function applyLanguage(lang) {
        if (!translations[lang]) return;
        localStorage.setItem('insa_lang', lang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
    }

    if (langSelect) {
        const savedLang = localStorage.getItem('insa_lang') || 'es';
        langSelect.value = savedLang;
        applyLanguage(savedLang);

        langSelect.addEventListener('change', (e) => {
            applyLanguage(e.target.value);
        });
    }

    // 6. MODAL Y DESBLOQUEO DEL SIMULADOR
    const preRegModal = document.getElementById('preRegModal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const preRegForm = document.getElementById('preRegForm');
    const openSimBtns = document.querySelectorAll('.btn-open-sim');

    window.openPreRegisterModal = function() {
        if (preRegModal) {
            preRegModal.style.display = 'flex';
        }
    };

    window.closePreRegisterModal = function() {
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

});