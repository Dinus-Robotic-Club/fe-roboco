'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@/lib/utils'

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

const FieldLabel = ({ label, required, icon: Icon }: { label: string; required?: boolean; icon?: React.ElementType }) => (
  <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
    {Icon && <Icon className="w-4 h-4 text-slate-400" />}
    {label}
    {required && <span className="text-red-500">*</span>}
  </label>
)

export { Label, FieldLabel }
