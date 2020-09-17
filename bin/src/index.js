#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const chalk_1 = __importDefault(require("chalk"));
const ejs_1 = __importDefault(require("ejs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const commander_1 = __importDefault(require("commander"));
const packageJson = __importStar(require("../package.json"));
const process_1 = require("process");
const _write = (fileTypeDir, fileType, fileName, data) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(process.cwd(), "src", fileTypeDir);
    const file = path_1.default.join(filePath, fileName + ".ts");
    if (fs_extra_1.default.existsSync(filePath) == false) {
        fs_extra_1.default.mkdirSync(filePath);
    }
    if (fs_extra_1.default.existsSync(file) == false) {
        fs_extra_1.default.writeFile(path_1.default.join(filePath, fileName + ".ts"), data).then(() => {
            console.log(chalk_1.default.green(`${fileType} has been created.`));
        });
    }
    else {
        console.log(chalk_1.default.red(`${fileName} already exists.`));
    }
});
const _generate = (name, data, fileTypeDir, fileType, stub) => __awaiter(void 0, void 0, void 0, function* () {
    yield ejs_1.default
        .renderFile(path_1.default.join(__dirname, `stubs/${stub}`), data)
        .then((content) => {
        _write(fileTypeDir, fileType, name, content);
    });
});
const entity = (name) => __awaiter(void 0, void 0, void 0, function* () {
    _generate(name, { entity: name }, "entity", "Entity", "entity.ejs");
});
const resolver = (name) => __awaiter(void 0, void 0, void 0, function* () {
    _generate(name, { resolver: name }, "resolvers", "Resolver", "resolver.ejs");
});
commander_1.default
    .name(packageJson.name)
    .version(packageJson.version)
    .description(packageJson.version);
commander_1.default
    .command("init <name>")
    .description("Creates initial typegraphql project")
    .action((name) => {
    if (fs_extra_1.default.existsSync(path_1.default.join(process.cwd(), name))) {
        console.log(chalk_1.default.red("Project name already exists."));
        process_1.exit(1);
    }
    fs_extra_1.default.copySync(path_1.default.join(__dirname, "..", "..", "node_modules", "tgql-make-base"), path_1.default.join(process.cwd(), name));
    console.log(chalk_1.default.green(`${name} has been created. Enjoy!`));
});
commander_1.default
    .command("entity <name>")
    .description("Generates an entity")
    .action((name) => {
    entity(name);
});
commander_1.default
    .command("resolver <name>")
    .description("Generates a resolver")
    .action((name) => {
    resolver(name);
});
commander_1.default.parse(process.argv);
