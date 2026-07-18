document.addEventListener('DOMContentLoaded', () => {
    const baseDateText = document.getElementById('base-date-text');
    const baseDatePicker = document.getElementById('base-date-picker');
    const operation = document.getElementById('operation');
    
    const yearsInput = document.getElementById('years');
    const monthsInput = document.getElementById('months');
    const weeksInput = document.getElementById('weeks');
    const daysInput = document.getElementById('days');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');

    function formatDate(date) {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    }

    function parseDate(str) {
        if (!str) return null;
        const parts = str.split('/');
        if (parts.length === 3) {
            const d = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10) - 1;
            const y = parseInt(parts[2], 10);
            const date = new Date(y, m, d);
            if (date.getFullYear() === y && date.getMonth() === m && date.getDate() === d) {
                return date;
            }
        }
        return null;
    }

    function syncDateInputs(textInput, pickerInput) {
        textInput.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 8) v = v.slice(0, 8);
            if (v.length >= 5) {
                e.target.value = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`;
            } else if (v.length >= 3) {
                e.target.value = `${v.slice(0,2)}/${v.slice(2)}`;
            } else {
                e.target.value = v;
            }

            const parts = e.target.value.split('/');
            if (parts.length === 3 && parts[2].length === 4) {
                pickerInput.value = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        });

        pickerInput.addEventListener('change', () => {
            if (pickerInput.value) {
                const [y, m, d] = pickerInput.value.split('-');
                textInput.value = `${d}/${m}/${y}`;
            }
        });
    }

    syncDateInputs(baseDateText, baseDatePicker);

    // Set today's date as default
    const today = new Date();
    baseDateText.value = formatDate(today);
    baseDatePicker.value = today.toISOString().split('T')[0];

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        
        const base = parseDate(baseDateText.value);
        if (!base) {
            errorMsg.textContent = 'Please enter a valid Start Date in (DD/MM/YYYY) format.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        base.setHours(0,0,0,0);
        
        const y = parseInt(yearsInput.value) || 0;
        const m = parseInt(monthsInput.value) || 0;
        const w = parseInt(weeksInput.value) || 0;
        const d = parseInt(daysInput.value) || 0;
        
        const totalDaysToAdd = (w * 7) + d;
        const op = operation.value;

        if (op === 'add') {
            base.setFullYear(base.getFullYear() + y);
            base.setMonth(base.getMonth() + m);
            base.setDate(base.getDate() + totalDaysToAdd);
        } else {
            base.setFullYear(base.getFullYear() - y);
            base.setMonth(base.getMonth() - m);
            base.setDate(base.getDate() - totalDaysToAdd);
        }

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = base.toLocaleDateString(undefined, options);

        let partsStr = [];
        if (y > 0) partsStr.push(`${y} year${y > 1 ? 's' : ''}`);
        if (m > 0) partsStr.push(`${m} month${m > 1 ? 's' : ''}`);
        if (w > 0) partsStr.push(`${w} week${w > 1 ? 's' : ''}`);
        if (d > 0) partsStr.push(`${d} day${d > 1 ? 's' : ''}`);
        
        let opText = op === 'add' ? 'Added' : 'Subtracted';
        let detailText = partsStr.length > 0 ? `${opText} ${partsStr.join(', ')}` : 'No changes made';

        detailedRes.innerHTML = `
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">New Date</div>
            <div style="font-size: 24px; font-weight: 700; color: var(--btn-operator-color); margin-bottom: 5px; line-height: 1.3;">
                ${formattedDate}
            </div>
            <div style="font-size: 14px; color: var(--text-secondary); font-style: italic; margin-top: 10px;">
                ${detailText}
            </div>
        `;

        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        baseDateText.value = formatDate(today);
        baseDatePicker.value = today.toISOString().split('T')[0];
        operation.value = 'add';
        yearsInput.value = '0';
        monthsInput.value = '0';
        weeksInput.value = '0';
        daysInput.value = '0';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
