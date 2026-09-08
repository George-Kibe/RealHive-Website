"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  // modal={false} disables Radix's scroll lock. While open, the modal variant
  // injects `overflow:hidden` + `padding-right:<scrollbar>px` onto <body>.
  // This body is max-width:1120px, margin-inline:auto and box-sizing:border-box,
  // so that padding shrinks the content box while the vanishing scrollbar
  // simultaneously re-centres it - the page visibly jumps on open and snaps
  // back on close. A theme menu has no reason to lock scrolling.
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Toggle colour theme"
          className="relative hover:text-brand hover:border-brand"
        >
          {/* Both icons are always mounted and cross-faded with rotate+scale.
              Without these classes they render stacked on top of each other. */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
