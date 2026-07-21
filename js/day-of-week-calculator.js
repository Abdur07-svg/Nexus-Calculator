document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-input');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultDesc = document.getElementById('result-desc');
    const resultDay = document.getElementById('result-day');
    const errorMsg = document.getElementById('error-msg');

    calcBtn.addEventListener('click', () => {
        if (!dateInput.value) {
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        // Parse date. Splitting to avoid timezone shift issues with input type="date"
        const [year, month, day] = dateInput.value.split('-');
        const date = new Date(year, month - 1, day);
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        const today = new Date();
        today.setHours(0,0,0,0);
        
        if (date.getTime() < today.getTime()) {
            resultDesc.textContent = "That day was a...";
        } else if (date.getTime() > today.getTime()) {
            resultDesc.textContent = "That day will be a...";
        } else {
            resultDesc.textContent = "Today is...";
        }

        resultDay.textContent = dayName;
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        dateInput.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
