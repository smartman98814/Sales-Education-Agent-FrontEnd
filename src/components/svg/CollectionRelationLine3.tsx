import * as React from 'react';
import { SVGProps } from 'react';

export const CollectionRelationLine3 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={416}
    height={48}
    viewBox="0 0 416 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_0_1)">
      <path
        d="M-64 4.00006H89.2157C94.5201 4.00006 99.6071 6.10719 103.358 9.85792L127.142 33.6422C130.893 37.3929 135.98 39.5001 141.284 39.5001H278.812C283.61 39.5001 288.248 37.775 291.881 34.6396L321.744 8.86045C325.377 5.72506 330.015 4 334.813 4H440"
        stroke="#D1D1D1"
        strokeWidth={2}
      />
    </g>
    <g opacity={0.4} filter="url(#filter1_f_0_1)">
      <path
        d="M-64 6.00006H89.2157C94.5201 6.00006 99.6071 8.10719 103.358 11.8579L127.142 35.6422C130.893 39.3929 135.98 41.5001 141.284 41.5001H278.812C283.61 41.5001 288.248 39.775 291.881 36.6396L321.744 10.8604C325.377 7.72506 330.015 6 334.813 6H359"
        stroke="url(#paint0_linear_0_1)"
        strokeWidth={2}
      />
    </g>
    <path
      d="M-64 4.00006H89.2157C94.5201 4.00006 99.6071 6.10719 103.358 9.85792L127.142 33.6422C130.893 37.3929 135.98 39.5001 141.284 39.5001H278.812C283.61 39.5001 288.248 37.775 291.881 34.6396L321.744 8.86045C325.377 5.72506 330.015 4 334.813 4H359"
      stroke="url(#paint1_linear_0_1)"
      strokeWidth={2}
    />
    <defs>
      <filter
        id="filter0_d_0_1"
        x={-64}
        y={3}
        width={504}
        height={38.5001}
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
        x={-69}
        y={0}
        width={433}
        height={47.5001}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation={2.5} result="effect1_foregroundBlur_0_1" />
      </filter>
      <linearGradient
        id="paint0_linear_0_1"
        x1={193.5}
        y1={48.5}
        x2={339.5}
        y2={20.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2791FC" stopOpacity={0} />
        <stop offset={0.75} stopColor="#2791FC" />
        <stop offset={1} stopColor="#28C9FF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_0_1"
        x1={79}
        y1={47}
        x2={339.5}
        y2={18.5001}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2791FC" stopOpacity={0} />
        <stop offset={0.75} stopColor="#2791FC" />
        <stop offset={1} stopColor="#28C9FF" />
      </linearGradient>
    </defs>
  </svg>
);
