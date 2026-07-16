document.addEventListener('DOMContentLoaded', () => {
    // --- Mass Calculator ---
    const massVol = document.getElementById('mass-vol');
    const massVolUnit = document.getElementById('mass-vol-unit');
    const massDen = document.getElementById('mass-den');
    const massDenUnit = document.getElementById('mass-den-unit');
    const massCalcBtn = document.getElementById('mass-calc-btn');
    const massClearBtn = document.getElementById('mass-clear-btn');
    const massError = document.getElementById('mass-error');
    const massResultBox = document.getElementById('mass-result-box');
    const massMainRes = document.getElementById('mass-main-res');

    massCalcBtn.addEventListener('click', () => {
        massError.style.display = 'none';
        const v = parseFloat(massVol.value);
        const d = parseFloat(massDen.value);

        if (isNaN(v) || isNaN(d) || v < 0 || d < 0) {
            massError.textContent = 'Please enter valid positive numbers for Volume and Density.';
            massError.style.display = 'block';
            massResultBox.classList.remove('active');
            return;
        }

        // Convert Volume to m³
        let vol_m3 = v;
        if (massVolUnit.value === 'cm3') vol_m3 = v / 1000000;
        else if (massVolUnit.value === 'l') vol_m3 = v / 1000;

        // Convert Density to kg/m³
        let den_kg_m3 = d;
        if (massDenUnit.value === 'g_cm3') den_kg_m3 = d * 1000;

        // Mass in kg = Density (kg/m³) * Volume (m³)
        const mass_kg = den_kg_m3 * vol_m3;
        
        let displayStr = `${mass_kg.toLocaleString(undefined, {maximumFractionDigits: 4})} kg`;
        if (mass_kg < 1) {
            displayStr += `<br><span style="font-size:18px; color:var(--text-secondary)">(${(mass_kg * 1000).toLocaleString(undefined, {maximumFractionDigits: 4})} g)</span>`;
        } else {
            displayStr += `<br><span style="font-size:18px; color:var(--text-secondary)">(${(mass_kg * 2.20462).toLocaleString(undefined, {maximumFractionDigits: 4})} lbs)</span>`;
        }

        massMainRes.innerHTML = displayStr;
        massResultBox.classList.add('active');
    });

    massClearBtn.addEventListener('click', () => {
        massVol.value = '';
        massDen.value = '';
        massResultBox.classList.remove('active');
        massError.style.display = 'none';
    });

    // --- Volume Calculator ---
    const volLen = document.getElementById('vol-len');
    const volLenUnit = document.getElementById('vol-len-unit');
    const volWid = document.getElementById('vol-wid');
    const volWidUnit = document.getElementById('vol-wid-unit');
    const volHei = document.getElementById('vol-hei');
    const volHeiUnit = document.getElementById('vol-hei-unit');
    
    const volCalcBtn = document.getElementById('vol-calc-btn');
    const volClearBtn = document.getElementById('vol-clear-btn');
    const volError = document.getElementById('vol-error');
    const volResultBox = document.getElementById('vol-result-box');
    const volMainRes = document.getElementById('vol-main-res');
    const volDetRes = document.getElementById('vol-det-res');

    function convertToMeters(val, unit) {
        if (unit === 'cm') return val / 100;
        if (unit === 'in') return val * 0.0254;
        if (unit === 'ft') return val * 0.3048;
        return val; // 'm'
    }

    volCalcBtn.addEventListener('click', () => {
        volError.style.display = 'none';
        const l = parseFloat(volLen.value);
        const w = parseFloat(volWid.value);
        const h = parseFloat(volHei.value);

        if (isNaN(l) || isNaN(w) || isNaN(h) || l < 0 || w < 0 || h < 0) {
            volError.textContent = 'Please enter valid positive numbers for all dimensions.';
            volError.style.display = 'block';
            volResultBox.classList.remove('active');
            return;
        }

        const l_m = convertToMeters(l, volLenUnit.value);
        const w_m = convertToMeters(w, volWidUnit.value);
        const h_m = convertToMeters(h, volHeiUnit.value);

        const vol_m3 = l_m * w_m * h_m;
        const vol_cm3 = vol_m3 * 1000000;
        const vol_liters = vol_m3 * 1000;

        volMainRes.textContent = `${vol_m3.toLocaleString(undefined, {maximumFractionDigits: 6})} m³`;
        volDetRes.innerHTML = `
            ${vol_cm3.toLocaleString(undefined, {maximumFractionDigits: 2})} cm³<br>
            ${vol_liters.toLocaleString(undefined, {maximumFractionDigits: 2})} Liters
        `;
        volResultBox.classList.add('active');
    });

    volClearBtn.addEventListener('click', () => {
        volLen.value = '';
        volWid.value = '';
        volHei.value = '';
        volResultBox.classList.remove('active');
        volError.style.display = 'none';
    });
});
