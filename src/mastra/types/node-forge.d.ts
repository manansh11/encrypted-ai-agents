declare module 'node-forge' {
  namespace pki {
    interface PublicKey {
      encrypt(data: string, scheme?: string): string;
    }
    
    interface PrivateKey {
      decrypt(data: string, scheme?: string): string;
    }
    
    namespace rsa {
      function generateKeyPair(options: { bits: number }, callback: (err: Error | null, keypair: { publicKey: PublicKey; privateKey: PrivateKey }) => void): void;
    }
    
    function publicKeyFromPem(pem: string): PublicKey;
    function privateKeyFromPem(pem: string): PrivateKey;
    function publicKeyToPem(key: PublicKey): string;
    function privateKeyToPem(key: PrivateKey): string;
  }
  
  namespace util {
    function encode64(data: string): string;
    function decode64(data: string): string;
  }
}
