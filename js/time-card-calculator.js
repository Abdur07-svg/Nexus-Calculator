document.addEventListener('DOMContentLoaded', () => {
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const breakTimeInput = document.getElementById('break-time');
    const payRateInput = document.getElementById('pay-rate');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultBox = document.getElementById('result-box');
    const resultHours = document.getElementById('result-hours');
    const resultPay = document.getElementById('result-pay');
    const errorMsg = document.getElementById('error-msg');

    calcBtn.addEventListener('click', () => {
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const breakMins = parseFloat(breakTimeInput.value) || 0;
        const payRate = parseFloat(payRateInput.value) || 0;

        if (!startTime || !endTime) {
            errorMsg.textContent = "Please enter both start and end times.";
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        
        // If end time is before start time, assume it goes to next day
        if (end < start) {
            end.setDate(end.getDate() + 1);
        }

        let diffMs = end - start;
        let diffMins = diffMs / 1000 / 60;
        
        diffMins -= breakMins;
        
        if (diffMins < 0) {
            errorMsg.textContent = "Break time cannot be longer than work duration.";
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        const hours = Math.floor(diffMins / 60);
        const mins = Math.round(diffMins % 60);
        const totalDecimalHours = diffMins / 60;

        resultHours.textContent = `${hours}h ${mins}m`;
        
        if (payRate > 0) {
            const grossPay = (totalDecimalHours * payRate).toFixed(2);
            resultPay.innerHTML = `Gross Pay: <strong>$${grossPay}</strong>`;
        } else {
            resultPay.innerHTML = '';
        }
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        startTimeInput.value = '09:00';
        endTimeInput.value = '17:00';
        breakTimeInput.value = '';
        payRateInput.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
