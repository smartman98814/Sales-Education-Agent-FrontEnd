import * as React from 'react';
import { SVGProps } from 'react';

export const BnbChainIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      fill="#F3BA2F"
      d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z"
    />
    <path
      stroke="#000"
      strokeOpacity={0.21}
      d="M12 .5C18.351.5 23.5 5.649 23.5 12S18.351 23.5 12 23.5.5 18.351.5 12 5.649.5 12 .5Z"
    />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="m15.113 13.276 1.81 1.805-4.921 4.916-4.916-4.916 1.81-1.805 3.106 3.105 3.11-3.105Zm-3.111-3.11 1.836 1.836-1.836 1.836-1.831-1.831v-.005l.322-.323.156-.156 1.353-1.357Zm-6.19.026 1.81 1.81-1.81 1.805-1.81-1.81 1.81-1.805Zm12.38 0 1.81 1.81-1.81 1.805-1.81-1.81 1.81-1.805Zm-6.19-6.19 4.915 4.915-1.81 1.81-3.105-3.11-3.105 3.105-1.81-1.805 4.915-4.915Z"
      clipRule="evenodd"
    />
  </svg>
);
