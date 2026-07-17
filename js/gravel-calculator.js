document.addEventListener('DOMContentLoaded', () => {
    const lInput = document.getElementById('length');
    const unitL = document.getElementById('unit-l');
    
    const wInput = document.getElementById('width');
    const unitW = document.getElementById('unit-w');
    
    const dInput = document.getElementById('depth');
    const unitD = document.getElementById('unit-d');
    
    const gravelType = document.getElementById('gravel-type');
    const customDensityGroup = document.getElementById('custom-density-group');
    const customDensityInput = document.getElementById('custom-density');

    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');

    gravelType.addEventListener('change', () => {
        if (gravelType.value === 'custom') {
            customDensityGroup.style.display = 'flex';
        } else {
            customDensityGroup.style.display = 'none';
        }
    });

    function getMultiplierToMeters(unit) {
        switch(unit) {
            case 'ft': return 0.3048;
            case 'yd': return 0.9144;
            case 'm': return 1;
            case 'in': return 0.0254;
            case 'cm': return 0.01;
            default: return 1;
        }
    }

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        const l = parseFloat(lInput.value);
        const w = parseFloat(wInput.value);
        const d = parseFloat(dInput.value);

        let densityKgPerM3 = 1680;
        if (gravelType.value === 'custom') {
            densityKgPerM3 = parseFloat(customDensityInput.value);
        } else {
            densityKgPerM3 = parseFloat(gravelType.value);
        }

        if (isNaN(l) || isNaN(w) || isNaN(d) || l <= 0 || w <= 0 || d <= 0) {
            errorMsg.textContent = 'Please enter valid positive numbers for all fields.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        if (isNaN(densityKgPerM3) || densityKgPerM3 <= 0) {
            errorMsg.textContent = 'Please enter a valid density.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        // Convert everything to meters
        const lengthM = l * getMultiplierToMeters(unitL.value);
        const widthM = w * getMultiplierToMeters(unitW.value);
        const depthM = d * getMultiplierToMeters(unitD.value);

        const volumeCubicMeters = lengthM * widthM * depthM;
        const volumeCubicYards = volumeCubicMeters * 1.30795;
        const volumeCubicFeet = volumeCubicMeters * 35.3147;

        const weightKg = volumeCubicMeters * densityKgPerM3;
        const weightTonsMetric = weightKg / 1000;
        
        const weightLbs = weightKg * 2.20462;
        const weightTonsUS = weightLbs / 2000;

        let densityText = gravelType.options[gravelType.selectedIndex].text;
        if (gravelType.value === 'custom') {
            densityText = `Custom (${densityKgPerM3} kg/m&sup3;)`;
        }

        detailedRes.innerHTML = `
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Estimated Volume</div>
            <div style="font-size: 26px; font-weight: 700; color: var(--btn-operator-color); margin-bottom: 20px;">
                ${volumeCubicYards.toLocaleString(undefined, {maximumFractionDigits: 2})} cubic yards<br>
                <span style="font-size: 16px; font-weight: 500; color: var(--text-primary);">(${volumeCubicMeters.toLocaleString(undefined, {maximumFractionDigits: 2})} m&sup3; / ${volumeCubicFeet.toLocaleString(undefined, {maximumFractionDigits: 2})} ft&sup3;)</span>
            </div>
            
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Estimated Weight</div>
            <div style="font-size: 22px; font-weight: 700; color: var(--text-primary);">
                ${weightTonsUS.toLocaleString(undefined, {maximumFractionDigits: 2})} US tons<br>
                <span style="font-size: 16px; font-weight: 500; color: var(--text-secondary);">(${weightTonsMetric.toLocaleString(undefined, {maximumFractionDigits: 2})} Metric tonnes)</span>
            </div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-top: 10px; font-style: italic;">
                *Weight is estimated based on: ${densityText}.
            </div>
        `;

        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        lInput.value = '';
        wInput.value = '';
        dInput.value = '';
        gravelType.value = '1680';
        customDensityInput.value = '';
        customDensityGroup.style.display = 'none';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
