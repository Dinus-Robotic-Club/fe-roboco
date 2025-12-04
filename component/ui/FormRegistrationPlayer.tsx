'use client';

import { IParticipantsBody } from '@/lib/types/team';
import { Square, SquareCheckBig } from 'lucide-react';

type Props = {
	data: IParticipantsBody[];
	setData: (index: number, patch: Partial<IParticipantsBody>) => void;
	errors?: Record<number, Partial<Record<keyof IParticipantsBody, string>>>;
	onOpenTwibbonModal: (index: number) => void;
};

export default function FormRegistrationPlayer({
	data,
	setData,
	errors = {},
	onOpenTwibbonModal,
}: Props) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-28 w-full max-w-[1176px] px-3 md:px-6">
			{data.map((player, index) => (
				<div key={index} className="flex flex-col gap-6">
					{/* NAME */}
					<Field
						label={`NAMA PEMAIN ${index + 1}`}
						error={errors[index]?.participantsName}
					>
						<input
							id={`participants-${index}-participantsName`}
							value={player.participantsName}
							type="text"
							placeholder={`Masukkan nama lengkap pemain ${index + 1}`}
							className={`p-4 bg-white rounded-xs shadow-md border-2 ${
								errors[index]?.participantsName
									? 'border-red-500'
									: 'border-gray-200'
							}`}
							onChange={(e) =>
								setData(index, { participantsName: e.target.value })
							}
						/>
					</Field>

					<Field
						label={`PERAN PEMAIN ${index + 1}`}
						error={errors[index]?.participantsRoleInTeam}
					>
						<select
							id={`participants-${index}-participantsRoleInTeam`}
							name="participant-role"
							value={player.participantsRoleInTeam}
							onChange={(e) =>
								setData(index, { participantsRoleInTeam: e.target.value })
							}
							className={`p-4 bg-white rounded-xs shadow-md border-2 font-plus-jakarta-sans text-sm lg:text-base ${
								player.participantsRoleInTeam === ''
									? 'text-gray-400'
									: 'text-black'
							} ${
								errors[index]?.participantsRoleInTeam
									? 'border-red-500'
									: 'border-gray-200'
							}`}
						>
							<option value="">-- PILIH PERAN --</option>
							{!data.some(
								(p, i) => p.participantsRoleInTeam === 'LEADER' && i !== index
							) && (
								<option value="LEADER" className="text-black">
									KETUA (LEADER)
								</option>
							)}
							<option value="MEMBER" className="text-black">
								ANGGOTA (MEMBER)
							</option>
						</select>
					</Field>

					<Field
						label={`KARTU IDENTITAS ${index + 1} (KTP/KTM/KTS)`}
						error={errors[index]?.participantsIdentityCardImage}
					>
						<input
							id={`participants-${index}-participantsIdentityCardImage`}
							type="file"
							accept=".jpg, .png, .jpeg"
							className={`p-4 bg-white rounded-xs shadow-md border-2 ${
								errors[index]?.participantsIdentityCardImage
									? 'border-red-500'
									: 'border-gray-200'
							}`}
							onChange={(e) => {
								const file = (e.target as HTMLInputElement).files?.[0];
								if (file)
									setData(index, { participantsIdentityCardImage: file });
							}}
						/>
					</Field>

					<Field
						label={`FOTO & TWIBBON PEMAIN ${index + 1}`}
						error={errors[index]?.participantsImage}
					>
						<button
							id={`participants-${index}-participantsImage`}
							type="button"
							onClick={() => onOpenTwibbonModal(index)}
							className={`p-4 bg-white rounded-xs shadow-md border-2 flex justify-between items-center cursor-pointer active:bg-gray-100 w-full transition-colors ${
								errors[index]?.participantsImage
									? 'border-red-500 text-red-500'
									: data[index]?.participantsImage
									? 'border-green-500/50 text-green-700 bg-green-50'
									: 'border-gray-200 text-gray-500'
							}`}
						>
							<p className="truncate max-w-[85%] font-medium">
								{data[index]?.participantsImage instanceof File
									? data[index].participantsImage.name
									: 'Atur Foto dan Twibbon'}
							</p>
							{data[index]?.participantsImage ? (
								<SquareCheckBig className="w-6 h-6" />
							) : (
								<Square className="w-6 h-6" />
							)}
						</button>
					</Field>

					<Field
						label={`LINK TWIBBON PEMAIN ${index + 1}`}
						error={errors[index]?.participantsTwibbon}
					>
						<input
							id={`participants-${index}-participantsTwibbon`}
							value={player.participantsTwibbon}
							type="url"
							placeholder="Tempel link post Instagram twibbon di sini"
							className={`p-4 bg-white rounded-xs shadow-md border-2 ${
								errors[index]?.participantsTwibbon
									? 'border-red-500'
									: 'border-gray-200'
							}`}
							onChange={(e) =>
								setData(index, { participantsTwibbon: e.target.value })
							}
						/>
					</Field>

					<Field
						label={`NOMOR WHATSAPP PEMAIN ${index + 1}`}
						error={errors[index]?.participantsPhone}
					>
						<input
							id={`participants-${index}-participantsPhone`}
							value={player.participantsPhone}
							type="tel"
							placeholder="Contoh: 08123456789"
							className={`p-4 bg-white rounded-xs shadow-md border-2 ${
								errors[index]?.participantsPhone
									? 'border-red-500'
									: 'border-gray-200'
							}`}
							onChange={(e) =>
								setData(index, { participantsPhone: e.target.value })
							}
						/>
					</Field>
				</div>
			))}
		</div>
	);
}

function Field({
	label,
	error,
	children,
}: {
	label: string;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1">
			<label className="text-sm lg:text-base font-fira-code uppercase">
				{label}
			</label>
			{children}
			{error && (
				<p className="text-red-500 text-xs font-bold animate-pulse">{error}</p>
			)}
		</div>
	);
}
