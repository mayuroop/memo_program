'use client';

import { useState } from 'react';
import { MetadataFormData } from '@/types/solana';

interface MetadataFormProps {
  onSubmit: (data: MetadataFormData) => void;
  loading: boolean;
}

export function MetadataForm({ onSubmit, loading }: MetadataFormProps) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'text' | 'json'>('text');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }

    if (type === 'json') {
      try {
        JSON.parse(content);
      } catch {
        setError('Invalid JSON format');
        return;
      }
    }

    onSubmit({ content: content.trim(), type });
  };

  const handleTypeChange = (newType: 'text' | 'json') => {
    setType(newType);
    setError('');
    
    // Clear content when switching to JSON to avoid confusion
    if (newType === 'json' && type === 'text') {
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Content Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Content Type
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="text"
              checked={type === 'text'}
              onChange={() => handleTypeChange('text')}
              className="mr-2 text-blue-500"
            />
            <span className="text-white">Plain Text</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="json"
              checked={type === 'json'}
              onChange={() => handleTypeChange('json')}
              className="mr-2 text-blue-500"
            />
            <span className="text-white">JSON</span>
          </label>
        </div>
      </div>

      {/* Content Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {type === 'json' ? 'JSON Content' : 'Text Content'}
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            type === 'json' 
              ? '{"name": "example", "value": "data"}' 
              : 'Enter your metadata content here...'
          }
          className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={6}
          disabled={loading}
        />
        {type === 'json' && (
          <p className="text-xs text-gray-400 mt-1">
            Enter valid JSON format. The content will be validated before submission.
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-red-400 text-sm bg-red-500/20 border border-red-500/30 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Storing on Solana...
          </>
        ) : (
          'Store Metadata on Solana'
        )}
      </button>

      {/* Info Text */}
      <div className="text-xs text-gray-400 bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
        <p className="font-semibold mb-1">How it works:</p>
        <ul className="space-y-1 text-left">
          <li>• A new Solana account will be created to store your metadata</li>
          <li>• You'll sign a transaction to pay for account creation</li>
          <li>• The metadata will be stored as raw data in the account</li>
          <li>• You can retrieve the data using the account address</li>
        </ul>
      </div>
    </form>
  );
}
