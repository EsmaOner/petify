document.addEventListener('DOMContentLoaded', function() {
    console.log("Petify Script Başlatıldı...");

    // ===============================================
    // 1. HAMBURGER MENÜ (Try-Catch ile Korundu)
    // ===============================================
    try {
        const navToggle = document.getElementById('navToggle');
        const nav = document.querySelector('nav');

        if (navToggle && nav) {
            navToggle.addEventListener('click', function(e) {
                e.stopPropagation(); // Tıklamanın başka yerleri etkilemesini engelle
                nav.classList.toggle('active');
                
                const icon = navToggle.querySelector('i');
                if (icon) {
                    if (nav.classList.contains('active')) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-xmark');
                    } else {
                        icon.classList.remove('fa-xmark');
                        icon.classList.add('fa-bars');
                    }
                }
            });

            // Menü dışına tıklanınca kapatma
            document.addEventListener('click', function(event) {
                if (!nav.contains(event.target) && !navToggle.contains(event.target) && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const icon = navToggle.querySelector('i');
                    if(icon) {
                        icon.classList.remove('fa-xmark');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        }
    } catch (error) {
        console.error("Menü hatası:", error);
    }

    // ===============================================
    // 2. VARYANT VE FİYAT DEĞİŞİMİ
    // ===============================================
    const variantButtons = document.querySelectorAll('.variant-btn');

    variantButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Sayfa zıplamasını engelle
            
            try {
                const card = this.closest('.product-card');
                if (!card) return;

                // Diğer aktif sınıfları temizle
                const siblings = card.querySelectorAll('.variant-btn');
                siblings.forEach(btn => btn.classList.remove('active'));

                // Tıklanana aktif ekle
                this.classList.add('active');

                // Fiyat verisini al
                const newPrice = this.getAttribute('data-price');
                
                // Ana fiyatı güncelle
                const priceDisplay = card.querySelector('.new-price');
                if (priceDisplay) priceDisplay.textContent = newPrice;

                // Varsa indirimli bar fiyatını da güncelle
                const priceBarDisplay = card.querySelector('.price-bar .new-price');
                if (priceBarDisplay) priceBarDisplay.textContent = newPrice;

            } catch (error) {
                console.error("Fiyat değişim hatası:", error);
            }
        });
    });

    // ===============================================
    // 3. MİKTAR (ADET) İŞLEMLERİ
    // ===============================================
    const quantityBtns = document.querySelectorAll('.quantity-btn');

    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            try {
                const action = this.getAttribute('data-action');
                const container = this.closest('.quantity-selector');
                const valueSpan = container.querySelector('.quantity-value');
                const decreaseBtn = container.querySelector('[data-action="decrease"]');
                
                let value = parseInt(valueSpan.textContent);

                if (action === 'increase') {
                    value++;
                } else if (action === 'decrease') {
                    if (value > 1) {
                        value--;
                    }
                }

                valueSpan.textContent = value;

                // Eksi butonunu aktif/pasif yapma
                if (value === 1) {
                    if(decreaseBtn) decreaseBtn.setAttribute('disabled', 'true');
                } else {
                    if(decreaseBtn) decreaseBtn.removeAttribute('disabled');
                }
            } catch (error) {
                console.error("Miktar değiştirme hatası:", error);
            }
        });
    });

    // ===============================================
    // 4. SEPETE EKLEME MANTIĞI (LOCALSTORAGE)
    // ===============================================
    const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            try {
                const card = this.closest('.product-card');
                
                // --- Veri Toplama (Hata korumalı) ---
                const nameEl = card.querySelector('.product-name');
                const imgEl = card.querySelector('.product-image');
                const priceEl = card.querySelector('.new-price');
                const qtyEl = card.querySelector('.quantity-value');

                if (!nameEl || !priceEl) {
                    console.error("Ürün bilgileri eksik!");
                    return;
                }

                const productName = nameEl.textContent.trim();
                const productImage = imgEl ? imgEl.src : 'img/default.png'; 
                const quantity = qtyEl ? parseInt(qtyEl.textContent) : 1;
                
                // Seçili varyantı bul
                let selectedVariant = card.querySelector('.variant-btn.active');
                let variantName = 'Standart';
                let price = priceEl.textContent;

                if (selectedVariant) {
                    const vNameEl = selectedVariant.querySelector('.variant-name');
                    variantName = vNameEl ? vNameEl.textContent : 'Seçenek';
                    // Fiyatı butondan al (daha güvenli)
                    price = selectedVariant.getAttribute('data-price') || price;
                }

                // Sepet Objesi
                const product = {
                    id: productName + '-' + variantName, // Unique ID
                    name: productName,
                    image: productImage,
                    variant: variantName,
                    price: price,
                    quantity: quantity
                };

                // Kaydet
                addToLocalStorage(product);

                // Buton Animasyonu
                const originalHTML = this.innerHTML;
                this.innerHTML = '<span class="btn-text">Eklendi</span><span class="btn-icon"><i class="fa-solid fa-check"></i></span>';
                this.classList.add('added');
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.classList.remove('added');
                }, 2000);

            } catch (error) {
                console.error("Sepete ekleme hatası:", error);
                alert("Ürün eklenirken bir hata oluştu.");
            }
        });
    });

    // Sayfa açılışında sepet sayısını güncelle
    updateCartCount();
});

// ===============================================
// YARDIMCI FONKSİYONLAR
// ===============================================

function addToLocalStorage(product) {
    try {
        let cart = JSON.parse(localStorage.getItem('petifySepet')) || [];
        
        const existingIndex = cart.findIndex(item => item.id === product.id);

        if (existingIndex > -1) {
            cart[existingIndex].quantity += product.quantity;
        } else {
            cart.push(product);
        }

        localStorage.setItem('petifySepet', JSON.stringify(cart));
        updateCartCount();
        console.log("Sepet güncellendi:", cart);
    } catch (e) {
        console.error("LocalStorage hatası:", e);
    }
}

function updateCartCount() {
    try {
        let cart = JSON.parse(localStorage.getItem('petifySepet')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Sepet ikonunu bul (href="sepet.html" olan a etiketi)
        const cartIconLink = document.querySelector('a[href="sepet.html"]');
        
        if (cartIconLink) {
            // Önce varsa eski badge'i bul
            let badge = cartIconLink.querySelector('.cart-badge');
            
            // Yoksa oluştur
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                
                // Stil tanımları (CSS dosyasında yoksa buradan ekler)
                badge.style.position = 'absolute';
                badge.style.top = '-5px';
                badge.style.right = '-10px';
                badge.style.backgroundColor = '#E63946';
                badge.style.color = 'white';
                badge.style.borderRadius = '50%';
                badge.style.padding = '2px 5px';
                badge.style.fontSize = '10px';
                badge.style.fontWeight = 'bold';
                badge.style.minWidth = '18px';
                badge.style.textAlign = 'center';
                
                cartIconLink.style.position = 'relative'; 
                cartIconLink.appendChild(badge);
            }
            
            if (totalItems > 0) {
                badge.style.display = 'block';
                badge.textContent = totalItems;
            } else {
                badge.style.display = 'none';
            }
        }
    } catch (e) {
        console.error("Sepet ikonu güncelleme hatası:", e);
    }
}
