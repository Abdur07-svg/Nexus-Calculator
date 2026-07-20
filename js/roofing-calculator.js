document.addEventListener('DOMContentLoaded', () => {
    const lengthInput = document.getElementById('base-length');
    const unitLength = document.getElementById('unit-length');
    const widthInput = document.getElementById('base-width');
    const unitWidth = document.getElementById('unit-width');
    const pitchSelect = document.getElementById('roof-pitch');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultArea = document.getElementById('result-area');
    const resultSquares = document.getElementById('result-squares');
    const resultBundles = document.getElementById('result-bundles');
    const errorMsg = document.getElementById('error-msg');

    calcBtn.addEventListener('click', () => {
        let length = parseFloat(lengthInput.value);
        let width = parseFloat(widthInput.value);
        const pitchMultiplier = parseFloat(pitchSelect.value);

        if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        // Convert to feet if meters
        if (unitLength.value === 'm') {
            length = length * 3.28084;
        }
        if (unitWidth.value === 'm') {
            width = width * 3.28084;
        }

        // Calculate base area (in sq ft)
        const baseArea = length * width;
        
        // Calculate true roof area using pitch multiplier
        const roofArea = baseArea * pitchMultiplier;

        // Calculate squares (1 square = 100 sq ft)
        const squares = roofArea / 100;

        // Calculate bundles (3 bundles per square)
        const bundles = squares * 3;

        resultArea.textContent = `${Math.ceil(roofArea).toLocaleString()} sq ft`;
        resultSquares.textContent = Math.ceil(squares).toLocaleString();
        resultBundles.textContent = Math.ceil(bundles).toLocaleString();
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        lengthInput.value = '';
        widthInput.value = '';
        unitLength.value = 'ft';
        unitWidth.value = 'ft';
        pitchSelect.value = '1.118';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
