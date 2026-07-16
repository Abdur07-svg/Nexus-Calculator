document.addEventListener('DOMContentLoaded', () => {
    // --- Standard Ohm's Law ---
    const valV = document.getElementById('ohm-v');
    const unitV = document.getElementById('ohm-v-unit');
    const valI = document.getElementById('ohm-i');
    const unitI = document.getElementById('ohm-i-unit');
    const valR = document.getElementById('ohm-r');
    const unitR = document.getElementById('ohm-r-unit');
    const valP = document.getElementById('ohm-p');
    const unitP = document.getElementById('ohm-p-unit');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');

    const mult = {
        V: 1, mV: 0.001, kV: 1000,
        A: 1, mA: 0.001, kA: 1000,
        'Ω': 1, 'mΩ': 0.001, 'kΩ': 1000, 'MΩ': 1000000,
        W: 1, mW: 0.001, kW: 1000
    };

    function showError(msg) {
        if(errorMsg) {
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            errorMsg.style.display = 'block';
        }
    }

    function highlightInput(input) {
        input.style.borderColor = '#4caf50';
        input.style.color = '#4caf50';
        setTimeout(() => {
            input.style.borderColor = 'rgba(255,255,255,0.1)';
            input.style.color = 'var(--text-primary)';
        }, 1500);
    }

    function calculateOhmsLaw() {
        if(errorMsg) errorMsg.style.display = 'none';
        
        const strV = valV.value.trim();
        const strI = valI.value.trim();
        const strR = valR.value.trim();
        const strP = valP.value.trim();
        
        let v = strV !== '' ? parseFloat(strV) * mult[unitV.value] : null;
        let i = strI !== '' ? parseFloat(strI) * mult[unitI.value] : null;
        let r = strR !== '' ? parseFloat(strR) * mult[unitR.value] : null;
        let p = strP !== '' ? parseFloat(strP) * mult[unitP.value] : null;
        
        let inputsProvided = 0;
        if(v !== null) inputsProvided++;
        if(i !== null) inputsProvided++;
        if(r !== null) inputsProvided++;
        if(p !== null) inputsProvided++;
        
        if (inputsProvided !== 2) {
            showError('Please enter exactly TWO values to calculate the others.');
            return;
        }

        // Logic based on which two are provided
        if (v !== null && i !== null) {
            r = v / i;
            p = v * i;
            valR.value = parseFloat((r / mult[unitR.value]).toFixed(4));
            valP.value = parseFloat((p / mult[unitP.value]).toFixed(4));
            highlightInput(valR);
            highlightInput(valP);
        } else if (v !== null && r !== null) {
            i = v / r;
            p = (v * v) / r;
            valI.value = parseFloat((i / mult[unitI.value]).toFixed(4));
            valP.value = parseFloat((p / mult[unitP.value]).toFixed(4));
            highlightInput(valI);
            highlightInput(valP);
        } else if (v !== null && p !== null) {
            i = p / v;
            r = (v * v) / p;
            valI.value = parseFloat((i / mult[unitI.value]).toFixed(4));
            valR.value = parseFloat((r / mult[unitR.value]).toFixed(4));
            highlightInput(valI);
            highlightInput(valR);
        } else if (i !== null && r !== null) {
            v = i * r;
            p = i * i * r;
            valV.value = parseFloat((v / mult[unitV.value]).toFixed(4));
            valP.value = parseFloat((p / mult[unitP.value]).toFixed(4));
            highlightInput(valV);
            highlightInput(valP);
        } else if (i !== null && p !== null) {
            v = p / i;
            r = p / (i * i);
            valV.value = parseFloat((v / mult[unitV.value]).toFixed(4));
            valR.value = parseFloat((r / mult[unitR.value]).toFixed(4));
            highlightInput(valV);
            highlightInput(valR);
        } else if (r !== null && p !== null) {
            v = Math.sqrt(p * r);
            i = Math.sqrt(p / r);
            valV.value = parseFloat((v / mult[unitV.value]).toFixed(4));
            valI.value = parseFloat((i / mult[unitI.value]).toFixed(4));
            highlightInput(valV);
            highlightInput(valI);
        }
    }

    calcBtn.addEventListener('click', calculateOhmsLaw);

    clearBtn.addEventListener('click', () => {
        valV.value = '';
        valI.value = '';
        valR.value = '';
        valP.value = '';
        if(errorMsg) errorMsg.style.display = 'none';
        
        [valV, valI, valR, valP].forEach(el => {
            el.style.borderColor = 'rgba(255,255,255,0.1)';
            el.style.color = 'var(--text-primary)';
        });
    });

    // --- Anisotropic Materials Ohm's Law ---
    const aniE = document.getElementById('ani-e');
    const unitAniE = document.getElementById('ani-e-unit');
    const aniJ = document.getElementById('ani-j');
    const unitAniJ = document.getElementById('ani-j-unit');
    const aniR = document.getElementById('ani-r');
    const unitAniR = document.getElementById('ani-r-unit');
    
    const aniCalcBtn = document.getElementById('ani-calc-btn');
    const aniClearBtn = document.getElementById('ani-clear-btn');
    const aniErrorMsg = document.getElementById('ani-error-msg');

    const aniMult = {
        'V/m': 1, 'V/cm': 100,
        'A/m2': 1, 'A/cm2': 10000,
        'ohm-m': 1, 'ohm-cm': 0.01
    };

    function showAniError(msg) {
        if(aniErrorMsg) {
            aniErrorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            aniErrorMsg.style.display = 'block';
        }
    }

    aniCalcBtn.addEventListener('click', () => {
        if(aniErrorMsg) aniErrorMsg.style.display = 'none';
        
        const strE = aniE.value.trim();
        const strJ = aniJ.value.trim();
        const strR = aniR.value.trim();
        
        let e = strE !== '' ? parseFloat(strE) * aniMult[unitAniE.value] : null;
        let j = strJ !== '' ? parseFloat(strJ) * aniMult[unitAniJ.value] : null;
        let r = strR !== '' ? parseFloat(strR) * aniMult[unitAniR.value] : null;
        
        let inputs = 0;
        if(e !== null) inputs++;
        if(j !== null) inputs++;
        if(r !== null) inputs++;
        
        if (inputs !== 2) {
            showAniError('Please enter exactly TWO values.');
            return;
        }

        // Formula: E = ρ × J => e = r * j
        if (e !== null && j !== null) {
            r = e / j;
            aniR.value = parseFloat((r / aniMult[unitAniR.value]).toFixed(6));
            highlightInput(aniR);
        } else if (e !== null && r !== null) {
            j = e / r;
            aniJ.value = parseFloat((j / aniMult[unitAniJ.value]).toFixed(6));
            highlightInput(aniJ);
        } else if (j !== null && r !== null) {
            e = j * r;
            aniE.value = parseFloat((e / aniMult[unitAniE.value]).toFixed(6));
            highlightInput(aniE);
        }
    });

    aniClearBtn.addEventListener('click', () => {
        aniE.value = '';
        aniJ.value = '';
        aniR.value = '';
        if(aniErrorMsg) aniErrorMsg.style.display = 'none';
        [aniE, aniJ, aniR].forEach(el => {
            el.style.borderColor = 'rgba(255,255,255,0.1)';
            el.style.color = 'var(--text-primary)';
        });
    });
});
