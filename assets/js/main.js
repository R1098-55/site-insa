document.addEventListener('DOMContentLoaded', () => {




    // ==========================================
    // 1. CONTROLE DO WIDGET DO WHATSAPP (MOBILE & PC)
    // ==========================================
    const waToggleBtn = document.getElementById('waToggleBtn');
    const waMenu = document.getElementById('waMenu');

    if (waToggleBtn && waMenu) {

        // Alterna a exibição do menu ao clicar no botão
        waToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            waMenu.classList.toggle('active');
        });

        // Fecha o menu do WhatsApp ao clicar em qualquer lugar fora dele
        document.addEventListener('click', (e) => {
            if (!waMenu.contains(e.target) && !waToggleBtn.contains(e.target)) {
                waMenu.classList.remove('active');
            }
        });
    }


    // ==========================================
    // 2. CONTROLE DO BANNER DE COOKIES (RGPD)
    // ==========================================
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    // Verifica no navegador se o usuário já aceitou os cookies anteriormente
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        if (cookieBanner) {
            cookieBanner.style.display = 'none';
        }
    }

    // Grava a preferência e esconde o banner ao clicar no botão
    if (acceptCookiesBtn && cookieBanner) {
        acceptCookiesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }



    // ==========================================
    // 3. ROLAGEM SUAVE (SMOOTH SCROLL PARA SINGLE PAGE)
    // ==========================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            if (targetId !== '#' && targetId !== '') {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();

                    // Fecha o menu do WhatsApp se estiver aberto durante a rolagem
                    if (waMenu) {
                        waMenu.classList.remove('active');
                    }

                    // Calcula a altura da navbar fixa para não cobrir o título da seção
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










    // ==========================================
    // 4. FEEDBACK DO FORMULÁRIO DE CONTATO
    // ==========================================
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            const btnSubmit = contactForm.querySelector('button[type="submit"]');
            if (btnSubmit) {
                btnSubmit.textContent = 'Enviando...';
                btnSubmit.disabled = true;
            }
        });
    }

});