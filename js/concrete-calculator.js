document.addEventListener('DOMContentLoaded', () => {
    const length = document.getElementById('length');
    const lenUnit = document.getElementById('len-unit');
    const width = document.getElementById('width');
    const widUnit = document.getElementById('wid-unit');
    const depth = document.getElementById('depth');
    const depUnit = document.getElementById('dep-unit');
    const quantity = document.getElementById('quantity');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');

    function getMultiplierToFeet(unit) {
        switch(unit) {
            case 'ft': return 1;
            case 'in': return 1 / 12;
            case 'm': return 3.28084;
            case 'cm': return 0.0328084;
            default: return 1;
        }
    }

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        
        const l = parseFloat(length.value);
        const w = parseFloat(width.value);
        const d = parseFloat(depth.value);
        let q = parseInt(quantity.value);

        if (isNaN(l) || isNaN(w) || isNaN(d) || l <= 0 || w <= 0 || d <= 0) {
            errorMsg.textContent = 'Please enter valid positive numbers for all fields.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }
        
        if (isNaN(q) || q < 1) q = 1;

        // Convert everything to feet
        const lFt = l * getMultiplierToFeet(lenUnit.value);
        const wFt = w * getMultiplierToFeet(widUnit.value);
        const dFt = d * getMultiplierToFeet(depUnit.value);

        const areaSqFt = lFt * wFt * q;
        const areaSqM = areaSqFt * 0.092903;

        const volumeCuFt = areaSqFt * dFt;
        const volumeCuYards = volumeCuFt / 27;
        const volumeCuMeters = volumeCuYards * 0.764555;

        // Number of bags (approx)
        const bags80 = volumeCuFt / 0.60;
        const bags60 = volumeCuFt / 0.45;

        detailedRes.innerHTML = `
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Total Area</div>
            <div style="font-size: 24px; font-weight: 700; color: var(--text-primary); margin-bottom: 15px;">
                ${areaSqFt.toFixed(2)} sq ft &nbsp;|&nbsp; ${areaSqM.toFixed(2)} sq m
            </div>

            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Total Volume Needed</div>
            <div style="font-size: 32px; font-weight: 700; color: var(--btn-operator-color); margin-bottom: 5px;">
                ${volumeCuYards.toFixed(2)} cu yd
            </div>
            <div style="font-size: 16px; font-weight: 500; color: var(--text-primary); margin-bottom: 20px;">
                ${volumeCuMeters.toFixed(2)} cu m &nbsp;|&nbsp; ${volumeCuFt.toFixed(1)} cu ft
            </div>
            
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Estimated Premixed Bags</div>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 15px; color: var(--text-primary);">
                <li style="margin-bottom: 5px;"><strong>${Math.ceil(bags80)}</strong> bags (80 lbs each)</li>
                <li><strong>${Math.ceil(bags60)}</strong> bags (60 lbs each)</li>
            </ul>
            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 10px; font-style: italic;">
                Note: It is recommended to buy 5-10% extra to account for spillage or uneven subgrade.
            </div>
        `;

        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        length.value = ''; width.value = ''; depth.value = ''; quantity.value = '1';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
