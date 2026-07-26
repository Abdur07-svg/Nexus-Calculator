document.addEventListener('DOMContentLoaded', () => {
    const shapeSelector = document.getElementById('shape-selector');
    const unitSelector = document.getElementById('unit-selector');
    
    // Input containers
    const inputsCube = document.getElementById('inputs-cube');
    const inputsSphere = document.getElementById('inputs-sphere');
    const inputsCylinder = document.getElementById('inputs-cylinder');
    const inputsCone = document.getElementById('inputs-cone');
    const inputsRectangularTank = document.getElementById('inputs-rectangular-tank');
    const inputsTube = document.getElementById('inputs-tube');
    const inputsCapsule = document.getElementById('inputs-capsule');
    const inputsSphericalCap = document.getElementById('inputs-spherical-cap');
    const inputsConicalFrustum = document.getElementById('inputs-conical-frustum');
    const inputsEllipsoid = document.getElementById('inputs-ellipsoid');
    const inputsSquarePyramid = document.getElementById('inputs-square-pyramid');
    
    const inputContainers = [
        inputsCube, inputsSphere, inputsCylinder, inputsCone,
        inputsRectangularTank, inputsTube, inputsCapsule,
        inputsSphericalCap, inputsConicalFrustum, inputsEllipsoid, inputsSquarePyramid
    ];
    
    // Inputs mapping for easier enter key handling
    const inputIds = [
        'cube-edge', 'sphere-radius', 'cylinder-radius', 'cylinder-height',
        'cone-radius', 'cone-height', 'tank-length', 'tank-width', 'tank-height',
        'tube-outer', 'tube-inner', 'tube-length', 'capsule-radius', 'capsule-length',
        'cap-base', 'cap-height', 'frustum-bottom', 'frustum-top', 'frustum-height',
        'ellipsoid-a', 'ellipsoid-b', 'ellipsoid-c', 'pyramid-edge', 'pyramid-height'
    ];

    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const resultBox = document.getElementById('result-box');
    const resultVolume = document.getElementById('result-volume');
    const resultUnit = document.getElementById('result-unit');
    const errorMsg = document.getElementById('error-msg');

    // Handle shape change
    shapeSelector.addEventListener('change', () => {
        // Hide all
        inputContainers.forEach(container => {
            if(container) container.classList.remove('active');
        });
        
        // Show selected
        const selected = shapeSelector.value;
        const selectedContainer = document.getElementById(`inputs-${selected}`);
        if(selectedContainer) {
            selectedContainer.classList.add('active');
        }
        
        // Reset results and errors
        clearInputs();
    });

    // Handle unit change
    unitSelector.addEventListener('change', () => {
        if(resultBox.classList.contains('active')) {
            resultUnit.textContent = unitSelector.value + '³';
        }
    });

    function getVal(id) {
        const val = parseFloat(document.getElementById(id).value);
        if (isNaN(val) || val < 0) throw "Please enter valid positive values.";
        return val;
    }

    function calculateVolume() {
        const shape = shapeSelector.value;
        let volume = 0;

        try {
            if (shape === 'cube') {
                const a = getVal('cube-edge');
                if(a === 0) throw "Value must be greater than zero.";
                volume = Math.pow(a, 3);
            } 
            else if (shape === 'sphere') {
                const r = getVal('sphere-radius');
                volume = (4 / 3) * Math.PI * Math.pow(r, 3);
            }
            else if (shape === 'cylinder') {
                const r = getVal('cylinder-radius');
                const h = getVal('cylinder-height');
                volume = Math.PI * Math.pow(r, 2) * h;
            }
            else if (shape === 'cone') {
                const r = getVal('cone-radius');
                const h = getVal('cone-height');
                volume = (1 / 3) * Math.PI * Math.pow(r, 2) * h;
            }
            else if (shape === 'rectangular-tank') {
                const l = getVal('tank-length');
                const w = getVal('tank-width');
                const h = getVal('tank-height');
                volume = l * w * h;
            }
            else if (shape === 'tube') {
                const R = getVal('tube-outer');
                const r = getVal('tube-inner');
                const h = getVal('tube-length');
                if (r >= R) throw "Inner radius must be smaller than outer radius.";
                volume = Math.PI * (Math.pow(R, 2) - Math.pow(r, 2)) * h;
            }
            else if (shape === 'capsule') {
                const r = getVal('capsule-radius');
                const a = getVal('capsule-length');
                // volume = pi * r^2 * ( (4/3)*r + a )
                volume = Math.PI * Math.pow(r, 2) * ((4 / 3) * r + a);
            }
            else if (shape === 'spherical-cap') {
                const a = getVal('cap-base');
                const h = getVal('cap-height');
                // volume = (pi * h / 6) * (3*a^2 + h^2)
                volume = (Math.PI * h / 6) * (3 * Math.pow(a, 2) + Math.pow(h, 2));
            }
            else if (shape === 'conical-frustum') {
                const R = getVal('frustum-bottom');
                const r = getVal('frustum-top');
                const h = getVal('frustum-height');
                // volume = (pi * h / 3) * (R^2 + R*r + r^2)
                volume = (Math.PI * h / 3) * (Math.pow(R, 2) + (R * r) + Math.pow(r, 2));
            }
            else if (shape === 'ellipsoid') {
                const a = getVal('ellipsoid-a');
                const b = getVal('ellipsoid-b');
                const c = getVal('ellipsoid-c');
                volume = (4 / 3) * Math.PI * a * b * c;
            }
            else if (shape === 'square-pyramid') {
                const a = getVal('pyramid-edge');
                const h = getVal('pyramid-height');
                volume = (1 / 3) * Math.pow(a, 2) * h;
            }

            errorMsg.style.display = 'none';
            resultVolume.textContent = formatNumber(volume);
            resultUnit.textContent = unitSelector.value + '³';
            resultBox.classList.add('active');
            
        } catch (err) {
            showError(err);
        }
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        resultBox.classList.remove('active');
    }

    function formatNumber(num) {
        if (num === 0) return "0";
        if (Number.isInteger(num)) {
            return num.toString();
        }
        return num.toFixed(4).replace(/\.?0+$/, ''); // Max 4 decimal places, trim trailing zeros
    }

    function clearInputs() {
        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.value = '';
        });
        
        errorMsg.style.display = 'none';
        resultBox.classList.remove('active');
    }

    calcBtn.addEventListener('click', calculateVolume);
    clearBtn.addEventListener('click', clearInputs);

    // Handle enter key
    inputIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    calculateVolume();
                }
            });
        }
    });
});
