/* =========================================================
   1. GÜVENLİ ÖDEME FORMU KODLARI (Sadece form varsa çalışır)
   ========================================================= */
const nameInput = document.getElementById('input-name');
const numberInput = document.getElementById('input-number');
const dateInput = document.getElementById('input-date');

const nameCard = document.getElementById('card-name-text');
const numberCard = document.getElementById('card-number-text');
const dateCard = document.getElementById('card-date-text');

if (nameInput) {
    nameInput.addEventListener('input', (e) => {
        let val = e.target.value;
        val = val.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, ''); 
        e.target.value = val;
        if(nameCard) nameCard.innerText = val === '' ? 'AD SOYAD' : val.toUpperCase();
    });
}

if (numberInput) {
    numberInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        let formatted = '';
        for(let i = 0; i < val.length; i++) {
            if(i > 0 && i % 4 === 0) formatted += ' ';
            formatted += val[i];
        }
        e.target.value = formatted;
        if(numberCard) numberCard.innerText = val === '' ? '**** **** **** ****' : formatted;
    });
}

if (dateInput) {
    dateInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if(val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
        e.target.value = val;
        if(dateCard) dateCard.innerText = val === '' ? 'AA/YY' : val;
    });
}

/* =========================================================
   2. MENÜ İŞLEVLERİ (Her sayfada çalışır)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Hamburger Menü
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('menu-open');
            
            // İkon değiştirme
            const icon = hamburgerBtn.querySelector('i');
            if (mobileMenu.classList.contains('menu-open')) {
                if(icon) icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                if(icon) icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }

    // 2. Alt Menü Okları (Chevron) - Daha Sağlam Yöntem
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation();

            // Önce data-target ile bulmaya çalış
            const targetId = toggle.getAttribute('data-target');
            let targetMenu = null;
            
            if (targetId) {
                targetMenu = document.querySelector(targetId);
            }

            // ID ile bulunamazsa, bulunduğu kutunun içine bak (Yedek Plan)
            if (!targetMenu) {
                const parent = toggle.closest('.nav-item');
                if (parent) {
                    targetMenu = parent.querySelector('.mega-menu');
                }
            }
            
            if (targetMenu) {
                // Menüyü aç/kapat
                targetMenu.classList.toggle('active');
                
                // Oku döndür
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
            } else {
                console.log("Menü bulunamadı!");
            }
        });
    });
});
