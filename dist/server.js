"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const DB_1 = __importDefault(require("./config/DB"));
const port = config_1.default.port;
// initializing DB
(0, DB_1.default)();
app_1.default.listen(port, () => {
    console.log(`app v1 listening on port ${port} ....`);
});
