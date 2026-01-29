import React from "react";

const Pokeball = ({
  size = 24, // Default size if nothing is passed
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24" // <--- THIS IS THE FIX. It allows scaling.
    width={size} // Uses the size prop
    height={size} // Uses the size prop
    fill="none"
    stroke={props.stroke || "#d73131"}
    strokeWidth={1.5}
    color={props.color || "#d73131"}
    className={props.className}
    onClick={props.onClick}
    {...props} // Passes any other props like className
  >
    <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" />
    <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" />
    <path d="M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2 11c2.596 1.004 4.853 1.668 6.998 1.993M22 11.003c-2.593 1.01-4.848 1.675-6.998 1.997" />
  </svg>
);

export default Pokeball;
