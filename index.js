// The delay is milliseconds to wait on each shortie.
let delay = 3000;
// If set to true, makes sure the sound is enabled for each shortie.
let enableSound = true;
// If set to true during the script runtime, stops the script.
//  Call the 'swipeLoop()' function again to re-run the script.
let stop = false;

// Populate _M.
for (let k in window) {
    try {
        if (window[k] && typeof window[k].setEventsAnimation === "function") {
            window._M = window[k]; // Save reference
            break;
        }
    } catch { }
}

// Sleep ms milliseconds
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Determins if the current shortie is an add
function isAdTimeUpdating(timeout = 1000) {
    return new Promise((resolve) => {
        const adTimeSpans = document.querySelectorAll(".mgp_adTime");
        if (adTimeSpans.length === 0) return resolve(false);

        let changed = false;

        const observer = new MutationObserver(() => {
            changed = true;
            observer.disconnect();
            resolve(true);
        });

        adTimeSpans.forEach((span) => {
            observer.observe(span, {
                characterData: true,
                subtree: true,
                childList: true,
            });
        });

        setTimeout(() => {
            if (!changed) observer.disconnect();
            resolve(changed);
        }, timeout);
    });
}

// Swipes to the next shortie.
function swipe() {
    _M.setEventsAnimation(1);
}

// Unmutes the current shortie.
function unmute() {
    _M.isMuted = false;
    Object.keys(MGP.players).forEach(function (id) {
        _M.updateMuteIcon(id, true);
    });
}

async function swipeLoop() {
    while (true) {
        if (stop === true) return;

        swipe();

        if (enableSound) {
            unmute();
        }

        const start = performance.now();
        const adUpdating = await isAdTimeUpdating(1000);
        const elapsed = performance.now() - start;
        const delayToWait = Math.max(0, delay - elapsed); // prevent negative values

        if (adUpdating) continue;

        await sleep(delayToWait);
    }
}

swipeLoop()

