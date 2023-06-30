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
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
let terminal;
function activate(context) {
    const disposable = vscode.commands.registerCommand('extension.gitCommitAmend', () => {
        amendLastCommit();
    });
    const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    button.text = "$(git-commit) Amend Last Commit";
    button.command = 'extension.gitCommitAmend';
    button.show();
    context.subscriptions.push(disposable, button);
    vscode.window.onDidCloseTerminal((closedTerminal) => {
        if (closedTerminal === terminal) {
            handleTerminalClosed();
        }
    });
}
exports.activate = activate;
function amendLastCommit() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            terminal = vscode.window.createTerminal();
            terminal.sendText('git commit --amend --no-edit');
        }
        catch (error) {
            vscode.window.showErrorMessage('Failed to amend git commit:', error.message);
        }
    });
}
function handleTerminalClosed() {
    terminal = undefined;
    vscode.window.showInformationMessage('Git commit amended successfully!');
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map