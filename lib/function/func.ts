import { IOptionItem } from '../types'

export const generateOptions = <T>(data: T[], selector: (item: T) => string | undefined | null, labelFormatter?: (value: string) => string): IOptionItem[] => {
  const allValues = data.map(selector)

  const validValues = allValues.filter((v): v is string => typeof v === 'string' && v.trim() !== '')

  const uniqueValues = Array.from(new Set(validValues))

  return uniqueValues
    .map((val) => ({
      value: val,
      label: labelFormatter ? labelFormatter(val) : val,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export const formatCapitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
