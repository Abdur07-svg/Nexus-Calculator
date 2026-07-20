document.addEventListener('DOMContentLoaded', () => {
    const massInput = document.getElementById('mass');
    const massUnit = document.getElementById('mass-unit');
    const molarMassInput = document.getElementById('molar-mass');
    const molarMassUnit = document.getElementById('molar-mass-unit');
    const volumeInput = document.getElementById('volume');
    const volumeUnit = document.getElementById('volume-unit');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultMolarity = document.getElementById('result-molarity');
    const resultMoles = document.getElementById('result-moles');
    const resultMassConc = document.getElementById('result-mass-conc');
    const errorMsg = document.getElementById('error-msg');

    calcBtn.addEventListener('click', () => {
        let mass = parseFloat(massInput.value);
        const molarMass = parseFloat(molarMassInput.value);
        let volume = parseFloat(volumeInput.value);

        if (isNaN(mass) || isNaN(molarMass) || isNaN(volume) || mass <= 0 || molarMass <= 0 || volume <= 0) {
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        // Convert Mass to grams
        let massG = mass;
        if (massUnit.value === 'mg') {
            massG = mass / 1000;
        } else if (massUnit.value === 'kg') {
            massG = mass * 1000;
        }

        // Convert Molar Mass to g/mol
        let molarMassG = molarMass;
        if (molarMassUnit.value === 'kg-mol') {
            molarMassG = molarMass * 1000;
        } else if (molarMassUnit.value === 'mg-mol') {
            molarMassG = molarMass / 1000;
        }

        // Convert Volume to Liters
        let volumeL = volume;
        if (volumeUnit.value === 'ml') {
            volumeL = volume / 1000;
        }

        // Calculate Moles: mass(g) / molarMass(g/mol)
        const moles = massG / molarMassG;
        
        // Calculate Molarity: moles / volume(L)
        const molarity = moles / volumeL;
        
        // Calculate Mass Concentration: mass(g) / volume(L)
        const massConc = massG / volumeL;

        resultMolarity.textContent = `${molarity.toLocaleString(undefined, {maximumFractionDigits: 4})} M`;
        resultMoles.textContent = `${moles.toLocaleString(undefined, {maximumFractionDigits: 4})} moles`;
        resultMassConc.textContent = `${massConc.toLocaleString(undefined, {maximumFractionDigits: 4})} g/L (Mass Concentration)`;
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        massInput.value = '';
        molarMassInput.value = '';
        volumeInput.value = '';
        massUnit.value = 'g';
        molarMassUnit.value = 'g-mol';
        volumeUnit.value = 'l';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
