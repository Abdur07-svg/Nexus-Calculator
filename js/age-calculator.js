document.addEventListener('DOMContentLoaded', () => {
    const dobText = document.getElementById('dob-text');
    const dobPicker = document.getElementById('dob-picker');
    const targetDateText = document.getElementById('target-date-text');
    const targetDatePicker = document.getElementById('target-date-picker');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const mainAge = document.getElementById('main-age');
    const detailedAge = document.getElementById('detailed-age');

    function showError(msg) {
        if(errorMsg) {
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            errorMsg.style.display = 'block';
        } else {
            alert(msg);
        }
    }

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

    syncDateInputs(dobText, dobPicker);
    syncDateInputs(targetDateText, targetDatePicker);

    // Set default target date
    const today = new Date();
    targetDateText.value = formatDate(today);
    targetDatePicker.value = today.toISOString().split('T')[0];

    function calculateAge() {
        if(errorMsg) errorMsg.style.display = 'none';
        const dob = parseDate(dobText.value);
        const target = parseDate(targetDateText.value);

        if (!dob || !target) {
            showError('Please enter valid dates in (DD/MM/YYYY) format.');
            return;
        }

        if (dob > target) {
            showError('Date of birth cannot be after the target date.');
            return;
        }

        let years = target.getFullYear() - dob.getFullYear();
        let months = target.getMonth() - dob.getMonth();
        let days = target.getDate() - dob.getDate();

        if (days < 0) {
            months--;
            const previousMonth = new Date(target.getFullYear(), target.getMonth(), 0);
            days += previousMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        mainAge.textContent = `${years} Years`;
        detailedAge.textContent = `${years} years, ${months} months, and ${days} days old.`;
        resultBox.classList.add('active');
    }

    function clearData() {
        dobText.value = '';
        dobPicker.value = '';
        
        targetDateText.value = formatDate(today);
        targetDatePicker.value = today.toISOString().split('T')[0];
        
        resultBox.classList.remove('active');
        mainAge.textContent = '-';
        detailedAge.textContent = '-';
    }

    calcBtn.addEventListener('click', calculateAge);
    clearBtn.addEventListener('click', clearData);
});
