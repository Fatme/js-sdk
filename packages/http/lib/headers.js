"use strict";
/* eslint no-useless-constructor: "off" */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var isFunction_1 = __importDefault(require("lodash/isFunction"));
var isArray_1 = __importDefault(require("lodash/isArray"));
var HttpHeaders = /** @class */ (function () {
    function HttpHeaders(headers) {
        var _this = this;
        this.headers = new Map();
        this.normalizedNames = new Map();
        if (headers) {
            if (headers instanceof HttpHeaders) {
                this.join(headers);
            }
            else {
                Object.keys(headers).forEach(function (name) {
                    _this.set(name, headers[name]);
                });
            }
        }
    }
    Object.defineProperty(HttpHeaders.prototype, "contentType", {
        get: function () {
            return this.get('Content-Type');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpHeaders.prototype, "authorization", {
        get: function () {
            return this.get('Authorization');
        },
        set: function (value) {
            this.set('Authorization', value);
        },
        enumerable: true,
        configurable: true
    });
    HttpHeaders.prototype.has = function (name) {
        return this.headers.has(name.toLowerCase());
    };
    HttpHeaders.prototype.get = function (name) {
        return this.headers.get(name.toLowerCase());
    };
    HttpHeaders.prototype.keys = function () {
        return Array.from(this.normalizedNames.values());
    };
    HttpHeaders.prototype.set = function (name, value) {
        if (isFunction_1.default(value)) {
            return this.set(name, value());
        }
        if (isArray_1.default(value)) {
            return this.set(name, value.join(','));
        }
        var key = name.toLowerCase();
        this.headers.set(key, value);
        if (!this.normalizedNames.has(key)) {
            this.normalizedNames.set(key, name);
        }
        return this;
    };
    HttpHeaders.prototype.join = function (headers) {
        var _this = this;
        headers
            .keys()
            .forEach(function (name) {
            var value = headers.get(name);
            if (value) {
                _this.set(name, value);
            }
        });
        return this;
    };
    HttpHeaders.prototype.delete = function (name) {
        return this.headers.delete(name);
    };
    HttpHeaders.prototype.toPlainObject = function () {
        var _this = this;
        return this
            .keys()
            .reduce(function (headers, header) {
            var _a;
            var value = _this.get(header);
            if (value) {
                return Object.assign(headers, (_a = {}, _a[header] = value, _a));
            }
            return headers;
        }, {});
    };
    HttpHeaders.fromHeaders = function (headers) {
        var httpHeaders = new HttpHeaders();
        if (headers) {
            if (headers instanceof HttpHeaders) {
                httpHeaders.join(headers);
            }
            else {
                Object.keys(headers).forEach(function (name) {
                    httpHeaders.set(name, headers[name]);
                });
            }
        }
        return httpHeaders;
    };
    return HttpHeaders;
}());
exports.HttpHeaders = HttpHeaders;
//# sourceMappingURL=headers.js.map