document.addEventListener('DOMContentLoaded', () => {
    const calcMode = document.getElementById('calc-mode');
    const timeInput = document.getElementById('time-input');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultTitle = document.getElementById('result-title');
    const resultList = document.getElementById('result-list');
    const errorMsg = document.getElementById('error-msg');

    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    }

    calcBtn.addEventListener('click', () => {
        if (!timeInput.value) {
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';
        
        // Parse input time
        const timeParts = timeInput.value.split(':');
        const targetHour = parseInt(timeParts[0], 10);
        const targetMin = parseInt(timeParts[1], 10);

        const targetDate = new Date();
        targetDate.setHours(targetHour, targetMin, 0, 0);

        const mode = calcMode.value; // 'wake' or 'sleep'
        resultList.innerHTML = ''; // clear previous

        // 90 min per cycle, plus 15 mins to fall asleep
        const cycleLength = 90; 
        const fallAsleepDelay = 15;
        
        // Cycles to display (6 to 3)
        const cyclesToCalc = [6, 5, 4, 3];

        if (mode === 'wake') {
            resultTitle.textContent = "To wake up refreshed, try to fall asleep at one of these times:";
        } else {
            resultTitle.textContent = "If you go to bed now/then, try to wake up at one of these times:";
        }

        cyclesToCalc.forEach(cycle => {
            const totalMinutes = (cycle * cycleLength) + fallAsleepDelay;
            const resDate = new Date(targetDate.getTime());
            
            if (mode === 'wake') {
                // subtract time to find bed time
                resDate.setMinutes(resDate.getMinutes() - totalMinutes);
            } else {
                // add time to find wake time
                resDate.setMinutes(resDate.getMinutes() + totalMinutes);
            }

            const li = document.createElement('li');
            
            // Determine styling
            let styleClass = 'poor';
            if (cycle === 6 || cycle === 5) styleClass = 'optimal'; // 9hr or 7.5hr
            else if (cycle === 4) styleClass = 'good'; // 6hr
            
            li.className = `time-item ${styleClass}`;
            
            const hoursSleep = (cycle * cycleLength) / 60;
            
            li.innerHTML = `
                <span class="time-val">${formatTime(resDate)}</span>
                <span class="time-cycles">${cycle} cycles (${hoursSleep} hr)</span>
            `;
            resultList.appendChild(li);
        });

        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        timeInput.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
