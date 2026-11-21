// DualAudio Sync Web Controller & Audio Engine Simulator
// Engineered by Adham Cherkaoui Eddeqaqi

let isCalibrating = false;
let isSimulated = false;
let pollInterval = null;
let audioCtx = null;
let metronomeInterval = null;
let currentDelay = 1740;
let sonosVol = 45;
let citytekVol = 60;
let masterVol = 75;
let isSonosMuted = false;
let isCitytekMuted = false;
let isShieldActive = true;

// DOM Elements
const autopilotPill = document.getElementById('autopilot-pill');
const autopilotText = document.getElementById('autopilot-text');
const btnRestartStream = document.getElementById('btn-restart-stream');
const btnToggleNotifs = document.getElementById('btn-toggle-notifs');
const shieldStatusText = document.getElementById('shield-status-text');
const heroShieldTag = document.getElementById('hero-shield-tag');
const heroShieldText = document.getElementById('hero-shield-text');

// Sonos Elements
const sonosStatusBadge = document.getElementById('sonos-status-badge');
const sonosStatusText = document.getElementById('sonos-status-text');
const sonosDeviceName = document.getElementById('sonos-device-name');
const sonosIpDisplay = document.getElementById('sonos-ip-display');
const btnEditSonosIp = document.getElementById('btn-edit-sonos-ip');
const sonosVolSlider = document.getElementById('sonos-vol-slider');
const sonosVolVal = document.getElementById('sonos-vol-val');
const btnSonosMute = document.getElementById('btn-sonos-mute');

// Citytek Elements
const citytekStatusBadge = document.getElementById('citytek-status-badge');
const citytekStatusText = document.getElementById('citytek-status-text');
const citytekDeviceDropdown = document.getElementById('citytek-device-dropdown');
const citytekVolSlider = document.getElementById('citytek-vol-slider');
const citytekVolVal = document.getElementById('citytek-vol-val');
const btnCitytekMute = document.getElementById('btn-citytek-mute');

// Sync Elements
const syncDelaySlider = document.getElementById('sync-delay-slider');
const delayNumDisplay = document.getElementById('delay-num-display');
const btnCalibrateBeat = document.getElementById('btn-calibrate-beat');
const calibrateBtnText = document.getElementById('calibrate-btn-text');

// Master Controls
const masterVolSlider = document.getElementById('master-vol-slider');
const masterVolVal = document.getElementById('master-vol-val');
const heroVuLeft = document.getElementById('hero-vu-left');
const heroVuRight = document.getElementById('hero-vu-right');
const audioActivityStatus = document.getElementById('audio-activity-status');
const footerStreamUrl = document.getElementById('footer-stream-url');

// Initialize Web Audio API for synthetic metronome clicks
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

// Play synthetic acoustic metronome click
function playMetronomeClick(pitch = 880) {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.7 * (masterVol / 100), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);

        // Flash VU meters synchronously
        if (heroVuLeft && heroVuRight) {
            heroVuLeft.style.width = '92%';
            heroVuRight.style.width = '96%';
            setTimeout(() => {
                heroVuLeft.style.width = '65%';
                heroVuRight.style.width = '70%';
            }, 80);
        }
    } catch (e) {
        console.warn('WebAudio tick error:', e);
    }
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
    initControls();
    startStatusChecker();
    initPresets();
    startVuSimulation();
});

