import * as React from 'react';
import { SVGProps } from 'react';

export const SingleForwardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={12}
    height={14}
    viewBox="0 0 12 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_2291_488)">
      <path d="M0 12H3.94144L10 6L3.94144 0H0L6.05856 6L0 12Z" fill="white" />
    </g>
    <defs>
      <filter
        id="filter0_d_2291_488"
        x={0}
        y={0}
        width={12}
        height={14}
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
        <feOffset dx={1} dy={1} />
        <feGaussianBlur stdDeviation={0.5} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2291_488" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_2291_488"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
