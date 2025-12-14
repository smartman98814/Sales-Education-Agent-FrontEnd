import * as React from 'react';
import { SVGProps } from 'react';

export const IndicatorLine = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={128}
    height={83}
    viewBox="0 0 128 83"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeOpacity={0.4}
      d="M1 82 81.121 1.879A3 3 0 0 1 83.243 1H127.5"
    />
  </svg>
);
