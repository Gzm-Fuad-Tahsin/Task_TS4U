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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailFunctiom = exports.getNodes = exports.saveNode = void 0;
const nodeModel_1 = __importDefault(require("../model/nodeModel")); // Make sure your model file has TypeScript definitions
const sendMail_1 = __importDefault(require("./sendMail"));
const saveNode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ipAddress, flow } = req.body;
        console.log(ipAddress);
        const { nodes, edges, viewport } = flow;
        console.log(nodes);
        let data;
        const check = yield nodeModel_1.default.findOne({ device: ipAddress });
        if (!check) {
            data = yield new nodeModel_1.default({ device: ipAddress, nodes, edges, viewport }).save();
        }
        else {
            data = yield nodeModel_1.default.findByIdAndUpdate({ _id: check._id }, { nodes, edges, viewport }, { new: true });
        }
        res.status(200).send(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
exports.saveNode = saveNode;
const getNodes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ipAddress } = req.params;
        console.log(ipAddress);
        const data = yield nodeModel_1.default.findOne({ device: ipAddress }).exec();
        console.log(data);
        res.status(200).json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
exports.getNodes = getNodes;
const sendMailFunctiom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { flow } = req.body;
    const nodes = flow.nodes;
    // Extract the email and message from the flow data
    let email = '';
    let message = '';
    nodes.forEach((node) => {
        if (node.type === 'textupdate') {
            email = node.data.label; // Email from the node
        }
        if (node.type === 'textupdateMsg') {
            message = node.data.label; // Message from the node
        }
    });
    if (!email || !message) {
        res.status(400).json({ success: false, message: 'Email or message is missing in the flow data' });
    }
    (0, sendMail_1.default)({
        to: email,
        subject: "Automate Mail",
        message: message
    });
});
exports.sendMailFunctiom = sendMailFunctiom;
