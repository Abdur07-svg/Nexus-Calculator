document.addEventListener('DOMContentLoaded', () => {
    const widthInput = document.getElementById('width');
    const widthUnit = document.getElementById('width-unit');
    const ratioInput = document.getElementById('ratio');
    const diameterInput = document.getElementById('diameter');
    const diamUnit = document.getElementById('diam-unit');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        let w = parseFloat(widthInput.value);
        const r = parseFloat(ratioInput.value);
        let d = parseFloat(diameterInput.value);

        if (isNaN(w) || isNaN(r) || isNaN(d) || w <= 0 || r <= 0 || d <= 0) {
            errorMsg.textContent = 'Please enter valid numbers for width, ratio, and diameter.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        // Convert width to mm if inches
        if (widthUnit.value === 'in') w = w * 25.4;
        
        // Convert diam to inches if mm
        if (diamUnit.value === 'mm') d = d / 25.4;

        const sidewall_mm = w * (r / 100);
        const sidewall_in = sidewall_mm / 25.4;
        
        const total_diam_in = (sidewall_in * 2) + d;
        const total_diam_mm = total_diam_in * 25.4;
        
        const circum_in = total_diam_in * Math.PI;
        const circum_mm = total_diam_mm * Math.PI;

        const revs_per_km = 1000000 / circum_mm;

        let tableRows = `
            <tr>
                <th style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-secondary); font-weight: 500; width: 60%;">Sidewall Height</th>
                <td style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); font-weight: 600;">${sidewall_in.toFixed(2)} in <br><span style="font-size:12px; font-weight:400;">(${sidewall_mm.toFixed(1)} mm)</span></td>
            </tr>
            <tr>
                <th style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-secondary); font-weight: 500;">Tire Diameter</th>
                <td style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); font-weight: 600; color: var(--btn-operator-color);">${total_diam_in.toFixed(2)} in <br><span style="font-size:12px; font-weight:400; color: var(--text-primary);">(${total_diam_mm.toFixed(1)} mm)</span></td>
            </tr>
            <tr>
                <th style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-secondary); font-weight: 500;">Circumference</th>
                <td style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); font-weight: 600;">${circum_in.toFixed(2)} in <br><span style="font-size:12px; font-weight:400;">(${circum_mm.toFixed(1)} mm)</span></td>
            </tr>
            <tr>
                <th style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); color: var(--text-secondary); font-weight: 500;">Revolutions</th>
                <td style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); font-weight: 600;">${Math.round(revs_per_km)} <span style="font-size: 14px; font-weight: 500; color: var(--text-secondary);">revs/km</span></td>
            </tr>
        `;

        detailedRes.innerHTML = `
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 15px;">
                ${tableRows}
            </table>
        `;
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        widthInput.value = '';
        ratioInput.value = '';
        diameterInput.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
