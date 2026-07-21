document.addEventListener('DOMContentLoaded', () => {
    const calcTypeRadios = document.querySelectorAll('input[name="calc-type"]');
    const groupClock = document.getElementById('group-clock');
    const groupElapsed = document.getElementById('group-elapsed');

    const clockFmtRadios = document.querySelectorAll('input[name="clock-fmt"]');
    const clkStDate = document.getElementById('clk-st-date');
    const clkStHr = document.getElementById('clk-st-hr');
    const clkStMin = document.getElementById('clk-st-min');
    const clkStAmpm = document.getElementById('clk-st-ampm');
    const clkEndDate = document.getElementById('clk-end-date');
    const clkEndHr = document.getElementById('clk-end-hr');
    const clkEndMin = document.getElementById('clk-end-min');
    const clkEndAmpm = document.getElementById('clk-end-ampm');

    const elStUnit = document.getElementById('el-st-unit');
    const elStHr = document.getElementById('el-st-hr');
    const elStMin = document.getElementById('el-st-min');
    const elStSec = document.getElementById('el-st-sec');

    const elEndUnit = document.getElementById('el-end-unit');
    const elEndHr = document.getElementById('el-end-hr');
    const elEndMin = document.getElementById('el-end-min');
    const elEndSec = document.getElementById('el-end-sec');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultMain = document.getElementById('result-main');
    const resHours = document.getElementById('res-hours');
    const resMins = document.getElementById('res-mins');
    const resSecs = document.getElementById('res-secs');
    const errorMsg = document.getElementById('error-msg');

    function handleCalcTypeChange() {
        const type = document.querySelector('input[name="calc-type"]:checked').value;
        if (type === 'elapsed') {
            groupElapsed.style.display = 'flex';
            groupClock.style.display = 'none';
        } else {
            groupElapsed.style.display = 'none';
            groupClock.style.display = 'flex';
        }
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    }
    
    calcTypeRadios.forEach(radio => radio.addEventListener('change', handleCalcTypeChange));

    function handleClockFmtChange() {
        const fmt = document.querySelector('input[name="clock-fmt"]:checked').value;
        const is24 = fmt === '24';
        clkStAmpm.style.display = is24 ? 'none' : 'block';
        clkEndAmpm.style.display = is24 ? 'none' : 'block';
        
        clkStHr.max = is24 ? 23 : 12;
        clkStHr.min = is24 ? 0 : 1;
        clkEndHr.max = is24 ? 23 : 12;
        clkEndHr.min = is24 ? 0 : 1;
    }
    clockFmtRadios.forEach(radio => radio.addEventListener('change', handleClockFmtChange));

    function updateElapsedUI(unitSelect, hrInput, minInput, secInput) {
        const val = unitSelect.value;
        hrInput.style.display = ['hrs', 'hrs_min', 'hrs_min_sec'].includes(val) ? 'block' : 'none';
        minInput.style.display = ['min', 'min_sec', 'hrs_min', 'hrs_min_sec'].includes(val) ? 'block' : 'none';
        secInput.style.display = ['sec', 'min_sec', 'hrs_min_sec'].includes(val) ? 'block' : 'none';
        
        // Hide separators appropriately (simple approach: rely on flex gap or manually handle them)
        const parent = hrInput.parentElement;
        const sepHr = parent.querySelector('.sep-hr');
        const sepMin = parent.querySelector('.sep-min');
        if(sepHr) sepHr.style.display = (hrInput.style.display === 'block' && (minInput.style.display === 'block' || secInput.style.display === 'block')) ? 'block' : 'none';
        if(sepMin) sepMin.style.display = (minInput.style.display === 'block' && secInput.style.display === 'block') ? 'block' : 'none';
    }

    elStUnit.addEventListener('change', () => updateElapsedUI(elStUnit, elStHr, elStMin, elStSec));
    elEndUnit.addEventListener('change', () => updateElapsedUI(elEndUnit, elEndHr, elEndMin, elEndSec));
    
    // Initial call
    updateElapsedUI(elStUnit, elStHr, elStMin, elStSec);
    updateElapsedUI(elEndUnit, elEndHr, elEndMin, elEndSec);

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        let diffMs = 0;

        if (document.querySelector('input[name="calc-type"]:checked').value === 'clock') {
            if (!clkStDate.value || !clkStHr.value || !clkStMin.value || !clkEndDate.value || !clkEndHr.value || !clkEndMin.value) {
                errorMsg.textContent = "Please fill in all date and time fields.";
                errorMsg.style.display = 'block';
                resultBox.classList.remove('active');
                return;
            }
            
            const is24 = document.querySelector('input[name="clock-fmt"]:checked').value === '24';
            
            let stHr = parseInt(clkStHr.value);
            if (!is24) {
                if (clkStAmpm.value === 'PM' && stHr < 12) stHr += 12;
                if (clkStAmpm.value === 'AM' && stHr === 12) stHr = 0;
            }
            const stMin = parseInt(clkStMin.value);
            
            let endHr = parseInt(clkEndHr.value);
            if (!is24) {
                if (clkEndAmpm.value === 'PM' && endHr < 12) endHr += 12;
                if (clkEndAmpm.value === 'AM' && endHr === 12) endHr = 0;
            }
            const endMin = parseInt(clkEndMin.value);

            const startDate = new Date(`${clkStDate.value}T${stHr.toString().padStart(2, '0')}:${stMin.toString().padStart(2, '0')}:00`);
            const endDate = new Date(`${clkEndDate.value}T${endHr.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}:00`);
            
            diffMs = Math.abs(endDate - startDate);
        } else {
            const getSecs = (hrInp, minInp, secInp, unitVal) => {
                let h = hrInp.style.display !== 'none' ? (parseFloat(hrInp.value) || 0) : 0;
                let m = minInp.style.display !== 'none' ? (parseFloat(minInp.value) || 0) : 0;
                let s = secInp.style.display !== 'none' ? (parseFloat(secInp.value) || 0) : 0;
                return (h * 3600) + (m * 60) + s;
            };

            const startTotalSec = getSecs(elStHr, elStMin, elStSec, elStUnit.value);
            const endTotalSec = getSecs(elEndHr, elEndMin, elEndSec, elEndUnit.value);
            
            diffMs = Math.abs(endTotalSec - startTotalSec) * 1000;
        }

        // Calculate totals
        const totalSecs = Math.floor(diffMs / 1000);
        const totalMins = Math.floor(totalSecs / 60);
        const totalHours = Math.floor(totalMins / 60);
        const totalDays = Math.floor(totalHours / 24);

        // Calculate breakdown
        const days = totalDays;
        const hours = totalHours % 24;
        const mins = totalMins % 60;
        const secs = totalSecs % 60;
        
        let mainStr = [];
        
        if (days > 0) mainStr.push(`${days} Days`);
        if (hours > 0) mainStr.push(`${hours} Hours`);
        if (mins > 0) mainStr.push(`${mins} Mins`);
        if (document.querySelector('input[name="calc-type"]:checked').value === 'elapsed' && secs > 0) mainStr.push(`${secs} Secs`);
        
        if (mainStr.length === 0) {
            mainStr.push("0 Mins");
        }

        resultMain.textContent = mainStr.join(', ');
        
        resHours.textContent = `${totalHours.toLocaleString()} total hours`;
        resMins.textContent = `${totalMins.toLocaleString()} total minutes`;
        resSecs.textContent = `${totalSecs.toLocaleString()} total seconds`;
        
        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        clkStDate.value = '';
        clkStHr.value = '';
        clkStMin.value = '';
        clkEndDate.value = '';
        clkEndHr.value = '';
        clkEndMin.value = '';
        
        elStHr.value = '';
        elStMin.value = '';
        elStSec.value = '';
        elEndHr.value = '';
        elEndMin.value = '';
        elEndSec.value = '';
        
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
