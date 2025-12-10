document.addEventListener('DOMContentLoaded', function() {

    // 1. Hamburger Menü ve Ana Menü Kapsayıcıları
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    // -- HAMBURGER (Ana Menü Açma/Kapama) --
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            // CSS'teki menü açma sınıfını tetikler
            mobileMenu.classList.toggle('menu-open');
            
            const icon = hamburgerBtn.querySelector('i');
            
            // Body scroll ve ikon değiştirme
            if (mobileMenu.classList.contains('menu-open')) {
                document.body.style.overflow = 'hidden'; // Arka planı kilitle
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

    // 2. Alt Menü Okları (Chevron - Mega Menü Açma/Kapama)
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault(); // Sayfa linkini engeller
            e.stopPropagation();

            // Hedef menüyü bul
            const targetId = toggle.getAttribute('data-target');
            let targetMenu = null;
            if (targetId) {
                targetMenu = document.querySelector(targetId);
            }

            if (targetMenu) {
                // Menüye 'active' sınıfını ekle (CSS'te görünür yapar)
                targetMenu.classList.toggle('active');
                
                // Oku döndürmek için
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
            }
        });
    });

    /* NOT: Bu sayfada ürüne özel bir işlev (sepet/kart) olmadığı için 
       JS kodu sadece menü işlevleriyle sınırlı tutulmuştur. */
});