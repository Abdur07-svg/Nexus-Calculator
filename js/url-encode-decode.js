document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    
    const encodeBtn = document.getElementById('encode-btn');
    const decodeBtn = document.getElementById('decode-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    
    const errorMsg = document.getElementById('error-msg');

    encodeBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        const val = inputText.value;
        if (!val.trim()) {
            errorMsg.textContent = 'Please enter some text to encode.';
            errorMsg.style.display = 'block';
            return;
        }
        try {
            // encodeURIComponent encodes most things properly for URLs
            outputText.value = encodeURIComponent(val);
        } catch (e) {
            errorMsg.textContent = 'Failed to encode text.';
            errorMsg.style.display = 'block';
        }
    });

    decodeBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        const val = inputText.value;
        if (!val.trim()) {
            errorMsg.textContent = 'Please enter a URL to decode.';
            errorMsg.style.display = 'block';
            return;
        }
        try {
            outputText.value = decodeURIComponent(val);
        } catch (e) {
            errorMsg.textContent = 'Failed to decode. Ensure the input is a valid URL-encoded string.';
            errorMsg.style.display = 'block';
        }
    });

    copyBtn.addEventListener('click', () => {
        if (!outputText.value) return;
        navigator.clipboard.writeText(outputText.value).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        }).catch(() => {
            errorMsg.textContent = 'Failed to copy to clipboard.';
            errorMsg.style.display = 'block';
        });
    });

    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        errorMsg.style.display = 'none';
    });
});
