import * as React from 'react'

import { cn } from '@/lib/utils'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { IFieldProps, IFormInputProps } from '@/lib/types'
import { FieldLabel } from './label'

export const InputStyles =
  'w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-[#FBFF00]/50 transition-all disabled:bg-slate-50 disabled:text-slate-500'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 bg-white border  px-3 py-6 text-base shadow-lg transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

const FormInput = ({ label, errorMessage, className, ...props }: IFormInputProps) => (
  <div className="flex flex-col gap-1 w-full">
    <label htmlFor={props.id} className="text-sm lg:text-base font-fira-code">
      {label}
    </label>
    <input {...props} className={`p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2 ${className || ''}`} />
    {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
  </div>
)

const PasswordInput = ({ label, errorMessage, ...props }: IFormInputProps) => {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative flex flex-col gap-1 w-full">
      <label htmlFor={props.id} className="text-sm lg:text-base font-fira-code">
        {label}
      </label>
      <input {...props} type={showPassword ? 'text' : 'password'} className="p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2" />
      <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-5 bottom-4.5 text-center transform translate-y-0 text-gray-500 hover:text-gray-700">
        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
      </button>
      {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
    </div>
  )
}

const FormInputTournament = ({ label, icon, required, helperText, className, ...props }: IFieldProps) => (
  <div className={`flex flex-col ${className}`}>
    <FieldLabel label={label} required={required} icon={icon} />
    <input className={InputStyles} {...props} />
    {helperText && <span className="text-[10px] text-slate-500 mt-1 ml-1">{helperText}</span>}
  </div>
)

export { Input, FormInput, PasswordInput, FormInputTournament }
