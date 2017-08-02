import EventListener from './EventListener.js';
import EventOptions from './EventOptions.js';
import ConstructableEventTarget from './ConstructableEventTarget.js'

const listenerSymbol = Symbol('Event Listeners');
const listenerMap = new WeakMap();
const targetSymbol = Symbol('Event Listener Key');

class CustomEventTarget extends ConstructableEventTarget {
    constructor() {
        super();

        const weakMapKey = {};

        this[targetSymbol] = weakMapKey;

        const listenerMap = CustomEventTarget[listenerSymbol];
        listenerMap.set(weakMapKey, {references: new WeakMap(), listeners: []});
    }

    addEventListener(eventType, pListener, pOptions) {
        if (!(this instanceof CustomEventTarget)) {
            throw new TypeError('Illegal invocation');
        }

        const listener = typeof pListener === 'function'
            ? new EventListener({handleEvent: pListener}, false)
            : new EventListener(pListener, true);

        const options = typeof pOptions === 'boolean'
            ? new EventOptions({capture: pOptions})
            : new EventOptions(pOptions);

        const {references, listeners} = this[listenerSymbol];

        const eventHandlerList = _getListenerReferences(references, eventType, pListener, options);

        const alreadyAttached = eventHandlerList.some(item => options.equal(item));
        if (alreadyAttached) return;

        eventHandlerList.push(options);

        listeners.push({eventType, listener, options});

        function _getListenerReferences(references, eventType, pListener, options) {
            const existingHandlerMap = references.get(pListener);
            const handlerMap = existingHandlerMap || new Map();

            if (!existingHandlerMap) {
                references.set(pListener, handlerMap);
            }

            const existingEventHandlerList = handlerMap.get(eventType);
            const eventHandlerList = existingEventHandlerList || [];

            if (!existingEventHandlerList) {
                handlerMap.set(eventType, eventHandlerList);
            }

            return eventHandlerList;
        }
    }

    removeEventListener(eventType, pListener, pOptions) {
        if (!(this instanceof CustomEventTarget)) {
            throw new TypeError('Illegal invocation');
        }

        const options = typeof pOptions === 'boolean'
            ? new EventOptions({capture: pOptions})
            : new EventOptions(pOptions);

        const {references, listeners} = this[listenerSymbol];

        const handlerMap = references.get(pListener);
        if (!handlerMap) return;

        const eventHandlerList = handlerMap.get(eventType);
        if (!eventHandlerList) return;

        const optionIndex = eventHandlerList.findIndex(item => options.equal(item));
        if (optionIndex === -1) return;

        const foundOptions = eventHandlerList[optionIndex];
        eventHandlerList.splice(optionIndex, 1);

        const listenerIndex = listeners.findIndex(item => item.options === foundOptions);
        listeners.splice(listenerIndex, 1);
    }

    dispatchEvent(event) {
        if (!(this instanceof CustomEventTarget)) {
            throw new TypeError('Illegal invocation');
        }

        const {references, listeners} = this[listenerSymbol];

        const {capture, noCapture} = listeners.reduce((o, item) => {
            if (item.eventType === event.type) {
                if (item.options.capture) o.capture.push(item);
                else o.noCapture.push(item);
            }
            return o;
        }, {
            capture: [],
            noCapture: []
        });

        capture
            .filter(item => item.options.shouldHandle(event, true, this, item.listener))
            .forEach(item => {item.listener.handle(event, this)});
        noCapture
            .filter(item => item.options.shouldHandle(event, false, this, item.listener))
            .forEach(item => {item.listener.handle(event, this)});

        return true;
    }

    get [listenerSymbol]() {
        return CustomEventTarget[listenerSymbol].get(this[targetSymbol]);
    }

    static get [listenerSymbol]() {
        return listenerMap;
    }
}

export default CustomEventTarget;
