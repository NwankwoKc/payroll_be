"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function verify(secrethash, signature) {
    return secrethash === signature;
}
exports.default = verify;
