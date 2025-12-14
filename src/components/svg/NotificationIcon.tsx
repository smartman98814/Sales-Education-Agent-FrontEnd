import { SVGProps } from 'react';

export const NotificationIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={32}
    height={34}
    viewBox="0 0 32 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_358_4)">
      <path
        d="M16 3.75004C11.8579 3.75004 8.5 7.10791 8.5 11.25V18.9348C8.5 19.7889 8.09525 20.6385 7.33994 21.0373C6.545 21.4571 6 22.293 6 23.25C6 24.625 7.125 25.75 8.5 25.75H23.5C24.875 25.75 26 24.625 26 23.25C26 22.293 25.455 21.4571 24.6601 21.0373C23.9047 20.6385 23.5 19.7889 23.5 18.9348V11.25C23.5 7.10791 20.1421 3.75004 16 3.75004ZM16 3.75004L16 1.25001M13.5 30.75H18.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_358_4"
        x={0}
        y={0}
        width={34}
        height={34}
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
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_358_4" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_358_4" result="shape" />
      </filter>
    </defs>
  </svg>
);
