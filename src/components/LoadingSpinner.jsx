import { useState, useEffect } from 'react';

function LoadingSpinner({ 
  size = 'medium', 
  variant = 'primary', 
  text = 'Loading...', 
  showProgress = false, 
  progress = 0,
  tips = []
}) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    if (tips.length > 0) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [tips]);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const variantClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-500',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Spinner */}
      <div className="relative">
        <svg 
          className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        
        {/* Pulsing ring for enhanced visual */}
        <div className={`absolute inset-0 ${sizeClasses[size]} ${variantClasses[variant]} rounded-full border-2 border-current opacity-30 animate-ping`} />
      </div>

      {/* Loading text */}
      {text && (
        <div className="text-center">
          <p className={`font-medium ${
            size === 'small' ? 'text-sm' : 
            size === 'large' || size === 'xlarge' ? 'text-lg' : 'text-base'
          } ${variantClasses[variant]}`}>
            {text}
          </p>
        </div>
      )}

      {/* Progress bar */}
      {showProgress && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                variant === 'primary' ? 'bg-blue-600' :
                variant === 'success' ? 'bg-green-600' :
                variant === 'warning' ? 'bg-yellow-600' :
                variant === 'danger' ? 'bg-red-600' :
                'bg-gray-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {/* Rotating tips */}
      {tips.length > 0 && (
        <div className="text-center max-w-md">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-yellow-800 text-xs">💡</span>
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Pro Tip
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {tips[currentTipIndex]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized loading components for different use cases
export function DocumentProcessingLoader({ progress = 0 }) {
  const tips = [
    "PoliGap analyzes over 50 compliance frameworks to ensure comprehensive coverage.",
    "Our AI can detect subtle compliance gaps that manual reviews often miss.",
    "Documents are automatically categorized by industry and risk level.",
    "The analysis includes recommendations with estimated implementation timelines.",
    "All processed documents are encrypted and automatically deleted after 30 days."
  ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
      <LoadingSpinner
        size="large"
        variant="primary"
        text="Analyzing Policy Document"
        showProgress={true}
        progress={progress}
        tips={tips}
      />
      
      {/* Processing steps */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border ${
          progress >= 33 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {progress >= 33 ? (
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            ) : (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            )}
            <span className={`text-sm font-semibold ${
              progress >= 33 ? 'text-green-900' : 'text-blue-900'
            }`}>
              Document Processing
            </span>
          </div>
          <p className={`text-xs ${
            progress >= 33 ? 'text-green-700' : 'text-gray-600'
          }`}>
            Extracting and parsing content
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${
          progress >= 66 ? 'bg-green-50 border-green-200' : 
          progress >= 33 ? 'bg-blue-50 border-blue-200' : 
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {progress >= 66 ? (
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            ) : progress >= 33 ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
            )}
            <span className={`text-sm font-semibold ${
              progress >= 66 ? 'text-green-900' : 
              progress >= 33 ? 'text-blue-900' : 
              'text-gray-500'
            }`}>
              AI Analysis
            </span>
          </div>
          <p className={`text-xs ${
            progress >= 66 ? 'text-green-700' : 
            progress >= 33 ? 'text-blue-700' : 
            'text-gray-500'
          }`}>
            Identifying compliance gaps
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${
          progress >= 100 ? 'bg-green-50 border-green-200' : 
          progress >= 66 ? 'bg-blue-50 border-blue-200' : 
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {progress >= 100 ? (
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            ) : progress >= 66 ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
            )}
            <span className={`text-sm font-semibold ${
              progress >= 100 ? 'text-green-900' : 
              progress >= 66 ? 'text-blue-900' : 
              'text-gray-500'
            }`}>
              Report Generation
            </span>
          </div>
          <p className={`text-xs ${
            progress >= 100 ? 'text-green-700' : 
            progress >= 66 ? 'text-blue-700' : 
            'text-gray-500'
          }`}>
            Creating actionable insights
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner
        size="medium"
        variant="primary"
        text="Authenticating..."
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner
        size="large"
        variant="primary"
        text="Loading PoliGap..."
        tips={[
          "PoliGap helps organizations achieve compliance faster than traditional methods.",
          "Our platform supports GDPR, HIPAA, SOX, and many other frameworks.",
          "AI-powered analysis can reduce compliance review time by up to 80%."
        ]}
      />
    </div>
  );
}

export default LoadingSpinner;
