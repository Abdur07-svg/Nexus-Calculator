document.addEventListener('DOMContentLoaded', () => {
    const startText = document.getElementById('start-date-text');
    const startPicker = document.getElementById('start-date-picker');
    const endText = document.getElementById('end-date-text');
    const endPicker = document.getElementById('end-date-picker');
    const includeEnd = document.getElementById('include-end');
    
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

    syncDateInputs(startText, startPicker);
    syncDateInputs(endText, endPicker);

    // Set today's date as default
    const today = new Date();
    startText.value = formatDate(today);
    startPicker.value = today.toISOString().split('T')[0];
    endText.value = formatDate(today);
    endPicker.value = today.toISOString().split('T')[0];

    function getWorkingDays(startDate, endDate, includeEndBool) {
        let count = 0;
        let curDate = new Date(startDate.getTime());
        
        let step = endDate >= startDate ? 1 : -1;
        let limit = Math.abs((endDate - startDate)/(1000*60*60*24));
        if(includeEndBool) limit += 1;

        for(let i = 0; i < limit; i++) {
            let day = curDate.getDay();
            if(day !== 0 && day !== 6) count++;
            curDate.setDate(curDate.getDate() + step);
        }
        return count;
    }

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        
        const start = parseDate(startText.value);
        const end = parseDate(endText.value);

        if (!start || !end) {
            errorMsg.textContent = 'Please enter valid dates in (DD/MM/YYYY) format.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        // Remove time component
        start.setHours(0,0,0,0);
        end.setHours(0,0,0,0);

        let diffTime = end.getTime() - start.getTime();
        let isNegative = diffTime < 0;
        
        if (isNegative) {
            diffTime = Math.abs(diffTime);
        }

        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (includeEnd.checked) {
            diffDays += 1;
        }

        const workingDays = getWorkingDays(start, end, includeEnd.checked);
        const totalWeeks = diffDays / 7;
        const totalMonths = diffDays / 30.436875;
        const totalYears = diffDays / 365.2425;

        // Detailed breakdown
        const startD = isNegative ? new Date(end) : new Date(start);
        const endD = isNegative ? new Date(start) : new Date(end);
        
        let years = endD.getFullYear() - startD.getFullYear();
        let months = endD.getMonth() - startD.getMonth();
        let days = endD.getDate() - startD.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(endD.getFullYear(), endD.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        
        if (includeEnd.checked) {
            days++;
            const daysInCurrentMonth = new Date(endD.getFullYear(), endD.getMonth() + 1, 0).getDate();
            if (days >= daysInCurrentMonth) {
                days -= daysInCurrentMonth;
                months++;
                if (months >= 12) {
                    months -= 12;
                    years++;
                }
            }
        }

        let breakdownStr = [];
        if (years > 0) breakdownStr.push(`${years} year${years > 1 ? 's' : ''}`);
        if (months > 0) breakdownStr.push(`${months} month${months > 1 ? 's' : ''}`);
        if (days > 0 || breakdownStr.length === 0) breakdownStr.push(`${days} day${days > 1 ? 's' : ''}`);

        let resStr = `
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Result</div>
            <div style="font-size: 28px; font-weight: 700; color: var(--btn-operator-color); margin-bottom: 5px;">
                ${isNegative && diffDays > 0 ? '-' : ''}${diffDays} days
            </div>
            <div style="font-size: 16px; font-weight: 500; color: var(--text-primary); margin-bottom: 20px;">
                ${isNegative ? 'Date is in the past' : 'Date difference'}
            </div>
            
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Breakdown</div>
            <div style="font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 15px;">
                ${breakdownStr.join(', ')}
            </div>
            
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Alternative Units</div>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 15px; color: var(--text-primary);">
                <li style="margin-bottom: 5px;"><strong>${workingDays}</strong> working days (Mon-Fri)</li>
                <li style="margin-bottom: 5px;"><strong>${totalWeeks.toFixed(1)}</strong> weeks</li>
                <li style="margin-bottom: 5px;"><strong>${totalMonths.toFixed(1)}</strong> months</li>
                <li><strong>${totalYears.toFixed(2)}</strong> years</li>
            </ul>
        `;

        detailedRes.innerHTML = resStr;
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        startText.value = formatDate(today);
        startPicker.value = today.toISOString().split('T')[0];
        endText.value = formatDate(today);
        endPicker.value = today.toISOString().split('T')[0];
        includeEnd.checked = false;
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
