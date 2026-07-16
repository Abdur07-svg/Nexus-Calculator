document.addEventListener('DOMContentLoaded', () => {
    const vdMaterial = document.getElementById('vd-material');
    const vdPhase = document.getElementById('vd-phase');
    const vdAwg = document.getElementById('vd-awg');
    const vdVoltage = document.getElementById('vd-voltage');
    const vdAmps = document.getElementById('vd-amps');
    const vdDist = document.getElementById('vd-dist');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    
    const resultBox = document.getElementById('result-box');
    const resDrop = document.getElementById('res-drop');
    const resPercent = document.getElementById('res-percent');
    const resEnd = document.getElementById('res-end');

    function showError(msg) {
        if(errorMsg) {
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            errorMsg.style.display = 'block';
        }
    }

    // Resistance in Ohms per 1000ft (approx NEC Ch9 Table 8, stranded)
    const resistance = {
        copper: {
            '14': 3.14,
            '12': 1.98,
            '10': 1.24,
            '8': 0.778,
            '6': 0.491,
            '4': 0.308,
            '3': 0.245,
            '2': 0.194,
            '1': 0.154,
            '1/0': 0.122,
            '2/0': 0.0967,
            '3/0': 0.0766,
            '4/0': 0.0608
        },
        aluminum: {
            '14': 5.17,
            '12': 3.25,
            '10': 2.04,
            '8': 1.28,
            '6': 0.808,
            '4': 0.508,
            '3': 0.403,
            '2': 0.319,
            '1': 0.253,
            '1/0': 0.201,
            '2/0': 0.159,
            '3/0': 0.126,
            '4/0': 0.100
        }
    };

    function calculate() {
        if(errorMsg) errorMsg.style.display = 'none';
        
        const v = parseFloat(vdVoltage.value);
        const a = parseFloat(vdAmps.value);
        const d = parseFloat(vdDist.value);
        
        if (isNaN(v) || isNaN(a) || isNaN(d) || v <= 0 || a < 0 || d < 0) {
            showError('Please enter valid numeric values for Voltage, Current, and Distance.');
            return;
        }
        
        const mat = vdMaterial.value;
        const phase = parseInt(vdPhase.value);
        const awg = vdAwg.value;
        
        const rPer1000 = resistance[mat][awg];
        
        // Voltage Drop Formula
        // Single Phase: 2 * R * L * I / 1000
        // Three Phase: sqrt(3) * R * L * I / 1000
        const multiplier = (phase === 1) ? 2 : 1.732;
        
        const vDrop = (multiplier * rPer1000 * d * a) / 1000;
        const vDropPercent = (vDrop / v) * 100;
        const vEnd = v - vDrop;
        
        resDrop.textContent = `${vDrop.toFixed(2)} V`;
        resPercent.textContent = `${vDropPercent.toFixed(2)} %`;
        resEnd.textContent = `${vEnd.toFixed(2)} V`;
        
        if (vDropPercent > 3) {
            resPercent.style.color = '#ff5252'; // Red if > 3% drop
        } else {
            resPercent.style.color = '#4caf50'; // Green if <= 3% drop
        }
        
        resultBox.style.display = 'block';
    }

    calcBtn.addEventListener('click', calculate);

    clearBtn.addEventListener('click', () => {
        vdVoltage.value = '';
        vdAmps.value = '';
        vdDist.value = '';
        if(errorMsg) errorMsg.style.display = 'none';
        resultBox.style.display = 'none';
    });
});
