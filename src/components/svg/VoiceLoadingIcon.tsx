import * as React from 'react';
import { SVGProps } from 'react';

export const VoiceLoadingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="animate-spin"
    {...props}
  >
    <path
      d="M14 1.5C20.9036 1.5 26.5 7.09644 26.5 14C26.5 20.9036 20.9036 26.5 14 26.5C7.09644 26.5 1.5 20.9036 1.5 14C1.5 7.09644 7.09644 1.5 14 1.5Z"
      fill="url(#paint0_radial_loading)"
    />
    <path
      d="M14 1.5C20.9036 1.5 26.5 7.09644 26.5 14C26.5 20.9036 20.9036 26.5 14 26.5C7.09644 26.5 1.5 20.9036 1.5 14C1.5 7.09644 7.09644 1.5 14 1.5Z"
      stroke="url(#paint1_linear_loading)"
      strokeWidth={3}
    />
    <g filter="url(#filter0_d_loading)">
      {/* Loading spinner dots */}
      <circle cx={14} cy={6} r={1.5} fill="white" opacity={1} />
      <circle cx={19.5} cy={8.5} r={1.5} fill="white" opacity={0.8} />
      <circle cx={22} cy={14} r={1.5} fill="white" opacity={0.6} />
      <circle cx={19.5} cy={19.5} r={1.5} fill="white" opacity={0.4} />
      <circle cx={14} cy={22} r={1.5} fill="white" opacity={0.2} />
      <circle cx={8.5} cy={19.5} r={1.5} fill="white" opacity={0.1} />
      <circle cx={6} cy={14} r={1.5} fill="white" opacity={0.05} />
      <circle cx={8.5} cy={8.5} r={1.5} fill="white" opacity={0.1} />
    </g>
    <defs>
      <filter
        id="filter0_d_loading"
        x={4}
        y={4}
        width={20}
        height={20}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={1} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_loading" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_loading" result="shape" />
      </filter>
      <radialGradient
        id="paint0_radial_loading"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(14 14) rotate(180) scale(14.6364 14)"
      >
        <stop stopColor="#28C9FF" />
        <stop offset={1} stopColor="#2791FC" />
      </radialGradient>
      <linearGradient
        id="paint1_linear_loading"
        x1={14}
        y1={0}
        x2={14}
        y2={28}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#69DAFF" />
        <stop offset={1} stopColor="#1E65FF" />
      </linearGradient>
    </defs>
  </svg>
);
