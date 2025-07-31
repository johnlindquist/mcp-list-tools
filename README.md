# mcp-list-tools

A simplified command-line tool to list available tools, resources, and prompts from MCP (Model Context Protocol) servers.

## Why This Tool?

The official MCP Inspector requires remembering a complex command structure:

```bash
npx @modelcontextprotocol/inspector --cli <server_command> --method tools/list
```

With `mcp-list-tools`, you can simply use:

```bash
npx mcp-list-tools <server_command>
```

## Installation

No installation required! Use it directly with npx:

```bash
npx mcp-list-tools --help
```

## Usage

### Basic Usage

```bash
# List tools from a local Node.js server
npx mcp-list-tools node build/index.js

# List tools from an NPM package server
npx mcp-list-tools npx @modelcontextprotocol/server-filesystem /path/to/directory

# List tools from a Python server
npx mcp-list-tools python -m my_mcp_server

# List tools from a remote server
npx mcp-list-tools https://my-mcp-server.example.com
```

### Advanced Options

```bash
# List resources instead of tools
npx mcp-list-tools node build/index.js --resources

# List prompts instead of tools
npx mcp-list-tools node build/index.js --prompts

# Use HTTP transport for remote servers (default is SSE)
npx mcp-list-tools https://my-server.com --transport http

# Show verbose output (displays the underlying inspector command)
npx mcp-list-tools node build/index.js --verbose
```

## Command Reference

### Options

- `--help`, `-h`: Show help message
- `--version`, `-v`: Show version information
- `--transport <type>`: Specify transport type for remote servers (default: sse)
- `--verbose`: Show verbose output including the full inspector command
- `--resources`: List resources instead of tools
- `--prompts`: List prompts instead of tools

### Examples

#### Local Development

```bash
# TypeScript/JavaScript server
npx mcp-list-tools node dist/index.js
npx mcp-list-tools node build/server.js --port 3000

# Python server
npx mcp-list-tools python -m my_mcp_server
npx mcp-list-tools python server.py --config config.json
```

#### NPM Package Servers

```bash
# Filesystem server
npx mcp-list-tools npx @modelcontextprotocol/server-filesystem /Users/username/Documents

# GitHub server
npx mcp-list-tools npx @modelcontextprotocol/server-github --token YOUR_TOKEN

# Slack server
npx mcp-list-tools npx @modelcontextprotocol/server-slack --token YOUR_SLACK_TOKEN
```

#### Remote Servers

```bash
# Default SSE transport
npx mcp-list-tools https://api.example.com/mcp

# HTTP transport
npx mcp-list-tools https://api.example.com/mcp --transport http

# With authentication (if supported by the server)
npx mcp-list-tools https://api.example.com/mcp --transport http
```

#### Different Content Types

```bash
# List available tools (default)
npx mcp-list-tools node server.js

# List available resources
npx mcp-list-tools node server.js --resources

# List available prompts
npx mcp-list-tools node server.js --prompts
```

## What This Tool Does

This tool is a simple wrapper around the official `@modelcontextprotocol/inspector` CLI tool. It:

1. Simplifies the command syntax
2. Provides sensible defaults
3. Offers convenient shortcuts for common operations
4. Maintains full compatibility with the underlying inspector

## Requirements

- Node.js 14.0.0 or higher
- The `@modelcontextprotocol/inspector` package (automatically installed via npx)

## Troubleshooting

### Common Issues

1. **"Command not found" errors**: Make sure you have Node.js installed and npx is available
2. **Server connection issues**: Verify your server is running and accessible
3. **Permission errors**: Ensure your server command has proper permissions

### Verbose Mode

Use the `--verbose` flag to see the exact inspector command being executed:

```bash
npx mcp-list-tools node server.js --verbose
```

This will show:
```
Running: npx @modelcontextprotocol/inspector --cli node server.js --method tools/list
---
[inspector output follows]
```

## Contributing

This tool is designed to be simple and focused. If you have suggestions for improvements:

1. Keep it simple - the goal is to reduce complexity, not add features
2. Maintain compatibility with the underlying inspector
3. Focus on common use cases

## License

MIT License - see LICENSE file for details.

## Related Projects

- [@modelcontextprotocol/inspector](https://www.npmjs.com/package/@modelcontextprotocol/inspector) - The official MCP Inspector
- [Model Context Protocol](https://modelcontextprotocol.io/) - Official MCP documentation