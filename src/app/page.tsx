'use client';

import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { MetadataForm } from '@/components/MetadataForm';
import { WalletConnection } from '@/components/WalletConnection';
import { StoredDataDisplay } from '@/components/StoredDataDisplay';
import { MessageDisplay } from '@/components/MessageDisplay';
import { MetadataFormData, StoredMetadata } from '@/types/solana';
import { storeMetadataOnSolana, retrieveMetadataFromSolana } from '@/utils/solanaStorage';

// Solana devnet connection
const SOLANA_DEVNET_URL = 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_DEVNET_URL, 'confirmed');

export default function Home() {
  // State management
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [storedMetadata, setStoredMetadata] = useState<StoredMetadata | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if Phantom wallet is installed
  useEffect(() => {
    if (typeof window !== 'undefined' && window.solana?.isPhantom) {
      // Check if already connected
      if (window.solana.isConnected) {
        setWalletConnected(true);
        setPublicKey(window.solana.publicKey);
      }
    }
  }, []);

  // Connect to Phantom wallet
  const connectWallet = async () => {
    try {
      if (!window.solana?.isPhantom) {
        throw new Error('Phantom wallet not found. Please install Phantom wallet.');
      }

      const response = await window.solana.connect();
      setPublicKey(response.publicKey);
      setWalletConnected(true);
      setMessage({ type: 'success', text: 'Wallet connected successfully!' });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to connect wallet' 
      });
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      if (window.solana) {
        await window.solana.disconnect();
      }
      setWalletConnected(false);
      setPublicKey(null);
      setMessage({ type: 'success', text: 'Wallet disconnected successfully!' });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to disconnect wallet' 
      });
    }
  };

  // Store metadata on Solana
  const storeMetadata = async (formData: MetadataFormData) => {
    if (!publicKey) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Step 1: Prepare the metadata content
      let metadataContent: string;
      if (formData.type === 'json') {
        try {
          // Validate JSON format
          JSON.parse(formData.content);
          metadataContent = formData.content;
        } catch {
          throw new Error('Invalid JSON format');
        }
      } else {
        metadataContent = formData.content;
      }

      // Step 2: Store metadata using our utility function
      const result = await storeMetadataOnSolana(
        connection,
        publicKey,
        metadataContent,
        (transaction) => window.solana!.signTransaction(transaction)
      );

      const storedData: StoredMetadata = {
        content: result.content,
        accountAddress: result.accountAddress,
        transactionSignature: result.transactionSignature,
        timestamp: Date.now(),
      };

      setStoredMetadata(storedData);
      setMessage({ 
        type: 'success', 
        text: `Metadata stored successfully! Account: ${result.accountAddress}. Memo: ${result.memoSignature}` 
      });

    } catch (error) {
      console.error('Error storing metadata:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to store metadata' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Retrieve stored metadata
  const retrieveMetadata = async (accountAddress: string) => {
    setLoading(true);
    setMessage(null);

    try {
      // Use our utility function to retrieve metadata
      const result = await retrieveMetadataFromSolana(connection, accountAddress);
      
      const retrievedData: StoredMetadata = {
        content: result.content,
        accountAddress: accountAddress,
        transactionSignature: result.transactionSignature,
        timestamp: result.timestamp,
      };

      setStoredMetadata(retrievedData);
      setMessage({ type: 'success', text: 'Metadata retrieved successfully!' });

    } catch (error) {
      console.error('Error retrieving metadata:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to retrieve metadata' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Solana Metadata Storage
            </h1>
            <p className="text-xl text-gray-300">
              Store and retrieve metadata on Solana devnet using Phantom Wallet
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <MessageDisplay 
              message={message} 
              onClose={() => setMessage(null)} 
            />
          )}

          {/* Wallet Connection */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
            <WalletConnection
              connected={walletConnected}
              publicKey={publicKey}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
            />
          </div>

          {/* Main Content */}
          {walletConnected ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Metadata Form */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Store Metadata
                </h2>
                <MetadataForm
                  onSubmit={storeMetadata}
                  loading={loading}
                />
              </div>

              {/* Stored Data Display */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Stored Data
                </h2>
                <StoredDataDisplay
                  storedMetadata={storedMetadata}
                  onRetrieve={retrieveMetadata}
                  loading={loading}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-300 mb-6">
                Please connect your Phantom wallet to start storing metadata on Solana.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}