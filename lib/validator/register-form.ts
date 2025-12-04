import { z } from 'zod';

// --- CONSTANTS ---
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
];

const StrictFileSchema = (required: boolean) =>
	z
		.custom<File>((v) => v instanceof File, {
			message: required ? 'File wajib diupload' : 'File tidak valid',
		})
		.nullable()
		.refine(
			(file) => {
				if (!required && !file) return true; // Kalau optional dan kosong, lolos
				return file !== null;
			},
			{ message: 'File wajib diupload' }
		)
		.refine(
			(file) => {
				if (!file) return true;
				return file.size <= MAX_FILE_SIZE;
			},
			{ message: `Ukuran file maksimal ${MAX_FILE_SIZE / (1024 * 1024)}MB.` }
		)
		.refine(
			(file) => {
				if (!file) return true;
				return ACCEPTED_IMAGE_TYPES.includes(file.type);
			},
			{ message: 'Format file harus .jpg, .jpeg, .png, atau .webp' }
		);

// --- TEAM SCHEMA ---

export const TeamSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, 'Nama team tidak boleh kosong')
			.min(3, 'Nama team terlalu pendek (min 3 karakter)')
			.max(50, 'Nama team terlalu panjang (max 50 karakter)')
			.regex(
				/^[a-zA-Z0-9\s\-_]+$/,
				'Nama team hanya boleh huruf, angka, spasi, strip, dan underscore'
			), // Anti XSS simpel

		email: z
			.string()
			.trim()
			.min(1, 'Email wajib diisi')
			.email('Format email tidak valid (contoh: team@email.com)')
			.toLowerCase(), // Sanitize input jadi lowercase

		password: z
			.string()
			.min(1, 'Password wajib diisi')
			.min(8, 'Password minimal 8 karakter')
			.regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf besar')
			.regex(/[a-z]/, 'Password harus mengandung minimal 1 huruf kecil')
			.regex(/[0-9]/, 'Password harus mengandung minimal 1 angka')
			.regex(/[^A-Za-z0-9]/, 'Password harus mengandung minimal 1 simbol unik'),

		confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),

		communityName: z
			.string()
			.trim()
			.min(1, 'Asal sekolah/komunitas wajib diisi')
			.min(3, 'Nama komunitas terlalu pendek')
			.max(100, 'Nama komunitas terlalu panjang'),

		category: z
			.string()
			.trim()
			.min(1, 'Kategori lomba wajib dipilih')
			.refine(
				(val) => ['SOCCER', 'SUMO'].includes(val),
				'Kategori tidak valid'
			), // Hardlock value yang diperbolehkan

		tournamentId: z
			.string()
			.trim()
			.min(1, 'Turnamen wajib dipilih')
			.uuid('ID Turnamen tidak valid'), // Asumsi ID dari DB adalah UUID

		logo: StrictFileSchema(false).optional(), // Optional, tapi kalau ada harus valid size/type

		invoice: StrictFileSchema(true), // Wajib, valid size/type
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Password dan konfirmasi password tidak cocok',
		path: ['confirmPassword'],
	});

// --- PARTICIPANT SCHEMA ---

export const ParticipantSchema = z.object({
	participantsName: z
		.string()
		.trim()
		.min(1, 'Nama pemain wajib diisi')
		.min(3, 'Nama pemain terlalu pendek')
		.max(60, 'Nama pemain terlalu panjang')
		.regex(
			/^[a-zA-Z\s'.]+$/,
			"Nama hanya boleh mengandung huruf, spasi, petik ('), dan titik (.)"
		), // Mencegah angka/simbol aneh di nama orang

	participantsRoleInTeam: z
		.string()
		.trim()
		.min(1, 'Role wajib dipilih')
		.refine((val) => ['LEADER', 'MEMBER'].includes(val), 'Role tidak valid'),

	participantsPhone: z
		.string()
		.trim()
		.min(1, 'Nomor HP wajib diisi')
		.min(10, 'Nomor HP terlalu pendek (min 10 digit)')
		.max(15, 'Nomor HP terlalu panjang (max 15 digit)')
		.regex(/^08[0-9]+$/, 'Nomor HP harus diawali 08 dan hanya berisi angka'), // Strict format Indo

	participantsTwibbon: z
		.string()
		.trim()
		.min(1, 'Link twibbon wajib diisi')
		.url('Link twibbon harus berupa URL valid (http/https)')
		.startsWith('https://', 'Link harus secure (https)'),

	participantsImage: StrictFileSchema(true), // Wajib
	participantsIdentityCardImage: StrictFileSchema(true), // Wajib
});

// --- PARENT SCHEMA ---

export const RegisterTeamSchema = z.object({
	team: TeamSchema,
	participants: z
		.array(ParticipantSchema)
		.min(1, 'Minimal harus ada 1 pemain dalam tim')
		.max(5, 'Maksimal 5 pemain dalam satu tim'), // Cegah spam user nambah array manual via console
});
