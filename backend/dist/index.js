"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const route_1 = __importDefault(require("./route"));
dotenv_1.default.config({ path: "./config.env" });
const app = (0, express_1.default)();
const port = process.env.PORT || 5001;
(0, database_1.default)();
const corsOptions = {
    origin: ["http://localhost", "http://localhost:3000"],
    credentials: true,
};
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", corsOptions.origin.join(", "));
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use((0, cors_1.default)(corsOptions));
// Serve static files from "uploads" directory if needed
// app.use('/', express.static('uploads'));
app.use("/api/v1/auth", route_1.default);
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});
app.get("/", (req, res) => {
    res.send("Server is running");
});
