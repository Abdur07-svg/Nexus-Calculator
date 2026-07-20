document.addEventListener('DOMContentLoaded', () => {
    const tempInput = document.getElementById('temp');
    const unitTemp = document.getElementById('unit-temp');
    const windInput = document.getElementById('wind');
    const unitWind = document.getElementById('unit-wind');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultChill = document.getElementById('result-chill');
    const resultDanger = document.getElementById('result-danger');
    const resHeatloss = document.getElementById('res-heatloss');
    const resFrostbite = document.getElementById('res-frostbite');
    const errorMsg = document.getElementById('error-msg');

    calcBtn.addEventListener('click', () => {
        const t = parseFloat(tempInput.value);
        const v = parseFloat(windInput.value);
        const isF = unitTemp.value === 'f';
        const isMph = unitWind.value === 'mph';

        if (isNaN(t) || isNaN(v) || v < 0) {
            errorMsg.textContent = "Please enter valid numbers.";
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        // Convert everything to F and mph for validation and calculation if needed, 
        // or use native metric formula.
        
        let tempF = t;
        let windMph = v;
        
        if (!isF) tempF = (t * 9/5) + 32;
        if (!isMph) windMph = v / 1.60934;

        // Wind chill is only valid for temps <= 50F and wind > 3mph
        if (tempF > 50 || windMph <= 3) {
            errorMsg.textContent = "Valid only for Temps <= 50°F (10°C) and Wind > 3 mph (4.8 km/h).";
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        let windChill;
        let unitStr;

        if (isF && isMph) {
            // US standard
            windChill = 35.74 + (0.6215 * t) - (35.75 * Math.pow(v, 0.16)) + (0.4275 * t * Math.pow(v, 0.16));
            unitStr = '°F';
        } else if (!isF && !isMph) {
            // Metric standard
            windChill = 13.12 + (0.6215 * t) - (11.37 * Math.pow(v, 0.16)) + (0.3965 * t * Math.pow(v, 0.16));
            unitStr = '°C';
        } else {
            // Mixed units: calculate in F/mph, then convert back to requested temp unit
            let wcF = 35.74 + (0.6215 * tempF) - (35.75 * Math.pow(windMph, 0.16)) + (0.4275 * tempF * Math.pow(windMph, 0.16));
            if (isF) {
                windChill = wcF;
                unitStr = '°F';
            } else {
                windChill = (wcF - 32) * 5/9;
                unitStr = '°C';
            }
        }

        // Output Temperature
        let wcCelsius = unitStr === '°C' ? windChill : (windChill - 32) * 5/9;
        let wcKelvin = wcCelsius + 273.15;
        resultChill.textContent = `${Math.round(windChill)} ${unitStr} / ${Math.round(wcKelvin)} K`;

        // Calculate Heat Loss (watts/meter2)
        // Formula: W = (10.45 + 10 * sqrt(v_ms) - v_ms) * (33 - tempC)
        let tempC = isF ? (tempF - 32) * 5/9 : tempF;
        let v_ms = windMph * 0.44704;
        let heatLoss = (10.45 + 10 * Math.sqrt(v_ms) - v_ms) * (33 - tempC);
        if (heatLoss < 0) heatLoss = 0; // cannot be negative heat loss from cold
        
        resHeatloss.textContent = `${Math.round(heatLoss).toLocaleString()} watts/m²`;

        // Frostbite check (based on NWS guidelines using Wind Chill F)
        let wcForRisk = unitStr === '°F' ? windChill : (windChill * 9/5) + 32;
        let frostbiteTime = "Low Risk ( > 30 mins)";
        
        if (wcForRisk <= -18 && wcForRisk > -36) {
            frostbiteTime = "30 minutes";
            resultDanger.style.display = 'block';
            resultDanger.textContent = "Frostbite can occur in 30 minutes!";
        } else if (wcForRisk <= -36 && wcForRisk > -54) {
            frostbiteTime = "10 minutes";
            resultDanger.style.display = 'block';
            resultDanger.textContent = "Frostbite can occur in 10 minutes!";
        } else if (wcForRisk <= -54) {
            frostbiteTime = "5 minutes or less";
            resultDanger.style.display = 'block';
            resultDanger.textContent = "Extreme Danger: Frostbite in 5 minutes!";
        } else {
            resultDanger.style.display = 'none';
        }

        resFrostbite.textContent = frostbiteTime;
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        tempInput.value = '';
        windInput.value = '';
        unitTemp.value = 'f';
        unitWind.value = 'mph';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
