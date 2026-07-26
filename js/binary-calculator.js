document.addEventListener('DOMContentLoaded', () => {
    const calcMode = document.getElementById('calc-mode');
    const sectionArithmetic = document.getElementById('section-arithmetic');
    const sectionConverter = document.getElementById('section-converter');
    
    // Arithmetic inputs
    const val1Input = document.getElementById('val-1');
    const val2Input = document.getElementById('val-2');
    const operationSelect = document.getElementById('operation');
    
    // Converter inputs
    const converterLabel = document.getElementById('converter-label');
    const valConvert = document.getElementById('val-convert');

    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultPrimary = document.getElementById('result-primary');
    const labelPrimary = document.getElementById('label-primary');
    const resultSecondary = document.getElementById('result-secondary');
    const labelSecondary = document.getElementById('label-secondary');
    const errorMsg = document.getElementById('error-msg');

    // Switch modes
    calcMode.addEventListener('change', () => {
        const mode = calcMode.value;
        if (mode === 'arithmetic') {
            sectionArithmetic.classList.add('active');
            sectionConverter.classList.remove('active');
        } else {
            sectionArithmetic.classList.remove('active');
            sectionConverter.classList.add('active');
            
            if (mode === 'bin2dec') {
                converterLabel.textContent = "Binary Value";
                valConvert.placeholder = "e.g. 1010";
            } else {
                converterLabel.textContent = "Decimal Value";
                valConvert.placeholder = "e.g. 10";
            }
        }
        
        // Reset states
        errorMsg.style.display = 'none';
        resultBox.classList.remove('active');
        valConvert.value = '';
    });

    // Restrict input
    function restrictBinary(e) {
        const char = String.fromCharCode(e.which);
        if (!(/[01]/.test(char))) {
            e.preventDefault();
        }
    }

    function restrictDecimal(e) {
        const char = String.fromCharCode(e.which);
        if (!(/[0-9\.\-]/.test(char))) {
            e.preventDefault();
        }
    }

    val1Input.addEventListener('keypress', restrictBinary);
    val2Input.addEventListener('keypress', restrictBinary);

    valConvert.addEventListener('keypress', (e) => {
        if (calcMode.value === 'bin2dec') {
            restrictBinary(e);
        } else {
            restrictDecimal(e);
        }
    });

    function calculateBinary() {
        const mode = calcMode.value;
        errorMsg.style.display = 'none';

        try {
            if (mode === 'arithmetic') {
                const val1Str = val1Input.value.trim();
                const val2Str = val2Input.value.trim();
                const op = operationSelect.value;

                if (!val1Str || !val2Str) throw "Please enter values in both fields.";
                if (!/^[01]+$/.test(val1Str) || !/^[01]+$/.test(val2Str)) throw "Invalid characters. Only 0s and 1s allowed.";

                const num1 = parseInt(val1Str, 2);
                const num2 = parseInt(val2Str, 2);

                let decimalResult = 0;
                switch (op) {
                    case '+': decimalResult = num1 + num2; break;
                    case '-': decimalResult = num1 - num2; break;
                    case '*': decimalResult = num1 * num2; break;
                    case '/': 
                        if (num2 === 0) throw "Cannot divide by zero.";
                        decimalResult = num1 / num2; 
                        break;
                }

                if (!isFinite(decimalResult)) throw "Result is too large or undefined.";

                labelPrimary.textContent = "Binary Result";
                labelSecondary.textContent = "Decimal Result";
                resultPrimary.textContent = decimalToBinaryString(decimalResult);
                resultSecondary.textContent = decimalResult.toString();

            } else if (mode === 'bin2dec') {
                const valStr = valConvert.value.trim();
                if (!valStr) throw "Please enter a binary value.";
                if (!/^[01]+$/.test(valStr)) throw "Invalid characters. Only 0s and 1s allowed.";

                const decimalResult = parseInt(valStr, 2);

                labelPrimary.textContent = "Decimal Result";
                labelSecondary.textContent = "Binary Value";
                resultPrimary.textContent = decimalResult.toString();
                resultSecondary.textContent = valStr;

            } else if (mode === 'dec2bin') {
                const valStr = valConvert.value.trim();
                if (!valStr) throw "Please enter a decimal value.";
                
                const decimalResult = parseFloat(valStr);
                if (isNaN(decimalResult)) throw "Please enter a valid decimal number.";

                labelPrimary.textContent = "Binary Result";
                labelSecondary.textContent = "Decimal Value";
                resultPrimary.textContent = decimalToBinaryString(decimalResult);
                resultSecondary.textContent = decimalResult.toString();
            }
            
            resultBox.classList.add('active');
            
        } catch (err) {
            showError(err);
        }
    }

    function decimalToBinaryString(decimalResult) {
        if (Number.isInteger(decimalResult)) {
            if (decimalResult < 0) {
                return '-' + Math.abs(decimalResult).toString(2);
            } else {
                return decimalResult.toString(2);
            }
        } else {
            const intPart = Math.trunc(decimalResult);
            let fracPart = Math.abs(decimalResult - intPart);
            let binaryResultStr = (intPart < 0 ? '-' : '') + Math.abs(intPart).toString(2) + '.';
            
            let fracBits = '';
            for(let i=0; i<10; i++) {
                fracPart *= 2;
                const bit = Math.trunc(fracPart);
                fracBits += bit;
                fracPart -= bit;
                if(fracPart === 0) break;
            }
            return binaryResultStr + fracBits;
        }
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        resultBox.classList.remove('active');
    }

    calcBtn.addEventListener('click', calculateBinary);

    clearBtn.addEventListener('click', () => {
        val1Input.value = '';
        val2Input.value = '';
        valConvert.value = '';
        errorMsg.style.display = 'none';
        resultBox.classList.remove('active');
        
        if (calcMode.value === 'arithmetic') {
            val1Input.focus();
        } else {
            valConvert.focus();
        }
    });

    [val1Input, val2Input, valConvert, operationSelect, calcMode].forEach(input => {
        input.addEventListener('input', () => {
            errorMsg.style.display = 'none';
        });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateBinary();
            }
        });
    });
});
