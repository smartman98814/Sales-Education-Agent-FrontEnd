export const MintIcon = ({ className = 'w-7 h-7' }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* "MINT" text - much larger */}
      <text
        x="50"
        y="50"
        fontFamily="Arial, sans-serif"
        fontSize="45"
        fontWeight="bold"
        fill="currentColor"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        MINT
      </text>
    </svg>
  );
};
