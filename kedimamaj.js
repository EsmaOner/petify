// NIHAI GUNCELLEME: kedimama.js

document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================================================
    // 1. RESPONSIVE MENÜ İŞLEVİ (Hamburger ve Mega Menü)
    // ===========================================================
    
    const navToggle = document.getElementById('navToggle');
    const body = document.body;
    const navItems = document.querySelectorAll('.nav-item');
    
    // Mobil görünümü kontrol eden fonksiyon
    const isMobileView = () => window.innerWidth <= 1024;


    // --- Hamburger Menü Kontrolü ---
    if (navToggle) {
    navToggle.addEventListener('click', function() {
        body.classList.toggle('nav-open'); // body.nav-open sınıfını ekler/kaldırır
        
        const icon = navToggle.querySelector('i');
        if (body.classList.contains('nav-open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
            // Menü açıldığında, sayfanın kaydırmasını engelle (CSS'teki kuralı tetikler)
            document.documentElement.style.overflow = 'hidden'; 

        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
            navItems.forEach(item => item.classList.remove('mega-open'));
            // Menü kapandığında, sayfa kaydırmasını geri aç
            document.documentElement.style.overflow = ''; 
        }
    });
}

    // --- Mobil Mega Menü Yönetimi (Tıklama ile Aç/Kapa ve Hover Engeli) ---
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const megaMenu = item.querySelector('.mega-menu');
        
        if (megaMenu) {
            
            // 1. Tıklama Olayı (Mobil Menü Açma/Kapama)
            link.addEventListener('click', function(e) {
                if (isMobileView()) {
                    e.preventDefault(); 
                    
                    const isAlreadyOpen = item.classList.contains('mega-open');
                    
                    // Açık olan diğer tüm mega menüleri kapat
                    navItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('mega-open');
                        }
                    });

                    // Eğer kapalıysa aç, açıksa kapat
                    if (!isAlreadyOpen) {
                        item.classList.add('mega-open');
                    } else {
                        item.classList.remove('mega-open');
                    }
                }
            });

            // 2. Alt Linklere Tıklama Olayı (Sayfa geçişinde ana menüyü kapatma)
            megaMenu.querySelectorAll('a').forEach(subLink => {
                subLink.addEventListener('click', function(e) {
                    e.stopPropagation(); 
                    
                    // Eğer link geçerli bir sayfaya gidiyorsa (veya hash içeriyorsa) ana menüyü kapat
                    if (isMobileView() && body.classList.contains('nav-open')) {
                        body.classList.remove('nav-open');
                        navToggle.querySelector('i').classList.remove('fa-xmark');
                        navToggle.querySelector('i').classList.add('fa-bars');
                    }
                });
            });
            
            // 3. Masaüstü/Hover Engeli: Mobil görünümde mouseenter'ı yoksay
            item.addEventListener('mouseenter', function() {
                if (isMobileView()) {
                    return;
                }
            });
        } 
        
        // Mega menüsü olmayan linklere tıklanınca mobil menüyü kapat
        else {
            link.addEventListener('click', function() {
                if (isMobileView() && body.classList.contains('nav-open')) {
                    body.classList.remove('nav-open');
                    navToggle.querySelector('i').classList.remove('fa-xmark');
                    navToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        }
    });

    // --- Alt Menü (Sub Nav) Sayfa İçi Kaydırma (Bu kısım sorunsuzdur) ---
    const subNavLinks = document.querySelectorAll('.sub-nav a');
    subNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // CSS'teki scroll-margin-top kuralı ofseti yönetecek.
                targetElement.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // ===========================================================
    // 2. ÜRÜN VARYANT FİYAT GÜNCELLEME İŞLEVİ
    // ===========================================================
    
    // (Fiyat ve Sepet İşlevleri bu kısımda devam eder...)
    
    const productCards = document.querySelectorAll('.product-card');

    function formatPrice(priceValue) {
        if (typeof priceValue === 'string') {
            priceValue = priceValue.replace('₺', '').replace(/\./g, '').replace(',', '.').trim();
        }
        priceValue = parseFloat(priceValue);

        if (isNaN(priceValue)) {
            return '₺0,00';
        }
        
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2,
        }).format(priceValue);
    }
    
    productCards.forEach(card => {
        const variantButtons = card.querySelectorAll('.variant-tag');
        const newPriceSpan = card.querySelector('.price-stack .new-price');
        const oldPriceSpan = card.querySelector('.price-stack .old-price');
        const discountTextSpan = card.querySelector('.discount-badge');

        variantButtons.forEach(button => {
            button.addEventListener('click', () => {
                variantButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const newPriceAttr = button.getAttribute('data-price');
                
                if (newPriceAttr && newPriceAttr.includes('₺') && newPriceSpan) {
                    
                    const cleanNewPrice = newPriceAttr.replace('₺', '').replace(/\./g, '').replace(',', '.').trim();
                    const newPriceValue = parseFloat(cleanNewPrice);
                    
                    if (!isNaN(newPriceValue)) {
                        newPriceSpan.textContent = formatPrice(newPriceValue);
                        
                        if (oldPriceSpan && discountTextSpan) {
                            const oldPriceText = oldPriceSpan.textContent;
                            const cleanOldPrice = oldPriceText.replace('₺', '').replace(/\./g, '').replace(',', '.').trim();
                            const oldPriceValue = parseFloat(cleanOldPrice);
                            
                            if (!isNaN(oldPriceValue) && oldPriceValue > newPriceValue) {
                                const discount = ((oldPriceValue - newPriceValue) / oldPriceValue) * 100;
                                discountTextSpan.textContent = `%${Math.round(discount)} İndirim`;
                            } 
                        }
                    }
                } 
            });
        });
    });

    // ===========================================================
    // 3. MİKTAR ve SEPETE EKLE İŞLEVLERİ
    // ===========================================================

    // --- Sepete Ekle Butonu Animasyonu ---
    const allButtons = document.querySelectorAll('.add-to-cart');
    allButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('added')) { return; }

            this.classList.add('added');
            
            const originalHTML = this.innerHTML; 
            this.innerHTML = `Eklendi <i class="fa-solid fa-check-double"></i>`;

            setTimeout(() => {
                this.classList.remove('added');
                this.innerHTML = originalHTML; 
            }, 2000);
        });
    });

    // --- Miktar Sınırlaması (Min 1, Max 5) ---
    const allQuantitySelectors = document.querySelectorAll('.quantity-selector');
    allQuantitySelectors.forEach(selector => {
        const minusBtn = selector.querySelector('button:first-child');
        const plusBtn = selector.querySelector('button:last-child');
        const quantityInput = selector.querySelector('input');

        const updateButtons = (currentValue) => {
            minusBtn.disabled = (currentValue <= 1);
            plusBtn.disabled = (currentValue >= 5);
        };
        
        let initialValue = parseInt(quantityInput.value);
        if (isNaN(initialValue) || initialValue < 1) {
            initialValue = 1;
            quantityInput.value = 1;
        }
        updateButtons(initialValue);


        plusBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue < 5) { 
                currentValue++;
                quantityInput.value = currentValue;
            }
            updateButtons(currentValue);
        });

        minusBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) { 
                currentValue--;
                quantityInput.value = currentValue;
            }
            updateButtons(currentValue);
        });
    });
});