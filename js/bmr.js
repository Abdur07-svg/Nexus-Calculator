document?.addEventListener('DOMContentLoaded', () => {
    // Theme setup from local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    const btnCalcBmr = document.getElementById('calc-bmr-btn');
    const inputAge = document.getElementById('bmr-age');
    const inputGender = document.getElementById('bmr-gender');
    const inputHeight = document.getElementById('bmr-height');
    const inputWeight = document.getElementById('bmr-weight');
    const resultContainer = document.getElementById('bmr-result-container');
    const scoreDisplay = document.getElementById('bmr-score');

    if (btnCalcBmr) {
        btnCalcBmr.addEventListener('click', () => {
            const age = parseFloat(inputAge.value);
            const height = parseFloat(inputHeight.value);
            const weight = parseFloat(inputWeight.value);
            const gender = inputGender.value;

            if (!age || !height || !weight || age <= 0 || height <= 0 || weight <= 0) {
                scoreDisplay.textContent = '0';
                resultContainer.style.display = 'block';
                return;
            }

            // Mifflin-St Jeor Equation
            let bmr = 0;
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }

            scoreDisplay.textContent = Math.round(bmr).toLocaleString();
            resultContainer.style.display = 'block';
        });
    }
});
