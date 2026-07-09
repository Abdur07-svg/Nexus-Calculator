document?.addEventListener('DOMContentLoaded', () => {
    // Theme setup from local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    const btnCalcBf = document.getElementById('calc-bf-btn');
    const inputGender = document.getElementById('bf-gender');
    const inputAge = document.getElementById('bf-age');
    const inputWeight = document.getElementById('bf-weight');
    const inputHeight = document.getElementById('bf-height');
    const inputNeck = document.getElementById('bf-neck');
    const inputWaist = document.getElementById('bf-waist');
    const inputHip = document.getElementById('bf-hip');
    const hipGroup = document.getElementById('bf-hip-group');
    
    const resultContainer = document.getElementById('bf-result-container');
    const percentageDisplay = document.getElementById('bf-percentage');
    const categoryDisplay = document.getElementById('bf-category');
    const fatMassDisplay = document.getElementById('bf-fat-mass');
    const leanMassDisplay = document.getElementById('bf-lean-mass');

    // Toggle Hip input visibility based on gender
    inputGender?.addEventListener('change', () => {
        if (inputGender.value === 'female') {
            hipGroup.style.display = 'block';
        } else {
            hipGroup.style.display = 'none';
        }
    });

    if (btnCalcBf) {
        btnCalcBf.addEventListener('click', () => {
            const gender = inputGender.value;
            const weight = parseFloat(inputWeight.value);
            const height = parseFloat(inputHeight.value);
            const neck = parseFloat(inputNeck.value);
            const waist = parseFloat(inputWaist.value);
            const hip = parseFloat(inputHip.value) || 0;

            if (!weight || !height || !neck || !waist || weight <= 0 || height <= 0 || neck <= 0 || waist <= 0) {
                percentageDisplay.textContent = '0%';
                resultContainer.style.display = 'block';
                return;
            }

            if (gender === 'female' && (!hip || hip <= 0)) {
                percentageDisplay.textContent = 'Error';
                categoryDisplay.textContent = 'Hip measurement required';
                resultContainer.style.display = 'block';
                return;
            }

            // U.S. Navy Method Body Fat Formula (Metric)
            let bfPercentage = 0;
            
            if (gender === 'male') {
                if (waist - neck <= 0) return; // Invalid measurements
                bfPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
            } else {
                if (waist + hip - neck <= 0) return; // Invalid measurements
                bfPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
            }

            // Bound the percentage
            bfPercentage = Math.max(0, Math.min(bfPercentage, 100));

            const fatMass = weight * (bfPercentage / 100);
            const leanMass = weight - fatMass;

            // Determine category
            let category = '';
            let color = '';
            
            if (gender === 'male') {
                if (bfPercentage < 2) { category = 'Essential fat'; color = '#3b82f6'; }
                else if (bfPercentage < 14) { category = 'Athletes'; color = '#22c55e'; }
                else if (bfPercentage < 18) { category = 'Fitness'; color = '#10b981'; }
                else if (bfPercentage < 25) { category = 'Average'; color = '#eab308'; }
                else { category = 'Obese'; color = '#ef4444'; }
            } else {
                if (bfPercentage < 10) { category = 'Essential fat'; color = '#3b82f6'; }
                else if (bfPercentage < 21) { category = 'Athletes'; color = '#22c55e'; }
                else if (bfPercentage < 25) { category = 'Fitness'; color = '#10b981'; }
                else if (bfPercentage < 32) { category = 'Average'; color = '#eab308'; }
                else { category = 'Obese'; color = '#ef4444'; }
            }

            percentageDisplay.textContent = bfPercentage.toFixed(1) + '%';
            categoryDisplay.textContent = category;
            categoryDisplay.style.color = color;
            fatMassDisplay.textContent = fatMass.toFixed(1) + ' kg';
            leanMassDisplay.textContent = leanMass.toFixed(1) + ' kg';

            resultContainer.style.display = 'block';
        });
    }
});
