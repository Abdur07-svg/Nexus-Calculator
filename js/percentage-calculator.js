document.addEventListener('DOMContentLoaded', () => {
    const calcType = document.getElementById('calc-type');
    const labelX = document.getElementById('label-x');
    const labelY = document.getElementById('label-y');
    const valX = document.getElementById('val-x');
    const valY = document.getElementById('val-y');
    const equationPreview = document.getElementById('equation-preview');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultBox = document.getElementById('result-box');
    const resultMain = document.getElementById('result-main');
    const resultDetails = document.getElementById('result-details');
    const resultLabel = document.getElementById('result-label');
    const errorMsg = document.getElementById('error-msg');

    // Update labels and placeholder based on type
    calcType.addEventListener('change', () => {
        const type = calcType.value;
        valX.value = '';
        valY.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';

        if (type === '1') {
            labelX.textContent = 'Percentage (X%)';
            labelY.textContent = 'Value (Y)';
            equationPreview.innerHTML = 'What is <span style="color: var(--btn-operator-color)">X</span> % of <span style="color: var(--btn-operator-color)">Y</span>?';
        } else if (type === '2') {
            labelX.textContent = 'Value (X)';
            labelY.textContent = 'Value (Y)';
            equationPreview.innerHTML = '<span style="color: var(--btn-operator-color)">X</span> is what % of <span style="color: var(--btn-operator-color)">Y</span>?';
        } else if (type === '3') {
            labelX.textContent = 'Original Value (X)';
            labelY.textContent = 'New Value (Y)';
            equationPreview.innerHTML = 'Percentage change from <span style="color: var(--btn-operator-color)">X</span> to <span style="color: var(--btn-operator-color)">Y</span>?';
        } else if (type === '4') {
            labelX.textContent = 'Value (X)';
            labelY.textContent = 'Percentage (P%)';
            equationPreview.innerHTML = '<span style="color: var(--btn-operator-color)">X</span> is <span style="color: var(--btn-operator-color)">P</span>% of what?';
        } else if (type === '5') {
            labelX.textContent = 'Original Value (X)';
            labelY.textContent = 'Percentage (P%)';
            equationPreview.innerHTML = 'What is <span style="color: var(--btn-operator-color)">X</span> increased/decreased by <span style="color: var(--btn-operator-color)">P</span>%?';
        }
    });

    calcBtn.addEventListener('click', () => {
        const x = parseFloat(valX.value);
        const y = parseFloat(valY.value);
        const type = calcType.value;

        if (isNaN(x) || isNaN(y)) {
            showError("Please enter valid numbers for both X and Y.");
            return;
        }

        errorMsg.style.display = 'none';
        let result = 0;
        let details = "";
        let resultTitle = "Result";

        if (type === '1') {
            // What is X% of Y?
            result = (x / 100) * y;
            resultTitle = `${x}% of ${y}`;
            details = `${x} / 100 × ${y} = ${formatNumber(result)}`;
            resultMain.textContent = formatNumber(result);
            resultMain.style.color = 'var(--btn-operator-color)';
        } else if (type === '2') {
            // X is what % of Y?
            if (y === 0) {
                showError("Value Y cannot be zero.");
                return;
            }
            result = (x / y) * 100;
            resultTitle = `${x} is what % of ${y}`;
            details = `${x} / ${y} = ${formatNumber(x/y)} = ${formatNumber(result)}%`;
            resultMain.textContent = formatNumber(result) + '%';
            resultMain.style.color = 'var(--btn-operator-color)';
        } else if (type === '3') {
            // Percentage change from X to Y
            if (x === 0) {
                showError("Original Value (X) cannot be zero.");
                return;
            }
            const diff = y - x;
            result = (diff / Math.abs(x)) * 100;
            const changeType = result > 0 ? 'Increase' : (result < 0 ? 'Decrease' : 'Change');
            resultTitle = `Percentage ${changeType}`;
            details = `Difference: ${formatNumber(y)} - ${formatNumber(x)} = ${formatNumber(diff)}<br>Change: (${formatNumber(diff)} / ${formatNumber(Math.abs(x))}) × 100 = ${formatNumber(result)}%`;
            
            // Format result main with + or -
            let prefix = result > 0 ? '+' : '';
            resultMain.textContent = prefix + formatNumber(result) + '%';
            
            if (result > 0) {
                resultMain.style.color = '#4caf50'; // Green for increase
            } else if (result < 0) {
                resultMain.style.color = '#ff5252'; // Red for decrease
            } else {
                resultMain.style.color = 'var(--btn-operator-color)';
            }
        } else if (type === '4') {
            // X is P% of what? (Here X is valX, P is valY)
            if (y === 0) {
                showError("Percentage (P%) cannot be zero.");
                return;
            }
            result = x / (y / 100);
            resultTitle = `${x} is ${y}% of ${formatNumber(result)}`;
            details = `${x} / (${y} / 100) = ${formatNumber(result)}`;
            resultMain.textContent = formatNumber(result);
            resultMain.style.color = 'var(--btn-operator-color)';
        } else if (type === '5') {
            // What is X increased/decreased by P%? (Here X is valX, P is valY)
            const changeAmt = x * (y / 100);
            const increased = x + changeAmt;
            const decreased = x - changeAmt;
            
            resultTitle = `Change by ${y}%`;
            details = `Change amount: ${x} × (${y} / 100) = ${formatNumber(changeAmt)}`;
            
            resultMain.innerHTML = `
                <div style="font-size: 20px; color: #4caf50; margin-bottom: 5px;">Increased: ${formatNumber(increased)}</div>
                <div style="font-size: 20px; color: #ff5252;">Decreased: ${formatNumber(decreased)}</div>
            `;
            // Unset color so inner HTML styles take over
            resultMain.style.color = 'inherit';
        }

        resultLabel.textContent = resultTitle;
        resultDetails.innerHTML = details;
        resultBox.classList.add('active');
    });

    function formatNumber(num) {
        // Round to max 6 decimal places to avoid floating point issues
        return parseFloat(num.toFixed(6)).toLocaleString('en-US');
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        resultBox.classList.remove('active');
    }

    clearBtn.addEventListener('click', () => {
        valX.value = '';
        valY.value = '';
        errorMsg.style.display = 'none';
        resultBox.classList.remove('active');
        resultMain.style.color = 'var(--btn-operator-color)';
    });

    // Inputs focus handling to hide errors
    valX.addEventListener('input', () => errorMsg.style.display = 'none');
    valY.addEventListener('input', () => errorMsg.style.display = 'none');
});
