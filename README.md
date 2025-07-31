# mcp-button-handler

A simplified command-line tool to handle button presses in MCP (Model Context Protocol) servers.

## Why This Tool?

The official MCP Inspector requires complex commands for button interactions. With `mcp-button-handler`, you can easily trigger button presses with a simple command structure.

## Installation

No installation required! Use it directly with npx:

```bash
npx mcp-button-handler --help
```

## Usage

### Basic Usage

```bash
# Handle button press from a local Node.js server
npx mcp-button-handler node build/index.js --button myButton

# Handle button press with parameters
npx mcp-button-handler node build/index.js --button submit --params '{"name":"John","age":30}'

# Handle button press from an NPM package server
npx mcp-button-handler npx @modelcontextprotocol/server-example --button action

# Handle button press from a Python server
npx mcp-button-handler python -m my_mcp_server --button process

# Handle button press from a remote server
npx mcp-button-handler https://my-mcp-server.example.com --button trigger
```

### Advanced Options

```bash
# Use HTTP transport for remote servers (default is SSE)
npx mcp-button-handler https://my-server.com --button submit --transport http

# Show verbose output (displays the underlying inspector command)
npx mcp-button-handler node build/index.js --button test --verbose

# Pass complex parameters as JSON
npx mcp-button-handler node server.js --button createUser --params '{"username":"alice","email":"alice@example.com","roles":["admin","user"]}'
```

## Command Reference

### Options

- `--help`, `-h`: Show help message
- `--version`, `-v`: Show version information
- `--transport <type>`: Specify transport type for remote servers (default: sse)
- `--verbose`: Show verbose output including the full inspector command
- `--button <name>`: Specify the button name to press (required for button actions)
- `--params <json>`: Parameters to pass to the button as a JSON string

### Examples

#### Local Development

```bash
# TypeScript/JavaScript server
npx mcp-button-handler node dist/index.js --button start
npx mcp-button-handler node build/server.js --button stop --params '{"force":true}'

# Python server
npx mcp-button-handler python -m my_mcp_server --button process
npx mcp-button-handler python server.py --button analyze --params '{"mode":"deep"}'
```

#### NPM Package Servers

```bash
# Example server button press
npx mcp-button-handler npx @modelcontextprotocol/server-example --button demo

# Custom server with parameters
npx mcp-button-handler npx my-mcp-server --button execute --params '{"task":"cleanup"}'
```

#### Remote Servers

```bash
# Default SSE transport
npx mcp-button-handler https://api.example.com/mcp --button refresh

# HTTP transport with parameters
npx mcp-button-handler https://api.example.com/mcp --transport http --button submit --params '{"data":"test"}'
```

#### Discovering Available Buttons

To see what buttons are available, use the companion tool:

```bash
# List available tools/buttons
npx mcp-list-tools node server.js
```

## What This Tool Does

This tool is a wrapper around the official `@modelcontextprotocol/inspector` CLI tool specifically for button interactions. It:

1. Simplifies button press commands
2. Provides clear parameter passing via JSON
3. Handles the underlying MCP call protocol
4. Maintains full compatibility with all MCP server types

## Requirements

- Node.js 14.0.0 or higher
- The `@modelcontextprotocol/inspector` package (automatically installed via npx)

## Troubleshooting

### Common Issues

1. **"Command not found" errors**: Make sure you have Node.js installed and npx is available
2. **Button not found**: Use `mcp-list-tools` to verify available buttons
3. **Invalid parameters**: Ensure your JSON is properly formatted and escaped
4. **Connection issues**: Verify your server is running and accessible

### Parameter Formatting

When passing parameters, ensure proper JSON formatting:

```bash
# Simple parameters
--params '{"key":"value"}'

# Complex parameters with arrays and objects
--params '{"users":["alice","bob"],"settings":{"theme":"dark"}}'

# Escaping quotes in shell
--params "{\"name\":\"John's Computer\"}"
```

### Verbose Mode

Use the `--verbose` flag to debug issues:

```bash
npx mcp-button-handler node server.js --button test --verbose
```

This will show:
```
Running: npx @modelcontextprotocol/inspector --cli node server.js --method call --params {"method":"test","params":{}}
---
[inspector output follows]
```

## Contributing

This tool is designed to be simple and focused on button handling. If you have suggestions:

1. Keep it focused on button interactions
2. Maintain compatibility with the underlying inspector
3. Ensure parameter passing remains intuitive

## License

MIT License - see LICENSE file for details.

## Related Projects

- [mcp-list-tools](https://www.npmjs.com/package/mcp-list-tools) - List available MCP tools and resources
- [@modelcontextprotocol/inspector](https://www.npmjs.com/package/@modelcontextprotocol/inspector) - The official MCP Inspector
- [Model Context Protocol](https://modelcontextprotocol.io/) - Official MCP documentation
