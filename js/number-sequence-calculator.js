document.addEventListener('DOMContentLoaded', () => {
    const seqType = document.getElementById('seq-type');
    const inputsStandard = document.getElementById('inputs-standard');
    const labelD = document.getElementById('label-d');
    
    const valA = document.getElementById('val-a');
    const valD = document.getElementById('val-d');
    const valN = document.getElementById('val-n');

    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultSequence = document.getElementById('result-sequence');
    const resultSum = document.getElementById('result-sum');
    const errorMsg = document.getElementById('error-msg');

    seqType.addEventListener('change', () => {
        const type = seqType.value;
        if (type === 'fibonacci') {
            inputsStandard.classList.remove('active');
        } else {
            inputsStandard.classList.add('active');
            if (type === 'arithmetic') {
                labelD.textContent = 'Common Difference (d)';
            } else {
                labelD.textContent = 'Common Ratio (r)';
            }
        }
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });

    function calculateSequence() {
        const type = seqType.value;
        const n = parseInt(valN.value);

        try {
            if (isNaN(n) || n < 1) throw "Please enter a valid positive number for terms (n).";
            if (n > 5000) throw "Number of terms is too large. Maximum is 5000.";

            let sequence = [];
            let sum = 0;

            if (type === 'fibonacci') {
                if (n === 1) {
                    sequence = [0];
                    sum = 0;
                } else if (n >= 2) {
                    sequence = [0, 1];
                    sum = 1;
                    for (let i = 2; i < n; i++) {
                        const next = sequence[i - 1] + sequence[i - 2];
                        if(!isFinite(next)) throw "Values exceeded maximum allowed size.";
                        sequence.push(next);
                        sum += next;
                    }
                }
            } else {
                const a = parseFloat(valA.value);
                const d = parseFloat(valD.value);
                
                if (isNaN(a) || isNaN(d)) throw "Please enter valid numbers for Start Value and Difference/Ratio.";

                for (let i = 0; i < n; i++) {
                    let term = 0;
                    if (type === 'arithmetic') {
                        term = a + (i * d);
                    } else if (type === 'geometric') {
                        term = a * Math.pow(d, i);
                    }
                    if(!isFinite(term)) throw "Values exceeded maximum allowed size.";
                    
                    sequence.push(term);
                    sum += term;
                }
            }

            errorMsg.style.display = 'none';

            // Format sequence
            const formattedSeq = sequence.map(num => formatNumber(num)).join(', ');
            resultSequence.textContent = formattedSeq;
            resultSum.textContent = formatNumber(sum);
            
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
        // Check if scientific notation is needed for huge numbers
        if (Math.abs(num) > 1e15) {
            return num.toExponential(4);
        }
        return num.toFixed(4).replace(/\.?0+$/, ''); 
    }

    calcBtn.addEventListener('click', calculateSequence);

    clearBtn.addEventListener('click', () => {
        valA.value = '';
        valD.value = '';
        valN.value = '';
        errorMsg.style.display = 'none';
        resultBox.classList.remove('active');
        if(inputsStandard.classList.contains('active')) {
            valA.focus();
        } else {
            valN.focus();
        }
    });

    [valA, valD, valN].forEach(input => {
        input.addEventListener('input', () => {
            errorMsg.style.display = 'none';
        });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateSequence();
            }
        });
    });
});
