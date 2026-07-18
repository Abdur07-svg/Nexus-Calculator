document.addEventListener('DOMContentLoaded', () => {
    const underbustInput = document.getElementById('underbust');
    const bustInput = document.getElementById('bust');
    const unitSelect = document.getElementById('unit');
    const unitSync = document.getElementById('unit-sync');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');

    // Sync the two unit selects
    unitSelect.addEventListener('change', () => {
        unitSync.value = unitSelect.value;
    });
    unitSync.addEventListener('change', () => {
        unitSelect.value = unitSync.value;
    });

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        
        let underbust = parseFloat(underbustInput.value);
        let bust = parseFloat(bustInput.value);

        if (isNaN(underbust) || isNaN(bust) || underbust <= 0 || bust <= 0) {
            errorMsg.textContent = 'Please enter valid positive measurements.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        if (bust < underbust) {
            errorMsg.textContent = 'Bust measurement is usually larger than underbust.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        // Get both cm and inches
        let underbustIn = underbust;
        let bustIn = bust;
        let underbustCm = underbust;
        let bustCm = bust;

        if (unitSelect.value === 'cm') {
            underbustIn = underbust / 2.54;
            bustIn = bust / 2.54;
        } else {
            underbustCm = underbust * 2.54;
            bustCm = bust * 2.54;
        }

        // --- US / UK Sizing ---
        let usBand = Math.round(underbustIn);
        if (usBand % 2 !== 0) {
            usBand += 1;
        }
        
        const diffIn = Math.round(bustIn) - usBand;
        const usCups = ["AA", "A", "B", "C", "D", "DD/E", "DDD/F", "G", "H", "I", "J", "K"];
        const ukCups = ["AA", "A", "B", "C", "D", "DD", "E", "F", "FF", "G", "GG", "H"];
        
        let usCup = diffIn < 0 ? "AA" : (diffIn < usCups.length ? usCups[diffIn] : "L+");
        let ukCup = diffIn < 0 ? "AA" : (diffIn < ukCups.length ? ukCups[diffIn] : "L+");

        // --- EU Sizing Conversion ---
        // EU Band corresponds to US Band (US 32 = EU 70, US 34 = EU 75, etc.)
        let euBand = Math.round(((usBand - 32) / 2) * 5 + 70);
        
        const euCups = ["AA", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
        let euCup = diffIn < 0 ? "AA" : (diffIn < euCups.length ? euCups[diffIn] : "L+");

        detailedRes.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 10px; text-align: center;">
                <div style="background: rgba(255,255,255,0.5); padding: 15px 5px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05);">
                    <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 5px; font-weight: 500;">US Size</div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--btn-operator-color);">${usBand}${usCup}</div>
                </div>
                
                <div style="background: rgba(255,255,255,0.5); padding: 15px 5px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05);">
                    <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 5px; font-weight: 500;">UK Size</div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--text-primary);">${usBand}${ukCup}</div>
                </div>
                
                <div style="background: rgba(255,255,255,0.5); padding: 15px 5px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05);">
                    <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 5px; font-weight: 500;">EU Size</div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--text-primary);">${euBand}${euCup}</div>
                </div>
            </div>
            
            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 15px; font-style: italic;">
                Note: Sizing standards vary heavily by brand. Use these as a starting point.
            </div>
        `;

        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        underbustInput.value = '';
        bustInput.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
