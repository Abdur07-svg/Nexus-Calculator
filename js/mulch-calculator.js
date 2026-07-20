document.addEventListener('DOMContentLoaded', () => {
    const lengthInput = document.getElementById('length');
    const unitLength = document.getElementById('unit-length');
    const widthInput = document.getElementById('width');
    const unitWidth = document.getElementById('unit-width');
    const depthInput = document.getElementById('depth');
    const unitDepth = document.getElementById('unit-depth');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultCuYd = document.getElementById('result-cu-yd');
    const resultCuFt = document.getElementById('result-cu-ft');
    const resultBags2 = document.getElementById('result-bags-2');
    const resultBags3 = document.getElementById('result-bags-3');
    const errorMsg = document.getElementById('error-msg');

    calcBtn.addEventListener('click', () => {
        let length = parseFloat(lengthInput.value);
        let width = parseFloat(widthInput.value);
        let depth = parseFloat(depthInput.value);

        if (isNaN(length) || isNaN(width) || isNaN(depth) || length <= 0 || width <= 0 || depth <= 0) {
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        // Convert to feet
        if (unitLength.value === 'm') length = length * 3.28084;
        if (unitWidth.value === 'm') width = width * 3.28084;
        
        // Convert depth to feet
        if (unitDepth.value === 'in') {
            depth = depth / 12;
        } else if (unitDepth.value === 'cm') {
            depth = (depth / 2.54) / 12; // cm to inches, then to feet
        }

        const volumeCuFt = length * width * depth;
        const volumeCuYd = volumeCuFt / 27;
        const volumeCuMeters = volumeCuFt * 0.0283168;

        const bags2 = Math.ceil(volumeCuFt / 2);
        const bags3 = Math.ceil(volumeCuFt / 3);

        resultCuYd.textContent = `${volumeCuYd.toLocaleString(undefined, {maximumFractionDigits: 2})} Cubic Yards`;
        resultCuFt.textContent = `${volumeCuFt.toLocaleString(undefined, {maximumFractionDigits: 1})} Cubic Feet / ${volumeCuMeters.toLocaleString(undefined, {maximumFractionDigits: 2})} m³`;
        resultBags2.textContent = bags2.toLocaleString();
        resultBags3.textContent = bags3.toLocaleString();
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        lengthInput.value = '';
        widthInput.value = '';
        depthInput.value = '';
        unitLength.value = 'ft';
        unitWidth.value = 'ft';
        unitDepth.value = 'in';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
