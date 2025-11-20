import slugify from 'slugify'
import { IParticipantsBody, ITeamBody, RegisterError } from './types/team'
import * as z from 'zod'

export const generateSlug = (value: string): string => {
    return slugify(value, { lower: true, strict: true, replacement: '-', trim: true })
}

export function mapZodErrors(issues: z.ZodIssue[]): RegisterError {
    const errorObj: RegisterError = {
        team: {},
        participants: [],
    }

    for (const issue of issues) {
        const path = issue.path

        if (path[0] === 'team' && typeof path[1] === 'string') {
            const field = path[1] as keyof ITeamBody
            errorObj.team![field] = issue.message
        }

        if (path[0] === 'participants') {
            const idx = path[1] as number
            const field = path[2] as keyof IParticipantsBody

            if (!errorObj.participants![idx]) {
                errorObj.participants![idx] = {}
            }

            errorObj.participants![idx]![field] = issue.message
        }
    }

    return errorObj
}
