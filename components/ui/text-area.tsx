import { IFieldProps } from '@/lib/types'
import { FieldLabel } from './label'
import { InputStyles } from './input'

const FormTextArea = ({ label, icon, required, ...props }: IFieldProps) => (
  <div className="flex flex-col">
    <FieldLabel label={label} required={required} icon={icon} />
    <textarea className={`${InputStyles} min-h-20 resize-none`} {...props} />
  </div>
)

export { FormTextArea }
