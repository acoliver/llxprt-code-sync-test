/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * This test verifies MCP (Model Context Protocol) server integration.
 * It uses a minimal MCP server implementation that doesn't require
 * external dependencies, making it compatible with Docker sandbox mode.
 */

import { test, describe, before } from 'node:test';
import { strict as assert } from 'node:assert';
<<<<<<< HEAD
import { TestRig } from './test-helper.js';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, unlinkSync, mkdirSync } from 'fs';

// Skip MCP tests in CI when using OpenRouter as tool extraction may vary by model
if (process.env.OPENAI_BASE_URL?.includes('openrouter')) {
  console.log('Skipping MCP server tests when using OpenRouter');
  test.skip('MCP server tests skipped for OpenRouter', () => {});
} else {
  const __dirname = fileURLToPath(new URL('.', import.meta.url));
  const serverScriptPath = join(__dirname, './temp-server.js');

  const serverScript = `
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
=======
import { TestRig, validateModelOutput } from './test-helper.js';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync } from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Create a minimal MCP server that doesn't require external dependencies
// This implements the MCP protocol directly using Node.js built-ins
const serverScript = `#!/usr/bin/env node
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
>>>>>>> 38770660 (fix(tests): refactor integration tests to be less flaky (#4890))

const readline = require('readline');
const fs = require('fs');

// Debug logging to stderr (only when MCP_DEBUG or VERBOSE is set)
const debugEnabled = process.env.MCP_DEBUG === 'true' || process.env.VERBOSE === 'true';
function debug(msg) {
  if (debugEnabled) {
    fs.writeSync(2, \`[MCP-DEBUG] \${msg}\\n\`);
  }
}

debug('MCP server starting...');

// Simple JSON-RPC implementation for MCP
class SimpleJSONRPC {
  constructor() {
    this.handlers = new Map();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
    
    this.rl.on('line', (line) => {
      debug(\`Received line: \${line}\`);
      try {
        const message = JSON.parse(line);
        debug(\`Parsed message: \${JSON.stringify(message)}\`);
        this.handleMessage(message);
      } catch (e) {
        debug(\`Parse error: \${e.message}\`);
      }
    });
  }
  
  send(message) {
    const msgStr = JSON.stringify(message);
    debug(\`Sending message: \${msgStr}\`);
    process.stdout.write(msgStr + '\\n');
  }
  
  async handleMessage(message) {
    if (message.method && this.handlers.has(message.method)) {
      try {
        const result = await this.handlers.get(message.method)(message.params || {});
        if (message.id !== undefined) {
          this.send({
            jsonrpc: '2.0',
            id: message.id,
            result
          });
        }
      } catch (error) {
        if (message.id !== undefined) {
          this.send({
            jsonrpc: '2.0',
            id: message.id,
            error: {
              code: -32603,
              message: error.message
            }
          });
        }
      }
    } else if (message.id !== undefined) {
      this.send({
        jsonrpc: '2.0',
        id: message.id,
        error: {
          code: -32601,
          message: 'Method not found'
        }
      });
    }
  }
  
  on(method, handler) {
    this.handlers.set(method, handler);
  }
}

// Create MCP server
const rpc = new SimpleJSONRPC();

// Handle initialize
rpc.on('initialize', async (params) => {
  debug('Handling initialize request');
  return {
    protocolVersion: '2024-11-05',
    capabilities: {
      tools: {}
    },
    serverInfo: {
      name: 'addition-server',
      version: '1.0.0'
    }
  };
});

// Handle tools/list
rpc.on('tools/list', async () => {
  debug('Handling tools/list request');
  return {
    tools: [{
      name: 'add',
      description: 'Add two numbers',
      inputSchema: {
        type: 'object',
        properties: {
          a: { type: 'number', description: 'First number' },
          b: { type: 'number', description: 'Second number' }
        },
        required: ['a', 'b']
      }
    }]
  };
});

// Handle tools/call
rpc.on('tools/call', async (params) => {
  debug(\`Handling tools/call request for tool: \${params.name}\`);
  if (params.name === 'add') {
    const { a, b } = params.arguments;
    return {
      content: [{
        type: 'text',
        text: String(a + b)
      }]
    };
  }
  throw new Error('Unknown tool: ' + params.name);
});

// Send initialization notification
rpc.send({
  jsonrpc: '2.0',
  method: 'initialized'
});
`;

<<<<<<< HEAD
  describe('simple-mcp-server', () => {
    const rig = new TestRig();
    let child;

    before(() => {
      writeFileSync(serverScriptPath, serverScript);
      child = spawn('node', [serverScriptPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
      // Wait for the server to be ready
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    after(() => {
      child.kill();
      unlinkSync(serverScriptPath);
    });

    test('should add two numbers', () => {
      rig.setup('should add two numbers');
      // Create a settings file with MCP server configuration
      const settingsPath = join(rig.testDir, '.llxprt', 'settings.json');
      mkdirSync(dirname(settingsPath), { recursive: true });
      writeFileSync(
        settingsPath,
        JSON.stringify(
          {
            mcpServers: {
              'addition-server': {
                command: 'node',
                args: [serverScriptPath],
              },
            },
          },
          null,
          2,
        ),
      );

      const output = rig.run('What is 5 + 10?');
      assert.ok(output.includes('15'));
    });
=======
describe('simple-mcp-server', () => {
  const rig = new TestRig();

  before(async () => {
    // Setup test directory with MCP server configuration
    await rig.setup('simple-mcp-server', {
      settings: {
        mcpServers: {
          'addition-server': {
            command: 'node',
            args: ['mcp-server.cjs'],
          },
        },
      },
    });

    // Create server script in the test directory
    const testServerPath = join(rig.testDir, 'mcp-server.cjs');
    writeFileSync(testServerPath, serverScript);

    // Make the script executable (though running with 'node' should work anyway)
    if (process.platform !== 'win32') {
      const { chmodSync } = await import('fs');
      chmodSync(testServerPath, 0o755);
    }
  });

  test('should add two numbers', async () => {
    // Test directory is already set up in before hook
    // Just run the command - MCP server config is in settings.json
    const output = await rig.run('add 5 and 10');

    const foundToolCall = await rig.waitForToolCall('add');

    assert.ok(foundToolCall, 'Expected to find an add tool call');

    // Validate model output - will throw if no output, fail if missing expected content
    validateModelOutput(output, '15', 'MCP server test');
    assert.ok(output.includes('15'), 'Expected output to contain the sum (15)');
>>>>>>> 38770660 (fix(tests): refactor integration tests to be less flaky (#4890))
  });
} // End of else block for OpenRouter skip
