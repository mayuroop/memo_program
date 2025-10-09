'use client';

import { PublicKey } from '@solana/web3.js';

interface WalletConnectionProps {
  connected: boolean;
  publicKey: PublicKey | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletConnection({ 
  connected, 
  publicKey, 
  onConnect, 
  onDisconnect 
}: WalletConnectionProps) {
  const formatAddress = (address: PublicKey) => {
    const str = address.toString();
    return `${str.slice(0, 4)}...${str.slice(-4)}`;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Wallet Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>

        {/* Connection Status */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            {connected ? 'Wallet Connected' : 'Wallet Not Connected'}
          </h3>
          {connected && publicKey && (
            <p className="text-sm text-gray-300 font-mono">
              {formatAddress(publicKey)}
            </p>
          )}
        </div>
      </div>

      {/* Connection Button */}
      <button
        onClick={connected ? onDisconnect : onConnect}
        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
          connected
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
        }`}
      >
        {connected ? 'Disconnect' : 'Connect Phantom'}
      </button>
    </div>
  );
}
