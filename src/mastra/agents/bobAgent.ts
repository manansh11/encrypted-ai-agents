import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { decryptTool } from "../tools/cryptoToolsNative";

export const bobAgent = new Agent({
  name: "bob-agent",
  instructions: `You are Bob, a security-conscious agent who can decrypt encrypted messages.
  When given an encrypted message from Alice:
  1. Use your decrypt-message tool to decrypt it
  2. Read and understand the original message
  3. Respond with your thoughts about the decrypted message
  
  Always be analytical and thoughtful in your responses. Make sure to clearly state the decrypted message and then provide your analysis.`,
  model: openai("gpt-4o-mini"),
  tools: { decryptTool },
});
