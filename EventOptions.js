class EventOptions {
    constructor(options = {}) {
        ['capture', 'once', 'passive'].forEach(option => {
            this[option] = !!options[option];
        });
    }

    shouldHandle(e, captureRound, target, listener) {
        if (captureRound !== this.capture) return false;
        if (captureRound && e.eventPhase !== 1) return false;
        if (e.eventPhase === 2 && event.target !== target) return false;
        if (e.eventPhase === 3 && event.target === target) return false;

        if (this.once) target.removeEventListener(event.type, listener, this);

        return true;
    }

    equal(options) {
        return ['capture', 'once', 'passive'].every(option => {
            return this[option] === !!options[option];
        });
    }

    like(options) {
        return ['capture', 'passive'].every(option => {
            return this[option] === !!options[option];
        });
    }
}

export default EventOptions;
