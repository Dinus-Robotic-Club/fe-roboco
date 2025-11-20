import { z } from 'zod'

export const TeamSchema = z
    .object({
        name: z.string().min(1, 'Nama wajib diisi'),
        school: z.string().min(1, 'Asal sekolah wajib diisi'),
        password: z.string().min(6, 'Password minimal 6 karakter'),
        confirmPassword: z.string().min(5, 'Konfirmasi password wajib diisi'),
        category: z.string().min(1, 'Kategori wajib diisi'),
        email: z.string().email('Email tidak valid'),
        tournamentId: z.string().min(1, 'Tournament ID wajib'),
        invoice: z.instanceof(File).nullable(),
        logo: z.instanceof(File).nullable(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Password dan konfirmasi tidak sama',
        path: ['confirmPassword'],
    })

export const ParticipantSchema = z.object({
    participantsName: z.string().min(1, 'Nama pemain wajib'),
    participantsRoleInTeam: z.string().min(1, 'Role wajib diisi'),
    participantsImage: z.instanceof(File).nullable(),
    participantsIdentityCardImage: z.instanceof(File).nullable(),
    participantsTwibbon: z.string().optional(),
    participantsPhone: z.string().min(10, 'Nomor HP tidak valid').optional(),
})

export const RegisterTeamSchema = z.object({
    team: TeamSchema,
    participants: z.array(ParticipantSchema).min(1, 'Minimal 1 pemain'),
})

export type RegisterTeamSchemaType = z.infer<typeof RegisterTeamSchema>
