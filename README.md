# CustomEventTarget

Implementing the [*EventTarget interface*](https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget) so it can be used by constructed objects/classes extending `CustomEventTarget`
Designing this to work in browser and in node.

# TODO

 - [x] Construcatable inheritance from EventTarget
 - [x] addEventListener
 - [x] removeEventListener
 - [ ] dispatchEvent
    - [x] Working with custom-crafted events which pass a `eventOptions.shouldHandle` test
    - [ ] Handlers with option "once" remove themselves consistently
    - [ ] Return value reflects `event.preventDefault` invocation
    - [ ] `event.stopPropagation` (no bubbling, if capture phase, no non-capture phase)
    - [ ] `event.stopImmediatePropagation` (no further handlers invoked)
 - [ ] CustomEvent
 - [ ] Event bubbling; being able to set a parent/child relation between two CustomEventTarget objects
