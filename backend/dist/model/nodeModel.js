"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define schema for the node object
const NodeSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    data: {
        label: { type: String, required: true }
    },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },
    measured: {
        width: { type: Number, required: true },
        height: { type: Number, required: true }
    },
    selected: { type: Boolean, default: false },
    dragging: { type: Boolean, default: false }
});
// Define schema for the edge object
const EdgeSchema = new mongoose_1.Schema({
    source: { type: String, required: true },
    target: { type: String, required: true },
    id: { type: String, required: true }
});
// Define schema for the viewport object
const ViewportSchema = new mongoose_1.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    zoom: { type: Number, required: true }
});
// Main schema for the flow
const FlowSchema = new mongoose_1.Schema({
    device: {
        type: String,
        required: true,
    },
    nodes: [NodeSchema],
    edges: [EdgeSchema],
    viewport: ViewportSchema
});
// Create and export the model
const Flow = mongoose_1.default.model('Flow', FlowSchema);
exports.default = Flow;
