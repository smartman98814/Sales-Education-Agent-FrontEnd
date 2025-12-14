import * as React from 'react';
import { SVGProps } from 'react';

export const CollectionRelationLine4 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={416}
    height={56}
    viewBox="0 0 416 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_166_227)">
      <g clipPath="url(#clip1_166_227)">
        <g filter="url(#filter0_d_166_227)">
          <path
            d="M-18 1H41.2468C46.5327 1 51.6037 3.09261 55.3514 6.82042L85.1486 36.4601C88.8963 40.1879 93.9673 42.2805 99.2532 42.2805H512"
            stroke="#D1D1D1"
            strokeWidth={2}
          />
        </g>
        <g opacity={0.4} filter="url(#filter1_f_166_227)">
          <path
            d="M-18 3H41.2468C46.5327 3 51.6037 5.09261 55.3514 8.82042L85.1486 38.4601C88.8963 42.1879 93.9673 44.2805 99.2532 44.2805H114.5"
            stroke="url(#paint0_linear_166_227)"
            strokeWidth={2}
          />
        </g>
        <path
          d="M-18 1H41.2468C46.5327 1 51.6037 3.09261 55.3514 6.82042L85.1486 36.4601C88.8963 40.1879 93.9673 42.2805 99.2532 42.2805H114.5"
          stroke="url(#paint1_linear_166_227)"
          strokeWidth={2}
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_166_227"
        x={-18}
        y={0}
        width={530}
        height={44.2805}
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
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_166_227" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_166_227" result="shape" />
      </filter>
      <filter
        id="filter1_f_166_227"
        x={-23}
        y={-3}
        width={142.5}
        height={53.2805}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation={2.5} result="effect1_foregroundBlur_166_227" />
      </filter>
      <linearGradient
        id="paint0_linear_166_227"
        x1={62.6589}
        y1={52.4203}
        x2={109.948}
        y2={49.9773}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2791FC" stopOpacity={0} />
        <stop offset={0.75} stopColor="#2791FC" />
        <stop offset={1} stopColor="#28C9FF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_166_227"
        x1={-44}
        y1={17.8611}
        x2={89.8479}
        y2={67.6814}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2791FC" stopOpacity={0} />
        <stop offset={0.75} stopColor="#2791FC" />
        <stop offset={1} stopColor="#28C9FF" />
      </linearGradient>
      <clipPath id="clip0_166_227">
        <rect width={416} height={56} fill="white" />
      </clipPath>
      <clipPath id="clip1_166_227">
        <rect width={416} height={443} fill="white" transform="translate(0 -350)" />
      </clipPath>
    </defs>
  </svg>
);