function initControls() {
    // Sync delay slider
    if (syncDelaySlider) {
        syncDelaySlider.addEventListener('input', (e) => {
            currentDelay = parseInt(e.target.value);
            if (delayNumDisplay) delayNumDisplay.textContent = currentDelay;
            updatePresetChips(currentDelay);
            sendDelay(currentDelay);
        });
    }

    // Sonos volume
    if (sonosVolSlider) {
        sonosVolSlider.addEventListener('input', (e) => {
            sonosVol = parseInt(e.target.value);
            if (sonosVolVal) sonosVolVal.textContent = sonosVol + '%';
            sendSonosVolume(sonosVol);
        });
    }

    // Citytek volume
    if (citytekVolSlider) {
        citytekVolSlider.addEventListener('input', (e) => {
            citytekVol = parseInt(e.target.value);
            if (citytekVolVal) citytekVolVal.textContent = citytekVol + '%';
            sendCitytekVolume(citytekVol);
        });
    }

    // Master volume
    if (masterVolSlider) {
        masterVolSlider.addEventListener('input', (e) => {
            masterVol = parseInt(e.target.value);
            if (masterVolVal) masterVolVal.textContent = masterVol + '%';
            sendMasterVolume(masterVol);
        });
    }

    // Sonos Mute
    if (btnSonosMute) {
        btnSonosMute.addEventListener('click', () => {
            isSonosMuted = !isSonosMuted;
            btnSonosMute.classList.toggle('active', isSonosMuted);
            btnSonosMute.querySelector('span').textContent = isSonosMuted ? 'Unmute Sonos' : 'Mute Sonos';
            if (sonosVolSlider) sonosVolSlider.style.opacity = isSonosMuted ? '0.4' : '1';
        });
    }

    // Citytek Mute
    if (btnCitytekMute) {
        btnCitytekMute.addEventListener('click', () => {
            isCitytekMuted = !isCitytekMuted;
            btnCitytekMute.classList.toggle('active', isCitytekMuted);
            btnCitytekMute.querySelector('span').textContent = isCitytekMuted ? 'Unmute Citytek' : 'Mute Citytek';
            if (citytekVolSlider) citytekVolSlider.style.opacity = isCitytekMuted ? '0.4' : '1';
        });
    }

    // Notification Shield Toggle
    if (btnToggleNotifs) {
        btnToggleNotifs.addEventListener('click', () => {
            isShieldActive = !isShieldActive;
            updateShieldUI(isShieldActive);
        });
    }

    // Calibrate Metronome Button
    if (btnCalibrateBeat) {
        btnCalibrateBeat.addEventListener('click', toggleCalibration);
    }

    // Restart Stream button
    if (btnRestartStream) {
        btnRestartStream.addEventListener('click', () => {
            btnRestartStream.disabled = true;
            const originalText = btnRestartStream.querySelector('span').textContent;
            btnRestartStream.querySelector('span').textContent = 'Rebuilding Stream...';
            setTimeout(() => {
                btnRestartStream.disabled = false;
                btnRestartStream.querySelector('span').textContent = originalText;
                showToast('Stream pipe rebuilt at 44.1kHz 16-bit Stereo');
            }, 800);
        });
    }

    // Set Sonos IP button
    if (btnEditSonosIp) {
        btnEditSonosIp.addEventListener('click', () => {
            const currentIp = sonosIpDisplay.textContent.trim();
            const newIp = prompt('Enter Sonos Play:1 Local IP Address:', currentIp);
            if (newIp && newIp.trim() !== '') {
                sonosIpDisplay.textContent = newIp.trim();
                showToast(`Target Sonos IP updated to ${newIp.trim()}`);
            }
        });
    }
}

function initPresets() {
    const chips = document.querySelectorAll('.quick-preset-chips .chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const delay = parseInt(chip.dataset.delay);
            currentDelay = delay;
            if (syncDelaySlider) syncDelaySlider.value = delay;
            if (delayNumDisplay) delayNumDisplay.textContent = delay;
            updatePresetChips(delay);
            sendDelay(delay);
        });
    });
}

function updatePresetChips(val) {
    document.querySelectorAll('.quick-preset-chips .chip').forEach(c => {
        c.classList.toggle('active', parseInt(c.dataset.delay) === val);
    });
}

