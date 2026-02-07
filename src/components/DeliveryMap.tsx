import React from 'react';

export function DeliveryMap() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-300 via-slate-200 to-slate-100">
      <svg className="w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width="400" height="600" fill="#e8edf5" />
        <rect width="400" height="600" fill="url(#grid)" />

        {/* Road network */}
        <line x1="0" y1="150" x2="400" y2="150" stroke="#f5d547" strokeWidth="8" />
        <line x1="150" y1="0" x2="150" y2="600" stroke="#f5d547" strokeWidth="8" />
        <line x1="350" y1="100" x2="350" y2="500" stroke="#f5d547" strokeWidth="6" />
        <line x1="50" y1="400" x2="300" y2="400" stroke="#f5d547" strokeWidth="6" />

        {/* Buildings/blocks */}
        <rect x="50" y="50" width="60" height="60" fill="#c7d2e8" stroke="#9ca3af" strokeWidth="1" />
        <rect x="200" y="80" width="80" height="50" fill="#c7d2e8" stroke="#9ca3af" strokeWidth="1" />
        <rect x="320" y="200" width="60" height="70" fill="#c7d2e8" stroke="#9ca3af" strokeWidth="1" />
        <rect x="80" y="300" width="70" height="60" fill="#c7d2e8" stroke="#9ca3af" strokeWidth="1" />
        <rect x="220" y="320" width="80" height="75" fill="#c7d2e8" stroke="#9ca3af" strokeWidth="1" />

        {/* Green spaces */}
        <circle cx="280" cy="500" r="40" fill="#86efac" opacity="0.6" />
        <circle cx="100" cy="500" r="35" fill="#86efac" opacity="0.6" />

        {/* Current location marker */}
        <circle cx="150" cy="150" r="12" fill="#3b82f6" />
        <circle cx="150" cy="150" r="18" fill="#3b82f6" opacity="0.2" />

        {/* Delivery location marker */}
        <circle cx="300" cy="350" r="12" fill="#10b981" />
        <circle cx="300" cy="350" r="18" fill="#10b981" opacity="0.2" />

        {/* Route line */}
        <path
          d="M 150 150 Q 200 200 300 350"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          opacity="0.6"
        />

        {/* ETA badge */}
        <g transform="translate(250, 100)">
          <rect x="0" y="0" width="100" height="40" rx="20" fill="#3b82f6" />
          <text x="50" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
            Arrive by 4:55 PM
          </text>
        </g>
      </svg>
    </div>
  );
}
