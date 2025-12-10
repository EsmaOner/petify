document.addEventListener('DOMContentLoaded', function() {

    // 1. Hamburger Menü
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('menu-open');
            const icon = hamburgerBtn.querySelector('i');
            
            if (mobileMenu.classList.contains('menu-open')) {
                document.body.style.overflow = 'hidden';
                if(icon) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                }
            } else {
                document.body.style.overflow = '';
                if(icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // 2. Alt Menü Okları (Chevron)
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation();

            const targetId = toggle.getAttribute('data-target');
            let targetMenu = null;
            if (targetId) {
                targetMenu = document.querySelector(targetId);
            }

            if (targetMenu) {
                targetMenu.classList.toggle('active');
                
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
            }
        });
    });
});