"use client"

import { cn } from '@/lib/shadcn.utils'

interface HeartIconProps {
  filled?: boolean
  className?: string
  onClick?: () => void
}

export const HeartIcon = ({ filled = false, className, onClick }: HeartIconProps) => {
  return (
    <button
      className={cn("w-6 h-6 cursor-pointer transition-colors border-none bg-transparent p-0", className)}
      onClick={onClick}
      aria-label={filled ? "Unlike" : "Like"}
      type="button"
    >
      <svg
        className="w-full h-full"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}