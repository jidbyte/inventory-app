import { DrizzleQueryError, DrizzleError } from 'drizzle-orm';
import type { PostgresError } from 'postgres';

type ErrorHandler = (error: PostgresError) => { message: string; constraint: string | null };

function extractFieldFromConstraint(constraintName: string): string {
	// Remove common suffixes like _unique, _key, _idx, _index amd split by _
	const cleaned = constraintName.replace(/_(unique|key|idx|index)$/i, '');
	const parts = cleaned.split('_');

	// Remove table name (typically the first part) if there are multiple parts
	if (parts.length > 1) {
		parts.shift();
	}

	// Join remaining parts with spaces and capitalize
	const fieldName = parts.join(' ');
	return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
}

// Maps PostgreSQL error codes to specific handler functions
const PostgresErrorHandlers: Record<string, ErrorHandler> = {
	'23505': (error) => {
		const constraintName = (error as any).constraint_name || null;

		if (constraintName) {
			const fieldName = extractFieldFromConstraint(constraintName);
			return {
				message: `${fieldName} already exists.`,
				constraint: constraintName
			};
		}

		return {
			message: 'A duplicate entry was found for a unique field.',
			constraint: constraintName
		};
	},
	'23503': (error) => ({
		message: 'A foreign key violation occurred. The record you are trying to link does not exist.',
		constraint: (error as any).constraint_name || null
	}),
	'22P02': () => ({
		message: 'The data provided is in an invalid format (e.g., not a valid UUID).',
		constraint: null
	}),
	'23514': (error) => ({
		message: 'A check constraint was violated.',
		constraint: (error as any).constraint_name || null
	}),
	'23502': (error) => {
		const column = (error as any).column_name || null;
		return {
			message: column
				? `A required field is missing. The column '${column}' cannot be null.`
				: 'A required field is missing.',
			constraint: column
		};
	},
	'42703': (error) => {
		const column = (error as any).column_name || null;
		return {
			message: 'An undefined column was referenced in the query.',
			constraint: column
		};
	},
	'42601': () => ({
		message: "There's a syntax error in the database query.",
		constraint: null
	}),
	'25000': () => ({
		message: 'Transaction failed: a data integrity issue occurred within a database transaction.',
		constraint: null
	}),
	'08006': () => ({
		message: 'Database connection failed. The database may be unavailable.',
		constraint: null
	}),
	'42P01': () => ({
		message: 'A referenced table does not exist in the database.',
		constraint: null
	}),
	'40001': () => ({
		message:
			'Transaction serialization failure. Please retry the transaction as it could not be completed due to concurrent modifications.',
		constraint: null
	}),
	default: (error) => ({
		message: `A database error occurred: ${error.message}`,
		constraint: null
	})
};

// Type guard to ensure we are dealing with a PostgresError
const isPostgresError = (value: unknown): value is PostgresError => {
	return typeof value === 'object' && value !== null && 'code' in value;
};

export function handleDbError(error: unknown): { message: string; constraint: string | null } {
	console.error(error);

	if (error instanceof DrizzleQueryError && isPostgresError(error.cause)) {
		const originalError = error.cause;
		const handler = PostgresErrorHandlers[originalError.code ?? 'default'];

		if (handler) {
			return handler(originalError);
		}

		return {
			message: `An unexpected error occurred. Please try again`,
			constraint: null
		};
	}

	// Fallback for generic Drizzle errors or other Error instances
	if (error instanceof DrizzleError || error instanceof Error) {
		return {
			message: error.message || 'An unexpected error occurred. Please try again',
			constraint: null
		};
	}

	// Final fallback for unknown error types
	return { message: 'An unexpected error occurred. Please try again', constraint: null };
}
