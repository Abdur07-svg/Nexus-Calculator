document.addEventListener('DOMContentLoaded', () => {
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const lenUnit = document.getElementById('len-unit');
    const widUnit = document.getElementById('wid-unit');
    const hgtUnit = document.getElementById('hgt-unit');
    const roomTypeSelect = document.getElementById('room-type');
    const exposureSelect = document.getElementById('exposure');
    const peopleInput = document.getElementById('people');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');

    // Sync units for convenience
    [lenUnit, widUnit, hgtUnit].forEach(select => {
        select.addEventListener('change', (e) => {
            let val = e.target.value;
            lenUnit.value = val;
            widUnit.value = val;
            hgtUnit.value = val;
        });
    });

    // Standard EPA cooling capacity mapping based on Square Feet (assuming standard 8ft ceiling)
    function getBaseBTU(sqft) {
        if (sqft <= 150) return 5000;
        if (sqft <= 250) return 6000;
        if (sqft <= 300) return 7000;
        if (sqft <= 350) return 8000;
        if (sqft <= 400) return 9000;
        if (sqft <= 450) return 10000;
        if (sqft <= 550) return 12000;
        if (sqft <= 700) return 14000;
        if (sqft <= 1000) return 18000;
        if (sqft <= 1200) return 21000;
        if (sqft <= 1400) return 23000;
        if (sqft <= 1500) return 24000;
        if (sqft <= 2000) return 30000;
        if (sqft <= 2500) return 34000;
        return sqft * 20; 
    }

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        
        let length = parseFloat(lengthInput.value);
        let width = parseFloat(widthInput.value);
        let height = parseFloat(heightInput.value);
        let people = parseInt(peopleInput.value);

        if (isNaN(length) || isNaN(width) || isNaN(height) || length <= 0 || width <= 0 || height <= 0) {
            errorMsg.textContent = 'Please enter valid room dimensions and ceiling height.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        if (isNaN(people) || people < 1) {
            people = 1;
        }

        let l_ft = length;
        let w_ft = width;
        let h_ft = height;

        // Convert meters to feet if selected
        if (lenUnit.value === 'm') l_ft *= 3.28084;
        if (widUnit.value === 'm') w_ft *= 3.28084;
        if (hgtUnit.value === 'm') h_ft *= 3.28084;

        let sqft = l_ft * w_ft;
        let baseBTU = getBaseBTU(sqft);
        let finalBTU = baseBTU;

        // Height Adjustment (proportional to standard 8ft ceiling)
        finalBTU = finalBTU * (h_ft / 8);

        // Room Type Adjustment
        if (roomTypeSelect.value === 'kitchen') {
            finalBTU += 4000;
        } else if (roomTypeSelect.value === 'attic') {
            finalBTU *= 1.15; // +15%
        } else if (roomTypeSelect.value === 'basement') {
            finalBTU *= 0.85; // -15%
        }

        // Exposure Adjustment
        if (exposureSelect.value === 'shaded') {
            finalBTU *= 0.90; // -10%
        } else if (exposureSelect.value === 'sunny') {
            finalBTU *= 1.10; // +10%
        }

        // Occupant Adjustment (+600 for every person beyond 2)
        if (people > 2) {
            finalBTU += (people - 2) * 600;
        }

        detailedRes.innerHTML = `
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Recommended Cooling Capacity</div>
            <div style="font-size: 32px; font-weight: 700; color: var(--btn-operator-color); margin-bottom: 5px;">
                ${Math.round(finalBTU).toLocaleString()} BTUs
            </div>
            
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Room Area</div>
            <div style="font-size: 20px; font-weight: 600; color: var(--text-primary);">
                ${sqft.toLocaleString()} sq ft
            </div>
            
            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 15px; font-style: italic;">
                Note: This is an estimate based on standard guidelines. High ceilings or poor insulation may require higher capacity.
            </div>
        `;

        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        lengthInput.value = '';
        widthInput.value = '';
        heightInput.value = '8';
        unitSelect.value = 'ft';
        roomTypeSelect.value = 'bedroom';
        exposureSelect.value = 'normal';
        peopleInput.value = '2';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
