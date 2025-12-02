// Güncellenmiş anasayfa.js

document.addEventListener('DOMContentLoaded', function() {

    /* ===========================================================
     * RESPONSIVE KODLAR
     =========================================================== */

    // 1. MOBİL MENÜ İŞLEVİ (Hamburger Açma/Kapama)
   const navToggle = document.getElementById('navToggle');
    const body = document.body;
    const navItems = document.querySelectorAll('.nav-item');
    
    const isMobileView = () => window.innerWidth <= 1024;

    // 1. MOBİL MENÜ İŞLEVİ (Hamburger Açma/Kapama)
   if (navToggle) {
    navToggle.addEventListener('click', function() {
        body.classList.toggle('nav-open');
        
        // KRİTİK KONTROL: body kaydırmasını engelle/geri aç
        if (body.classList.contains('nav-open')) {
            document.documentElement.style.overflow = 'hidden'; 
        } else {
            document.documentElement.style.overflow = ''; 
        }

            // İkonu değiştir (fa-bars <-> fa-xmark)
            const icon = navToggle.querySelector('i');
            if (body.classList.contains('nav-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
                // Menü kapandığında tüm açık mega menüleri de kapat
                navItems.forEach(item => item.classList.remove('mega-open'));
            }
        });
    }

    // 2. MOBİL MEGA MENÜ YÖNETİMİ (Tıklama ile Aç/Kapa ve Hover Engeli)
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const megaMenu = item.querySelector('.mega-menu');
        
        if (megaMenu) {
            
            // Tıklama Olayı (Mega Menü Açma/Kapama)
            link.addEventListener('click', function(e) {
                if (isMobileView()) {
                    
                    // Ana linkin varsayılan aksiyonunu engelle
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

            // Alt Linklere Tıklama Olayı (Menüyü Kapatma)
            megaMenu.querySelectorAll('a').forEach(subLink => {
                subLink.addEventListener('click', function(e) {
                    // Tıklama olayının nav-item'a yayılmasını durdur
                    e.stopPropagation(); 
                    
                    // Mobil menüyü kapat
                    if (isMobileView() && body.classList.contains('nav-open')) {
                        body.classList.remove('nav-open');
                        navToggle.querySelector('i').classList.remove('fa-xmark');
                        navToggle.querySelector('i').classList.add('fa-bars');
                        navItems.forEach(item => item.classList.remove('mega-open'));
                    }
                });
            });
            
            // HOVER özelliğini mobil görünümde iptal et
            item.addEventListener('mouseenter', function() {
                if (isMobileView()) {
                    return;
                }
            });
            item.addEventListener('mouseleave', function() {
                 if (isMobileView()) {
                    return;
                }
            });

        } 
        // Mega menüsü olmayan ana linke tıklayınca mobil menüyü kapatma
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
    
    // 3. ÜRÜN VARYANTLARINI YÖNETME İŞLEVİ
   const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const variantButtons = card.querySelectorAll('.variant-btn');
        const newPriceSpan = card.querySelector('.product-price .new-price');
        const oldPriceSpan = card.querySelector('.product-price .old-price');
        const discountTextSpan = card.querySelector('.discount-text');
        
        // Fiyat formatlama fonksiyonu (Türk Lirası formatı)
        function formatPrice(priceValue) {
            if (typeof priceValue === 'string') {
                // Virgülden sonraki kısmı ondalık olarak kabul et
                priceValue = priceValue.replace('₺', '').replace(/\./g, '').replace(',', '.').trim();
            }
            priceValue = parseFloat(priceValue);

            if (isNaN(priceValue)) {
                return '₺0,00';
            }
            
            // Sayıyı Türk Lirası formatında biçimlendir
            return new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
                minimumFractionDigits: 2,
            }).format(priceValue);
        }

        variantButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Önceki aktif düğmeyi kaldır
                variantButtons.forEach(btn => btn.classList.remove('active'));
                // Yeni aktif düğmeyi ayarla
                button.classList.add('active');

                // Yeni fiyatı veri özniteliğinden (data-price) al
                const newPriceAttr = button.getAttribute('data-price');
                
                // Eğer newPriceAttr içinde "₺" varsa bu bir fiyattır
                if (newPriceAttr && newPriceAttr.includes('₺')) {
                    // Fiyatı temizleyip sayısal değere dönüştür
                    // Bu düzeltme, binlik ayraç noktaları kaldırır ve ondalık ayraç virgülü noktaya çevirir.
                    const cleanNewPrice = newPriceAttr.replace('₺', '').replace(/\./g, '').replace(',', '.').trim();
                    const newPriceValue = parseFloat(cleanNewPrice);
                    
                    if (!isNaN(newPriceValue) && newPriceSpan) {
                        // Yeni fiyatı formatlayıp ana span'a yaz
                        newPriceSpan.textContent = formatPrice(newPriceValue);
                        
                        // İndirimli kart ise indirim oranını güncelle
                        if (card.classList.contains('discount-card') && oldPriceSpan && discountTextSpan) {
                            const oldPriceText = oldPriceSpan.textContent;
                            // Eski fiyatı da temizleyip sayıya çevir
                            const cleanOldPrice = oldPriceText.replace('₺', '').replace(/\./g, '').replace(',', '.').trim();
                            const oldPriceValue = parseFloat(cleanOldPrice);
                            
                            if (oldPriceValue > newPriceValue) {
                                const discount = ((oldPriceValue - newPriceValue) / oldPriceValue) * 100;
                                discountTextSpan.textContent = `%${Math.round(discount)} İndirim`;
                            } 
                        }
                    }
                } 
                // Fiyat içermeyen varyantlar (örneğin sadece boyut yazıyorsa) için hiçbir şey yapılmaz, 
                // fiyat olduğu gibi kalır.
            });
        });
    });

    /* ===========================================================
     * MEVCUT KODLARINIZ (Miktar, Sepet, Kart İşlemleri)
     * Bu kısım olduğu gibi bırakıldı.
     =========================================================== */

    // 4. MİKTAR (ADET) BUTONLARI (+ / -)
    const quantitySelectors = document.querySelectorAll('.quantity-selector');

    quantitySelectors.forEach(selector => {
        const buttons = selector.querySelectorAll('button');
        const minusBtn = buttons[0]; 
        const plusBtn = buttons[1];
        const valueElement = selector.querySelector('input') || selector.querySelector('.quantity-value') || selector.querySelector('span');

        if (valueElement && minusBtn && plusBtn) {

            // Sayı değerini okuma ve yazma fonksiyonları
            const getValue = () => valueElement.tagName === 'INPUT' ? parseInt(valueElement.value) : parseInt(valueElement.innerText);
            const setValue = (val) => {
                if (valueElement.tagName === 'INPUT') valueElement.value = val;
                else valueElement.innerText = val;
            };

            const updateButtons = (currentVal) => {
                // Eksi butonu kontrolü
                if (currentVal <= 1) {
                    minusBtn.setAttribute('disabled', 'disabled');
                    minusBtn.style.opacity = "0.5";
                    minusBtn.style.cursor = "not-allowed";
                } else {
                    minusBtn.removeAttribute('disabled');
                    minusBtn.style.opacity = "1";
                    minusBtn.style.cursor = "pointer";
                }
                
                // Artı butonu kontrolü
                if (currentVal >= 5) {
                    plusBtn.setAttribute('disabled', 'disabled');
                    plusBtn.style.opacity = "0.5";
                    plusBtn.style.cursor = "not-allowed";
                } else {
                    plusBtn.removeAttribute('disabled');
                    plusBtn.style.opacity = "1";
                    plusBtn.style.cursor = "pointer";
                }
            };
            
            // Başlangıçta buton durumunu ayarla
            updateButtons(getValue());

            // --- ARTIRMA İŞLEMİ (+) ---
            plusBtn.addEventListener('click', function(e) {
                e.preventDefault(); 
                let currentVal = getValue();
                
                if (currentVal < 5) {
                    let newVal = currentVal + 1;
                    setValue(newVal);
                    updateButtons(newVal);
                } else {
                    alert("Bir üründen en fazla 5 adet sipariş edebilirsiniz.");
                }
            });

            // --- AZALTMA İŞLEMİ (-) ---
            minusBtn.addEventListener('click', function(e) {
                e.preventDefault();

                let currentVal = getValue();
                
                if (currentVal > 1) {
                    let newVal = currentVal - 1;
                    setValue(newVal);
                    updateButtons(newVal);
                }
            });
        }
    });

    // 5. SEPETE EKLE BUTONU (İkon ve Renk Değişimi)
    const addButtons = document.querySelectorAll('.btn-add-to-cart, .add-to-cart');

    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); 
            if (this.classList.contains('added')) return;

            this.classList.add('added');
            // HTML'deki span'leri hedefle
            const textSpan = this.querySelector('.btn-text');
            const iconSpan = this.querySelector('.btn-icon');
            
            if (textSpan) textSpan.textContent = 'Eklendi';
            if (iconSpan) iconSpan.innerHTML = '<i class="fa-solid fa-check-double"></i>';

            setTimeout(() => {
                this.classList.remove('added');
                if (textSpan) textSpan.textContent = 'Sepete Ekle';
                if (iconSpan) iconSpan.innerHTML = '<i class="fa-solid fa-basket-shopping"></i>';
            }, 2000);
        });
    });

    // 6. KREDİ KARTI İŞLEMLERİ (Bu kısım anasayfa.html'de görünmediği için sadece var olduğu varsayılarak bırakıldı)
    const nameInput = document.getElementById('input-name');
    
    if (nameInput) {
        const numberInput = document.getElementById('input-number');
        const dateInput = document.getElementById('input-date');
        const nameCard = document.getElementById('card-name-text');
        const numberCard = document.getElementById('card-number-text');
        const dateCard = document.getElementById('card-date-text');

        // A. İsim
        nameInput.addEventListener('input', (e) => {
            let val = e.target.value;
            val = val.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, ''); 
            e.target.value = val;

            if(val === '') {
                if(nameCard) nameCard.innerText = 'AD SOYAD';
            } else {
                if(nameCard) nameCard.innerText = val.toUpperCase();
            }
        });

        // B. Kart Numarası
        if (numberInput) {
            numberInput.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '');
                let formatted = '';
                
                for(let i = 0; i < val.length; i++) {
                    if(i > 0 && i % 4 === 0) formatted += ' ';
                    formatted += val[i];
                }
                e.target.value = formatted;

                if(val === '') {
                    if(numberCard) numberCard.innerText = '**** **** **** ****';
                } else {
                    if(numberCard) numberCard.innerText = formatted;
                }
            });
        }

        // C. Tarih
        if (dateInput) {
            dateInput.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '');
                if(val.length > 2) {
                    val = val.substring(0, 2) + '/' + val.substring(2, 4);
                }
                e.target.value = val;

                if(val === '') {
                    if(dateCard) dateCard.innerText = 'AA/YY';
                } else {
                    if(dateCard) dateCard.innerText = val;
                }
            });
        }
    }
});