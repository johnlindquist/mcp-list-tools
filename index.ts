#!/usr/bin/env bun

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

interface Config {
  serverCommand: string[];
  transport: string;
  verbose: boolean;
  buttonName: string | null;
  params: Record<string, any>;
}

function getPackageJson(): any {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const packageJsonPath = join(__dirname, 'package.json');
  return JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
}

function showUsage(): void {
  console.log(`
mcp-button-handler - Handle button presses from MCP servers

USAGE:
  npx mcp-button-handler <server_command> [args...]
  npx mcp-button-handler <url>

EXAMPLES:
  # Handle button presses from a local Node.js server
  npx mcp-button-handler node build/index.js

  # Handle button presses from an NPM package server
  npx mcp-button-handler npx @modelcontextprotocol/server-filesystem /path/to/directory

  # Handle button presses from a Python server
  npx mcp-button-handler python -m my_mcp_server

  # Handle button presses from a remote server
  npx mcp-button-handler https://my-mcp-server.example.com

OPTIONS:
  --help, -h          Show this help message
  --version, -v       Show version information
  --transport <type>  Specify transport type for remote servers (default: sse)
  --verbose           Show verbose output including the full inspector command
  --button <name>     Specify button name to press
  --params <json>     Parameters to pass to button as JSON string

DESCRIPTION:
  This tool simplifies handling button presses in MCP (Model Context Protocol) servers
  by wrapping the @modelcontextprotocol/inspector CLI with sensible defaults.
`);
}

function showVersion(): void {
  const packageJson = getPackageJson();
  console.log(`mcp-button-handler v${packageJson.version}`);
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
    verbose: false,
    buttonName: null,
    params: {}
  };

  let i = 0;
  let foundServerCommand = false;
  
  while (i < args.length) {
    const arg = args[i];
    
    if (!foundServerCommand) {
      if (arg === '--transport') {
        config.transport = args[i + 1];
        i += 2;
        continue;
      } else if (arg === '--verbose') {
        config.verbose = true;
        i++;
        continue;
      } else if (arg === '--button') {
        config.buttonName = args[i + 1];
        i += 2;
        continue;
      } else if (arg === '--params') {
        try {
          config.params = JSON.parse(args[i + 1]);
        } catch (e: any) {
          console.error(`Error parsing params JSON: ${e.message}`);
          process.exit(1);
        }
        i += 2;
        continue;
      } else if (!arg.startsWith('--')) {
        foundServerCommand = true;
        config.serverCommand = args.slice(i);
        break;
      } else {
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
  
  inspectorArgs.push(...config.serverCommand);
  
  if (config.transport !== 'sse' && config.serverCommand[0].startsWith('http')) {
    inspectorArgs.push('--transport', config.transport);
  }
  
  // For button handling, we'll use the call method
  inspectorArgs.push('--method', 'call');
  
  if (config.buttonName) {
    inspectorArgs.push('--params', JSON.stringify({
      method: config.buttonName,
      params: config.params
    }));
  }
  
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
    
    if (!config.buttonName) {
      console.log('No button specified. Available buttons can be listed with:');
      console.log(`npx mcp-list-tools ${config.serverCommand.join(' ')}`);
      console.log('\nThen use --button <name> to press a specific button.');
      process.exit(0);
    }
    
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