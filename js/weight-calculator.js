document.addEventListener('DOMContentLoaded', () => {
    const materialSelect = document.getElementById('material');
    const volumeInput = document.getElementById('volume');
    const volumeUnit = document.getElementById('volume-unit');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultKg = document.getElementById('result-kg');
    const resultLbs = document.getElementById('result-lbs');
    const errorMsg = document.getElementById('error-msg');

    calcBtn.addEventListener('click', () => {
        const densityKgm3 = parseFloat(materialSelect.value); // density in kg/m3
        let volume = parseFloat(volumeInput.value);

        if (isNaN(volume) || volume <= 0) {
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        // Convert Volume to m3
        let volumeM3 = volume;
        if (volumeUnit.value === 'cm3') {
            volumeM3 = volume / 1000000;
        } else if (volumeUnit.value === 'liters') {
            volumeM3 = volume / 1000;
        } else if (volumeUnit.value === 'ft3') {
            volumeM3 = volume * 0.0283168;
        }

        const massKg = densityKgm3 * volumeM3;
        const massLbs = massKg * 2.20462;

        resultKg.textContent = `${massKg.toLocaleString(undefined, {maximumFractionDigits: 2})} kg`;
        resultLbs.textContent = `${massLbs.toLocaleString(undefined, {maximumFractionDigits: 2})} lbs`;
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        materialSelect.value = '7850';
        volumeInput.value = '';
        volumeUnit.value = 'm3';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
