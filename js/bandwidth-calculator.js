document.addEventListener('DOMContentLoaded', () => {
    const sizeInput = document.getElementById('file-size');
    const sizeUnit = document.getElementById('size-unit');
    const speedInput = document.getElementById('speed');
    const speedUnit = document.getElementById('speed-unit');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');

    function getMultiplierToBytes(unit) {
        switch(unit) {
            case 'B': return 1;
            case 'KB': return 1024;
            case 'MB': return 1024 * 1024;
            case 'GB': return 1024 * 1024 * 1024;
            case 'TB': return 1024 * 1024 * 1024 * 1024;
            default: return 1;
        }
    }

    function getSpeedMultiplierToBytesPerSec(unit) {
        switch(unit) {
            case 'Kbps': return 1000 / 8; // Kilobits per sec -> Bytes per sec
            case 'Mbps': return 1000000 / 8; // Megabits per sec
            case 'Gbps': return 1000000000 / 8; // Gigabits per sec
            case 'KBps': return 1024; // KiloBytes per sec
            case 'MBps': return 1024 * 1024; // MegaBytes per sec
            default: return 1;
        }
    }

    function formatTime(totalSeconds) {
        if (totalSeconds < 1) return "Less than a second";
        
        const days = Math.floor(totalSeconds / 86400);
        let remainder = totalSeconds % 86400;
        
        const hours = Math.floor(remainder / 3600);
        remainder = remainder % 3600;
        
        const minutes = Math.floor(remainder / 60);
        const seconds = Math.floor(remainder % 60);
        
        let parts = [];
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
        if (hours > 0) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
        if (minutes > 0) parts.push(`${minutes} min`);
        if (seconds > 0) parts.push(`${seconds} sec`);
        
        return parts.join(' ');
    }

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        const s = parseFloat(sizeInput.value);
        const sp = parseFloat(speedInput.value);

        if (isNaN(s) || isNaN(sp) || s <= 0 || sp <= 0) {
            errorMsg.textContent = 'Please enter valid positive numbers for size and speed.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        const sizeInBytes = s * getMultiplierToBytes(sizeUnit.value);
        const speedInBytesPerSec = sp * getSpeedMultiplierToBytesPerSec(speedUnit.value);

        const timeInSeconds = sizeInBytes / speedInBytesPerSec;

        detailedRes.innerHTML = `
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Estimated Download Time</div>
            <div style="font-size: 24px; font-weight: 700; color: var(--btn-operator-color); line-height: 1.4;">
                ${formatTime(timeInSeconds)}
            </div>
            <div style="font-size: 14px; color: var(--text-secondary); margin-top: 15px; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 15px;">
                <strong>Size:</strong> ${(sizeInBytes / (1024*1024)).toLocaleString(undefined, {maximumFractionDigits: 2})} MB<br>
                <strong>Speed:</strong> ${(speedInBytesPerSec / (1024*1024)).toLocaleString(undefined, {maximumFractionDigits: 2})} MB/s
            </div>
        `;

        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        sizeInput.value = '';
        speedInput.value = '';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
