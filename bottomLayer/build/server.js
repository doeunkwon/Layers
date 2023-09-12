"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var endpoints_1 = require("./src/routes/endpoints");
var sqlImport_1 = require("./src/utils/sqlImport");
var express_session_1 = __importDefault(require("express-session"));
var passport_1 = __importDefault(require("passport"));
var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var uuidv4 = require('uuid').v4;
;
var LocalStrategy = require('passport-local').Strategy;
var FileStore = require('session-file-store')(express_session_1.default);
require('dotenv').config();
app.use(express.json());
app.use((0, express_session_1.default)({
    genid: function (req) {
        return uuidv4();
    },
    store: new FileStore(),
    secret: (_a = process.env.SESSION_SECRET) !== null && _a !== void 0 ? _a : 'layersSession',
    resave: false,
    cookie: {
        maxAge: Date.now() + (30 * 86400 * 1000),
        secure: false // !!! Make this true by once we add HTTPS
    },
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.use('login', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, function (email, password, done) { return __awaiter(void 0, void 0, void 0, function () {
    var result, hashedPassword, passwordMatches, user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, sqlImport_1.pool.query('SELECT * FROM backend_schema.user WHERE email = $1', [email])];
            case 1:
                result = _a.sent();
                if (result.rowCount === 0) {
                    return [2 /*return*/, done(null, false, { message: 'user not found' })];
                }
                hashedPassword = result.rows[0].password;
                return [4 /*yield*/, bcrypt.compare(password, hashedPassword)];
            case 2:
                passwordMatches = _a.sent();
                if (!passwordMatches) {
                    console.log('Invalid Credentials');
                    return [2 /*return*/, done(null, false, { message: 'invalid credentials' })];
                }
                user = result.rows[0].uid;
                return [2 /*return*/, done(null, user)];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, done(err_1)];
            case 4: return [2 /*return*/];
        }
    });
}); }));
app.use('/', endpoints_1.routerBase);
app.use('/api', endpoints_1.routerPublic);
app.use('/api/private', endpoints_1.routerPrivate);
app.listen(process.env.PORT, function () {
    if (process.env.PORT == null) {
        return null;
    }
    console.log("Server is running on port ".concat(process.env.PORT));
});
