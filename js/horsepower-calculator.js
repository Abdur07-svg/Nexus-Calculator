document.addEventListener('DOMContentLoaded', () => {
    const hpMethod = document.getElementById('hp-method');
    const hpWeight = document.getElementById('hp-weight');
    const hpWeightUnit = document.getElementById('hp-weight-unit');
    
    const hpEt = document.getElementById('hp-et');
    const hpEtUnit = document.getElementById('hp-et-unit');
    
    const hpSpeed = document.getElementById('hp-speed');
    const hpSpeedUnit = document.getElementById('hp-speed-unit');
    
    const etGroup = document.getElementById('et-group');
    const speedGroup = document.getElementById('speed-group');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    
    const resultBox = document.getElementById('result-box');
    const resMech = document.getElementById('res-mech');
    const resMetric = document.getElementById('res-metric');
    const resKw = document.getElementById('res-kw');
    const resFtlb = document.getElementById('res-ftlb');

    function showError(msg) {
        if(errorMsg) {
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
            errorMsg.style.display = 'block';
        }
    }

    hpMethod.addEventListener('change', () => {
        if (hpMethod.value === 'et') {
            etGroup.style.display = 'block';
            speedGroup.style.display = 'none';
        } else {
            etGroup.style.display = 'none';
            speedGroup.style.display = 'block';
        }
        resultBox.style.display = 'none';
        if(errorMsg) errorMsg.style.display = 'none';
    });

    function calculateHP() {
        if(errorMsg) errorMsg.style.display = 'none';
        
        let weight = parseFloat(hpWeight.value);
        const method = hpMethod.value;
        
        if (isNaN(weight) || weight <= 0) {
            showError('Please enter a valid vehicle weight.');
            return;
        }

        // Convert weight to lbs if kg
        if (hpWeightUnit.value === 'kg') {
            weight = weight * 2.20462;
        }

        let hp = 0;

        if (method === 'et') {
            let et = parseFloat(hpEt.value);
            if (isNaN(et) || et <= 0) {
                showError('Please enter a valid Quarter Mile Time.');
                return;
            }
            // Convert min to sec
            if (hpEtUnit.value === 'min') {
                et = et * 60;
            }
            
            // Formula: HP = Weight / (ET / 5.825)^3
            hp = weight / Math.pow((et / 5.825), 3);
        } else {
            let speed = parseFloat(hpSpeed.value);
            if (isNaN(speed) || speed <= 0) {
                showError('Please enter a valid Trap Speed.');
                return;
            }
            // Convert km/h to mph
            if (hpSpeedUnit.value === 'kmh') {
                speed = speed * 0.621371;
            }
            
            // Formula: HP = Weight * (Speed / 234)^3
            hp = weight * Math.pow((speed / 234), 3);
        }

        const metric = hp * 1.01387;
        const kw = hp * 0.7457;
        const ftlb = hp * 550;

        resMech.textContent = Math.round(hp) + ' HP';
        resMetric.textContent = Math.round(metric) + ' PS';
        resKw.textContent = kw.toFixed(2) + ' kW';
        resFtlb.textContent = Math.round(ftlb) + ' ft-lb/s';

        resultBox.style.display = 'block';
    }

    calcBtn.addEventListener('click', calculateHP);

    clearBtn.addEventListener('click', () => {
        hpWeight.value = '';
        hpEt.value = '';
        hpSpeed.value = '';
        if(errorMsg) errorMsg.style.display = 'none';
        resultBox.style.display = 'none';
    });
});
