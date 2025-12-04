import slugify from 'slugify';
import { IParticipantsBody, ITeamBody, RegisterError } from './types/team';
import * as z from 'zod';

export const generateSlug = (value: string): string => {
	return slugify(value, {
		lower: true,
		strict: true,
		replacement: '-',
		trim: true,
	});
};

export function mapZodErrors(issues: z.ZodIssue[]): RegisterError {
	const errorObj: RegisterError = {
		team: {},
		participants: [],
	};

	issues.forEach((issue) => {
		const path = issue.path;

		// Map Team Errors
		if (path[0] === 'team') {
			const field = path[1] as keyof ITeamBody;
			errorObj.team![field] = issue.message;
		}

		// Map Participants Errors
		if (path[0] === 'participants') {
			const index = path[1] as number;
			const field = path[2] as keyof IParticipantsBody;

			if (!errorObj.participants![index]) {
				errorObj.participants![index] = {};
			}
			errorObj.participants![index][field] = issue.message;
		}
	});

	return errorObj;
}

export const scrollToFirstError = (issues: z.ZodIssue[]) => {
	if (issues.length === 0) return;

	const firstError = issues[0];
	const path = firstError.path;

	let elementId = '';

	// Logic mapping ID harus match dengan ID di input component HTML
	if (path[0] === 'team') {
		// Mapping team.name -> team_name, team.email -> team_email
		elementId = `team_${String(path[1])}`;

		// Exception untuk confirmPassword karena ID-nya beda di componentmu
		if (path[1] === 'confirmPassword') elementId = 'confirm_password';
		if (path[1] === 'category') elementId = 'kategori';
		if (path[1] === 'tournamentId') elementId = 'turnamen';
		if (path[1] === 'communityName') elementId = 'community_input'; // Asumsi ID di component CommunityInput
	} else if (path[0] === 'participants') {
		// participants[0].participantsName -> participants-0-participantsName
		elementId = `participants-${String(path[1])}-${String(path[2])}`;
	}

	const element = document.getElementById(elementId);
	if (element) {
		element.scrollIntoView({ behavior: 'smooth', block: 'center' });
		element.focus({ preventScroll: true }); // Focus agar user langsung bisa ketik
	}
};
