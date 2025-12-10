document.addEventListener('DOMContentLoaded', function() {

    // 1. Hamburger Menü ve Chevron Toggle Logic
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    // -- HAMBURGER (Ana Menü Açma) --
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('menu-open');
            const icon = hamburgerBtn.querySelector('i');
            
            if (mobileMenu.classList.contains('menu-open')) {
                document.body.style.overflow = 'hidden'; // Scroll kilitleme
                if(icon) {
                    icon.classList.replace('fa-bars', 'fa-xmark');
                }
            } else {
                document.body.style.overflow = '';
                if(icon) {
                    icon.classList.replace('fa-xmark', 'fa-bars');
                }
            }
        });
    }

    // -- CHEVRON (Alt Menü Açma) --
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation();

            const targetId = toggle.getAttribute('data-target');
            // Elementin varlığını kontrol ederek kodun çökmesini engelle
            const targetMenu = targetId ? document.querySelector(targetId) : null; 
            
            if (targetMenu) {
                targetMenu.classList.toggle('active');
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
            }
        });
    });

    /* 2. BİLDİRİM SAYFASI İŞLEVLERİ */
    const notificationItems = document.querySelectorAll('.notification-item');
    const updateButton = document.querySelector('.update-button');
    
    // Bildirimleri "okundu" olarak işaretleme (Örnek İşlev)
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.remove('new');
            this.style.backgroundColor = '#fff';
        });
    });

    // Güncelle Butonu İşlevi
    if (updateButton) {
        updateButton.addEventListener('click', function() {
            alert('Bildirimler güncelleniyor.');
        });
    }
});