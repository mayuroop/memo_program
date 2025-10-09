'use client';

import { useState } from 'react';
import { StoredMetadata } from '@/types/solana';

interface StoredDataDisplayProps {
  storedMetadata: StoredMetadata | null;
  onRetrieve: (accountAddress: string) => void;
  loading: boolean;
}

export function StoredDataDisplay({ 
  storedMetadata, 
  onRetrieve, 
  loading 
}: StoredDataDisplayProps) {
  const [retrieveAddress, setRetrieveAddress] = useState('');

  const handleRetrieve = (e: React.FormEvent) => {
    e.preventDefault();
    if (retrieveAddress.trim()) {
      onRetrieve(retrieveAddress.trim());
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return content;
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Stored Data */}
      {storedMetadata ? (
        <div className="space-y-4">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-400 mb-3">
              Latest Stored Data
            </h3>
            
            {/* Account Address */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Account Address
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-black/20 text-green-400 p-2 rounded text-sm font-mono break-all">
                  {storedMetadata.accountAddress}
                </code>
                <button
                  onClick={() => copyToClipboard(storedMetadata.accountAddress)}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-2 rounded transition-colors"
                  title="Copy address"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Transaction Signature */}
            {storedMetadata.transactionSignature && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Transaction Signature
                </label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-black/20 text-green-400 p-2 rounded text-sm font-mono break-all">
                    {storedMetadata.transactionSignature}
                  </code>
                  <button
                    onClick={() => copyToClipboard(storedMetadata.transactionSignature)}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-2 rounded transition-colors"
                    title="Copy signature"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Stored At
              </label>
              <p className="text-green-400 text-sm">
                {formatTimestamp(storedMetadata.timestamp)}
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Content
              </label>
              <pre className="bg-black/20 text-green-400 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                {formatContent(storedMetadata.content)}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-500/20 border border-gray-500/30 rounded-lg p-6 text-center">
          <p className="text-gray-400">
            No metadata stored yet. Submit the form to store your first piece of data.
          </p>
        </div>
      )}

      {/* Retrieve Data Section */}
      <div className="border-t border-white/20 pt-4">
        <h3 className="text-lg font-semibold text-white mb-3">
          Retrieve Data by Address
        </h3>
        <form onSubmit={handleRetrieve} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Account Address
            </label>
            <input
              type="text"
              value={retrieveAddress}
              onChange={(e) => setRetrieveAddress(e.target.value)}
              placeholder="Enter Solana account address..."
              className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !retrieveAddress.trim()}
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Retrieving...
              </>
            ) : (
              'Retrieve Data'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
