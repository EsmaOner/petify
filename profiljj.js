// NIHAI PROFIL.JS - Komple Mobil Menü ve Mega Menü Kontrolü

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const body = document.body;
    const navItems = document.querySelectorAll('.nav-item');

    // 1. Hamburger Menü Aç/Kapa İşlevi
    navToggle.addEventListener('click', () => {
        body.classList.toggle('nav-open');
    });

    // 2. Mobil Mega Menü Aç/Kapa İşlevi (KRİTİK)
    navItems.forEach(item => {
        const navLink = item.querySelector('.nav-link');
        const megaMenu = item.querySelector('.mega-menu');

        // Mega menüsü olan öğeler için
        if (megaMenu) {
            // Mobile özel tıklama işleyicisi ekliyoruz
            navLink.addEventListener('click', (e) => {
                // Sadece mobil görünümde (örneğin 1024px altı) çalıştır
                if (window.innerWidth <= 1024) {
                    e.preventDefault(); // Sayfanın linke gitmesini engelle

                    // Tıklanan nav-item'a 'mega-open' sınıfını toggle et
                    item.classList.toggle('mega-open');
                }
            });

            // Masaüstü (Hover) Kuralını Temizle
            // Masaüstünde menü açılırsa, mobil açma sınıfını kaldır
            item.addEventListener('mouseover', () => {
                if (window.innerWidth > 1024) {
                    item.classList.remove('mega-open');
                }
            });
        }
    });
});
    // Yardımcı fonksiyon: Mobil görünümü kontrol eder (1024px ve altı)
    const isMobileView = () => window.innerWidth <= 1024;

    // ===========================================================
    // 1. HAMBURGER MENÜ KONTROLÜ
    // ===========================================================
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            body.classList.toggle('nav-open');
            
            if (!body.classList.contains('nav-open')) {
                document.documentElement.style.overflow = '';
                navItemsWithMegaMenu.forEach(item => item.classList.remove('mega-open'));
            }

            const icon = navToggle.querySelector('i');
            if (body.classList.contains('nav-open')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }

    // ===========================================================
    // 2. MOBİL MEGA MENÜ YÖNETİMİ
    // ===========================================================
    navItemsWithMegaMenu.forEach(item => {
        
        item.addEventListener('click', function(e) {
            
            // Masaüstü (Hover) ise dur
            if (!isMobileView()) return;
            
            const isClickInsideMegaMenuLink = e.target.closest('.mega-menu a');

            // Eğer tıklama, mega menü içindeki bir alt link değilse
            if (!isClickInsideMegaMenuLink) {
                
                e.preventDefault(); 
                e.stopPropagation(); 
                
                const isAlreadyOpen = item.classList.contains('mega-open');
                
                // Açık olan diğer tüm mega menüleri kapat
                navItemsWithMegaMenu.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('mega-open');
                    }
                });

                // Kendi menüsünü aç/kapa
                item.classList.toggle('mega-open');
            }
        }); 

        // --- Alt Linklere Tıklama (Menüyü Kapatma) ---
        const megaMenu = item.querySelector('.mega-menu');
        if (megaMenu) {
            megaMenu.querySelectorAll('a').forEach(subLink => {
                subLink.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Mobil menü açıksa tamamen kapat
                    if (isMobileView() && body.classList.contains('nav-open')) {
                        body.classList.remove('nav-open');
                        document.documentElement.style.overflow = '';
                        
                        const icon = navToggle.querySelector('i');
                        icon.classList.replace('fa-xmark', 'fa-bars');
                        
                        navItemsWithMegaMenu.forEach(item => item.classList.remove('mega-open'));
                    }
                });
            });
        } 
    });
    
    // ===========================================================
    // 3. MENÜSÜZ ANA LİNKLERE TIKLAMA (Menüyü Kapatma)
    // ===========================================================
    
    allNavItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const hasMegaMenu = item.querySelector('.mega-menu');

        // Mega menüsü olmayan linkler için (Ana Sayfa gibi)
        if (link && !hasMegaMenu) { 
            link.addEventListener('click', function() {
                if (isMobileView() && body.classList.contains('nav-open')) {
                    body.classList.remove('nav-open');
                    document.documentElement.style.overflow = '';
                    
                    const icon = navToggle.querySelector('i');
                    icon.classList.replace('fa-xmark', 'fa-bars');
                }
            });
        }
    });

    // ===========================================================
    // 4. EKRAN BOYUTU DEĞİŞTİĞİNDE TEMİZLİK
    // ===========================================================
    let isDesktop = !isMobileView();

    window.addEventListener('resize', () => {
        if (!isMobileView() && !isDesktop) {
            // Mobilden Masaüstüne geçiş yapıldı
            body.classList.remove('nav-open');
            document.documentElement.style.overflow = '';
            navToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
            navItemsWithMegaMenu.forEach(item => item.classList.remove('mega-open'));
            isDesktop = true;
        } else if (isMobileView() && isDesktop) {
            isDesktop = false;
        }
    });
