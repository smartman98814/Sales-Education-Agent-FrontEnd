import { SVGProps } from 'react';

export const EyeLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={66}
    height={110}
    viewBox="0 0 66 110"
    fill="none"
    {...props}
  >
    <path
      fill="#58F5FF"
      d="M16 33c0-9.389 7.394-17 16.514-17h.972C42.606 16 50 23.611 50 33v44c0 9.389-7.394 17-16.514 17h-.972C23.394 94 16 86.389 16 77V33Z"
    />
    <g filter="url(#a)">
      <path
        fill="#58F5FF"
        d="M16 33c0-9.389 7.394-17 16.514-17h.972C42.606 16 50 23.611 50 33v44c0 9.389-7.394 17-16.514 17h-.972C23.394 94 16 86.389 16 77V33Z"
      />
    </g>
    <defs>
      <filter
        id="a"
        width={66}
        height={110}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur result="effect1_foregroundBlur_437_36" stdDeviation={8} />
      </filter>
    </defs>
  </svg>
);
