'use client'

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingOverlay({ 
  isLoading, 
  message = 'Loading...', 
  fullScreen = false 
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center ${
        fullScreen ? '' : 'bg-black/20'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        {message && (
          <p className="text-gray-700 font-medium text-lg animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

