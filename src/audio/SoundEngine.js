export class SoundEngine {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playSlash() {
        this._tone('sawtooth', 300, 40, 0.3, 0.15);
    }

    playHit() {
        this._tone('square', 120, 20, 0.4, 0.1);
    }

    playHeal() {
        this._tone('sine', 440, 880, 0.2, 0.3);
    }

    playSpell() {
        this._tone('triangle', 600, 150, 0.3, 0.25);
    }

    _tone(type, from, to, gainStart, duration) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(from, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(to, this.ctx.currentTime + duration);
        gain.gain.setValueAtTime(gainStart, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
}
