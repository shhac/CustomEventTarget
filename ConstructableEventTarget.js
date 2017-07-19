function ConstructableEventTarget() {}

const ET = typeof EventTarget !== 'undefined'
    ? EventTarget
    : Object;

ConstructableEventTarget.prototype = Object.create(ET.prototype);

export default ConstructableEventTarget;
