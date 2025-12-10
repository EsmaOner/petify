document.addEventListener('DOMContentLoaded', function() {

    /* ==========================================================
       1. HAMBURGER MENÜ VE MOBİL NAVİGASYON (Sepet.js'den alındı)
       ========================================================== */
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

    /* ==========================================================
       3. ÜRÜN KARTLARI İŞLEVLERİ (FİYAT VE SEPET)
       ========================================================== */

    // A. Varyant Seçimi ve Fiyat Güncelleme
    const variantBtns = document.querySelectorAll('.variant-tag');

    variantBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            const card = this.closest('.product-card');
            if (!card) return;

            // Diğer butonlardan active sınıfını kaldır
            const siblings = card.querySelectorAll('.variant-tag');
            siblings.forEach(s => s.classList.remove('active'));
            this.classList.add('active');

            // Fiyatı Güncelle
            const newPrice = this.getAttribute('data-price');
            const priceDisplay = card.querySelector('.new-price');
            
            if (priceDisplay && newPrice) {
                priceDisplay.textContent = newPrice;
            }
            
            // İndirim Oranı Güncelleme (Opsiyonel)
            const oldPriceEl = card.querySelector('.old-price');
            const badgeEl = card.querySelector('.discount-badge');
            
            if (oldPriceEl && badgeEl && newPrice) {
                let oldVal = parseFloat(oldPriceEl.textContent.replace('₺','').replace('.','').replace(',','.'));
                let newVal = parseFloat(newPrice.replace('₺','').replace('.','').replace(',','.'));
                
                if (oldVal > newVal) {
                    let discount = Math.round(((oldVal - newVal) / oldVal) * 100);
                    badgeEl.textContent = `%${discount} İndirim`;
                }
            }
        });
    });

    // B. Adet (Miktar) Artırma/Azaltma
    const quantitySelectors = document.querySelectorAll('.quantity-selector');

    quantitySelectors.forEach(selector => {
        const btns = selector.querySelectorAll('button');
        const input = selector.querySelector('input');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                let currentVal = parseInt(input.value);
                if (btn.innerText === '+') {
                    if (currentVal < 10) input.value = currentVal + 1;
                } else {
                    if (currentVal > 1) input.value = currentVal - 1;
                }
            });
        });
    });

    // C. Sepete Ekleme Animasyonu
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const originalHTML = this.innerHTML;
            
            this.classList.add('added');
            this.innerHTML = 'Eklendi <i class="fa-solid fa-check"></i>';
            this.style.backgroundColor = '#2ecc71';
            this.style.borderColor = '#2ecc71';
            
            setTimeout(() => {
                this.classList.remove('added');
                this.innerHTML = originalHTML;
                this.style.backgroundColor = '';
                this.style.borderColor = '';
            }, 1500);
        });
    });

});
