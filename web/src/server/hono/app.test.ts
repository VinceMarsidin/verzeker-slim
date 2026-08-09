import { describe, expect, it } from 'vitest'
import app from './app'

describe('review routes', () => {
  it('keeps the authenticated-user endpoint ahead of the slug route', async () => {
    const response = await app.request('http://localhost/api/v1/reviews/me')

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({
      error: 'Je moet ingelogd zijn',
    })
  })
})
