document.addEventListener('DOMContentLoaded', () => {
    const valC = document.getElementById('gdp-c');
    const valI = document.getElementById('gdp-i');
    const valG = document.getElementById('gdp-g');
    const valX = document.getElementById('gdp-x');
    const valM = document.getElementById('gdp-m');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    
    const resultBox = document.getElementById('result-box');
    const resGdp = document.getElementById('res-gdp');
    const resNetExports = document.getElementById('res-net-exports');
    const resDomestic = document.getElementById('res-domestic');

    function showError(msg) {
        if(errorMsg) {
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            errorMsg.style.display = 'block';
        }
    }

    function calculateGDP() {
        if(errorMsg) errorMsg.style.display = 'none';
        
        const c = parseFloat(valC.value);
        const i = parseFloat(valI.value);
        const g = parseFloat(valG.value);
        const x = parseFloat(valX.value);
        const m = parseFloat(valM.value);
        
        if (isNaN(c) || isNaN(i) || isNaN(g) || isNaN(x) || isNaN(m)) {
            showError('Please enter numeric values for all fields.');
            return;
        }

        const netExports = x - m;
        const domestic = c + i + g;
        const gdp = domestic + netExports;

        resGdp.textContent = gdp.toLocaleString(undefined, {maximumFractionDigits: 2});
        resNetExports.textContent = netExports.toLocaleString(undefined, {maximumFractionDigits: 2});
        resDomestic.textContent = domestic.toLocaleString(undefined, {maximumFractionDigits: 2});

        resultBox.style.display = 'block';
    }

    calcBtn.addEventListener('click', calculateGDP);

    clearBtn.addEventListener('click', () => {
        valC.value = '';
        valI.value = '';
        valG.value = '';
        valX.value = '';
        valM.value = '';
        if(errorMsg) errorMsg.style.display = 'none';
        resultBox.style.display = 'none';
    });
});
