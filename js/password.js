document?.addEventListener('DOMContentLoaded', () => {
    const lengthSlider = document.getElementById('password-length');
    const lengthVal = document.getElementById('length-val');
    const chkUpper = document.getElementById('inc-uppercase');
    const chkLower = document.getElementById('inc-lowercase');
    const chkNums = document.getElementById('inc-numbers');
    const chkSyms = document.getElementById('inc-symbols');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const passwordDisplay = document.getElementById('password-display');

    const chars = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    lengthSlider?.addEventListener('input', () => {
        if (lengthVal) lengthVal.value = lengthSlider.value;
    });

    lengthVal?.addEventListener('input', () => {
        let val = parseInt(lengthVal.value);
        if (!isNaN(val) && val >= 4 && val <= 64) {
            if (lengthSlider) lengthSlider.value = val;
        }
    });

    lengthVal?.addEventListener('change', () => {
        let val = parseInt(lengthVal.value);
        if (isNaN(val) || val < 4) val = 4;
        if (val > 64) val = 64;
        if (lengthVal) lengthVal.value = val;
        if (lengthSlider) lengthSlider.value = val;
    });

    function generatePassword() {
        let charset = '';
        if (chkUpper.checked) charset += chars.upper;
        if (chkLower.checked) charset += chars.lower;
        if (chkNums.checked) charset += chars.numbers;
        if (chkSyms.checked) charset += chars.symbols;

        if (charset === '') {
            passwordDisplay.textContent = 'Select at least one option';
            passwordDisplay.style.color = '#ef4444';
            passwordDisplay.style.wordBreak = 'normal';
            passwordDisplay.style.fontSize = '1.1rem';
            passwordDisplay.style.fontFamily = "'Outfit', sans-serif";
            return;
        }

        let password = '';
        const length = parseInt(lengthSlider.value);
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            password += charset[randomValues[i] % charset.length];
        }

        passwordDisplay.textContent = password;
        passwordDisplay.style.color = 'var(--calc-accent)';
        passwordDisplay.style.wordBreak = 'break-all';
        passwordDisplay.style.fontSize = '1.4rem';
        passwordDisplay.style.fontFamily = 'monospace';
    }

    generateBtn?.addEventListener('click', generatePassword);

    copyBtn?.addEventListener('click', () => {
        const text = passwordDisplay.textContent;
        if (text && text !== 'Click generate' && text !== 'Select at least one option') {
            navigator.clipboard.writeText(text).then(() => {
                const originalHtml = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check" style="color: #22c55e;"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = originalHtml;
                }, 1500);
            });
        }
    });

    // Generate on load
    generatePassword();
});


// Global Enter key listener for all input fields to trigger the calculate button
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') return;
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const calculatorDiv = input.closest('.calculator');
                let calcBtn = null;
                if (calculatorDiv) {
                    calcBtn = calculatorDiv.querySelector('button.action-btn, button[id^="calc-"]');
                }
                
                if (!calcBtn) {
                    calcBtn = document.querySelector('button.action-btn, button[id^="calc-"]');
                }
                
                if (calcBtn) {
                    calcBtn.click();
                }
            }
        });
    });
});
