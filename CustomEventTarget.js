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

        const listenerMap = CustomEventTarget[listenerSymbol];
        const {references, listeners} = listenerMap.get(this[targetSymbol]);

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

    static get [listenerSymbol]() {
        return listenerMap;
    }
}

export default CustomEventTarget;
