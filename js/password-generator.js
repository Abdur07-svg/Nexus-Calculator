document.addEventListener('DOMContentLoaded', () => {
    const lengthInput = document.getElementById('length');
    const lengthSlider = document.getElementById('length-slider');
    const uppercaseCb = document.getElementById('uppercase');
    const lowercaseCb = document.getElementById('lowercase');
    const numbersCb = document.getElementById('numbers');
    const symbolsCb = document.getElementById('symbols');
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');

    function showError(msg) {
        if(errorMsg) {
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            errorMsg.style.display = 'block';
        } else {
            alert(msg);
        }
    }
    const passwordDisplay = document.getElementById('password-display');
    const copyBtn = document.getElementById('copy-btn');

    const chars = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    lengthSlider.addEventListener('input', () => {
        lengthInput.value = lengthSlider.value;
    });

    lengthInput.addEventListener('input', () => {
        let val = parseInt(lengthInput.value);
        if (val < 4) val = 4;
        if (val > 32) val = 32;
        lengthSlider.value = val;
    });

    function generatePassword() {
        let charPool = '';
        if (uppercaseCb.checked) charPool += chars.uppercase;
        if (lowercaseCb.checked) charPool += chars.lowercase;
        if (numbersCb.checked) charPool += chars.numbers;
        if (symbolsCb.checked) charPool += chars.symbols;

        if (charPool === '') {
            showError('Please select at least one character type.');
            return;
        }

        let password = '';
        const length = parseInt(lengthInput.value);
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charPool.length);
            password += charPool[randomIndex];
        }

        passwordDisplay.textContent = password;
        passwordDisplay.style.color = 'var(--text-primary)';
    }

    function clearData() {
        lengthInput.value = 12;
        lengthSlider.value = 12;
        uppercaseCb.checked = true;
        lowercaseCb.checked = true;
        numbersCb.checked = true;
        symbolsCb.checked = true;
        passwordDisplay.textContent = 'Click Generate';
        passwordDisplay.style.color = 'var(--btn-operator-color)';
    }

    copyBtn.addEventListener('click', () => {
        const textToCopy = passwordDisplay.textContent;
        if (textToCopy === 'Click Generate') return;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const icon = copyBtn.querySelector('i');
            icon.className = 'fa-solid fa-check';
            setTimeout(() => {
                icon.className = 'fa-regular fa-copy';
            }, 2000);
        });
    });

    generateBtn.addEventListener('click', generatePassword);
    clearBtn.addEventListener('click', clearData);
});
