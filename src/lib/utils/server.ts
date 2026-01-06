import { getRequestEvent } from '$app/server';
import {  redirect } from '@sveltejs/kit';


export function requireAuth(): string {
  const { locals } = getRequestEvent()
  const userId = locals.user?.id

    if (!userId) {
      redirect(307, "/auth/sign-in")
    }

  return userId;
}


