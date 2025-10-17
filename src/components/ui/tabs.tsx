"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface TabsListProps {
  className?: string
  children: React.ReactNode
}

interface TabsTriggerProps {
  value: string
  className?: string
  children: React.ReactNode
}

interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue || value || "")

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value)
    }
  }, [value])

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            activeTab,
            onTabChange: handleTabChange,
          } as React.HTMLAttributes<HTMLElement>)
        }
        return child
      })}
    </div>
  )
}

export function TabsList({ className, children, activeTab, onTabChange }: TabsListProps & { activeTab?: string; onTabChange?: (value: string) => void }) {
  return (
    <div className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500",
      className
    )}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            activeTab,
            onTabChange,
          } as React.HTMLAttributes<HTMLElement>)
        }
        return child
      })}
    </div>
  )
}

export function TabsTrigger({ value, className, children, activeTab, onTabChange }: TabsTriggerProps & { activeTab?: string; onTabChange?: (value: string) => void }) {
  const isActive = activeTab === value

  return (
    <button
      onClick={() => onTabChange?.(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white text-slate-950 shadow-sm"
          : "hover:text-slate-900",
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, className, children, activeTab }: TabsContentProps & { activeTab?: string }) {
  if (activeTab !== value) return null

  return (
    <div className={cn("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2", className)}>
      {children}
    </div>
  )
}
