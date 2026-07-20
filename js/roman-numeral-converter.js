document.addEventListener('DOMContentLoaded', () => {
    const calcMode = document.getElementById('calc-mode');
    const groupNumber = document.getElementById('group-number');
    const groupRoman = document.getElementById('group-roman');
    const numInput = document.getElementById('num-input');
    const romanInput = document.getElementById('roman-input');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultLabel = document.getElementById('result-label');
    const resultValue = document.getElementById('result-value');
    const errorMsg = document.getElementById('error-msg');

    const romanMap = [
        { value: 1000, symbol: 'M' },
        { value: 900, symbol: 'CM' },
        { value: 500, symbol: 'D' },
        { value: 400, symbol: 'CD' },
        { value: 100, symbol: 'C' },
        { value: 90, symbol: 'XC' },
        { value: 50, symbol: 'L' },
        { value: 40, symbol: 'XL' },
        { value: 10, symbol: 'X' },
        { value: 9, symbol: 'IX' },
        { value: 5, symbol: 'V' },
        { value: 4, symbol: 'IV' },
        { value: 1, symbol: 'I' }
    ];

    const romanCharMap = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    };

    calcMode.addEventListener('change', () => {
        if (calcMode.value === 'to-roman') {
            groupNumber.style.display = 'flex';
            groupRoman.style.display = 'none';
        } else {
            groupNumber.style.display = 'none';
            groupRoman.style.display = 'flex';
        }
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });

    function numberToRoman(num) {
        let result = '';
        for (let i = 0; i < romanMap.length; i++) {
            while (num >= romanMap[i].value) {
                result += romanMap[i].symbol;
                num -= romanMap[i].value;
            }
        }
        return result;
    }

    function romanToNumber(roman) {
        let result = 0;
        for (let i = 0; i < roman.length; i++) {
            const current = romanCharMap[roman[i]];
            const next = romanCharMap[roman[i + 1]];
            
            if (current === undefined) return null; // Invalid character

            if (next && current < next) {
                result -= current;
            } else {
                result += current;
            }
        }
        return result;
    }

    // Basic regex to check valid roman numerals strictly
    function isValidRoman(str) {
        return /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i.test(str);
    }

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        
        if (calcMode.value === 'to-roman') {
            const num = parseInt(numInput.value);
            if (isNaN(num) || num < 1 || num > 3999) {
                errorMsg.textContent = "Please enter a valid number between 1 and 3999.";
                errorMsg.style.display = 'block';
                resultBox.classList.remove('active');
                return;
            }
            resultLabel.textContent = "Roman Numeral";
            resultValue.textContent = numberToRoman(num);
        } else {
            const romanStr = romanInput.value.trim().toUpperCase();
            if (!romanStr || !isValidRoman(romanStr)) {
                errorMsg.textContent = "Please enter a valid Roman Numeral (e.g., XIV, MMXX).";
                errorMsg.style.display = 'block';
                resultBox.classList.remove('active');
                return;
            }
            const numResult = romanToNumber(romanStr);
            if (numResult === null) {
                errorMsg.textContent = "Invalid characters found.";
                errorMsg.style.display = 'block';
                resultBox.classList.remove('active');
                return;
            }
            resultLabel.textContent = "Number";
            resultValue.textContent = numResult;
        }

        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        numInput.value = '';
        romanInput.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
