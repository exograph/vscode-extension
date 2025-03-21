import * as path from "path";
import { workspace, ExtensionContext } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

const EXO_LSP_ENABLED_KEY = 'exograph.lsp.enabled';

export function activate(context: ExtensionContext) {
  // Initial activation based on setting
  if (getExoLspEnabled()) {
    startLspClient(context);
  }

  // Listen for configuration changes
  context.subscriptions.push(
    workspace.onDidChangeConfiguration(async (event) => {
      if (event.affectsConfiguration(EXO_LSP_ENABLED_KEY)) {
        if (getExoLspEnabled()) {
          startLspClient(context);
        } else {
          await deactivate();
        }
      }
    })
  );
}

export async function deactivate(): Promise<void> {
  if (client) {
    const result = await client.stop();
    client = undefined;
    return result;
  }
}

function startLspClient(context: ExtensionContext) {
  if (client) {
    return;
  }

  // If the EXO_LSP_SERVER_PATH environment variable is not set, use it from the default installation location $HOME/.exograph/bin/exo-lsp
  const command = process.env.EXO_LSP_SERVER_PATH || (process.env.HOME ? path.join(process.env.HOME, '.exograph/bin/exo-lsp') : "exo-lsp");
  const logLevel = process.env.EXO_LSP_LOG || "warn";

  const serverOptions: ServerOptions = {
    command,
    options: {
      env: {
        "EXO_LSP_LOG": logLevel,
        "EXO_LSP_LOG_DIR": context.logUri
      }
    },
    transport: TransportKind.stdio
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'exograph' }],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher('**/*.exo')
    }
  };

  client = new LanguageClient(
    'exographLanguageServer',
    'Exograph Language Server',
    serverOptions,
    clientOptions
  );

  client.start();
}

function getExoLspEnabled() {
  return workspace.getConfiguration().get(EXO_LSP_ENABLED_KEY, false);
}

