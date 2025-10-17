"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface SelectTriggerProps {
  className?: string
  children: React.ReactNode
}

interface SelectValueProps {
  placeholder?: string
}

interface SelectContentProps {
  className?: string
  children: React.ReactNode
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value || "")
  const [selectedLabel, setSelectedLabel] = React.useState("")
  const selectRef = React.useRef<HTMLDivElement>(null)

  // Extract label from children when value changes
  React.useEffect(() => {
    setSelectedValue(value || "")
    
    if (value) {
      // Find the label for the selected value
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectContent) {
          React.Children.forEach((child.props as any).children, (item: any) => {
            if (React.isValidElement(item) && (item.props as any).value === value) {
              setSelectedLabel(String((item.props as any).children))
            }
          })
        }
      })
    } else {
      setSelectedLabel("")
    }
  }, [value, children])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleValueChange = (newValue: string, label: string) => {
    setSelectedValue(newValue)
    setSelectedLabel(label)
    onValueChange?.(newValue)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={selectRef}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            value: selectedValue,
            selectedLabel,
            onValueChange: handleValueChange,
            isOpen,
            setIsOpen,
          } as any)
        }
        return child
      })}
    </div>
  )
}

export function SelectTrigger({ className, children, isOpen, setIsOpen, value, selectedLabel, ...props }: SelectTriggerProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void; value?: string; selectedLabel?: string }) {
  return (
    <button
      type="button"
      onClick={() => setIsOpen?.(!isOpen)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { selectedLabel } as any)
        }
        return child
      })}
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
    </button>
  )
}

export function SelectValue({ placeholder, value, selectedLabel }: SelectValueProps & { value?: string; selectedLabel?: string }) {
  return <span className="text-slate-900">{selectedLabel || placeholder}</span>
}

export function SelectContent({ className, children, isOpen, onValueChange }: SelectContentProps & { isOpen?: boolean; onValueChange?: (value: string, label: string) => void }) {
  if (!isOpen) return null

  return (
    <div className={cn(
      "absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto",
      className
    )}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onValueChange,
          } as React.HTMLAttributes<HTMLElement>)
        }
        return child
      })}
    </div>
  )
}

export function SelectItem({ value, children, onValueChange }: SelectItemProps & { onValueChange?: (value: string, label: string) => void }) {
  return (
    <div
      className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
      onClick={() => onValueChange?.(value, String(children))}
    >
      {children}
    </div>
  )
}
