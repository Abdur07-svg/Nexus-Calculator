document.addEventListener('DOMContentLoaded', () => {
    const valTrue = document.getElementById('val-true');
    const valMeasured = document.getElementById('val-measured');

    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultPercent = document.getElementById('result-percent');
    const resultAbsolute = document.getElementById('result-absolute');
    const errorMsg = document.getElementById('error-msg');

    function calculatePercentError() {
        const trueValue = parseFloat(valTrue.value);
        const measuredValue = parseFloat(valMeasured.value);

        try {
            if (isNaN(trueValue) || isNaN(measuredValue)) {
                throw "Please enter valid numeric values.";
            }

            if (trueValue === 0) {
                throw "True/Accepted value cannot be zero as it results in division by zero.";
            }

            errorMsg.style.display = 'none';

            const absoluteError = Math.abs(measuredValue - trueValue);
            const percentError = (absoluteError / Math.abs(trueValue)) * 100;

            resultAbsolute.textContent = formatNumber(absoluteError);
            resultPercent.textContent = formatNumber(percentError) + '%';
            
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
        return num.toFixed(4).replace(/\.?0+$/, ''); 
    }

    calcBtn.addEventListener('click', calculatePercentError);

    clearBtn.addEventListener('click', () => {
        valTrue.value = '';
        valMeasured.value = '';
        errorMsg.style.display = 'none';
        resultBox.classList.remove('active');
        valTrue.focus();
    });

    [valTrue, valMeasured].forEach(input => {
        input.addEventListener('input', () => {
            errorMsg.style.display = 'none';
        });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculatePercentError();
            }
        });
    });
});
