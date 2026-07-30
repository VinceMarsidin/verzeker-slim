import type { ZodSchema } from 'zod'

// Parsed en valideert de JSON-body van een request tegen een Zod-schema.
// Geeft { data } terug bij succes, of { error: Response } bij een
// validatiefout — die Response kun je dan direct terugsturen uit de route.
export async function validateBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<{ data: T; error: null } | { data: null; error: Response }> {
  const body = await request.json().catch(() => null)
  const result = schema.safeParse(body)

  if (!result.success) {
    return {
      data: null,
      error: Response.json(
        { error: 'Ongeldige invoer', details: result.error.flatten() },
        { status: 400 },
      ),
    }
  }

  return { data: result.data, error: null }
}
