document.addEventListener('DOMContentLoaded', () => {
    // Mode Switcher
    const calcMode = document.getElementById('calc-mode');
    const sections = {
        'duration': document.getElementById('section-duration'),
        'add-sub': document.getElementById('section-add-sub'),
        'weekly': document.getElementById('section-weekly'),
        'convert': document.getElementById('section-convert')
    };

    calcMode.addEventListener('change', (e) => {
        for (const [key, section] of Object.entries(sections)) {
            if (key === e.target.value) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        }
    });

    // Duration
    const startTime = document.getElementById('start-time');
    const endTime = document.getElementById('end-time');
    const breakMins = document.getElementById('break-mins');
    
    document.getElementById('calc-duration').addEventListener('click', () => {
        const err = document.getElementById('error-duration');
        const box = document.getElementById('result-duration');
        const det = document.getElementById('detail-duration');
        err.style.display = 'none';
        
        if (!startTime.value || !endTime.value) {
            err.textContent = 'Please enter both Start and End times.';
            err.style.display = 'block'; box.classList.remove('active'); return;
        }

        const [startH, startM] = startTime.value.split(':').map(Number);
        const [endH, endM] = endTime.value.split(':').map(Number);
        let bMins = parseInt(breakMins.value) || 0;
        if (bMins < 0) bMins = 0;

        let startTot = (startH * 60) + startM;
        let endTot = (endH * 60) + endM;
        if (endTot < startTot) endTot += 24 * 60; // crossed midnight

        let diff = endTot - startTot - bMins;
        if (diff < 0) {
            err.textContent = 'Break deduction is larger than total time worked.';
            err.style.display = 'block'; box.classList.remove('active'); return;
        }

        const h = Math.floor(diff / 60);
        const m = diff % 60;
        const dec = diff / 60;

        det.innerHTML = `
            <div style="font-size: 24px; font-weight: 700; color: var(--btn-operator-color); margin-bottom: 5px;">${h}h ${m}m</div>
            <div style="font-size: 14px; color: var(--text-secondary);">${dec.toFixed(2)} hours (decimal)</div>
        `;
        box.classList.add('active');
    });

    document.getElementById('clear-duration').addEventListener('click', () => {
        startTime.value = ''; endTime.value = ''; breakMins.value = '0';
        document.getElementById('result-duration').classList.remove('active');
        document.getElementById('error-duration').style.display = 'none';
    });


    // Add / Sub
    const baseTime = document.getElementById('base-time');
    const opTime = document.getElementById('op-time');
    const addHours = document.getElementById('add-hours');
    const addMins = document.getElementById('add-mins');

    function formatTime12(h, m) {
        const ampm = h >= 12 ? 'PM' : 'AM';
        let h12 = h % 12;
        if (h12 === 0) h12 = 12;
        return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
    }

    document.getElementById('calc-add').addEventListener('click', () => {
        const err = document.getElementById('error-add');
        const box = document.getElementById('result-add');
        const det = document.getElementById('detail-add');
        err.style.display = 'none';

        if (!baseTime.value) {
            err.textContent = 'Please enter a Start Time.';
            err.style.display = 'block'; box.classList.remove('active'); return;
        }

        const [bH, bM] = baseTime.value.split(':').map(Number);
        let inTotalMins = (bH * 60) + bM;

        let extraH = parseInt(addHours.value) || 0;
        let extraM = parseInt(addMins.value) || 0;
        let extraTotal = (extraH * 60) + extraM;

        if (opTime.value === 'add') {
            inTotalMins += extraTotal;
        } else {
            inTotalMins -= extraTotal;
            while(inTotalMins < 0) inTotalMins += 24 * 60;
        }

        // Days elapsed?
        const daysShift = Math.floor(inTotalMins / (24 * 60));
        let shiftStr = '';
        if (opTime.value === 'add' && daysShift > 0) shiftStr = `<br><span style="font-size:12px;">(+${daysShift} day${daysShift>1?'s':''})</span>`;
        if (opTime.value === 'sub' && Math.floor(((bH*60)+bM - extraTotal)/(24*60)) < 0) {
            const shiftD = Math.abs(Math.floor(((bH*60)+bM - extraTotal)/(24*60)));
            shiftStr = `<br><span style="font-size:12px;">(-${shiftD} day${shiftD>1?'s':''})</span>`;
        }

        let finalMins = inTotalMins % (24 * 60);
        let outH = Math.floor(finalMins / 60);
        let outM = finalMins % 60;

        let out24 = `${String(outH).padStart(2,'0')}:${String(outM).padStart(2,'0')}`;
        let out12 = formatTime12(outH, outM);

        det.innerHTML = `
            <div style="font-size: 24px; font-weight: 700; color: var(--btn-operator-color); margin-bottom: 5px;">${out12}${shiftStr}</div>
            <div style="font-size: 14px; color: var(--text-secondary);">${out24} (24-hour)</div>
        `;
        box.classList.add('active');
    });

    document.getElementById('clear-add').addEventListener('click', () => {
        baseTime.value = ''; opTime.value = 'add'; addHours.value = '0'; addMins.value = '0';
        document.getElementById('result-add').classList.remove('active');
        document.getElementById('error-add').style.display = 'none';
    });


    // Weekly
    const weekInputs = document.querySelectorAll('.week-input');
    
    document.getElementById('calc-weekly').addEventListener('click', () => {
        const box = document.getElementById('result-weekly');
        const det = document.getElementById('detail-weekly');
        
        let total = 0;
        weekInputs.forEach(i => {
            total += parseFloat(i.value) || 0;
        });

        const h = Math.floor(total);
        const m = Math.round((total - h) * 60);

        det.innerHTML = `
            <div style="font-size: 24px; font-weight: 700; color: var(--btn-operator-color); margin-bottom: 5px;">${h}h ${m}m</div>
            <div style="font-size: 14px; color: var(--text-secondary);">${total.toFixed(2)} hours (decimal)</div>
        `;
        box.classList.add('active');
    });

    document.getElementById('clear-weekly').addEventListener('click', () => {
        weekInputs.forEach(i => i.value = '0');
        document.getElementById('result-weekly').classList.remove('active');
    });


    // Convert
    const decHours = document.getElementById('decimal-hours');
    
    document.getElementById('calc-convert').addEventListener('click', () => {
        const err = document.getElementById('error-convert');
        const box = document.getElementById('result-convert');
        const det = document.getElementById('detail-convert');
        err.style.display = 'none';

        const val = parseFloat(decHours.value);
        if (isNaN(val) || val < 0) {
            err.textContent = 'Please enter a valid positive number.';
            err.style.display = 'block'; box.classList.remove('active'); return;
        }

        const years = val / (24 * 365);
        const months = val / (24 * 30.436875);
        const weeks = val / (24 * 7);
        const days = val / 24;
        const mins = val * 60;
        const secs = val * 3600;

        const h = Math.floor(val);
        const remMins = (val - h) * 60;
        const m = Math.floor(remMins);
        const s = Math.round((remMins - m) * 60);

        det.innerHTML = `
            <div style="font-size: 24px; font-weight: 700; color: var(--btn-operator-color); margin-bottom: 15px;">
                ${h}h ${m}m ${s}s
            </div>
            
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px; text-align: left;">Equivalent to:</div>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 15px; color: var(--text-primary); text-align: left;">
                <li style="margin-bottom: 5px;"><strong>${years.toFixed(4)}</strong> years</li>
                <li style="margin-bottom: 5px;"><strong>${months.toFixed(3)}</strong> months</li>
                <li style="margin-bottom: 5px;"><strong>${weeks.toFixed(2)}</strong> weeks</li>
                <li style="margin-bottom: 5px;"><strong>${days.toFixed(2)}</strong> days</li>
                <li style="margin-bottom: 5px;"><strong>${mins.toLocaleString(undefined, {maximumFractionDigits: 2})}</strong> minutes</li>
                <li><strong>${secs.toLocaleString(undefined, {maximumFractionDigits: 2})}</strong> seconds</li>
            </ul>
        `;
        box.classList.add('active');
    });

    document.getElementById('clear-convert').addEventListener('click', () => {
        decHours.value = '';
        document.getElementById('result-convert').classList.remove('active');
        document.getElementById('error-convert').style.display = 'none';
    });
});
