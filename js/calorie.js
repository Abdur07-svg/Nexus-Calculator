document?.addEventListener('DOMContentLoaded', () => {
    // Theme setup from local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    const btnCalcCalorie = document.getElementById('calc-calorie-btn');
    const inputAge = document.getElementById('cal-age');
    const inputGender = document.getElementById('cal-gender');
    const inputHeight = document.getElementById('cal-height');
    const inputWeight = document.getElementById('cal-weight');
    const inputActivity = document.getElementById('cal-activity');
    
    const resultContainer = document.getElementById('cal-result-container');
    const maintainDisplay = document.getElementById('cal-maintain');
    const mildLossDisplay = document.getElementById('cal-mild-loss');
    const lossDisplay = document.getElementById('cal-loss');
    const extremeLossDisplay = document.getElementById('cal-extreme-loss');
    const gainDisplay = document.getElementById('cal-gain');

    if (btnCalcCalorie) {
        btnCalcCalorie.addEventListener('click', () => {
            const age = parseFloat(inputAge.value);
            const height = parseFloat(inputHeight.value);
            const weight = parseFloat(inputWeight.value);
            const gender = inputGender.value;
            const activityFactor = parseFloat(inputActivity.value);

            if (!age || !height || !weight || age <= 0 || height <= 0 || weight <= 0) {
                maintainDisplay.textContent = '0';
                resultContainer.style.display = 'block';
                return;
            }

            // Mifflin-St Jeor Equation for BMR
            let bmr = 0;
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }

            // Calculate TDEE
            const tdee = Math.round(bmr * activityFactor);

            // Calculate targets
            maintainDisplay.textContent = tdee.toLocaleString();
            mildLossDisplay.textContent = Math.max(tdee - 250, 0).toLocaleString();
            lossDisplay.textContent = Math.max(tdee - 500, 0).toLocaleString();
            extremeLossDisplay.textContent = Math.max(tdee - 1000, 0).toLocaleString();
            gainDisplay.textContent = (tdee + 500).toLocaleString();

            resultContainer.style.display = 'block';
        });
    }
});
