'use client';

export default function YouTubeLogo({ size = 24, showWordmark = false, className = '' }) {
  // Official YouTube Brand Assets:
  // Red: #FF0000
  // Triangle: White (#FFFFFF)
  const height = size;
  const width = showWordmark ? size * 4.2 : size * 1.42;

  if (showWordmark) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
      >
        {/* Official YouTube Red Rounded Rectangle */}
        <g>
          <path
            d="M39.38 4.38C38.93 2.7 37.6 1.38 35.93 0.93C32.89 0.1 20.48 0.1 20.48 0.1C20.48 0.1 8.07 0.1 5.03 0.93C3.36 1.38 2.03 2.7 28 4.38C0.75 7.42 0.75 13.76 0.75 13.76C0.75 13.76 0.75 20.1 28 23.14C2.03 24.82 3.36 26.14 5.03 26.59C8.07 27.42 20.48 27.42 20.48 27.42C20.48 27.42 32.89 27.42 35.93 26.59C37.6 26.14 38.93 24.82 39.38 23.14C40.21 20.1 40.21 13.76 40.21 13.76C40.21 13.76 40.21 7.42 39.38 4.38Z"
            fill="#FF0000"
          />
          {/* Official White Play Triangle */}
          <polygon points="16.5,8.2 26.9,13.8 16.5,19.3" fill="#FFFFFF" />
        </g>
        {/* Official YouTube Text */}
        <text x="45" y="20" fill="currentColor" fontSize="19" fontWeight="800" letterSpacing="-0.5">
          YouTube
        </text>
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 41 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* Official YouTube Red Rounded Rectangle */}
      <path
        d="M39.38 4.38C38.93 2.7 37.6 1.38 35.93 0.93C32.89 0.1 20.48 0.1 20.48 0.1C20.48 0.1 8.07 0.1 5.03 0.93C3.36 1.38 2.03 2.7 28 4.38C0.75 7.42 0.75 13.76 0.75 13.76C0.75 13.76 0.75 20.1 28 23.14C2.03 24.82 3.36 26.14 5.03 26.59C8.07 27.42 20.48 27.42 20.48 27.42C20.48 27.42 32.89 27.42 35.93 26.59C37.6 26.14 38.93 24.82 39.38 23.14C40.21 20.1 40.21 13.76 40.21 13.76C40.21 13.76 40.21 7.42 39.38 4.38Z"
        fill="#FF0000"
      />
      {/* Official White Play Triangle */}
      <polygon points="16.5,8.2 26.9,13.8 16.5,19.3" fill="#FFFFFF" />
    </svg>
  );
}
