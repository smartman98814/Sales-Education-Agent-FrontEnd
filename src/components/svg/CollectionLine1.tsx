import * as React from 'react';
import { SVGProps } from 'react';

export const CollectionLine1 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={187}
    height={78}
    viewBox="0 0 187 78"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_1010_334)">
      <path
        d="M0 0.5H102.216C107.52 0.5 112.607 2.60714 116.358 6.35786L186.5 76.5"
        stroke="#D1D1D1"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_1010_334"
        x={0}
        y={0}
        width={186.854}
        height={77.8535}
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
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1010_334" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1010_334"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
