document.addEventListener('DOMContentLoaded', () => {
    const navbarContent = document.querySelector('.navbar-content');
    const navMenu = document.querySelector('.nav-menu');

    let mobileToggle = document.querySelector('.mobile-toggle');

    if (!mobileToggle && navbarContent) {
        mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-toggle';
        mobileToggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

        
        navbarContent.prepend(mobileToggle);
    }

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileToggle) mobileToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });
});



function openDirectWhatsapp() {
    window.open('https://api.whatsapp.com/send?phone=34933004024&text=Hola,%20quiero%20informacion%20sobre%20las%20alarmes%20INSA', '_blank');
}

// ==========================================================================
// FUNCIÓN GLOBAL DE TRADUCCIÓN (I18N) 
// ==========================================================================
async function applyLanguage(lang) {
    try {
        const isSubfolder = window.location.pathname.includes('/servicios/');
        const jsonPath = isSubfolder ? `../assets/locales/${lang}.json` : `assets/locales/${lang}.json`;

        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`No se pudo cargar el archivo de idioma: ${jsonPath}`);

        const translations = await response.json();

        localStorage.setItem('preferred_lang', lang);
        document.documentElement.lang = lang;


        function findTranslation(obj, path) {
            if (!obj || !path) return null;


            const parts = path.split('.');
            let curr = obj;
            let foundDirect = true;
            for (const part of parts) {
                if (curr && typeof curr === 'object' && part in curr) {
                    curr = curr[part];
                } else {
                    foundDirect = false;
                    break;
                }
            }
            if (foundDirect && (typeof curr === 'string' || typeof curr === 'number')) return curr;


            if (path in obj && typeof obj[path] === 'string') {
                return obj[path];
            }

            return null;
        }


        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = findTranslation(translations, key);

            if (translation) {
                if (translation.includes('<')) {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });


        const metaTitle = findTranslation(translations, 'meta.title');
        const metaDesc = findTranslation(translations, 'meta.description');
        const metaKeywords = findTranslation(translations, 'meta.keywords');

        if (metaTitle) document.title = metaTitle;
        if (metaDesc) {
            const descElement = document.querySelector('meta[name="description"]');
            if (descElement) descElement.setAttribute('content', metaDesc);
        }
        if (metaKeywords) {
            const keywordsElement = document.querySelector('meta[name="keywords"]');
            if (keywordsElement) keywordsElement.setAttribute('content', metaKeywords);
        }


        const langSelect = document.getElementById('langSelect');
        if (langSelect) langSelect.value = lang;


        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));

    } catch (error) {
        console.error("Error al aplicar el idioma:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const savedLang = localStorage.getItem('preferred_lang') || 'es';
    applyLanguage(savedLang);


    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', (e) => {
            applyLanguage(e.target.value);
        });
    }


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


    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (localStorage.getItem('cookiesAccepted') === 'true' && cookieBanner) {
        cookieBanner.style.display = 'none';
    }
    if (acceptCookiesBtn && cookieBanner) {
        acceptCookiesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }


    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId !== '#' && targetId !== '') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    if (waMenu) waMenu.classList.remove('active');
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

    // 7. Navbar Scroll
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
});

// ==========================================================================
// SIMULADOR de PRESUPUESTO - WIZARD
// ==========================================================================
let userAnswers = {
    tipo: '',
    subtipoNegocio: '',
    tamanio: '',
    codigoPostal: '',
    motivo: '',
    alarmaActual: '',
    telefono: ''
};

let isNegocio = false;

async function getWizardTranslation() {
    const lang = localStorage.getItem('preferred_lang') || 'es';
    const isSubfolder = window.location.pathname.includes('/servicios/');
    const jsonPath = isSubfolder ? `../assets/locales/${lang}.json` : `assets/locales/${lang}.json`;
    try {
        const res = await fetch(jsonPath);
        return await res.json();
    } catch (e) {
        return null;
    }
}

