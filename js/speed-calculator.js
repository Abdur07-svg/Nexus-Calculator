document.addEventListener('DOMContentLoaded', () => {
    // Helper to toggle hms inputs
    function setupHmsToggle(unitSelectId, singleInputId, multiInputId) {
        const unitSelect = document.getElementById(unitSelectId);
        const singleInput = document.getElementById(singleInputId);
        const multiInput = document.getElementById(multiInputId);

        unitSelect.addEventListener('change', () => {
            if (unitSelect.value === 'hms') {
                singleInput.style.display = 'none';
                multiInput.style.display = 'flex';
            } else {
                singleInput.style.display = 'block';
                multiInput.style.display = 'none';
            }
        });
    }

    setupHmsToggle('time-unit', 'time-single', 'time-multi');
    setupHmsToggle('comp-time-unit', 'comp-time-single', 'comp-time-multi');
    setupHmsToggle('diff-unit', 'diff-val-single', 'diff-val-multi');

    // Section 1 Logic
    const distanceInput = document.getElementById('distance');
    const distUnit = document.getElementById('dist-unit');
    const timeUnit = document.getElementById('time-unit');
    
    const timeSingle = document.getElementById('time-single');
    const timeH = document.getElementById('time-h');
    const timeM = document.getElementById('time-m');
    const timeS = document.getElementById('time-s');

    const calcBtn1 = document.getElementById('calc-btn-1');
    const clearBtn1 = document.getElementById('clear-btn-1');
    const errorMsg1 = document.getElementById('error-msg-1');
    const resultBox1 = document.getElementById('result-box-1');
    const mainRes1 = document.getElementById('main-res-1');
    const detailedRes1 = document.getElementById('detailed-res-1');

    function getTimeInSeconds(unit, singleVal, h, m, s) {
        if (unit === 'hms') {
            const hrs = parseFloat(h) || 0;
            const mins = parseFloat(m) || 0;
            const secs = parseFloat(s) || 0;
            if (hrs === 0 && mins === 0 && secs === 0) return 0;
            return (hrs * 3600) + (mins * 60) + secs;
        } else {
            const t = parseFloat(singleVal);
            if (isNaN(t) || t <= 0) return 0;
            if (unit === 'min') return t * 60;
            if (unit === 'h') return t * 3600;
            return t; // seconds
        }
    }

    calcBtn1.addEventListener('click', () => {
        errorMsg1.style.display = 'none';
        const d = parseFloat(distanceInput.value);
        const t_s = getTimeInSeconds(timeUnit.value, timeSingle.value, timeH.value, timeM.value, timeS.value);

        if (isNaN(d) || d < 0 || t_s <= 0) {
            errorMsg1.textContent = 'Please enter valid positive numbers. Time must be greater than 0.';
            errorMsg1.style.display = 'block';
            resultBox1.style.display = 'none';
            return;
        }

        // Convert distance to meters
        let d_m = d;
        if (distUnit.value === 'km') d_m = d * 1000;
        if (distUnit.value === 'mi') d_m = d * 1609.344;
        if (distUnit.value === 'ft') d_m = d * 0.3048;

        // Speed in m/s
        const speed_ms = d_m / t_s;
        
        // Conversions
        const speed_kmh = speed_ms * 3.6;
        const speed_mph = speed_ms * 2.236936;
        const speed_fps = speed_ms * 3.28084;

        mainRes1.innerHTML = `${speed_kmh.toLocaleString(undefined, {maximumFractionDigits: 2})} km/h`;
        detailedRes1.innerHTML = `
            ${speed_mph.toLocaleString(undefined, {maximumFractionDigits: 2})} mph<br>
            ${speed_ms.toLocaleString(undefined, {maximumFractionDigits: 2})} m/s<br>
            ${speed_fps.toLocaleString(undefined, {maximumFractionDigits: 2})} ft/s
        `;

        resultBox1.style.display = 'block';
    });

    clearBtn1.addEventListener('click', () => {
        distanceInput.value = '';
        timeSingle.value = '';
        timeH.value = ''; timeM.value = ''; timeS.value = '';
        resultBox1.style.display = 'none';
        errorMsg1.style.display = 'none';
    });

    // Section 2 Logic
    const compSpeed = document.getElementById('comp-speed');
    const compSpeedUnit = document.getElementById('comp-speed-unit');
    const compTimeUnit = document.getElementById('comp-time-unit');
    const compTimeSingle = document.getElementById('comp-time-single');
    const compTimeH = document.getElementById('comp-time-h');
    const compTimeM = document.getElementById('comp-time-m');
    const compTimeS = document.getElementById('comp-time-s');
    
    const diffUnit = document.getElementById('diff-unit');
    const diffValSingle = document.getElementById('diff-val-single');
    const diffH = document.getElementById('diff-h');
    const diffM = document.getElementById('diff-m');
    const diffS = document.getElementById('diff-s');
    
    const diffDir = document.getElementById('diff-dir');

    const calcBtn2 = document.getElementById('calc-btn-2');
    const clearBtn2 = document.getElementById('clear-btn-2');
    const errorMsg2 = document.getElementById('error-msg-2');
    const resultBox2 = document.getElementById('result-box-2');
    const resDist = document.getElementById('res-dist');
    const resTime = document.getElementById('res-time');
    const resSpeed = document.getElementById('res-speed');

    function formatTime(totalSeconds) {
        if (totalSeconds <= 0) return "0 s";
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        let parts = [];
        if (h > 0) parts.push(`${h} hr`);
        if (m > 0) parts.push(`${m} min`);
        if (s > 0 || parts.length === 0) parts.push(`${s.toFixed(1)} sec`);
        return parts.join(' ');
    }

    calcBtn2.addEventListener('click', () => {
        errorMsg2.style.display = 'none';
        const s_input = parseFloat(compSpeed.value);
        const t_s = getTimeInSeconds(compTimeUnit.value, compTimeSingle.value, compTimeH.value, compTimeM.value, compTimeS.value);
        const diff_s = getTimeInSeconds(diffUnit.value, diffValSingle.value, diffH.value, diffM.value, diffS.value);

        if (isNaN(s_input) || s_input <= 0 || t_s <= 0 || diff_s < 0) {
            errorMsg2.textContent = 'Please enter valid positive numbers for all fields.';
            errorMsg2.style.display = 'block';
            resultBox2.style.display = 'none';
            return;
        }

        // Convert speed to m/s
        let speed_ms = s_input;
        if (compSpeedUnit.value === 'kmh') speed_ms = s_input / 3.6;
        if (compSpeedUnit.value === 'mph') speed_ms = s_input / 2.236936;

        // Calculate Distance in meters
        const distance_m = speed_ms * t_s;

        let new_t_s = t_s;
        if (diffDir.value === 'faster') {
            new_t_s = t_s - diff_s;
            if (new_t_s <= 0) {
                errorMsg2.textContent = 'Time difference is too large! The new time must be greater than zero.';
                errorMsg2.style.display = 'block';
                resultBox2.style.display = 'none';
                return;
            }
        } else {
            new_t_s = t_s + diff_s;
        }

        // New Speed in m/s
        const new_speed_ms = distance_m / new_t_s;
        
        // Output format based on input units
        let dist_out, dist_unit_label;
        if (compSpeedUnit.value === 'mph') {
            dist_out = distance_m / 1609.344;
            dist_unit_label = 'miles';
        } else {
            dist_out = distance_m / 1000;
            dist_unit_label = 'km';
        }

        let new_speed_out, speed_unit_label;
        if (compSpeedUnit.value === 'kmh') {
            new_speed_out = new_speed_ms * 3.6;
            speed_unit_label = 'km/h';
        } else if (compSpeedUnit.value === 'mph') {
            new_speed_out = new_speed_ms * 2.236936;
            speed_unit_label = 'mph';
        } else {
            new_speed_out = new_speed_ms;
            speed_unit_label = 'm/s';
        }

        resDist.textContent = `${dist_out.toLocaleString(undefined, {maximumFractionDigits: 2})} ${dist_unit_label}`;
        resTime.textContent = formatTime(new_t_s);
        resSpeed.textContent = `${new_speed_out.toLocaleString(undefined, {maximumFractionDigits: 2})} ${speed_unit_label}`;

        resultBox2.style.display = 'block';
    });

    clearBtn2.addEventListener('click', () => {
        compSpeed.value = '';
        compTimeSingle.value = '';
        compTimeH.value = ''; compTimeM.value = ''; compTimeS.value = '';
        diffValSingle.value = '';
        diffH.value = ''; diffM.value = ''; diffS.value = '';
        resultBox2.style.display = 'none';
        errorMsg2.style.display = 'none';
    });
});
