document?.addEventListener('DOMContentLoaded', () => {
    const calcType = document.getElementById('date-calc-type');
    const modeDifference = document.getElementById('mode-difference');
    const modeAddSub = document.getElementById('mode-add-sub');
    const calcBtn = document.getElementById('calc-date-btn');
    const resultContainer = document.getElementById('date-result-container');
    const mainResult = document.getElementById('date-main-result');
    const detailsResult = document.getElementById('date-details');

    // Helper to safely parse DD/MM/YYYY
    function parseDateStr(str) {
        if (!str) return new Date("");
        const parts = str.split('/');
        if (parts.length === 3) {
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        return new Date(str);
    }

    // Set today as default (DD/MM/YYYY)
    const todayObj = new Date();
    const dd = String(todayObj.getDate()).padStart(2, '0');
    const mm = String(todayObj.getMonth() + 1).padStart(2, '0');
    const todayStr = `${dd}/${mm}/${todayObj.getFullYear()}`;
    document.getElementById('date-start').value = todayStr;
    document.getElementById('date-end').value = todayStr;
    document.getElementById('date-base').value = todayStr;

    if (typeof flatpickr !== 'undefined') {
        flatpickr(".date-input", {
            dateFormat: "d/m/Y",
            allowInput: true,
            disableMobile: "true"
        });
    }

    calcType?.addEventListener('change', () => {
        if (calcType.value === 'difference') {
            modeDifference.style.display = 'block';
            modeAddSub.style.display = 'none';
        } else {
            modeDifference.style.display = 'none';
            modeAddSub.style.display = 'block';
        }
        resultContainer.style.display = 'none';
    });

    calcBtn?.addEventListener('click', () => {
        if (calcType.value === 'difference') {
            calculateDifference();
        } else {
            calculateAddSub();
        }
    });

    function calculateDifference() {
        const start = parseDateStr(document.getElementById('date-start').value);
        const end = parseDateStr(document.getElementById('date-end').value);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            showError("Please enter valid dates.");
            return;
        }

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        if (days < 0) {
            months--;
            const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
            days += previousMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        // if start > end, we might just say "X days apart"
        const prefix = start > end ? "Earlier by " : "";

        mainResult.innerHTML = `${prefix}${Math.abs(years)} years, ${Math.abs(months)} months, ${days} days`;
        detailsResult.innerHTML = `<p>Total Days: <span>${diffDays}</span></p>`;
        resultContainer.style.display = 'block';
    }

    function calculateAddSub() {
        const base = parseDateStr(document.getElementById('date-base').value);
        const op = document.getElementById('date-op').value;
        const years = parseInt(document.getElementById('date-years').value) || 0;
        const months = parseInt(document.getElementById('date-months').value) || 0;
        const days = parseInt(document.getElementById('date-days').value) || 0;

        if (isNaN(base.getTime())) {
            showError("Please enter a valid base date.");
            return;
        }

        const resultDate = new Date(base);
        const multiplier = op === 'add' ? 1 : -1;

        resultDate.setFullYear(resultDate.getFullYear() + (years * multiplier));
        resultDate.setMonth(resultDate.getMonth() + (months * multiplier));
        resultDate.setDate(resultDate.getDate() + (days * multiplier));

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        mainResult.innerHTML = resultDate.toLocaleDateString(undefined, options);
        detailsResult.innerHTML = '';
        resultContainer.style.display = 'block';
    }

    function showError(msg) {
        mainResult.innerHTML = `<span style="color: #ef4444;">${msg}</span>`;
        detailsResult.innerHTML = '';
        resultContainer.style.display = 'block';
    }
});


// Global Enter key listener for all input fields to trigger the calculate button
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') return;
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const calculatorDiv = input.closest('.calculator');
                let calcBtn = null;
                if (calculatorDiv) {
                    calcBtn = calculatorDiv.querySelector('button.action-btn, button[id^="calc-"]');
                }
                
                if (!calcBtn) {
                    calcBtn = document.querySelector('button.action-btn, button[id^="calc-"]');
                }
                
                if (calcBtn) {
                    calcBtn.click();
                }
            }
        });
    });
});
