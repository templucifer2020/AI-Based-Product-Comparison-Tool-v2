import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16.5 16.5l-2.5-2.5" />
    <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
    <path d="M11 11c1-2.5 2.5-5.5 2.5-5.5" />
    <path d="M11 11c-1.5 2-2.5 5-2.5 5" />
  </svg>
);
