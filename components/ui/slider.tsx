"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

export interface SliderProps
extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
thumbClassName?: string
minThumbClassName?: string
maxThumbClassName?: string
}

const Slider = React.forwardRef<
React.ElementRef<typeof SliderPrimitive.Root>,
SliderProps
>(
(
  {
    className,
    thumbClassName,
    minThumbClassName,
    maxThumbClassName,
    value,
    defaultValue,
    ...props
  },
  ref
) => {
  const count =
    Array.isArray(value) && value.length > 0
      ? value.length
      : Array.isArray(defaultValue) && defaultValue.length > 0
        ? defaultValue.length
        : 1

  // Базовый стиль для "обычного" (левого) бегунка
  const baseThumbClass =
    "block h-4 w-4 rounded-full border border-primary/50 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"

  // Стиль из запроса пользователя для правого (максимального) бегунка
  const requestedRightThumbClass =
    "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      value={value as number[] | undefined}
      defaultValue={defaultValue as number[] | undefined}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-[6px] w-full grow overflow-hidden rounded-full bg-[#2c2c30]">
        <SliderPrimitive.Range className="absolute h-full bg-[#6C61FF]" />
      </SliderPrimitive.Track>

      {Array.from({ length: count }).map((_, i) => {
        const isFirst = i === 0
        const isLast = i === count - 1

        // Для правого бегунка применяем стиль из запроса пользователя,
        // но даём возможность переопределить через maxThumbClassName.
        const finalThumbClass = cn(
          baseThumbClass,
          thumbClassName,
          isFirst && minThumbClassName,
          isLast && (maxThumbClassName || requestedRightThumbClass)
        )

        return (
          <SliderPrimitive.Thumb
            key={i}
            className={finalThumbClass}
            aria-label={isLast ? "Maximum value" : "Minimum value"}
          />
        )
      })}
    </SliderPrimitive.Root>
  )
}
)
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
