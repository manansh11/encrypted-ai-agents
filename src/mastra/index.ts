import 'dotenv/config';
import { Mastra } from '@mastra/core';
import { chefAgent } from './agents/chefAgent';
import { aliceAgent } from './agents/aliceAgent';
import { bobAgent } from './agents/bobAgent';

// Log the API key status (not the key itself)
console.log(`OpenAI API key loaded: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);

export const mastra = new Mastra({
    agents: {chefAgent, aliceAgent, bobAgent},
});

// Different prompt styles for Alice to create varied messages
const messagePrompts = [
  "Create a simple, friendly secret message for Bob and encrypt it.",
  "Create a mysterious riddle or puzzle for Bob to solve and encrypt it.",
  "Create a humorous joke or pun that will make Bob laugh and encrypt it.",
  "Create a complex, philosophical thought experiment for Bob to ponder and encrypt it.",
  "Create a wildly absurd and surreal message that will surprise Bob and encrypt it.",
  "Create a dramatic mini-story with a twist ending for Bob and encrypt it.",
  "Create a technical message using computer science terminology for Bob and encrypt it.",
  "Create a secret message in the style of a famous poet or author for Bob and encrypt it."
];

async function main() {
  console.log("🔐 Starting Encrypted Message Exchange Demo 🔐");
  console.log("---------------------------------------------");

  try {
    // Run through each message type in sequence
    for (let i = 0; i < messagePrompts.length; i++) {
      console.log(`\n🔄 MESSAGE EXCHANGE #${i+1} 🔄`);
      
      // Step 1: Alice creates and encrypts a message for Bob
      console.log("\n👩 Alice's Turn:");
      const alicePrompt = messagePrompts[i] + " After you encrypt it, please report the result in this exact format: 'ENCRYPTED_MESSAGE_BEGIN:{encryptedMessage}:ENCRYPTED_MESSAGE_END'";
      const aliceResponse = await aliceAgent.generate([{ role: "user", content: alicePrompt }]);
      console.log(`Alice's Response:\n${aliceResponse.text}\n`);

      // Extract the encrypted message from Alice's response using the markers
      const encryptedMessageRegex = /ENCRYPTED_MESSAGE_BEGIN:(.*?):ENCRYPTED_MESSAGE_END/s;
      const encryptedMessageMatch = aliceResponse.text.match(encryptedMessageRegex);
      
      if (!encryptedMessageMatch) {
        console.error("❌ Couldn't extract encrypted message from Alice's response");
        console.log("Let's try to find another format...");
        
        // Try alternate format - looking for the tool output format
        const toolOutputMatch = aliceResponse.text.match(/encryptedMessage: ["'](.+?)["']/);
        if (toolOutputMatch) {
          const encryptedMessage = toolOutputMatch[1];
          await processEncryptedMessage(encryptedMessage);
        } else {
          console.error("❌ Could not find encrypted message in any expected format");
          continue; // Move to the next prompt
        }
      } else {
        const encryptedMessage = encryptedMessageMatch[1];
        await processEncryptedMessage(encryptedMessage);
      }
      
      // If not the last message, add a separator
      if (i < messagePrompts.length - 1) {
        console.log("\n\n==================================================\n\n");
      }
    }
    
    console.log("\n---------------------------------------------");
    console.log("🎉 All Encrypted Message Exchanges Complete! 🎉");
    
  } catch (error) {
    console.error("❌ Error during execution:", error);
  }
}

async function processEncryptedMessage(encryptedMessage: string) {
  console.log(`📨 Encrypted message being sent to Bob: ${encryptedMessage.substring(0, 40)}...`);

  // Step 2: Bob receives and decrypts Alice's message
  console.log("\n👨 Bob's Turn:");
  const bobPrompt = `Alice sent you this encrypted message: "${encryptedMessage}". Please decrypt it and respond with your thoughts. Be creative and match the tone of the decrypted message!`;
  const bobResponse = await bobAgent.generate([{ role: "user", content: bobPrompt }]);
  console.log(`Bob's Response:\n${bobResponse.text}`);
}
   
// Only run one message exchange in dev mode if specified
const singleExchange = process.argv.includes('--single');
if (singleExchange) {
  // Override the main function with a simplified version
  const simplifiedMain = async () => {
    console.log("🔐 Starting Single Encrypted Message Exchange Demo 🔐");
    console.log("---------------------------------------------");
    
    try {
      // Choose a random message prompt
      const randomIndex = Math.floor(Math.random() * messagePrompts.length);
      const selectedPrompt = messagePrompts[randomIndex];
      
      console.log(`\n👩 Alice's Turn (Using prompt type #${randomIndex+1}):`);
      const alicePrompt = selectedPrompt + " After you encrypt it, please report the result in this exact format: 'ENCRYPTED_MESSAGE_BEGIN:{encryptedMessage}:ENCRYPTED_MESSAGE_END'";
      const aliceResponse = await aliceAgent.generate([{ role: "user", content: alicePrompt }]);
      console.log(`Alice's Response:\n${aliceResponse.text}\n`);

      // Extract and process message
      const encryptedMessageRegex = /ENCRYPTED_MESSAGE_BEGIN:(.*?):ENCRYPTED_MESSAGE_END/s;
      const encryptedMessageMatch = aliceResponse.text.match(encryptedMessageRegex);
      
      if (encryptedMessageMatch) {
        await processEncryptedMessage(encryptedMessageMatch[1]);
      } else {
        console.error("❌ Couldn't extract encrypted message from Alice's response");
      }
      
      console.log("\n---------------------------------------------");
      console.log("🎉 Encrypted Message Exchange Complete! 🎉");
    } catch (error) {
      console.error("❌ Error during execution:", error);
    }
  };
  
  simplifiedMain();
} else {
  main();
}