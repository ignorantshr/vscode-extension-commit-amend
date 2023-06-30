import * as vscode from 'vscode';

let terminal: vscode.Terminal | undefined;

export function activate(context: vscode.ExtensionContext) {
	// 注册命令和按钮
	const disposable = vscode.commands.registerCommand('extension.gitCommitAmend', () => {
		amendLastCommit();
	});

	// 创建一个状态栏按钮
	const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	button.text = "$(git-commit) Amend Last Commit";
	button.command = 'extension.gitCommitAmend';
	button.show();

	// 将注册的命令和按钮添加到上下文订阅中
	context.subscriptions.push(disposable, button);

	// 监听终端关闭事件
	vscode.window.onDidCloseTerminal((closedTerminal: vscode.Terminal) => {
		if (closedTerminal === terminal) {
			// 终端关闭，执行相应操作
			handleTerminalClosed();
		}
	});
}

async function amendLastCommit() {
	try {
		terminal = vscode.window.createTerminal();
		terminal.sendText('git commit --amend --no-edit');
		// 注意：这里不能立即执行 resolve，因为终端可能还没有关闭
	} catch (error) {
		vscode.window.showErrorMessage('Failed to amend git commit:', error.message);
	}
}

function handleTerminalClosed() {
	terminal = undefined;
	// vscode.window.showInformationMessage('Git commit amended successfully!');
}

export function deactivate() { }
