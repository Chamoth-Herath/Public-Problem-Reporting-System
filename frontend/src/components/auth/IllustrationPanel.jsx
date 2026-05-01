import React from 'react';

export const IllustrationPanel = () => {
  return (
    <div className="hidden md:flex w-full md:w-2/5 bg-[#042C53] flex-col items-center justify-between py-12 px-8 relative overflow-hidden">
      {/* Subtle geometric pattern background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#F1EFE8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>

      {/* App name */}
      <div className="text-center z-10">
        <h1 className="text-4xl font-bold text-[#F1EFE8]" style={{ fontFamily: 'Syne' }}>
          CivilTrack
        </h1>
        <p
          className="text-[#B5D4F4] mt-2 text-sm"
          style={{ fontFamily: 'DM Sans' }}
        >
          Your voice. Your city. Our commitment.
        </p>
      </div>

      {/* Illustration SVG - Government building / civic symbol */}
      <div className="z-10 flex-1 flex items-center justify-center">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Building structure */}
          <rect x="40" y="60" width="120" height="100" fill="#1D9E75" opacity="0.8" />
          
          {/* Roof/dome */}
          <polygon points="50,60 100,20 150,60" fill="#185FA5" opacity="0.9" />
          
          {/* Door */}
          <rect x="90" y="120" width="20" height="40" fill="#042C53" />
          <circle cx="108" cy="140" r="2" fill="#F1EFE8" />

          {/* Windows */}
          <rect x="60" y="80" width="15" height="15" fill="#B5D4F4" opacity="0.7" />
          <rect x="85" y="80" width="15" height="15" fill="#B5D4F4" opacity="0.7" />
          <rect x="110" y="80" width="15" height="15" fill="#B5D4F4" opacity="0.7" />
          <rect x="135" y="80" width="15" height="15" fill="#B5D4F4" opacity="0.7" />

          <rect x="60" y="105" width="15" height="15" fill="#B5D4F4" opacity="0.7" />
          <rect x="85" y="105" width="15" height="15" fill="#B5D4F4" opacity="0.7" />
          <rect x="110" y="105" width="15" height="15" fill="#B5D4F4" opacity="0.7" />
          <rect x="135" y="105" width="15" height="15" fill="#B5D4F4" opacity="0.7" />

          {/* Shield with checkmark */}
          <g transform="translate(150, 45)">
            <path
              d="M 0 0 L 15 0 L 15 20 Q 15 25 0 30 Q -15 25 -15 20 L -15 0 Z"
              fill="#1D9E75"
            />
            <g transform="translate(-5, 8)">
              <polyline
                points="2,10 5,13 10,5"
                fill="none"
                stroke="#F1EFE8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>

          {/* Flag on top */}
          <line x1="100" y1="20" x2="100" y2="5" stroke="#F1EFE8" strokeWidth="2" />
          <polygon points="100,5 115,10 100,15" fill="#185FA5" />
        </svg>
      </div>

      {/* Carousel dots */}
      <div className="flex gap-2 z-10">
        <div className="w-2 h-2 rounded-full border border-[#B5D4F4]"></div>
        <div className="w-2 h-2 rounded-full bg-[#1D9E75]"></div>
        <div className="w-2 h-2 rounded-full border border-[#B5D4F4]"></div>
      </div>
    </div>
  );
};
