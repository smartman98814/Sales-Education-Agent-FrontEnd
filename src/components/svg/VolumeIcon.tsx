import { SVGProps } from 'react';

export const VolumeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.16667 4.16667L5.83333 7.5H2.5V12.5H5.83333L9.16667 15.8333V4.16667ZM13.3333 7.5C13.9896 8.15625 14.3542 9.05417 14.3542 10C14.3542 10.9458 13.9896 11.8438 13.3333 12.5M15.8333 5C17.1458 6.3125 17.8958 8.125 17.8958 10C17.8958 11.875 17.1458 13.6875 15.8333 15"
      stroke="currentColor"
      strokeWidth={1.67}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
