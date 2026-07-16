document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.omni-input');
    const units = document.querySelectorAll('.omni-unit');
    const clearBtn = document.getElementById('clear-btn');

    // State in base units (meters, steps, degrees)
    let state = {
        run_step: null,
        rise_step: null,
        tot_rise: null,
        steps: null,
        tot_run: null,
        bot_rise: null,
        str_len: null,
        str_hgt: null,
        angle: null
    };

    const CONV = {
        m: 1,
        cm: 0.01,
        in: 0.0254,
        ft: 0.3048,
        deg: 1,
        rad: 180 / Math.PI
    };

    function toBase(val, unit) {
        if (!unit) return val;
        return val * CONV[unit];
    }

    function fromBase(val, unit) {
        if (!unit) return val;
        return val / CONV[unit];
    }

    function getUnit(key) {
        const u = document.getElementById('unit-' + key);
        return u ? u.value : null;
    }

    function updateDOM() {
        inputs.forEach(input => {
            const key = input.dataset.type;
            if (state[key] !== null && document.activeElement !== input) {
                const val = fromBase(state[key], getUnit(key));
                // Round to 4 decimal places avoiding scientific notation
                input.value = parseFloat(val.toFixed(4));
            } else if (state[key] === null && document.activeElement !== input) {
                input.value = '';
            }
        });
    }

    function solve() {
        let changed = true;
        let iters = 0;
        while (changed && iters < 10) {
            changed = false;
            iters++;

            // steps = tot_rise / rise_step
            if (state.steps === null && state.tot_rise !== null && state.rise_step !== null) {
                state.steps = Math.round(state.tot_rise / state.rise_step);
                changed = true;
            }
            if (state.tot_rise === null && state.steps !== null && state.rise_step !== null) {
                state.tot_rise = state.steps * state.rise_step;
                changed = true;
            }
            if (state.rise_step === null && state.tot_rise !== null && state.steps !== null && state.steps !== 0) {
                state.rise_step = state.tot_rise / state.steps;
                changed = true;
            }

            // tot_run = step_run * steps
            if (state.tot_run === null && state.step_run !== null && state.steps !== null) {
                state.tot_run = state.step_run * state.steps;
                changed = true;
            }
            if (state.step_run === null && state.tot_run !== null && state.steps !== null && state.steps !== 0) {
                state.step_run = state.tot_run / state.steps;
                changed = true;
            }
            if (state.steps === null && state.tot_run !== null && state.step_run !== null && state.step_run !== 0) {
                state.steps = Math.round(state.tot_run / state.step_run);
                changed = true;
            }

            // str_len = sqrt(tot_rise^2 + tot_run^2)
            if (state.str_len === null && state.tot_rise !== null && state.tot_run !== null) {
                state.str_len = Math.sqrt(state.tot_rise**2 + state.tot_run**2);
                changed = true;
            }
            if (state.tot_run === null && state.str_len !== null && state.tot_rise !== null) {
                const val = state.str_len**2 - state.tot_rise**2;
                if(val >= 0) { state.tot_run = Math.sqrt(val); changed = true; }
            }
            if (state.tot_rise === null && state.str_len !== null && state.tot_run !== null) {
                const val = state.str_len**2 - state.tot_run**2;
                if(val >= 0) { state.tot_rise = Math.sqrt(val); changed = true; }
            }

            // angle = atan(tot_rise / tot_run)
            if (state.angle === null && state.tot_rise !== null && state.tot_run !== null && state.tot_run !== 0) {
                state.angle = Math.atan(state.tot_rise / state.tot_run) * (180 / Math.PI);
                changed = true;
            }
            if (state.tot_rise === null && state.angle !== null && state.tot_run !== null) {
                state.tot_rise = Math.tan(state.angle * Math.PI / 180) * state.tot_run;
                changed = true;
            }
            if (state.tot_run === null && state.angle !== null && state.tot_rise !== null) {
                state.tot_run = state.tot_rise / Math.tan(state.angle * Math.PI / 180);
                changed = true;
            }
            // bot_rise = rise_step (default)
            if (state.bot_rise === null && state.rise_step !== null) {
                state.bot_rise = state.rise_step;
                changed = true;
            }
            if (state.rise_step === null && state.bot_rise !== null) {
                // Not always strictly true, but for simple estimation
                state.rise_step = state.bot_rise;
                changed = true;
            }

            // str_hgt = tot_rise (default)
            if (state.str_hgt === null && state.tot_rise !== null) {
                state.str_hgt = state.tot_rise;
                changed = true;
            }
            if (state.tot_rise === null && state.str_hgt !== null) {
                state.tot_rise = state.str_hgt;
                changed = true;
            }
        }
    }

    function handleInput(e) {
        const input = e.target;
        const key = input.dataset.type;
        const valStr = input.value.trim();
        
        if (valStr === '') {
            state[key] = null;
        } else {
            const val = parseFloat(valStr);
            if (!isNaN(val)) {
                state[key] = toBase(val, getUnit(key));
            } else {
                state[key] = null;
            }
        }
        
        // When typing, if a conflict happens, we usually need a robust dependency graph.
        // For simplicity, we just recalculate the rest based on user inputs.
        // Let's gather all currently active inputs and re-solve from scratch.
        let activeKeys = [];
        inputs.forEach(inp => {
            if (inp.value.trim() !== '') {
                activeKeys.push(inp.dataset.type);
            }
        });

        const errorMsg = document.getElementById('error-msg');
        if (errorMsg) errorMsg.style.display = 'none';

        // Reset state
        for (let k in state) state[k] = null;
        
        // Restore manual inputs
        inputs.forEach(inp => {
            if (activeKeys.includes(inp.dataset.type)) {
                const v = parseFloat(inp.value);
                if(!isNaN(v)) state[inp.dataset.type] = toBase(v, getUnit(inp.dataset.type));
            }
        });

        solve();
        updateDOM();
    }

    inputs.forEach(input => {
        input.addEventListener('input', handleInput);
    });

    units.forEach(unit => {
        unit.addEventListener('change', () => {
            // Re-render the values based on new unit
            updateDOM();
        });
    });

    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            let activeInputs = 0;
            inputs.forEach(inp => {
                if (inp.value.trim() !== '') activeInputs++;
            });
            
            const errorMsg = document.getElementById('error-msg');
            if (activeInputs < 2) {
                if (errorMsg) {
                    errorMsg.innerHTML = '<i class="fa-solid fa-circle-info"></i> Please enter at least TWO values to calculate.';
                    errorMsg.style.display = 'block';
                }
            } else {
                if (errorMsg) errorMsg.style.display = 'none';
                solve();
                updateDOM();
            }
        });
    }

    clearBtn.addEventListener('click', () => {
        for (let k in state) state[k] = null;
        inputs.forEach(inp => inp.value = '');
        const errorMsg = document.getElementById('error-msg');
        if (errorMsg) errorMsg.style.display = 'none';
    });
});
