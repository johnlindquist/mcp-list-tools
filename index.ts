import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

interface Config {
  serverCommand: string[];
  transport: string;
  method: string;
  verbose: boolean;
}

function getPackageJson(): any {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const packageJsonPath = join(__dirname, 'package.json');
  return JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
}

function showUsage(): void {
  console.log(`
mcp-list-tools - Simplified tool to list available tools from MCP servers

USAGE:
  npx mcp-list-tools <server_command> [args...]
  npx mcp-list-tools <url>

EXAMPLES:
  # List tools from a local Node.js server
  npx mcp-list-tools node build/index.js

  # List tools from an NPM package server
  npx mcp-list-tools npx @modelcontextprotocol/server-filesystem /path/to/directory

  # List tools from a Python server
  npx mcp-list-tools python -m my_mcp_server

  # List tools from a remote server
  npx mcp-list-tools https://my-mcp-server.example.com

  # List tools with specific transport (for remote servers)
  npx mcp-list-tools https://my-mcp-server.example.com --transport http

OPTIONS:
  --help, -h          Show this help message
  --version, -v       Show version information
  --transport <type>  Specify transport type for remote servers (default: sse)
  --verbose           Show verbose output including the full inspector command
  --resources         List resources instead of tools
  --prompts           List prompts instead of tools

DESCRIPTION:
  This tool simplifies the process of listing tools from MCP (Model Context Protocol) servers
  by wrapping the @modelcontextprotocol/inspector CLI with sensible defaults.

  Instead of remembering the full inspector command:
    npx @modelcontextprotocol/inspector --cli <server> --method tools/list

  You can simply use:
    npx mcp-list-tools <server>
`);
}

function showVersion(): void {
  const packageJson = getPackageJson();
  console.log(`mcp-list-tools v${packageJson.version}`);
}

function parseArgs(): Config {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showUsage();
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    showVersion();
    process.exit(0);
  }

  const config: Config = {
    serverCommand: [],
    transport: 'sse',
    method: 'tools/list',
    verbose: false
  };

  let i = 0;
  let foundServerCommand = false;
  
  while (i < args.length) {
    const arg = args[i];
    
    // If we haven't found the server command yet, check for flags
    if (!foundServerCommand) {
      if (arg === '--transport' && args[i + 1]) {
        config.transport = args[i + 1];
        i += 2;
        continue;
      } else if (arg === '--verbose') {
        config.verbose = true;
        i++;
        continue;
      } else if (arg === '--resources') {
        config.method = 'resources/list';
        i++;
        continue;
      } else if (arg === '--prompts') {
        config.method = 'prompts/list';
        i++;
        continue;
      } else if (!arg.startsWith('--')) {
        // This is the start of the server command
        foundServerCommand = true;
        config.serverCommand = args.slice(i);
        break;
      } else {
        // Unknown flag, treat as start of server command
        foundServerCommand = true;
        config.serverCommand = args.slice(i);
        break;
      }
    }
  }

  if (config.serverCommand.length === 0) {
    console.error('Error: No server command or URL provided');
    showUsage();
    process.exit(1);
  }

  return config;
}

function buildInspectorCommand(config: Config): string[] {
  const inspectorArgs = ['@modelcontextprotocol/inspector', '--cli'];
  
  // Add server command/URL
  inspectorArgs.push(...config.serverCommand);
  
  // Add transport if it's not the default and we're dealing with a URL
  if (config.transport !== 'sse' && config.serverCommand[0] && config.serverCommand[0].startsWith('http')) {
    inspectorArgs.push('--transport', config.transport);
  }
  
  // Add method
  inspectorArgs.push('--method', config.method);
  
  return inspectorArgs;
}

function runInspector(config: Config): void {
  const inspectorArgs = buildInspectorCommand(config);
  
  if (config.verbose) {
    console.log(`Running: npx ${inspectorArgs.join(' ')}`);
    console.log('---');
  }
  
  const child = spawn('npx', inspectorArgs, {
    stdio: 'inherit',
    shell: true
  });
  
  child.on('error', (error) => {
    console.error(`Error running inspector: ${error.message}`);
    process.exit(1);
  });
  
  child.on('close', (code) => {
    process.exit(code || 0);
  });
}

function main(): void {
  try {
    const config = parseArgs();
    runInspector(config);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run main if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { parseArgs, buildInspectorCommand };