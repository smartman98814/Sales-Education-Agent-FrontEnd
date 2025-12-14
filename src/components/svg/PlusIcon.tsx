import * as React from 'react';
import { SVGProps } from 'react';

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={62} height={68} fill="none" {...props}>
    <g filter="url(#a)">
      <path fill="url(#b)" d="M38 26h16v8H38v16h-8V34H14v-8h16V10h8v16Z" />
      <path
        stroke="#fff"
        strokeOpacity={0.5}
        d="M37.5 10.5v16h16v7h-16v16h-7v-16h-16v-7h16v-16h7Z"
      />
    </g>
    <defs>
      <radialGradient
        id="b"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(-20.9091 0 0 -20 34 30)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#28C9FF" />
        <stop offset={1} stopColor="#2791FC" />
      </radialGradient>
      <filter
        id="a"
        width={68}
        height={68}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={7} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.152941 0 0 0 0 0.568627 0 0 0 0 0.988235 0 0 0 0.2 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_104_110" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow_104_110" result="shape" />
      </filter>
    </defs>
  </svg>
);
