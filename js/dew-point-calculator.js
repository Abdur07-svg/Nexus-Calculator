document.addEventListener('DOMContentLoaded', () => {
    const tempInput = document.getElementById('temp');
    const unitTemp = document.getElementById('unit-temp');
    const humidityInput = document.getElementById('humidity');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultDew = document.getElementById('result-dew');
    const resultComfort = document.getElementById('result-comfort');
    
    const resVp = document.getElementById('res-vp');
    const resSvp = document.getElementById('res-svp');
    const resAh = document.getElementById('res-ah');
    const resMvc = document.getElementById('res-mvc');
    const resMwc = document.getElementById('res-mwc');

    const errorMsg = document.getElementById('error-msg');

    calcBtn.addEventListener('click', () => {
        const t = parseFloat(tempInput.value);
        const rh = parseFloat(humidityInput.value);
        const isF = unitTemp.value === 'f';

        if (isNaN(t) || isNaN(rh) || rh < 0 || rh > 100) {
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        // Convert Temp to Celsius for Magnus-Tetens formula
        let tempC = isF ? (t - 32) * 5/9 : t;

        // Magnus-Tetens constants
        const a = 17.27;
        const b = 237.7;
        
        // If RH is 0, log is negative infinity, handle gracefully (though physically RH=0 is impossible on earth, mathematically we cap it)
        const rhVal = rh <= 0 ? 0.1 : rh;

        const alpha = ((a * tempC) / (b + tempC)) + Math.log(rhVal / 100.0);
        let dewPointC = (b * alpha) / (a - alpha);

        // Convert back if needed
        let dewPointResult = isF ? (dewPointC * 9/5) + 32 : dewPointC;
        let dewPointK = dewPointC + 273.15;
        
        resultDew.textContent = `${dewPointResult.toFixed(1)} °${isF ? 'F' : 'C'} / ${dewPointK.toFixed(1)} K`;

        // Calculate detailed properties
        // 1. Saturation Vapor Pressure (Pa) using Buck equation (more accurate)
        const svpPa = 611.21 * Math.exp((18.678 - tempC / 234.5) * (tempC / (257.14 + tempC)));
        // 2. Actual Vapor Pressure (Pa)
        const vpPa = svpPa * (rhVal / 100);
        // 3. Absolute Humidity (g/m3)
        const tempK = tempC + 273.15;
        const absHumidity = (vpPa * 2.16679) / tempK;
        
        // 4. Concentrations
        const atmPressurePa = 101325; // standard atm
        const volConcPpm = (vpPa / atmPressurePa) * 1000000;
        const volConcPct = (vpPa / atmPressurePa) * 100;
        
        // Using specific humidity formula for Weight Concentration to match standard outputs
        const weightConcPpm = volConcPpm * 0.62198;
        const weightConcPct = weightConcPpm / 10000;

        resVp.textContent = `${vpPa.toFixed(2)} Pa`;
        resSvp.textContent = `${svpPa.toFixed(2)} Pa`;
        resAh.textContent = `${absHumidity.toFixed(2)} g/m³`;
        resMvc.textContent = `${Math.round(volConcPpm).toLocaleString()} ppm (${volConcPct.toFixed(2)}%)`;
        resMwc.textContent = `${Math.round(weightConcPpm).toLocaleString()} ppm (${weightConcPct.toFixed(2)}%)`;

        // Comfort level (based on Fahrenheit Dew Point)
        let dpF = isF ? dewPointResult : (dewPointResult * 9/5) + 32;
        let comfort = "";
        
        if (dpF < 50) comfort = "Very Dry";
        else if (dpF >= 50 && dpF < 60) comfort = "Comfortable";
        else if (dpF >= 60 && dpF < 65) comfort = "Slightly Humid / Sticky";
        else if (dpF >= 65 && dpF < 70) comfort = "Very Humid / Uncomfortable";
        else comfort = "Oppressive / Dangerous";

        resultComfort.textContent = comfort;
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        tempInput.value = '';
        humidityInput.value = '';
        unitTemp.value = 'f';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
