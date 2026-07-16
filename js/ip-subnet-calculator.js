document.addEventListener('DOMContentLoaded', () => {
    const ipInput = document.getElementById('ip-address');
    const maskSelect = document.getElementById('subnet-mask');
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    
    const resultBox = document.getElementById('result-box');
    const resNetwork = document.getElementById('res-network');
    const resBroadcast = document.getElementById('res-broadcast');
    const resRange = document.getElementById('res-range');
    const resTotal = document.getElementById('res-total');
    const resUsable = document.getElementById('res-usable');

    function showError(msg) {
        if(errorMsg) {
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            errorMsg.style.display = 'block';
        }
    }

    const ipFormat = null; // No longer used for subnet calc

    function parseIP(ip, format) {
        ip = ip.trim().toLowerCase();
        
        function parseDotted(ipStr, base) {
            const parts = ipStr.split('.');
            if (parts.length !== 4) return null;
            let num = 0;
            for (let i = 0; i < 4; i++) {
                const val = parseInt(parts[i], base);
                if (isNaN(val) || val < 0 || val > 255) return null;
                num = (num << 8) | val;
            }
            return num >>> 0;
        }

        if (format === 'auto' || format === 'ipv4') {
            const res = parseDotted(ip, 10);
            if (res !== null) return res;
        }
        
        if (format === 'auto' || format === 'decimal') {
            if (/^\d+$/.test(ip)) {
                const val = parseInt(ip, 10);
                if (val >= 0 && val <= 4294967295) return val;
            }
        }
        
        if (format === 'auto' || format === 'hex') {
            let hexStr = ip.replace(/0x/g, '').replace(/\./g, '');
            if (/^[0-9a-f]{8}$/.test(hexStr)) {
                return parseInt(hexStr, 16) >>> 0;
            }
            const res = parseDotted(ip, 16);
            if (res !== null) return res;
        }
        
        if (format === 'auto' || format === 'binary') {
            let binStr = ip.replace(/\./g, '').replace(/ /g, '');
            if (/^[01]{32}$/.test(binStr)) {
                return parseInt(binStr, 2) >>> 0;
            }
            const res = parseDotted(ip, 2);
            if (res !== null) return res;
        }
        
        if (format === 'auto' || format === 'octal') {
            const res = parseDotted(ip, 8);
            if (res !== null) return res;
        }
        
        return null;
    }

    function numberToIp(num) {
        return [
            (num >>> 24) & 255,
            (num >>> 16) & 255,
            (num >>> 8) & 255,
            num & 255
        ].join('.');
    }

    function calculateSubnet() {
        if(errorMsg) errorMsg.style.display = 'none';
        
        const ipStr = ipInput.value.trim();
        const cidr = parseInt(maskSelect.value);
        
        if (!ipStr) {
            showError('Please enter an IP address.');
            return;
        }
        
        const ipNum = parseIP(ipStr, 'ipv4');
        if (ipNum === null) {
            showError('Invalid IP address format. (e.g. 192.168.1.10)');
            return;
        }

        // Subnet math
        const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
        const networkNum = (ipNum & maskNum) >>> 0;
        const broadcastNum = (networkNum | ~maskNum) >>> 0;

        const totalHosts = Math.pow(2, 32 - cidr);
        let usableHosts = totalHosts - 2;
        if (cidr === 32) usableHosts = 1;
        if (cidr === 31) usableHosts = 2; // PtP links

        let firstHost = networkNum + 1;
        let lastHost = broadcastNum - 1;
        if (cidr === 32) {
            firstHost = networkNum;
            lastHost = networkNum;
        } else if (cidr === 31) {
            firstHost = networkNum;
            lastHost = broadcastNum;
        }

        // Display results
        resNetwork.textContent = numberToIp(networkNum);
        resBroadcast.textContent = numberToIp(broadcastNum);
        resRange.textContent = `${numberToIp(firstHost)} - ${numberToIp(lastHost)}`;
        resTotal.textContent = totalHosts.toLocaleString();
        resUsable.textContent = Math.max(0, usableHosts).toLocaleString();
        
        resultBox.style.display = 'block';
    }

    calcBtn.addEventListener('click', calculateSubnet);

    clearBtn.addEventListener('click', () => {
        ipInput.value = '';
        maskSelect.value = '24';
        if(errorMsg) errorMsg.style.display = 'none';
        resultBox.style.display = 'none';
    });

    // --- CONVERTER LOGIC ---
    const convFormat = document.getElementById('conv-format');
    const convIpInput = document.getElementById('conv-ip');
    const convBtn = document.getElementById('conv-btn');
    const convClearBtn = document.getElementById('conv-clear-btn');
    const convErrorMsg = document.getElementById('conv-error-msg');
    
    const convResultBox = document.getElementById('conv-result-box');
    const convStd = document.getElementById('conv-std');
    const convDec = document.getElementById('conv-dec');
    const convBin = document.getElementById('conv-bin');
    const convHex = document.getElementById('conv-hex');
    const convOct = document.getElementById('conv-oct');

    function showConvError(msg) {
        if(convErrorMsg) {
            convErrorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            convErrorMsg.style.display = 'block';
        }
    }

    function calculateConversion() {
        if(convErrorMsg) convErrorMsg.style.display = 'none';
        
        let ipStr = convIpInput.value.trim();
        const format = convFormat.value;
        
        if (!ipStr) {
            showConvError('Please enter an IP address to convert.');
            return;
        }
        
        const ipNum = parseIP(ipStr, format);
        if (ipNum === null) {
            showConvError('Invalid IP format for selected type.');
            return;
        }

        // Format to standard
        convStd.textContent = numberToIp(ipNum);
        
        // Format to decimal
        convDec.textContent = ipNum.toString(10);
        
        // Format to binary (32 bit dotted)
        let binStr = (ipNum >>> 0).toString(2).padStart(32, '0');
        convBin.textContent = [binStr.slice(0,8), binStr.slice(8,16), binStr.slice(16,24), binStr.slice(24,32)].join('.');
        
        // Format to hex (dotted)
        let hexStr = (ipNum >>> 0).toString(16).padStart(8, '0').toUpperCase();
        convHex.textContent = '0x' + hexStr;
        
        // Format to octal (dotted)
        const oct1 = ((ipNum >>> 24) & 255).toString(8).padStart(4, '0');
        const oct2 = ((ipNum >>> 16) & 255).toString(8).padStart(4, '0');
        const oct3 = ((ipNum >>> 8) & 255).toString(8).padStart(4, '0');
        const oct4 = (ipNum & 255).toString(8).padStart(4, '0');
        convOct.textContent = `${oct1}.${oct2}.${oct3}.${oct4}`;

        convResultBox.style.display = 'block';
    }

    convBtn.addEventListener('click', calculateConversion);

    // Real-time input filtering
    convIpInput.addEventListener('input', (e) => {
        const format = convFormat.value;
        let val = e.target.value;
        
        if (format === 'binary') {
            // Allow only 0, 1, dot, space
            e.target.value = val.replace(/[^01\.\s]/g, '');
        } else if (format === 'hex') {
            // Allow hex chars, dot, x
            e.target.value = val.replace(/[^0-9a-fA-F\.\sx]/g, '');
        } else if (format === 'decimal' || format === 'octal' || format === 'ipv4') {
            // Allow numbers and dot
            e.target.value = val.replace(/[^0-9\.\s]/g, '');
        }
    });

    convFormat.addEventListener('change', () => {
        // Clear input when format changes to avoid confusion
        convIpInput.value = '';
        if(convErrorMsg) convErrorMsg.style.display = 'none';
        convResultBox.style.display = 'none';
    });

    convClearBtn.addEventListener('click', () => {
        convIpInput.value = '';
        convFormat.value = 'auto';
        if(convErrorMsg) convErrorMsg.style.display = 'none';
        convResultBox.style.display = 'none';
    });
});
