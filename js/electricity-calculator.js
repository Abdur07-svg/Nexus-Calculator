document.addEventListener('DOMContentLoaded', () => {
    const powerInput = document.getElementById('power');
    const powerUnit = document.getElementById('power-unit');
    const hoursInput = document.getElementById('hours');
    const timeUnit = document.getElementById('time-unit');
    const rateInput = document.getElementById('rate');
    const rateUnit = document.getElementById('rate-unit');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultKwh = document.getElementById('result-kwh');
    const costDay = document.getElementById('cost-day');
    const costMonth = document.getElementById('cost-month');
    const costYear = document.getElementById('cost-year');
    const errorMsg = document.getElementById('error-msg');

    calcBtn.addEventListener('click', () => {
        let power = parseFloat(powerInput.value);
        let timeValue = parseFloat(hoursInput.value);
        const rate = parseFloat(rateInput.value);

        if (isNaN(power) || isNaN(timeValue) || isNaN(rate) || power < 0 || timeValue < 0 || rate < 0) {
            errorMsg.textContent = "Please enter valid positive numbers.";
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        let hours = timeUnit.value === 'minutes' ? timeValue / 60 : timeValue;

        if (hours > 24) {
            errorMsg.textContent = "Time per day cannot exceed 24 hours.";
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        // Convert power to kW
        if (powerUnit.value === 'watts') {
            power = power / 1000;
        } else if (powerUnit.value === 'mw') {
            power = power * 1000;
        } else if (powerUnit.value === 'gw') {
            power = power * 1000000;
        } else if (powerUnit.value === 'btu') {
            power = power * 0.00029307107;
        } else if (powerUnit.value === 'hp') {
            power = power * 0.745699872;
        }

        // Convert rate to per kWh
        let ratePerKwh = rate;
        if (rateUnit.value === 'wh') {
            ratePerKwh = rate * 1000;
        } else if (rateUnit.value === 'mwh') {
            ratePerKwh = rate / 1000;
        }

        const kwhPerDay = power * hours;
        const dailyCost = kwhPerDay * ratePerKwh;
        const monthlyCost = dailyCost * 30;
        const yearlyCost = dailyCost * 365;

        resultKwh.textContent = `${kwhPerDay.toFixed(2)} kWh / day`;
        costDay.textContent = `$${dailyCost.toFixed(2)}`;
        costMonth.textContent = `$${monthlyCost.toFixed(2)}`;
        costYear.textContent = `$${yearlyCost.toFixed(2)}`;
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        powerInput.value = '';
        hoursInput.value = '';
        rateInput.value = '';
        powerUnit.value = 'kw';
        timeUnit.value = 'hours';
        rateUnit.value = 'kwh';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
