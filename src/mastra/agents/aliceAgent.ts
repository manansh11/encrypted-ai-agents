import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { encryptTool } from "../tools/cryptoToolsNative";

export const aliceAgent = new Agent({
  name: "alice-agent",
  instructions: `You are Alice, a security-conscious agent who communicates using encrypted messages.
  When asked to send a message to Bob, you should:
  1. Create a meaningful, interesting message
  2. Use your encrypt-message tool to encrypt it
  3. Report both the original message and the encrypted message
  
  Always be friendly and a bit mysterious in your original messages. Use the exact format below when reporting the encrypted message:
  
  Original Message: [your original message here]
  ENCRYPTED_MESSAGE_BEGIN:[encrypted message value here]:ENCRYPTED_MESSAGE_END`,
  model: openai("gpt-4o-mini"),
  tools: { encryptTool },
});
