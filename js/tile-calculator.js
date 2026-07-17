document.addEventListener('DOMContentLoaded', () => {
    const areaL = document.getElementById('area-l');
    const areaW = document.getElementById('area-w');
    const areaUnit = document.getElementById('area-unit');
    const areaWUnit = document.getElementById('area-w-unit');
    
    const tileL = document.getElementById('tile-l');
    const tileW = document.getElementById('tile-w');
    const tileUnit = document.getElementById('tile-unit');
    const tileWUnit = document.getElementById('tile-w-unit');
    
    const gapW = document.getElementById('gap-w');
    const gapUnit = document.getElementById('gap-unit');
    
    const wasteInput = document.getElementById('waste');
    
    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const resultBox = document.getElementById('result-box');
    const detailedRes = document.getElementById('detailed-res');

    function getMultiplierToInches(unit) {
        switch(unit) {
            case 'ft': return 12;
            case 'm': return 39.3701;
            case 'in': return 1;
            case 'cm': return 0.393701;
            case 'mm': return 0.0393701;
            default: return 1;
        }
    }

    calcBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        const aL = parseFloat(areaL.value);
        const aW = parseFloat(areaW.value);
        const tL = parseFloat(tileL.value);
        const tW = parseFloat(tileW.value);
        const gap = parseFloat(gapW.value) || 0;
        const waste = parseFloat(wasteInput.value) || 0;

        if (isNaN(aL) || isNaN(aW) || isNaN(tL) || isNaN(tW) || aL <= 0 || aW <= 0 || tL <= 0 || tW <= 0 || gap < 0) {
            errorMsg.textContent = 'Please enter valid numbers for lengths and widths.';
            errorMsg.style.display = 'block';
            resultBox.classList.remove('active');
            return;
        }

        const areaLengthInches = aL * getMultiplierToInches(areaUnit.value);
        const areaWidthInches = aW * getMultiplierToInches(areaWUnit.value);
        const totalAreaSqInches = areaLengthInches * areaWidthInches;

        const tileLengthInches = tL * getMultiplierToInches(tileUnit.value);
        const tileWidthInches = tW * getMultiplierToInches(tileWUnit.value);
        const gapInches = gap * getMultiplierToInches(gapUnit.value);
        
        // Add gap to tile dimensions
        const effectiveTileLengthInches = tileLengthInches + gapInches;
        const effectiveTileWidthInches = tileWidthInches + gapInches;
        
        const tileAreaSqInches = effectiveTileLengthInches * effectiveTileWidthInches;

        // Base calculations
        const exactTiles = totalAreaSqInches / tileAreaSqInches;
        const totalAreaSqFt = totalAreaSqInches / 144;
        const totalAreaSqM = totalAreaSqInches / 1550.0031;
        
        const wasteMultiplier = 1 + (waste / 100);
        const tilesWithWaste = Math.ceil(exactTiles * wasteMultiplier);

        detailedRes.innerHTML = `
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Total Area</div>
            <div style="font-size: 22px; font-weight: 700; color: var(--text-primary); margin-bottom: 20px;">
                ${totalAreaSqFt.toLocaleString(undefined, {maximumFractionDigits: 2})} sq ft<br>
                <span style="font-size: 16px; font-weight: 500;">(${totalAreaSqM.toLocaleString(undefined, {maximumFractionDigits: 2})} sq m)</span>
            </div>
            
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Exact Tiles Needed</div>
            <div style="font-size: 22px; font-weight: 700; color: var(--text-primary); margin-bottom: 20px;">
                ${Math.ceil(exactTiles)} tiles
            </div>

            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px;">Tiles Needed (incl. ${waste}% waste)</div>
            <div style="font-size: 28px; font-weight: 700; color: var(--btn-operator-color);">
                ${tilesWithWaste} tiles
            </div>
        `;

        resultBox.classList.add('active');
    });

    clearBtn.addEventListener('click', () => {
        areaL.value = '';
        areaW.value = '';
        tileL.value = '';
        tileW.value = '';
        gapW.value = '';
        wasteInput.value = '10';
        resultBox.classList.remove('active');
        errorMsg.style.display = 'none';
    });
});
