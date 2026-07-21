document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode');
    const inputText = document.getElementById('input-text');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    const errorMsg = document.getElementById('error-msg');

    // Unicode-safe encode/decode functions
    function utf8_to_b64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }

    function b64_to_utf8(str) {
        return decodeURIComponent(escape(window.atob(str)));
    }

    calcBtn.addEventListener('click', () => {
        const input = inputText.value;
        const mode = modeSelect.value;
        
        if (!input) {
            errorMsg.textContent = "Please enter some text.";
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        try {
            if (mode === 'encode') {
                resultText.value = utf8_to_b64(input);
            } else {
                resultText.value = b64_to_utf8(input);
            }
            resultBox.classList.add('active');
            copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy'; // Reset copy button text
        } catch (e) {
            errorMsg.textContent = "Error: Invalid input for decoding.";
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
        }
    });

    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });

    copyBtn.addEventListener('click', () => {
        if (!resultText.value) return;
        
        navigator.clipboard.writeText(resultText.value).then(() => {
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            copyBtn.textContent = 'Failed';
        });
    });
});
