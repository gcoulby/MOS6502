var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _value;
class Byte {
    constructor() {
        _value.set(this, void 0);
        __classPrivateFieldSet(this, _value, new Uint8Array(1));
        __classPrivateFieldGet(this, _value)[0] = 0;
    }
    get() {
        return __classPrivateFieldGet(this, _value)[0];
    }
    set(value) {
        switch (typeof value) {
            case "string":
                __classPrivateFieldGet(this, _value)[0] = parseInt(value, 16);
                ;
                break;
            case "number":
                __classPrivateFieldGet(this, _value)[0] = value;
                break;
            default:
                break;
        }
    }
    add(byte) {
        __classPrivateFieldGet(this, _value)[0] = this.get() + byte;
    }
}
_value = new WeakMap();
