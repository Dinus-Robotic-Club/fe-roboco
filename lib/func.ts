import slugify from 'slugify'
export const generateSlug = (value: string): string => {
    return slugify(value, { lower: true, strict: true, replacement: '-', trim: true })
}
