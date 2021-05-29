"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const path_1 = __importDefault(require("path"));
const sanctuary_1 = __importDefault(require("sanctuary"));
const sniffer_js_1 = require("./lib/sniffer.js");
// const trace = tag => x => (console.log (tag, x), x)
const setMimeType = response => mimeType => {
    if (response.headersSent)
        return;
    response.header({
        'Content-Type': mimeType,
        'X-Content-Type-Options': 'nosniff'
    });
};
const middleware = (root = '', options = {}) => (request, response, next) => {
    // console.debug (
    //   'path', request.path,
    //   'baseUrl', request.baseUrl,
    //   'mountpath', request.app.mountpath,
    //   'root', root,
    //   path.resolve (root, (request.baseUrl || request.path).slice (1))
    // )
    if (options.filters) {
        // find_ :: String a -> Maybe b
        const find_ = sanctuary_1.default.pipe([
            sanctuary_1.default.flip(sanctuary_1.default.test),
            sanctuary_1.default.flip(sanctuary_1.default.find)(options.filters),
        ]);
        if (sanctuary_1.default.isNothing(find_(request.path))) {
            return next();
        }
    }
    const happyPath = sanctuary_1.default.pipe([
        setMimeType(response),
        next,
    ]);
    const sadPath = sanctuary_1.default.pipe([
        console.error,
        next,
    ]);
    sniffer_js_1.sniffer(sadPath)(happyPath)(path_1.default.resolve(root, (request.baseUrl || request.path).slice(1)));
};
exports.middleware = middleware;
