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
Object.defineProperty(exports, "__esModule", { value: true });
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (require("mongoose")).connect('mongodb+srv://gazitahsin323:tah12345@cluster0.x4q0a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log(`Mongodb connected with server: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(`Error in Mongodb ${error}`);
    }
});
exports.default = connectDatabase;
