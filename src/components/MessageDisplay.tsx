'use client';

interface MessageDisplayProps {
  message: { type: 'success' | 'error'; text: string };
  onClose: () => void;
}

export function MessageDisplay({ message, onClose }: MessageDisplayProps) {
  const isSuccess = message.type === 'success';
  
  return (
    <div className={`mb-6 p-4 rounded-lg border ${
      isSuccess 
        ? 'bg-green-500/20 border-green-500/30 text-green-400' 
        : 'bg-red-500/20 border-red-500/30 text-red-400'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Icon */}
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            isSuccess ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {isSuccess ? (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          
          {/* Message */}
          <p className="font-medium">{message.text}</p>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`p-1 rounded-full hover:bg-white/10 transition-colors ${
            isSuccess ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
