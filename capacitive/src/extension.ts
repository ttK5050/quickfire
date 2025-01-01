import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Status bar item to show current state
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = "$(beaker) Capacitive";
  statusBarItem.command = "ai-test-generator.openApp";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Helper to register commands
  const registerCommand = (
    commandId: string,
    handler: (...args: any[]) => any
  ) => {
    let disposable = vscode.commands.registerCommand(commandId, handler);
    context.subscriptions.push(disposable);
  };

  // Generate tests for selected code
  registerCommand("ai-test-generator.generateTestsForSelection", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage(
        "Please select code to generate tests for"
      );
      return;
    }

    const selection = editor.selection;
    const selectedCode = editor.document.getText(selection);
    const filePath = editor.document.uri.fsPath;

    try {
      // TODO: Implement IPC call to Electron app
      await notifyElectronApp({
        type: "GENERATE_TESTS",
        payload: {
          code: selectedCode,
          filePath,
          selectionRange: {
            start: selection.start,
            end: selection.end,
          },
        },
      });
    } catch (error) {
      vscode.window.showErrorMessage(
        "Failed to communicate with Capacitive app"
      );
    }
  });

  // Generate tests for changed files
  registerCommand("ai-test-generator.generateTestsForCodebase", async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showInformationMessage("Please open a workspace first");
      return;
    }

    try {
      // TODO: Implement IPC call to Electron app
      await notifyElectronApp({
        type: "GENERATE_TESTS_CHANGED",
        payload: {
          workspacePath: workspaceFolders[0].uri.fsPath,
        },
      });
    } catch (error) {
      vscode.window.showErrorMessage(
        "Failed to communicate with Capacitive app"
      );
    }
  });

  // Run tests for selection
  registerCommand("ai-test-generator.runTests", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage(
        "Please select code to run tests for"
      );
      return;
    }

    try {
      await notifyElectronApp({
        type: "RUN_TESTS",
        payload: {
          filePath: editor.document.uri.fsPath,
        },
      });
    } catch (error) {
      vscode.window.showErrorMessage("Failed to run tests");
    }
  });

  // Run all tests
  registerCommand("ai-test-generator.runAllTests", async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showInformationMessage("Please open a workspace first");
      return;
    }

    try {
      await notifyElectronApp({
        type: "RUN_ALL_TESTS",
        payload: {
          workspacePath: workspaceFolders[0].uri.fsPath,
        },
      });
    } catch (error) {
      vscode.window.showErrorMessage("Failed to run tests");
    }
  });

  // Open Electron app UI
  registerCommand("ai-test-generator.openApp", async () => {
    try {
      await notifyElectronApp({
        type: "OPEN_APP",
        payload: {
          workspace: vscode.workspace.workspaceFolders?.[0].uri.fsPath,
        },
      });
    } catch (error) {
      vscode.window.showErrorMessage("Failed to launch Capacitive interface");
    }
  });
}

// TODO: Implement actual IPC mechanism
async function notifyElectronApp(message: { type: string; payload: any }) {
  // Placeholder for IPC implementation
  console.log("Sending to Electron:", message);

  // This will be replaced with actual IPC implementation
  // Options include:
  // 1. Custom protocol (capacitive://)
  // 2. WebSocket connection
  // 3. Node IPC
  // 4. TCP/UDP socket
}

export function deactivate() {}
