import { z } from 'zod';

export const joinSchema = z.object({
	code: z
		.hex('Invalid house code')
		.length(6, 'Must be 6 characters')
		.toLowerCase(),
});

export const newSchema = z.object({
	name: z
		.string('House name is required')
		.min(3, 'Must be 3 characters or more')
		.max(20, 'Must be 20 characters or less'),
});

export type JoinSchema = z.infer<typeof joinSchema>;
export type NewSchema = z.infer<typeof newSchema>;
