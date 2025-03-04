import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import crypto from 'crypto';

// Generate RSA key pair at the module level
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

console.log("🔑 Generated RSA key pair for Alice and Bob");

// Maximum size of data that can be encrypted with RSA-2048
const RSA_CHUNK_SIZE = 190; // Safe size for RSA-2048 with OAEP padding

// Helper function to split message into chunks for encryption
function chunkMessage(message) {
  const msgBuffer = Buffer.from(message, 'utf-8');
  const chunks = [];
  
  for (let i = 0; i < msgBuffer.length; i += RSA_CHUNK_SIZE) {
    chunks.push(msgBuffer.slice(i, i + RSA_CHUNK_SIZE));
  }
  
  return chunks;
}

// Helper function to concatenate decrypted chunks
function concatenateDecryptedChunks(chunks) {
  return Buffer.concat(chunks).toString('utf-8');
}

// Encryption tool
export const encryptTool = createTool({
  id: "encrypt-message",
  description: "Encrypt a message using Bob's public key",
  inputSchema: z.object({
    message: z.string().describe("The message to encrypt"),
  }),
  outputSchema: z.object({
    encryptedMessage: z.string().describe("The encrypted message"),
  }),
  execute: async ({ context }) => {
    const { message } = context;
    
    try {
      // Split message into chunks that can be encrypted with RSA
      const chunks = chunkMessage(message);
      
      // Encrypt each chunk
      const encryptedChunks = chunks.map(chunk => {
        const encrypted = crypto.publicEncrypt(
          {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          },
          chunk
        );
        return encrypted.toString('base64');
      });
      
      // Join encrypted chunks with a separator
      const encryptedMessage = encryptedChunks.join('|');
      
      console.log(`🔒 Alice encrypted: "${message}" → [encrypted data]`);
      
      return {
        encryptedMessage,
      };
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  },
});

// Decryption tool
export const decryptTool = createTool({
  id: "decrypt-message",
  description: "Decrypt a message using Bob's private key",
  inputSchema: z.object({
    encryptedMessage: z.string().describe("The encrypted message to decrypt"),
  }),
  outputSchema: z.object({
    decryptedMessage: z.string().describe("The decrypted message"),
  }),
  execute: async ({ context }) => {
    const { encryptedMessage } = context;
    
    try {
      // Split into chunks
      const encryptedChunks = encryptedMessage.split('|');
      
      // Decrypt each chunk
      const decryptedChunks = encryptedChunks.map(chunk => {
        const buffer = Buffer.from(chunk, 'base64');
        return crypto.privateDecrypt(
          {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          },
          buffer
        );
      });
      
      // Combine decrypted chunks
      const decryptedText = concatenateDecryptedChunks(decryptedChunks);
      
      console.log(`🔓 Bob decrypted: [encrypted data] → "${decryptedText}"`);
      
      return {
        decryptedMessage: decryptedText,
      };
    } catch (error) {
      console.error("Decryption error:", error);
      return {
        decryptedMessage: "Failed to decrypt the message. The encryption may be invalid."
      };
    }
  },
});
