document.addEventListener('DOMContentLoaded', () => {
    const minInput = document.getElementById('val-min');
    const maxInput = document.getElementById('val-max');
    const qtyInput = document.getElementById('val-qty');
    const allowDup = document.getElementById('allow-dup');

    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultNumbers = document.getElementById('result-numbers');
    const errorMsg = document.getElementById('error-msg');

    function generateRandomNumbers() {
        const min = parseInt(minInput.value);
        const max = parseInt(maxInput.value);
        const qty = parseInt(qtyInput.value);
        const allow = allowDup.checked;

        try {
            if (isNaN(min) || isNaN(max) || isNaN(qty)) throw "Please enter valid numbers.";
            if (min >= max) throw "Lower limit must be less than upper limit.";
            if (qty < 1) throw "Quantity must be at least 1.";
            if (qty > 10000) throw "Quantity is too large. Maximum is 10000.";

            const range = max - min + 1;
            
            if (!allow && qty > range) {
                throw `Cannot generate ${qty} unique numbers between ${min} and ${max}. Range is only ${range}.`;
            }

            errorMsg.style.display = 'none';

            let numbers = [];

            if (allow) {
                for (let i = 0; i < qty; i++) {
                    numbers.push(Math.floor(Math.random() * range) + min);
                }
            } else {
                // Generate unique numbers
                if (qty > range / 2) {
                    // Optimization: if we need more than half the range, generate all and shuffle, then slice
                    let allNums = [];
                    for(let i = min; i <= max; i++) allNums.push(i);
                    
                    // Fisher-Yates shuffle
                    for (let i = allNums.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [allNums[i], allNums[j]] = [allNums[j], allNums[i]];
                    }
                    numbers = allNums.slice(0, qty);
                } else {
                    // Using a Set is faster for sparse selection
                    let set = new Set();
                    while(set.size < qty) {
                        set.add(Math.floor(Math.random() * range) + min);
                    }
                    numbers = Array.from(set);
                }
            }

            resultNumbers.textContent = numbers.join(', ');
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

    calcBtn.addEventListener('click', generateRandomNumbers);

    clearBtn.addEventListener('click', () => {
        minInput.value = '1';
        maxInput.value = '100';
        qtyInput.value = '1';
        allowDup.checked = true;
        
        errorMsg.style.display = 'none';
        resultBox.classList.remove('active');
        minInput.focus();
    });

    [minInput, maxInput, qtyInput].forEach(input => {
        input.addEventListener('input', () => {
            errorMsg.style.display = 'none';
        });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                generateRandomNumbers();
            }
        });
    });
});
