import { z } from 'zod';
import type { AuthFormField } from '@nuxt/ui';

export const signInFields: AuthFormField[] = [
	{
		name: 'email',
		type: 'email',
		label: 'Email',
		placeholder: 'you@example.com',
		required: true,
	},
	{
		name: 'password',
		type: 'password',
		label: 'Password',
		placeholder: '••••••••',
		required: true,
	},
];

export const signUpFields: AuthFormField[] = [
	{
		name: 'fullName',
		type: 'text',
		label: 'Full Name',
		required: true,
	},
	{
		name: 'email',
		type: 'email',
		label: 'Email',
		required: true,
	},
	{
		name: 'password',
		type: 'password',
		label: 'Password',
		required: true,
	},
];

// --- Zod Schemas ---
export const logInSchema = z.object({
	email: z.email('Invalid email'),
	password: z.string().min(6, 'Min 6 characters'),
});

export const createAccountSchema = z.object({
	fullName: z.string('Name is required').min(2, 'Your name is too short'),
	email: z.email('Invalid email'),
	password: z.string('Not empty').min(6, 'Min 6 characters'),
});

export type LogInSchema = z.infer<typeof logInSchema>;
export type CreateAccountSchema = z.infer<typeof createAccountSchema>;
