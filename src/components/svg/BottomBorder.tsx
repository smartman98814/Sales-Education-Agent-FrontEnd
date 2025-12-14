import * as React from 'react';
import { SVGProps } from 'react';

export const BottomBorder = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={1264}
    height={175}
    viewBox="0 0 1264 175"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_222_2)">
      <path
        d="M0 1H118.216C123.52 1 128.607 3.10714 132.358 6.85786L293.142 167.642C296.893 171.393 301.98 173.5 307.284 173.5H1052.45C1059.6 173.5 1066.2 169.688 1069.77 163.5L1157.82 11C1161.39 4.81197 1167.99 1 1175.14 1H1263.5"
        stroke="#D1D1D1"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_222_2"
        x={0}
        y={0.5}
        width={1263.5}
        height={174.5}
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
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_222_2" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_222_2" result="shape" />
      </filter>
    </defs>
  </svg>
);
