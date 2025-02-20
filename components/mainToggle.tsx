"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="p-2 rounded-lg  bg-gray-950 dark:bg-gray-700"
        aria-label="Toggle theme"
        >
        {theme === "light" ? <Moon className="w-5 h-5 " /> : <Sun className="w-5 h-5" />}
        </button>
    )
}