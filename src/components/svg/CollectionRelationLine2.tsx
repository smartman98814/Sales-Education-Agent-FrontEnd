import * as React from 'react';
import { SVGProps } from 'react';

export const CollectionRelationLine2 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={416}
    height={41}
    viewBox="0 0 416 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_0_1)">
      <path
        d="M-58 3L20.7157 3C26.0201 3 31.1071 5.10714 34.8579 8.85786L58.6421 32.6421C62.3929 36.3929 67.4799 38.5 72.7843 38.5H445.5"
        stroke="#D1D1D1"
        strokeWidth={2}
      />
    </g>
    <g opacity={0.4} filter="url(#filter1_f_0_1)">
      <path
        d="M-58 6L20.7157 6C26.0201 6 31.1071 8.10714 34.8579 11.8579L48.5 25.5"
        stroke="url(#paint0_linear_0_1)"
        strokeWidth={2}
      />
    </g>
    <path
      d="M-58 3L20.7157 3C26.0201 3 31.1071 5.10714 34.8579 8.85786L48.5 22.5"
      stroke="url(#paint1_linear_0_1)"
      strokeWidth={2}
    />
    <defs>
      <filter
        id="filter0_d_0_1"
        x={-58}
        y={2}
        width={503.5}
        height={38.5}
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
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape" />
      </filter>
      <filter
        id="filter1_f_0_1"
        x={-63}
        y={0}
        width={117.207}
        height={31.2071}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation={2.5} result="effect1_foregroundBlur_0_1" />
      </filter>
      <linearGradient
        id="paint0_linear_0_1"
        x1={6.83153}
        y1={29.345}
        x2={44.6501}
        y2={26.0206}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2791FC" stopOpacity={0} />
        <stop offset={0.75} stopColor="#2791FC" />
        <stop offset={1} stopColor="#28C9FF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_0_1"
        x1={-21.9965}
        y1={26.6197}
        x2={44.2089}
        y2={23.2997}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2791FC" stopOpacity={0} />
        <stop offset={0.75} stopColor="#2791FC" />
        <stop offset={1} stopColor="#28C9FF" />
      </linearGradient>
    </defs>
  </svg>
);
