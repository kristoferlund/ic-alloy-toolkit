export default function Spinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'inline-block',
        marginBottom: '-3px',
        height: '15px',
        width: '15px',
        background: 'transparent',
        shapeRendering: 'auto',
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="white"
        strokeWidth="8"
        r="35"
        strokeDasharray="164.93361431346415 56.97787143782138"
        strokeDashoffset="0"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          from="0 50 50"
          to="360 50 50"
        />
      </circle>
    </svg>
  );
};


