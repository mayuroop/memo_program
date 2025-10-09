// TypeScript definitions for Solana wallet and metadata
export interface WalletAdapter {
  publicKey: PublicKey | null;
  connected: boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
}

export interface MetadataFormData {
  content: string;
  type: 'text' | 'json';
}

export interface StoredMetadata {
  content: string;
  accountAddress: string;
  transactionSignature: string;
  timestamp: number;
}

// Extend Window interface for Phantom wallet
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect(): Promise<{ publicKey: PublicKey }>;
      disconnect(): Promise<void>;
      signTransaction(transaction: Transaction): Promise<Transaction>;
      signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
      publicKey: PublicKey | null;
      isConnected: boolean;
    };
  }
}

import { PublicKey, Transaction } from '@solana/web3.js';
