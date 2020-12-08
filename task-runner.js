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
var tc = require('@actions/tool-cache');
var needle = require('needle');
var http = require('http');
var fs = require('fs');
var pkg = require('./package.json');
var path = require('path');
var makeDir = require('make-dir');
var exec = require("child_process").exec;
var os = 'Darwin';
var filepath = 'mfva_1.0.apk';
var supportedOS = {
    'Linux': {
        name: "appknox-Linux-x86_64",
        path: "/usr/local/bin/appknox",
        copyToBin: function (src, perm) {
            try {
                fs.copyFileSync(src, this.path);
                return fs.chmodSync(this.path, perm);
            }
            catch (error) {
                console.error('error', error);
                throw error;
            }
        }
    },
    'Darwin': {
        name: "appknox-Darwin-x86_64",
        path: "/usr/local/bin/appknox",
        copyToBin: function (src, perm) {
            try {
                fs.copyFileSync(src, this.path);
                return fs.chmodSync(this.path, perm);
            }
            catch (error) {
                console.error('error', error);
                throw error;
            }
        }
    }
};
/**
 * Gets appknox binary download url
 * @param os
 * @returns url
 */
function getAppknoxDownloadURL(os) {
    if (!(os in supportedOS)) {
        throw Error("Unsupported os " + os);
    }
    var binaryVersion = pkg.binary;
    var binaryName = supportedOS[os].name;
    return "https://github.com/appknox/appknox-go/releases/download/" + binaryVersion + "/" + binaryName;
}
/**
 * Downloads file to the specified destination
 * @param url
 * @param proxy
 * @param dest file
 */
function downloadFile(url) {
    return __awaiter(this, void 0, void 0, function () {
        var file, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, tc.downloadTool(url)];
                case 1:
                    file = _a.sent();
                    console.info('File Downloaded', file);
                    return [2 /*return*/, file];
                case 2:
                    error_1 = _a.sent();
                    console.error('Download:', error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// downloadFile(getAppknoxDownloadURL(os));
/**
 * Download & install appknox binary
 * @param os
 * @param proxy
 * @returns appknox binary path
 */
function installAppknox(os) {
    return __awaiter(this, void 0, void 0, function () {
        var url, tmpDir, binpath, tmpFile, downloadedPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(os in supportedOS)) {
                        throw Error("Unsupported os " + os);
                    }
                    url = getAppknoxDownloadURL(os);
                    tmpDir = 'binaries';
                    return [4 /*yield*/, makeDir(tmpDir)];
                case 1:
                    binpath = _a.sent();
                    tmpFile = path.join(binpath, supportedOS[os].name);
                    return [4 /*yield*/, downloadFile(url)];
                case 2:
                    downloadedPath = _a.sent();
                    console.debug("Downloading appknox binary from " + url + " to " + downloadedPath);
                    if (!fs.existsSync(downloadedPath)) {
                        throw Error("Could not download appknox binary");
                    }
                    console.debug("Download finished");
                    supportedOS[os].copyToBin(downloadedPath, "755");
                    console.debug("Appknox installation completed: " + supportedOS[os].path);
                    return [2 /*return*/, supportedOS[os].path];
            }
        });
    });
}
function upload(filepath, riskThreshold) {
    return __awaiter(this, void 0, void 0, function () {
        var appknoxPath, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.debug("Filepath: " + filepath);
                    console.debug("Riskthreshold: " + riskThreshold);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, installAppknox(os)];
                case 2:
                    appknoxPath = _a.sent();
                    console.log('appknoxPath', appknoxPath);
                    exec("appknox upload " + filepath, function (error, stdout, stderr) {
                        if (error) {
                            console.error("exec error: " + error);
                            return;
                        }
                        console.log("stdout: " + stdout);
                        console.error("stderr: " + stderr);
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
upload(filepath);
