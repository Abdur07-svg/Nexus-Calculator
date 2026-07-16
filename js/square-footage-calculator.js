document.addEventListener('DOMContentLoaded', () => {
    const lengthInput = document.getElementById('sq-length');
    const widthInput = document.getElementById('sq-width');
    const unitSelect = document.getElementById('sq-unit');
    const priceInput = document.getElementById('sq-price');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    
    const resultBox = document.getElementById('result-box');
    const resArea = document.getElementById('res-area');
    const resSqft = document.getElementById('res-sqft');
    const resSqm = document.getElementById('res-sqm');
    const costBox = document.getElementById('cost-box');
    const resCost = document.getElementById('res-cost');

    function showError(msg) {
        if(errorMsg) {
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            errorMsg.style.display = 'block';
        }
    }

    function calculateArea() {
        if(errorMsg) errorMsg.style.display = 'none';
        
        const l = parseFloat(lengthInput.value);
        const w = parseFloat(widthInput.value);
        const p = parseFloat(priceInput.value);
        const unit = unitSelect.value;
        
        if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) {
            showError('Please enter valid positive numbers for Length and Width.');
            return;
        }

        // Calculate base area in the chosen unit
        const baseArea = l * w;
        let sqft = 0;
        let sqm = 0;
        let unitLabel = '';

        // Convert baseArea to sqft and sqm based on unit
        if (unit === 'feet') {
            sqft = baseArea;
            sqm = baseArea * 0.092903;
            unitLabel = 'sq ft';
        } else if (unit === 'meters') {
            sqm = baseArea;
            sqft = baseArea * 10.7639;
            unitLabel = 'm²';
        } else if (unit === 'inches') {
            sqft = baseArea / 144;
            sqm = sqft * 0.092903;
            unitLabel = 'sq in';
        } else if (unit === 'cm') {
            sqm = baseArea / 10000;
            sqft = sqm * 10.7639;
            unitLabel = 'cm²';
        }

        resArea.textContent = `${baseArea.toLocaleString(undefined, {maximumFractionDigits: 2})} ${unitLabel}`;
        resSqft.textContent = sqft.toLocaleString(undefined, {maximumFractionDigits: 2});
        resSqm.textContent = sqm.toLocaleString(undefined, {maximumFractionDigits: 2});

        // Price calculation
        if (!isNaN(p) && p > 0) {
            const totalCost = baseArea * p;
            resCost.textContent = `$${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            costBox.style.display = 'block';
        } else {
            costBox.style.display = 'none';
        }

        resultBox.style.display = 'block';
    }

    calcBtn.addEventListener('click', calculateArea);

    clearBtn.addEventListener('click', () => {
        lengthInput.value = '';
        widthInput.value = '';
        priceInput.value = '';
        unitSelect.value = 'feet';
        if(errorMsg) errorMsg.style.display = 'none';
        resultBox.style.display = 'none';
    });
});
