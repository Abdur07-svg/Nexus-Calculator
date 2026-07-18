document.addEventListener('DOMContentLoaded', () => {
    const distanceInput = document.getElementById('distance');
    const distUnit = document.getElementById('dist-unit');
    const efficiencyInput = document.getElementById('efficiency');
    const effUnit = document.getElementById('eff-unit');
    const priceInput = document.getElementById('price');
    const priceUnit = document.getElementById('price-unit');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');

    // Auto-update units to match standard sets to avoid confusion
    distUnit.addEventListener('change', () => {
        if (distUnit.value === 'mi') {
            effUnit.value = 'mpg-us';
            priceUnit.value = 'g-us';
        } else {
            effUnit.value = 'kml';
            priceUnit.value = 'l';
        }
    });

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        
        let dist = parseFloat(distanceInput.value);
        let eff = parseFloat(efficiencyInput.value);
        let price = parseFloat(priceInput.value);

        if (isNaN(dist) || isNaN(eff) || isNaN(price) || dist < 0 || eff <= 0 || price < 0) {
            errorMsg.textContent = 'Please enter valid positive numbers for all fields.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        // Standardize everything to Kilometers, Liters, and Price per Liter for calculation
        let distKm = distUnit.value === 'mi' ? dist * 1.60934 : dist;
        
        let litersNeeded = 0;
        if (effUnit.value === 'kml') {
            litersNeeded = distKm / eff;
        } else if (effUnit.value === 'l100') {
            litersNeeded = (distKm / 100) * eff;
        } else if (effUnit.value === 'mpg-us') {
            // 1 mpg (us) = 0.425144 km/L
            let kml = eff * 0.425144;
            litersNeeded = distKm / kml;
        } else if (effUnit.value === 'mpg-uk') {
            // 1 mpg (uk) = 0.354006 km/L
            let kml = eff * 0.354006;
            litersNeeded = distKm / kml;
        }

        let pricePerLiter = price;
        if (priceUnit.value === 'g-us') {
            pricePerLiter = price / 3.78541; // 1 US gallon = 3.78541 L
        } else if (priceUnit.value === 'g-uk') {
            pricePerLiter = price / 4.54609; // 1 UK gallon = 4.54609 L
        }

        let totalCost = litersNeeded * pricePerLiter;
        
        // Display units contextually based on what user selected
        let volumeStr = "";
        let finalVolume = litersNeeded;
        if (priceUnit.value === 'l') {
            volumeStr = "Liters";
        } else if (priceUnit.value === 'g-us') {
            volumeStr = "Gallons (US)";
            finalVolume = litersNeeded / 3.78541;
        } else {
            volumeStr = "Gallons (UK)";
            finalVolume = litersNeeded / 4.54609;
        }

        detailedRes.innerHTML = `
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Total Fuel Cost</div>
            <div style="font-size: 32px; font-weight: 700; color: var(--btn-operator-color); margin-bottom: 15px;">
                ${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Fuel Required</div>
            <div style="font-size: 20px; font-weight: 600; color: var(--text-primary);">
                ${finalVolume.toFixed(2)} ${volumeStr}
            </div>
        `;

        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        distanceInput.value = '';
        efficiencyInput.value = '';
        priceInput.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
