"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sniffer = void 0;
const child_process_1 = require("child_process");
const sanctuary_1 = __importDefault(require("sanctuary"));
const { ap, pipe, trim, ifElse, Left, Right, compose, bimap } = sanctuary_1.default;
//const trace = tag => x => (console.log (tag, x), x)
// sliceAfterSpace :: String|Buffer -> String
const sliceAfterSpace = ap(s => n => s.slice(n + 1))(s => s.indexOf(' '));
// program :: Buffer -> Either (Left String, Right String)
const program = pipe([
    // @ts-ignore
    sliceAfterSpace,
    String,
    trim,
    ifElse(s => s.indexOf('ERROR') > -1)(Left)(Right),
]);
// sniffer :: String Error, String MimeType, String Path => (Error -> void) -> (MimeType -> void) -> Path -> void
const sniffer = errorHandler => successHandler => path => {
    const file = child_process_1.spawn('file', ['--mime', '-E', path]);
    file.stdout.on('data', compose(bimap(errorHandler)(successHandler))(program));
};
exports.sniffer = sniffer;
