document.addEventListener('DOMContentLoaded', () => {
    const modeBetweenBtn = document.getElementById('mode-between');
    const modeAddSubBtn = document.getElementById('mode-addsub');
    
    const betweenInputs = document.getElementById('between-inputs');
    const addsubInputs = document.getElementById('addsub-inputs');
    
    const startTime1 = document.getElementById('start-time-1');
    const endTime1 = document.getElementById('end-time-1');
    
    const baseTime = document.getElementById('base-time');
    const operation = document.getElementById('operation');
    const addHours = document.getElementById('add-hours');
    const addMins = document.getElementById('add-mins');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');

    function showError(msg) {
        if(errorMsg) {
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            errorMsg.style.display = 'block';
        } else {
            alert(msg);
        }
    }
    const mainResult = document.getElementById('main-result');
    const detailedResult = document.getElementById('detailed-result');

    let currentMode = 'between';

    modeBetweenBtn.addEventListener('click', () => {
        currentMode = 'between';
        modeBetweenBtn.classList.add('active');
        modeAddSubBtn.classList.remove('active');
        betweenInputs.style.display = 'block';
        addsubInputs.style.display = 'none';
        resetResults();
    });

    modeAddSubBtn.addEventListener('click', () => {
        currentMode = 'addsub';
        modeAddSubBtn.classList.add('active');
        modeBetweenBtn.classList.remove('active');
        addsubInputs.style.display = 'block';
        betweenInputs.style.display = 'none';
        resetResults();
    });

    // Parse time like "14:30" or "02:30 PM" into total minutes from midnight
    function parseTime(timeStr) {
        if (!timeStr) return null;
        timeStr = timeStr.trim().toLowerCase();
        
        // Match 12-hour or 24-hour format
        const regex = /^(\d{1,2}):(\d{2})(?:\s*(am|pm))?$/;
        const match = timeStr.match(regex);
        
        if (!match) return null;
        
        let hours = parseInt(match[1]);
        const mins = parseInt(match[2]);
        const ampm = match[3];

        if (ampm === 'pm' && hours < 12) hours += 12;
        if (ampm === 'am' && hours === 12) hours = 0;
        
        // 24-hour wrap
        hours = hours % 24;

        return (hours * 60) + mins;
    }

    function formatMinutesToTime(totalMins) {
        // Handle negative wrapping
        while (totalMins < 0) totalMins += (24 * 60);
        totalMins = totalMins % (24 * 60);
        
        let hours = Math.floor(totalMins / 60);
        const mins = totalMins % 60;
        
        const ampm = hours >= 12 ? 'PM' : 'AM';
        let displayHours = hours % 12;
        if (displayHours === 0) displayHours = 12;
        
        const paddedMins = mins.toString().padStart(2, '0');
        return `${displayHours}:${paddedMins} ${ampm}`;
    }

    function resetResults() {
        mainResult.textContent = '-';
        detailedResult.innerHTML = '-';
    }

    function calculate() {
        if(errorMsg) errorMsg.style.display = 'none';
        if (currentMode === 'between') {
            const startMins = parseTime(startTime1.value);
            const endMins = parseTime(endTime1.value);
            
            if (startMins === null || endMins === null) {
                showError('Please enter valid times (e.g. 14:30 or 2:30 PM).');
                return;
            }

            let diffMins = endMins - startMins;
            // If end time is technically earlier in the day, assume it crossed midnight
            if (diffMins < 0) {
                diffMins += (24 * 60);
            }

            const h = Math.floor(diffMins / 60);
            const m = diffMins % 60;
            
            mainResult.textContent = `${h}h ${m}m`;
            detailedResult.textContent = 'Total time difference';

        } else {
            const baseMins = parseTime(baseTime.value);
            if (baseMins === null) {
                showError('Please enter a valid base time (e.g. 14:30 or 2:30 PM).');
                return;
            }

            const h = parseInt(addHours.value) || 0;
            const m = parseInt(addMins.value) || 0;
            const totalAddMins = (h * 60) + m;

            let resultMins;
            if (operation.value === 'add') {
                resultMins = baseMins + totalAddMins;
            } else {
                resultMins = baseMins - totalAddMins;
            }

            mainResult.textContent = formatMinutesToTime(resultMins);
            detailedResult.textContent = 'Calculated Time';
        }
    }

    calcBtn.addEventListener('click', calculate);

    clearBtn.addEventListener('click', () => {
        if(errorMsg) errorMsg.style.display = 'none';
        startTime1.value = '';
        endTime1.value = '';
        baseTime.value = '';
        addHours.value = '';
        addMins.value = '';
        resetResults();
    });
});
