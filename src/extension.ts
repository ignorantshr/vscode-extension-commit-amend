import * as vscode from 'vscode';
// 导入 execSync 用于同步操作，并创建一个 exec 的 Promise 封装
import { exec, execSync } from 'child_process';
import { promisify } from 'util';

// 将 exec 包装成一个返回 Promise 的函数，方便使用 async/await
const execPromise = promisify(exec);

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.gitCommitAmend', () => {
        // 在调用命令前先检查工作区
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('please open a workspace first');
            return;
        }
        amendLastCommit(workspaceFolder.uri.fsPath);
    });

    const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    button.text = "$(git-commit) Amend Last Commit";
    button.command = 'extension.gitCommitAmend';
    button.show();

    context.subscriptions.push(disposable, button);
}

/**
 * 同步检查是否存在暂存的更改。
 * @param cwd - The current working directory (the workspace path).
 * @returns boolean - True if there are staged changes, false otherwise.
 */
function hasStagedChanges(cwd: string): boolean {
    try {
        // --quiet 使得有差异时退出码为1，无差异时为0
        // --exit-code 确保即使有差异也不向 stdout 输出 diff 内容
        execSync('git diff --cached --quiet --exit-code', { cwd });
        return false; // 退出码为 0，没有暂存的更改
    } catch (error: any) {
        if (error.status === 1) {
            return true; // 退出码为 1，有暂存的更改
        }
        // 如果是其他错误 (例如不是 git 仓库)，则向上抛出
        throw error;
    }
}

/**
 * @param workspacePath - The path to the current workspace.
 */
async function amendLastCommit(workspacePath: string) {
    try {
        let cmd = 'git commit --amend --no-edit';
        const useAutoStage = vscode.workspace.getConfiguration('gitCommitAmend').get('autoStage');

        if (useAutoStage && !hasStagedChanges(workspacePath)) {
            cmd = 'git add -A && ' + cmd;
        }

        const { stdout, stderr } = await execPromise(cmd, { cwd: workspacePath });

        if (stderr) {
            // 有些 git 信息会输出到 stderr，但不一定是错误，例如 rebase 的提示
            console.warn('Git stderr:', stderr);
        }

        // vscode.window.showInformationMessage('Git commit amended successfully.');
    } catch (error: any) {
        // execPromise 抛出的错误包含了 stdout 和 stderr，非常有用
        const errorMessage = error.stderr || error.stdout || error.message;
        vscode.window.showErrorMessage(`Failed to amend git commit: ${errorMessage}`);
    }
}

export function deactivate() { }
