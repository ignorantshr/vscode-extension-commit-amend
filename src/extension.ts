import * as vscode from 'vscode';

let terminal: vscode.Terminal | undefined;

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.gitCommitAmend', () => {
        amendLastCommit();
    });

    const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    button.text = "$(git-commit) Amend Last Commit";
    button.command = 'extension.gitCommitAmend';
    button.show();

    context.subscriptions.push(disposable, button);

    vscode.window.onDidCloseTerminal((closedTerminal: vscode.Terminal) => {
        if (closedTerminal === terminal) {
            handleTerminalClosed();
        }
    });
}

async function amendLastCommit() {
    try {
        terminal = vscode.window.createTerminal();
        terminal.sendText('git commit --amend --no-edit');
    } catch (error) {
        vscode.window.showErrorMessage('Failed to amend git commit:', error.message);
    }
}

function handleTerminalClosed() {
    terminal = undefined;
    vscode.window.showInformationMessage('Git commit amended successfully!');
}

export function deactivate() { }
