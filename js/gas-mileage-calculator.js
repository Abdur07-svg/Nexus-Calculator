document.addEventListener('DOMContentLoaded', () => {
    const distanceInput = document.getElementById('distance');
    const distUnit = document.getElementById('dist-unit');
    const fuelInput = document.getElementById('fuel');
    const fuelUnit = document.getElementById('fuel-unit');
    const priceInput = document.getElementById('price');
    const priceLabel = document.getElementById('price-label');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultBox = document.getElementById('result-box');
    const resultEfficiency = document.getElementById('result-efficiency');
    const resultMessage = document.getElementById('result-message');
    const resultCost = document.getElementById('result-cost');
    const errorMsg = document.getElementById('error-msg');

    function updatePriceLabel() {
        if (fuelUnit.value === 'liters') {
            priceLabel.textContent = 'Fuel Price (per Liter)';
        } else {
            priceLabel.textContent = 'Fuel Price (per Gallon)';
        }
    }

    // Auto-sync units intuitively (if they pick km, suggest liters)
    distUnit.addEventListener('change', () => {
        if (distUnit.value === 'km') {
            fuelUnit.value = 'liters';
        } else {
            fuelUnit.value = 'gallons';
        }
        updatePriceLabel();
    });
    
    fuelUnit.addEventListener('change', () => {
        if (fuelUnit.value === 'liters') {
            distUnit.value = 'km';
        } else {
            distUnit.value = 'miles';
        }
        updatePriceLabel();
    });

    calcBtn.addEventListener('click', () => {
        const distance = parseFloat(distanceInput.value);
        const fuel = parseFloat(fuelInput.value);
        const price = parseFloat(priceInput.value);

        if (isNaN(distance) || isNaN(fuel) || distance < 0 || fuel <= 0) {
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        let efficiency = 0;
        let label = '';
        let altMsg = '';

        if (distUnit.value === 'miles' && fuelUnit.value === 'gallons') {
            efficiency = distance / fuel;
            label = 'MPG';
            // Convert to km/L for alternate message
            const kmL = efficiency * 0.425144;
            altMsg = `Equivalent to ${kmL.toFixed(2)} km/L`;
        } 
        else if (distUnit.value === 'km' && fuelUnit.value === 'liters') {
            efficiency = distance / fuel;
            label = 'km/L';
            const mpg = efficiency * 2.35215;
            altMsg = `Equivalent to ${mpg.toFixed(2)} MPG`;
            
            // Also calculate L/100km which is common outside US/UK
            const lPer100km = (fuel / distance) * 100;
            altMsg += `<br>Or ${lPer100km.toFixed(2)} L/100km`;
        }
        else if (distUnit.value === 'miles' && fuelUnit.value === 'liters') {
            efficiency = distance / fuel;
            label = 'miles/liter';
            const mpg = efficiency * 3.78541;
            altMsg = `Equivalent to ${mpg.toFixed(2)} MPG`;
        }
        else if (distUnit.value === 'km' && fuelUnit.value === 'gallons') {
            efficiency = distance / fuel;
            label = 'km/gallon';
            const mpg = (distance * 0.621371) / fuel;
            altMsg = `Equivalent to ${mpg.toFixed(2)} MPG`;
        }

        resultEfficiency.textContent = `${efficiency.toFixed(2)} ${label}`;
        resultMessage.innerHTML = altMsg;
        
        if (!isNaN(price) && price > 0) {
            const cost = fuel * price;
            resultCost.textContent = `Trip Cost: $${cost.toFixed(2)}`;
            resultCost.style.display = 'block';
        } else {
            resultCost.style.display = 'none';
        }
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        distanceInput.value = '';
        fuelInput.value = '';
        priceInput.value = '';
        distUnit.value = 'miles';
        fuelUnit.value = 'gallons';
        updatePriceLabel();
        resultBox.classList.remove('active');
        resultCost.style.display = 'none';
        errorMsg.style.display = 'none';
    });
});
