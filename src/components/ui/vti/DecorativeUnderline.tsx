import React from "react";

interface DecorativeUnderlineProps {
  color?: string;
  className?: string;
}

export function DecorativeUnderline({
  color = "#C08C52",
  className = "",
}: DecorativeUnderlineProps) {
  return (
    <svg
      viewBox="0 0 130 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute left-0 -bottom-2 w-full h-[12px] pointer-events-none select-none ${className}`}
      preserveAspectRatio="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M125.063 11.8721C70.1888 -4.37767 22.1363 5.8257 5.29072 11.7636C3.83126 12.278 1.75942 13.7649 0.663148 13.08C-0.433124 12.3951 -0.138697 9.79786 1.32077 9.28341C19.8924 2.73708 70.7797 -7.78747 128.327 9.17486C129.914 9.59788 130.47 12.1696 129.569 12.9144C128.667 13.6593 126.65 12.2952 125.063 11.8721Z"
        fill={color}
      />
    </svg>
  );
}
