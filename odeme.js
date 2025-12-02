const nameInput = document.getElementById('input-name');
const numberInput = document.getElementById('input-number');
const dateInput = document.getElementById('input-date');

const nameCard = document.getElementById('card-name-text');
const numberCard = document.getElementById('card-number-text');
const dateCard = document.getElementById('card-date-text');

// 1. İsim Değişince
nameInput.addEventListener('input', (e) => {
    let val = e.target.value;
    val = val.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, ''); 
    e.target.value = val;

    if(val === '') {
        nameCard.innerText = 'AD SOYAD';
    } else {
        nameCard.innerText = val.toUpperCase();
    }
});

// 2. Kart Numarası Değişince
numberInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = '';
    
    for(let i = 0; i < val.length; i++) {
        if(i > 0 && i % 4 === 0) {
            formatted += ' ';
        }
        formatted += val[i];
    }
    
    e.target.value = formatted;

    if(val === '') {
        numberCard.innerText = '**** **** **** ****';
    } else {
        numberCard.innerText = formatted;
    }
});

// 3. Tarih Değişince
dateInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    
    if(val.length > 2) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    
    e.target.value = val;

    if(val === '') {
        dateCard.innerText = 'AA/YY';
    } else {
        dateCard.innerText = val;
    }
});