async function nextStep(currentStep, key, value) {
    if (key) userAnswers[key] = value;

    if (currentStep === 1) {
        const data = await getWizardTranslation();
        const w = data ? data.wizard : null;

        if (value === 'Negocio') {
            isNegocio = true;
            const qText = w ? w.q2Negocio : '¿Qué tipo de negocio tienes?';
            const optAut = w ? w.options.negAutonomo : 'Autónomo / Local pequeño';
            const optPym = w ? w.options.negPyme : 'Pyme / Oficina';
            const optCorp = w ? w.options.negCorporation : 'Gran Empresa / Nave';

            document.getElementById('question-step-2').innerText = qText;
            document.getElementById('options-step-2').innerHTML = `
                <button type="button" class="wizard-btn" onclick="nextStep(2, 'subtipoNegocio', '${optAut}')">${optAut}</button>
                <button type="button" class="wizard-btn" onclick="nextStep(2, 'subtipoNegocio', '${optPym}')">${optPym}</button>
                <button type="button" class="wizard-btn" onclick="nextStep(2, 'subtipoNegocio', '${optCorp}')">${optCorp}</button>
            `;
        } else {
            isNegocio = false;
            const qText = w ? w.q2Residencial : '¿Qué tamaño aproximado tiene el inmueble?';
            const optS = w ? w.options.sizeSmall : 'Pequeño – Menos de 100m2';
            const optM = w ? w.options.sizeMedium : 'Medio – entre 100-250m2';
            const optL = w ? w.options.sizeLarge : 'Grande – más de 250m2';

            document.getElementById('question-step-2').innerText = qText;
            document.getElementById('options-step-2').innerHTML = `
                <button type="button" class="wizard-btn" onclick="nextStep(2, 'tamanio', '${optS}')">${optS}</button>
                <button type="button" class="wizard-btn" onclick="nextStep(2, 'tamanio', '${optM}')">${optM}</button>
                <button type="button" class="wizard-btn" onclick="nextStep(2, 'tamanio', '${optL}')">${optL}</button>
            `;
        }
    }

    const currentEl = document.getElementById(`step-${currentStep}`);
    const nextEl = document.getElementById(`step-${currentStep + 1}`);

    if (currentEl && nextEl) {
        currentEl.style.display = 'none';
        nextEl.style.display = 'block';
        updateProgress(currentStep + 1);
    }
}

function prevStep(currentStep) {
    const currentEl = document.getElementById(`step-${currentStep}`);
    const prevEl = document.getElementById(`step-${currentStep - 1}`);

    if (currentEl && prevEl) {
        currentEl.style.display = 'none';
        prevEl.style.display = 'block';
        updateProgress(currentStep - 1);
    }
}

function submitPostal() {
    const postal = document.getElementById('postal-input').value.trim();
    if (!postal) {
        alert('Por favor, introduce tu código postal.');
        return;
    }
    userAnswers.codigoPostal = postal;
    nextStep(3, null, null);
}

async function updateProgress(step) {
    const percentages = { 1: 16.6, 2: 33.2, 3: 49.8, 4: 66.4, 5: 83.0, 6: 100 };
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = (percentages[step] || 16.6) + '%';

    const data = await getWizardTranslation();
    const w = data ? data.wizard : null;
    const stepTxt = w ? w.step : 'Paso';
    const ofTxt = w ? w.of : 'de';
    const finalTxt = w ? w.finalStep : 'Paso final';

    const label = step === 6 ? finalTxt : `${stepTxt} ${step} ${ofTxt} 6`;
    const indicator = document.getElementById('step-indicator');
    if (indicator) indicator.innerText = label;
}

function enviarPresupuesto() {
    const phone = document.getElementById('phone-input').value.trim();
    if (!phone) {
        alert('Por favor, introduce tu número de teléfono.');
        return;
    }
    userAnswers.telefono = phone;

    let detalleInmueble = isNegocio
        ? `- Tipo: Negocio (${userAnswers.subtipoNegocio})`
        : `- Tipo: ${userAnswers.tipo}\n- Tamaño: ${userAnswers.tamanio}`;

    const mensagem = `Hola Alarmas INSA, quiero solicitar un presupuesto personalizado:\n\n${detalleInmueble}\n- Código Postal: ${userAnswers.codigoPostal}\n- Motivo: ${userAnswers.motivo}\n- Alarma actual: ${userAnswers.alarmaActual}\n- Teléfono de contacto: ${userAnswers.telefono}`;

    const numeroWhatsapp = '34933004024';
    const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;

    window.open(urlWhatsapp, '_blank');
}