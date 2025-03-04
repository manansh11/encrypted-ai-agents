# Encrypted AI Agents

A demonstration of AI agents communicating securely using public-private key encryption, built with the Mastra framework.

## Overview

This project showcases two AI agents (Alice and Bob) exchanging encrypted messages:

- **Alice**: Creates and encrypts messages using RSA public key encryption
- **Bob**: Receives and decrypts messages using the corresponding private key

The system uses Node.js's native crypto module for secure RSA encryption and the Mastra framework for agent orchestration.

## Features

- ✅ Public-private key (RSA) encryption
- ✅ AI-powered agent communication with varied message styles:
  - Simple friendly messages
  - Mysterious riddles and puzzles
  - Humor and jokes
  - Philosophical thought experiments
  - Surreal and absurd messages
  - Mini-stories with twist endings
  - Technical messages
  - Literary style messages
- ✅ Complete console logging of all interactions
- ✅ Robust error handling for message extraction and decryption

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   (See `.env.example` for reference)

## Running the Demo

Run the full encrypted message exchange demo (all message types):

```
npx tsx src/mastra/index.ts
```

Run a single random message exchange (useful for quick tests):

```
npx tsx src/mastra/index.ts --single
```

## How It Works

1. The system generates an RSA key pair (public and private keys)
2. Alice creates different types of secret messages and encrypts them using the public key
3. The encrypted messages are sent to Bob
4. Bob decrypts the messages using the private key and responds with creative analyses

## Project Structure

- `src/mastra/index.ts` - Main application entry point with message prompts
- `src/mastra/agents/` - AI agent definitions
  - `aliceAgent.ts` - Alice agent with encryption capabilities
  - `bobAgent.ts` - Bob agent with decryption capabilities
- `src/mastra/tools/` - Tool definitions
  - `cryptoToolsNative.ts` - Encryption and decryption tools

## Technologies Used

- [Mastra](https://mastra.ai/) - AI agent framework
- [OpenAI API](https://openai.com/api/) - Language model provider
- Node.js Crypto - Native cryptography module
- TypeScript - Programming language

## License

MIT
