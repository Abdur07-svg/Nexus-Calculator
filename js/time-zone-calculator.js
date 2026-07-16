document.addEventListener('DOMContentLoaded', () => {
    const tzDatetime = document.getElementById('tz-datetime');
    const tzFrom = document.getElementById('tz-from');
    const tzTo = document.getElementById('tz-to');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    
    const resultBox = document.getElementById('result-box');
    const resTime = document.getElementById('res-time');
    const resDate = document.getElementById('res-date');
    const resDiff = document.getElementById('res-diff');

    function showError(msg) {
        if(errorMsg) {
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            errorMsg.style.display = 'block';
        }
    }

    const timeZones = [
        { id: 'UTC', label: 'UTC (Coordinated Universal Time)' },
        { id: 'GMT', label: 'GMT (Greenwich Mean Time)' },
        { id: 'America/New_York', label: 'EST/EDT (New York)' },
        { id: 'America/Chicago', label: 'CST/CDT (Chicago)' },
        { id: 'America/Denver', label: 'MST/MDT (Denver)' },
        { id: 'America/Los_Angeles', label: 'PST/PDT (Los Angeles)' },
        { id: 'Europe/London', label: 'GMT/BST (London)' },
        { id: 'Europe/Paris', label: 'CET/CEST (Paris)' },
        { id: 'Asia/Dubai', label: 'GST (Dubai)' },
        { id: 'Asia/Kolkata', label: 'IST (India)' },
        { id: 'Asia/Dhaka', label: 'BST (Bangladesh)' },
        { id: 'Asia/Bangkok', label: 'ICT (Bangkok)' },
        { id: 'Asia/Tokyo', label: 'JST (Tokyo)' },
        { id: 'Australia/Sydney', label: 'AEST/AEDT (Sydney)' },
        { id: 'Pacific/Auckland', label: 'NZST/NZDT (Auckland)' }
    ];

    function populateZones() {
        timeZones.forEach(tz => {
            const opt1 = document.createElement('option');
            opt1.value = tz.id;
            opt1.textContent = tz.label;
            tzFrom.appendChild(opt1);
            
            const opt2 = document.createElement('option');
            opt2.value = tz.id;
            opt2.textContent = tz.label;
            tzTo.appendChild(opt2);
        });
        
        // Try to guess local timezone for 'From'
        try {
            const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            let found = false;
            for(let i=0; i<tzFrom.options.length; i++) {
                if(tzFrom.options[i].value === localTz) {
                    tzFrom.selectedIndex = i;
                    found = true;
                    break;
                }
            }
            if(!found) {
                const opt = document.createElement('option');
                opt.value = localTz;
                opt.textContent = `Local (${localTz})`;
                tzFrom.insertBefore(opt, tzFrom.firstChild);
                tzFrom.selectedIndex = 0;
            }
        } catch(e) {}

        tzTo.value = 'UTC'; // Default To target
    }

    populateZones();

    function setCurrentTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        tzDatetime.value = `${year}-${month}-${day}T${hours}:${mins}`;
    }

    setCurrentTime();

    // The logic: Create a Date object assuming the input string represents time in "tzFrom".
    function calculateTime() {
        if(errorMsg) errorMsg.style.display = 'none';
        
        const dtStr = tzDatetime.value;
        const fromZone = tzFrom.value;
        const toZone = tzTo.value;
        
        if (!dtStr) {
            showError('Please enter a date and time.');
            return;
        }

        // JS Date doesn't easily parse a local time string as a specific timezone (other than system local).
        // A robust hack: use Intl.DateTimeFormat to find the offset difference, or manually parse.
        // We will construct the date using the system's local offset first, then shift it so it behaves as if it was entered in the `fromZone`.
        
        // Let's create the date in standard UTC representation just from the values
        const parts = dtStr.split('T');
        const dParts = parts[0].split('-');
        const tParts = parts[1].split(':');
        
        // This is the date as literal values
        const d = new Date(Date.UTC(dParts[0], dParts[1]-1, dParts[2], tParts[0], tParts[1], 0));
        
        // To find the offset of `fromZone` at this exact moment:
        function getOffset(date, timeZone) {
            // Get formatted string in the target timezone
            const formatted = new Intl.DateTimeFormat('en-US', {
                timeZone,
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: false
            }).format(date);
            
            // Re-parse the formatted string in UTC to compare
            const fDate = new Date(formatted + ' UTC');
            return (fDate - date) / (1000 * 60); // minutes difference
        }

        const fromOffset = getOffset(d, fromZone);
        
        // Adjust standard UTC date by the fromZone offset so it aligns to actual UTC moment
        const absoluteUtcDate = new Date(d.getTime() - fromOffset * 60000);

        // Now format absoluteUtcDate into the `toZone`
        const toFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: toZone,
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
        });

        const toStrParts = toFormatter.formatToParts(absoluteUtcDate);
        let timeStr = '';
        let dateStr = '';
        
        const tObj = {};
        toStrParts.forEach(p => tObj[p.type] = p.value);
        
        timeStr = `${tObj.hour}:${tObj.minute} ${tObj.dayPeriod}`;
        dateStr = `${tObj.weekday}, ${tObj.month} ${tObj.day}, ${tObj.year}`;

        resTime.textContent = timeStr;
        resDate.textContent = dateStr;

        // Difference
        const toOffset = getOffset(absoluteUtcDate, toZone);
        const diffMinutes = toOffset - fromOffset;
        
        let diffText = '';
        if (diffMinutes === 0) {
            diffText = 'No time difference';
        } else {
            const h = Math.abs(Math.floor(diffMinutes / 60));
            const m = Math.abs(diffMinutes % 60);
            const sign = diffMinutes > 0 ? 'ahead of' : 'behind';
            
            if (m === 0) {
                diffText = `${h} hour${h!==1?'s':''} ${sign} source zone`;
            } else {
                diffText = `${h} hr ${m} min ${sign} source zone`;
            }
        }
        
        resDiff.textContent = diffText;

        resultBox.style.display = 'block';
    }

    calcBtn.addEventListener('click', calculateTime);

    clearBtn.addEventListener('click', () => {
        setCurrentTime();
        if(errorMsg) errorMsg.style.display = 'none';
        resultBox.style.display = 'none';
    });
});
