document.addEventListener('DOMContentLoaded', () => {
    const valBase = document.getElementById('val-base');
    const valExp = document.getElementById('val-exp');

    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultEquation = document.getElementById('result-equation');
    const resultExpanded = document.getElementById('result-expanded');
    const errorMsg = document.getElementById('error-msg');

    function calculateExponent() {
        const base = parseFloat(valBase.value);
        const exp = parseFloat(valExp.value);

        try {
            if (isNaN(base) || isNaN(exp)) {
                throw "Please enter valid numeric values for Base and Exponent.";
            }

            errorMsg.style.display = 'none';

            const result = Math.pow(base, exp);

            if (!isFinite(result)) {
                throw "The result is too large to be calculated.";
            }

            const formattedBase = formatNumber(base);
            const formattedExp = formatNumber(exp);
            const formattedResult = formatNumber(result);

            resultEquation.innerHTML = `${formattedBase}<sup>${formattedExp}</sup> = ${formattedResult}`;
            
            // Generate expanded form if exponent is a small positive integer
            if (Number.isInteger(exp) && exp > 0 && exp <= 20) {
                let expandedStr = Array(exp).fill(formattedBase).join(' &times; ');
                expandedStr += ` = ${formattedResult}`;
                resultExpanded.innerHTML = expandedStr;
                resultExpanded.style.display = 'block';
            } else {
                resultExpanded.style.display = 'none';
            }

            resultBox.classList.add('active');
            
        } catch (err) {
            showError(err);
        }
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        resultBox.classList.remove('active');
    }

    function formatNumber(num) {
        if (Number.isInteger(num)) {
            return num.toString();
        }
        if (Math.abs(num) > 1e15 || Math.abs(num) < 1e-10) {
            return num.toExponential(4);
        }
        return num.toFixed(6).replace(/\.?0+$/, ''); 
    }

    calcBtn.addEventListener('click', calculateExponent);

    clearBtn.addEventListener('click', () => {
        valBase.value = '';
        valExp.value = '';
        errorMsg.style.display = 'none';
        resultBox.classList.remove('active');
        valBase.focus();
    });

    [valBase, valExp].forEach(input => {
        input.addEventListener('input', () => {
            errorMsg.style.display = 'none';
        });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateExponent();
            }
        });
    });
});
