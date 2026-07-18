document.addEventListener('DOMContentLoaded', () => {
    const tempInput = document.getElementById('temp');
    const tempUnit = document.getElementById('temp-unit');
    const humidityInput = document.getElementById('humidity');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        const temp = parseFloat(tempInput.value);
        const humidity = parseFloat(humidityInput.value);

        if (isNaN(temp) || isNaN(humidity)) {
            errorMsg.textContent = 'Please enter valid numbers.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        if (humidity < 0 || humidity > 100) {
            errorMsg.textContent = 'Relative Humidity must be between 0% and 100%.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        // Convert to Celsius and Fahrenheit
        let tC = temp;
        let tF = temp;
        let tK = temp;

        if (tempUnit.value === 'C') {
            tC = temp;
            tF = (temp * 9/5) + 32;
            tK = temp + 273.15;
        } else if (tempUnit.value === 'F') {
            tC = (temp - 32) * 5/9;
            tF = temp;
            tK = tC + 273.15;
        } else if (tempUnit.value === 'K') {
            tC = temp - 273.15;
            tF = (tC * 9/5) + 32;
            tK = temp;
        }

        // Dew Point Calculation (Magnus formula)
        // Ensure humidity is > 0 to avoid log(0)
        let dewPointC = tC;
        if (humidity > 0) {
            const a = 17.27;
            const b = 237.7;
            const alpha = ((a * tC) / (b + tC)) + Math.log(humidity / 100.0);
            dewPointC = (b * alpha) / (a - alpha);
        } else {
            // Approximation for 0% humidity (very unlikely in reality but handles math error)
            dewPointC = -273.15; 
        }
        const dewPointF = (dewPointC * 9/5) + 32;

        // NOAA Heat Index Calculation
        let hiF = tF;
        if (tF >= 80) {
            hiF = 0.5 * (tF + 61.0 + ((tF - 68.0) * 1.2) + (humidity * 0.094));
            
            if (hiF >= 80) {
                let T = tF;
                let R = humidity;
                hiF = -42.379 + 2.04901523*T + 10.14333127*R - 0.22475541*T*R - 0.00683783*T*T - 0.05481717*R*R + 0.00122874*T*T*R + 0.00085282*T*R*R - 0.00000199*T*T*R*R;
                
                if (R < 13 && T >= 80 && T <= 112) {
                    hiF -= ((13 - R) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
                } else if (R > 85 && T >= 80 && T <= 87) {
                    hiF += ((R - 85) / 10) * ((87 - T) / 5);
                }
            }
        }

        let hiC = (hiF - 32) * 5/9;
        let hiK = hiC + 273.15;

        // Determine warning level based on Heat Index in F
        let warning = "";
        let warnColor = "";
        if (hiF < 80) {
            warning = "Normal";
            warnColor = "#4CAF50";
        } else if (hiF >= 80 && hiF <= 90) {
            warning = "Caution";
            warnColor = "#FFC107";
        } else if (hiF > 90 && hiF <= 103) {
            warning = "Extreme Caution";
            warnColor = "#FF9800";
        } else if (hiF > 103 && hiF <= 124) {
            warning = "Danger";
            warnColor = "#F44336";
        } else {
            warning = "Extreme Danger";
            warnColor = "#D32F2F";
        }

        detailedRes.innerHTML = `
            <div style="display: flex; gap: 20px; text-align: left; margin-bottom: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 140px;">
                    <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Feels Like (Heat Index)</div>
                    <div style="font-size: 28px; font-weight: 700; color: var(--text-primary); margin-bottom: 5px;">
                        ${hiC.toFixed(1)} °C
                    </div>
                    <div style="font-size: 16px; font-weight: 500; color: var(--text-secondary);">
                        ${hiF.toFixed(1)} °F<br>${hiK.toFixed(1)} K
                    </div>
                </div>
                
                <div style="flex: 1; min-width: 140px;">
                    <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Dew Point</div>
                    <div style="font-size: 28px; font-weight: 700; color: var(--btn-operator-color); margin-bottom: 5px;">
                        ${dewPointC.toFixed(1)} °C
                    </div>
                    <div style="font-size: 16px; font-weight: 500; color: var(--text-secondary);">
                        ${dewPointF.toFixed(1)} °F
                    </div>
                </div>
            </div>
            
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px; text-align: left;">Risk Level</div>
            <div style="font-size: 20px; font-weight: 700; color: ${warnColor}; background: ${warnColor}22; padding: 10px; border-radius: 10px;">
                ${warning}
            </div>
        `;

        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        tempInput.value = '';
        humidityInput.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
