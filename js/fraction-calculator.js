document.addEventListener('DOMContentLoaded', () => {
    const num1Input = document.getElementById('num1');
    const den1Input = document.getElementById('den1');
    const operatorSelect = document.getElementById('operator');
    const num2Input = document.getElementById('num2');
    const den2Input = document.getElementById('den2');
    
    const block1 = document.getElementById('block1');
    const block2 = document.getElementById('block2');
    const blockDec = document.getElementById('block-dec');
    const decIn = document.getElementById('dec-in');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultBox = document.getElementById('result-box');
    const errorMsg = document.getElementById('error-msg');
    
    const resultMain = document.getElementById('result-main');
    const resultDecimal = document.getElementById('result-decimal');
    const resultMixed = document.getElementById('result-mixed');
    
    const resultSimpleContainer = document.getElementById('result-simple-container');
    const resultMixedContainer = document.getElementById('result-mixed-container');
    const resultDecimalContainer = document.getElementById('result-decimal-container');

    // GCD function to simplify fractions
    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        return b === 0 ? a : gcd(b, a % b);
    }
    
    operatorSelect.addEventListener('change', () => {
        const op = operatorSelect.value;
        errorMsg.style.display = 'none';
        resultBox.classList.remove('active');
        
        if (op === 'simplify' || op === 'frac2dec') {
            block1.style.display = 'flex';
            block2.style.display = 'none';
            blockDec.style.display = 'none';
        } else if (op === 'dec2frac') {
            block1.style.display = 'none';
            block2.style.display = 'none';
            blockDec.style.display = 'block';
        } else {
            block1.style.display = 'flex';
            block2.style.display = 'flex';
            blockDec.style.display = 'none';
        }
    });

    calcBtn.addEventListener('click', () => {
        const operator = operatorSelect.value;
        
        let resNum = 0;
        let resDen = 1;
        
        if (operator === 'dec2frac') {
            const decVal = parseFloat(decIn.value);
            if (isNaN(decVal)) {
                showError("Please enter a valid decimal number.");
                return;
            }
            
            // convert decimal to fraction
            const decStr = decVal.toString();
            const len = decStr.includes('.') ? decStr.split('.')[1].length : 0;
            resDen = Math.pow(10, len);
            resNum = Math.round(decVal * resDen);
            
        } else {
            const num1 = parseInt(num1Input.value);
            const den1 = parseInt(den1Input.value);
            
            if (isNaN(num1) || isNaN(den1)) {
                showError("Please fill in the fraction.");
                return;
            }
            if (den1 === 0) {
                showError("Denominator cannot be zero.");
                return;
            }
            
            if (operator === 'simplify' || operator === 'frac2dec') {
                resNum = num1;
                resDen = den1;
            } else {
                const num2 = parseInt(num2Input.value);
                const den2 = parseInt(den2Input.value);
                if (isNaN(num2) || isNaN(den2)) {
                    showError("Please fill in both fractions.");
                    return;
                }
                if (den2 === 0) {
                    showError("Denominator cannot be zero.");
                    return;
                }
                
                switch(operator) {
                    case '+': resNum = (num1 * den2) + (num2 * den1); resDen = den1 * den2; break;
                    case '-': resNum = (num1 * den2) - (num2 * den1); resDen = den1 * den2; break;
                    case '*': resNum = num1 * num2; resDen = den1 * den2; break;
                    case '/': 
                        if (num2 === 0) { showError("Cannot divide by zero."); return; }
                        resNum = num1 * den2; resDen = den1 * num2; break;
                }
            }
        }

        // Simplify fraction
        const divisor = gcd(resNum, resDen);
        let finalNum = resNum / divisor;
        let finalDen = resDen / divisor;
        
        if (finalDen < 0) {
            finalNum = -finalNum;
            finalDen = -finalDen;
        }

        displayResult(finalNum, finalDen);
    });

    function displayResult(num, den) {
        errorMsg.style.display = 'none';
        
        // Simple Fraction Form
        let html = '';
        if (den === 1) {
            html = `<span style="font-size: 32px; font-weight: 700; color: var(--btn-operator-color);">${num}</span>`;
        } else {
            html = `
                <div class="fraction-result">
                    <span>${num}</span>
                    <hr class="fraction-result-line">
                    <span>${den}</span>
                </div>
            `;
        }
        resultMain.innerHTML = html;
        resultSimpleContainer.style.display = 'block';

        // Decimal Form
        const decimalValue = num / den;
        // Limit to 6 decimal places but trim trailing zeros
        resultDecimal.textContent = parseFloat(decimalValue.toFixed(6)).toString();
        resultDecimalContainer.style.display = 'block';

        // Mixed Number Form
        if (Math.abs(num) > Math.abs(den) && den !== 1 && num !== 0) {
            const wholeNum = Math.floor(Math.abs(num) / den) * Math.sign(num);
            const remainderNum = Math.abs(num) % den;
            resultMixed.innerHTML = `
                <span>${wholeNum}</span>
                <div style="display: flex; flex-direction: column; align-items: center; font-size: 18px;">
                    <span>${remainderNum}</span>
                    <hr style="border: 0; border-top: 2px solid var(--btn-operator-color); width: 100%; margin: 2px 0;">
                    <span>${den}</span>
                </div>
            `;
            resultMixedContainer.style.display = 'block';
        } else {
            resultMixedContainer.style.display = 'none';
        }

        resultBox.classList.add('active');
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        resultBox.classList.remove('active');
    }

    clearBtn.addEventListener('click', () => {
        num1Input.value = '';
        den1Input.value = '';
        num2Input.value = '';
        den2Input.value = '';
        decIn.value = '';
        operatorSelect.value = '+';
        block1.style.display = 'flex';
        block2.style.display = 'flex';
        blockDec.style.display = 'none';
        errorMsg.style.display = 'none';
        resultBox.classList.remove('active');
    });
});
