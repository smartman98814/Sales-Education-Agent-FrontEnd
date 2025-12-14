import * as React from 'react';
import { SVGProps } from 'react';

export const BarcodeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={43}
    height={14}
    viewBox="0 0 43 14"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M0 .5h2v13H0zM4 .5h4v13H4zM10 .5h1v13h-1zM13 .5h4v13h-4zM19 .5h1v13h-1zM22 .5h1v13h-1zM25 .5h2v13h-2zM29 .5h1v13h-1zM32 .5h4v13h-4zM38 .5h2v13h-2zM42 .5h1v13h-1z"
    />
  </svg>
);
