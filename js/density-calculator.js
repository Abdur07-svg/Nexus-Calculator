document.addEventListener('DOMContentLoaded', () => {
    const calcType = document.getElementById('calc-type');
    
    const groupDensity = document.getElementById('group-density');
    const groupMass = document.getElementById('group-mass');
    const groupVolume = document.getElementById('group-volume');
    
    const densityInput = document.getElementById('density');
    const densityUnit = document.getElementById('density-unit');
    const massInput = document.getElementById('mass');
    const massUnit = document.getElementById('mass-unit');
    const volumeInput = document.getElementById('volume');
    const volumeUnit = document.getElementById('volume-unit');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultLabel = document.getElementById('result-label');
    const resultMain = document.getElementById('result-main');
    const resultAlt = document.getElementById('result-alt');
    const errorMsg = document.getElementById('error-msg');

    // UI switching
    calcType.addEventListener('change', () => {
        const type = calcType.value;
        
        groupDensity.style.display = type === 'density' ? 'none' : 'flex';
        groupMass.style.display = type === 'mass' ? 'none' : 'flex';
        groupVolume.style.display = type === 'volume' ? 'none' : 'flex';
        
        let btnText = 'Density';
        if (type === 'mass') btnText = 'Mass';
        if (type === 'volume') btnText = 'Volume';
        calcBtn.textContent = `Calculate ${btnText}`;
        
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });

    calcBtn.addEventListener('click', () => {
        const type = calcType.value;
        let d = parseFloat(densityInput.value);
        let m = parseFloat(massInput.value);
        let v = parseFloat(volumeInput.value);

        // Validation based on type
        if (type === 'density' && (isNaN(m) || isNaN(v) || m <= 0 || v <= 0)) {
            showError(); return;
        }
        if (type === 'mass' && (isNaN(d) || isNaN(v) || d <= 0 || v <= 0)) {
            showError(); return;
        }
        if (type === 'volume' && (isNaN(m) || isNaN(d) || m <= 0 || d <= 0)) {
            showError(); return;
        }

        errorMsg.style.display = 'none';

        // Base unit conversions
        // We will do math in base units: kg, m3, kg/m3

        // Convert Mass to kg if needed
        let mKg = m;
        if (type !== 'mass') {
            if (massUnit.value === 'g') mKg = m / 1000;
            if (massUnit.value === 'lbs') mKg = m * 0.453592;
        }

        // Convert Volume to m3 if needed
        let vM3 = v;
        if (type !== 'volume') {
            if (volumeUnit.value === 'cm3') vM3 = v / 1000000;
            if (volumeUnit.value === 'liters') vM3 = v / 1000;
        }

        // Convert Density to kg/m3 if needed
        let dKgm3 = d;
        if (type !== 'density') {
            if (densityUnit.value === 'gcm3') dKgm3 = d * 1000;
        }

        // Calculate
        if (type === 'density') {
            const densityKgm3 = mKg / vM3;
            const densityGcm3 = densityKgm3 / 1000;
            
            resultLabel.textContent = 'Density (ρ)';
            resultMain.textContent = `${formatNum(densityKgm3)} kg/m³`;
            resultAlt.textContent = `${formatNum(densityGcm3, 4)} g/cm³`;
            resultAlt.style.display = 'block';
        } 
        else if (type === 'mass') {
            const massKg = dKgm3 * vM3;
            const massLbs = massKg * 2.20462;
            const massG = massKg * 1000;
            
            resultLabel.textContent = 'Mass (Weight)';
            resultMain.textContent = `${formatNum(massKg)} kg`;
            resultAlt.innerHTML = `${formatNum(massG)} g <br> ${formatNum(massLbs)} lbs`;
            resultAlt.style.display = 'block';
        } 
        else if (type === 'volume') {
            const volM3 = mKg / dKgm3;
            const volLiters = volM3 * 1000;
            const volCm3 = volM3 * 1000000;
            
            resultLabel.textContent = 'Volume';
            resultMain.textContent = `${formatNum(volM3)} m³`;
            resultAlt.innerHTML = `${formatNum(volLiters)} Liters <br> ${formatNum(volCm3)} cm³`;
            resultAlt.style.display = 'block';
        }
        
        resultBox.classList.add('active');
    });

    function showError() {
        errorMsg.style.display = 'block';
        resultBox.classList.remove('active');
    }

    function formatNum(num, digits=2) {
        return num.toLocaleString(undefined, {maximumFractionDigits: digits});
    }

    clearBtn.addEventListener('click', () => {
        densityInput.value = '';
        massInput.value = '';
        volumeInput.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
