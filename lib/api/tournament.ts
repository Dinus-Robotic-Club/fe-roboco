import { IResponseGetTour } from '../types/type'
import { apiFetch } from './client'
// import { Tournament } from '../types'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const getAllTournaments = () => {
    return apiFetch<IResponseGetTour>(`${BASE}/tournament/get`)
}

export const createTournament = (data: FormData) => {
    return apiFetch<IResponseGetTour>(`${BASE}/tournament/create`, {
        method: 'POST',
        body: data,
    })
}
