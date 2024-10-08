"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodeController_1 = require("./controller/nodeController");
const router = express_1.default.Router();
router.post('/flowdata', nodeController_1.saveNode);
router.get('/flowdata/:ipAddress', nodeController_1.getNodes);
router.post('/sendEmail', nodeController_1.sendMailFunctiom);
exports.default = router;
