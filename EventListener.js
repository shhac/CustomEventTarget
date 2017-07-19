class EventListener {
    constructor(listener, withContext) {
        if (typeof listener !== 'object') {
            throw new TypeError('Listener must be Function or Object');
        }
        if (typeof listener.handleEvent !== 'function') {
            throw new TypeError('Event handler must be a Function');
        }
        this.handler = listener.handleEvent;
        if (withContext) this.context = listener;
    }

    handle(e, target) {
        if (this.context) this.handler.call(this.context, e);
        else this.handler.call(target, e);
    }
}

export default EventListener;
