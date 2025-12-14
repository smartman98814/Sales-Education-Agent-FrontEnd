import * as React from 'react';
import { SVGProps } from 'react';

export const VoicePlayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14 1.5C20.9036 1.5 26.5 7.09644 26.5 14C26.5 20.9036 20.9036 26.5 14 26.5C7.09644 26.5 1.5 20.9036 1.5 14C1.5 7.09644 7.09644 1.5 14 1.5Z"
      fill="url(#paint0_radial_1716_652)"
    />
    <path
      d="M14 1.5C20.9036 1.5 26.5 7.09644 26.5 14C26.5 20.9036 20.9036 26.5 14 26.5C7.09644 26.5 1.5 20.9036 1.5 14C1.5 7.09644 7.09644 1.5 14 1.5Z"
      stroke="url(#paint1_linear_1716_652)"
      strokeWidth={3}
    />
    <g filter="url(#filter0_d_1716_652)">
      <path
        d="M9.79993 10.1035C9.79993 8.52119 11.5504 7.5655 12.8814 8.42116L18.9429 12.3178C20.1676 13.1051 20.1676 14.8953 18.9429 15.6825L12.8814 19.5792C11.5504 20.4349 9.79993 19.4792 9.79993 17.8969V10.1035Z"
        fill="white"
        shapeRendering="crispEdges"
      />
      <path
        d="M9.79993 10.1035C9.79993 8.52119 11.5504 7.5655 12.8814 8.42116L18.9429 12.3178C20.1676 13.1051 20.1676 14.8953 18.9429 15.6825L12.8814 19.5792C11.5504 20.4349 9.79993 19.4792 9.79993 17.8969V10.1035Z"
        stroke="#3C7DFF"
        strokeOpacity={0.54}
        strokeLinecap="round"
        strokeLinejoin="round"
        shapeRendering="crispEdges"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_1716_652"
        x={9.29993}
        y={7.59937}
        width={11.0615}
        height={13.8015}
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
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1716_652" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1716_652"
          result="shape"
        />
      </filter>
      <radialGradient
        id="paint0_radial_1716_652"
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
        id="paint1_linear_1716_652"
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
