import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.gitCommitAmend', () => {
        amendLastCommit();
    });

    const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    button.text = "$(git-commit) Amend Last Commit";
    button.command = 'extension.gitCommitAmend';
    button.show();

    context.subscriptions.push(disposable, button);
}

async function amendLastCommit() {
    try {
        let terminal = vscode.window.createTerminal({ hideFromUser: true });
        terminal.sendText('git commit --amend --no-edit');
        setTimeout(() => {
            terminal.dispose();
        }, 2000);
    } catch (error) {
        vscode.window.showErrorMessage('Failed to amend git commit:', error.message);
    }
}

export function deactivate() { }
