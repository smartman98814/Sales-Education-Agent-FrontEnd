import * as React from 'react';
import { SVGProps } from 'react';

export const CollectionRelationLine1 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={503}
    height={45}
    viewBox="0 0 503 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_1010_344)">
      <path
        d="M0 1H331.747C337.033 1 342.104 3.09261 345.851 6.82042L375.649 36.4601C379.396 40.1879 384.467 42.2805 389.753 42.2805H503"
        stroke="#D1D1D1"
        strokeWidth={2}
      />
    </g>
    <defs>
      <filter
        id="filter0_d_1010_344"
        x={0}
        y={0}
        width={503}
        height={44.2808}
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
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1010_344" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1010_344"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
