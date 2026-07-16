document.addEventListener('DOMContentLoaded', () => {
    const distanceInput = document.getElementById('distance');
    const distUnit = document.getElementById('dist-unit');
    const fuelInput = document.getElementById('fuel');
    const fuelUnit = document.getElementById('fuel-unit');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultBox = document.getElementById('result-box');
    const mainRes = document.getElementById('main-res');
    const detailedRes = document.getElementById('detailed-res');
    const errorMsg = document.getElementById('error-msg');

    function calculateMileage() {
        errorMsg.style.display = 'none';
        const distance = parseFloat(distanceInput.value);
        const fuel = parseFloat(fuelInput.value);

        if (isNaN(distance) || isNaN(fuel) || distance <= 0 || fuel <= 0) {
            errorMsg.textContent = 'Please enter valid positive numbers for both distance and fuel.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        let distanceKm = distUnit.value === 'miles' ? distance * 1.60934 : distance;
        let fuelLiters = fuelUnit.value === 'gallons' ? fuel * 3.78541 : fuel;

        let distanceMiles = distUnit.value === 'km' ? distance * 0.621371 : distance;
        let fuelGallons = fuelUnit.value === 'liters' ? fuel * 0.264172 : fuel;

        const mpg = distanceMiles / fuelGallons;
        const kmpl = distanceKm / fuelLiters;
        const l100km = (fuelLiters / distanceKm) * 100;

        let mainText = '';
        if (distUnit.value === 'miles' && fuelUnit.value === 'gallons') {
            mainText = `${mpg.toFixed(2)} MPG`;
        } else {
            mainText = `${kmpl.toFixed(2)} km/L`;
        }

        mainRes.textContent = mainText;
        detailedRes.innerHTML = `
            ${mpg.toFixed(2)} MPG (US)<br>
            ${kmpl.toFixed(2)} km/L<br>
            ${l100km.toFixed(2)} L/100km
        `;
        resultBox.classList.add('active');
    }

    calcBtn.addEventListener('click', calculateMileage);

    clearBtn.addEventListener('click', () => {
        distanceInput.value = '';
        fuelInput.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