function updateShieldUI(active) {
    if (btnToggleNotifs) {
        btnToggleNotifs.classList.toggle('active', active);
        btnToggleNotifs.classList.toggle('inactive', !active);
    }
    if (shieldStatusText) {
        shieldStatusText.textContent = active ? 'Shield: Windows Clicks Blocked' : 'Shield: Alerts Allowed';
    }
    if (heroShieldTag) {
        heroShieldTag.className = active ? 'feature-tag active' : 'feature-tag';
    }
    if (heroShieldText) {
        heroShieldText.textContent = active ? 'Notification Sounds Blocked' : 'Notification Sounds Allowed';
    }
}

// Metronome Calibration Beat (WebAudio synthetic click)
function toggleCalibration() {
    isCalibrating = !isCalibrating;
    if (isCalibrating) {
        getAudioContext();
        btnCalibrateBeat.classList.add('active');
        calibrateBtnText.textContent = 'Stop Metronome Beat';
        btnCalibrateBeat.style.background = '#ef4444';
        
        // Fire every 600ms (100 BPM)
        playMetronomeClick(1000);
        metronomeInterval = setInterval(() => {
            playMetronomeClick(880);
        }, 600);
    } else {
        btnCalibrateBeat.classList.remove('active');
        calibrateBtnText.textContent = 'Test Sync (Metronome Click)';
        btnCalibrateBeat.style.background = '';
        if (metronomeInterval) {
            clearInterval(metronomeInterval);
            metronomeInterval = null;
        }
    }
}

// VU Meters realistic simulation
function startVuSimulation() {
    setInterval(() => {
        if (!isCalibrating) {
            const baseLeft = isCitytekMuted ? 0 : (citytekVol * (masterVol / 100));
            const baseRight = isSonosMuted ? 0 : (sonosVol * (masterVol / 100));
            
            const jitterL = Math.min(100, Math.max(15, baseLeft + (Math.random() * 20 - 10)));
            const jitterR = Math.min(100, Math.max(15, baseRight + (Math.random() * 20 - 10)));
            
            if (heroVuLeft) heroVuLeft.style.width = jitterL.toFixed(0) + '%';
            if (heroVuRight) heroVuRight.style.width = jitterR.toFixed(0) + '%';
        }
    }, 120);
}

// Status Checker (attempts live API, falls back gracefully to simulation)
function startStatusChecker() {
    fetchStatus();
    setInterval(fetchStatus, 3000);
}

async function fetchStatus() {
    try {
        const res = await fetch('/api/status', { signal: AbortSignal.timeout(1500) });
        if (!res.ok) throw new Error('API offline');
        const data = await res.json();
        // Server is live!
        isSimulated = false;
        if (footerStreamUrl && data.server) {
            footerStreamUrl.textContent = data.server.stream_url;
        }
    } catch (e) {
        // Fall back to standalone simulation mode seamlessly
        isSimulated = true;
    }
}

async function sendDelay(delay) {
    if (!isSimulated) {
        try {
            await fetch('/api/sync/delay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delay_ms: delay })
            });
        } catch (e) {}
    }
}

async function sendSonosVolume(vol) {
    if (!isSimulated) {
        try {
            await fetch('/api/sonos/volume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ volume: vol })
            });
        } catch (e) {}
    }
}

async function sendCitytekVolume(vol) {
    if (!isSimulated) {
        try {
            await fetch('/api/citytek/volume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ volume: vol })
            });
        } catch (e) {}
    }
}

async function sendMasterVolume(vol) {
    if (!isSimulated) {
        try {
            await fetch('/api/volume/master', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ volume: vol })
            });
        } catch (e) {}
    }
}

function showToast(msg) {
    let toast = document.getElementById('da-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'da-toast';
        toast.style.cssText = 'position:fixed; bottom:24px; right:24px; background:#0f172a; border:1px solid rgba(6,182,212,0.4); color:#fff; padding:12px 20px; border-radius:12px; font-size:13px; font-weight:500; z-index:9999; box-shadow:0 10px 25px rgba(0,0,0,0.5); display:flex; align-items:center; gap:8px; opacity:0; transition:opacity 0.3s;';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> <span>${msg}</span>`;
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2800);
}
