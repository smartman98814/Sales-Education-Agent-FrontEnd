import jwt from 'jsonwebtoken';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';

import { APP_ENV } from '@/configs';

type BodyData = {
  data?: string;
  slug?: string;
};

export async function POST(req: NextRequest) {
  const headersList = await headers();

  const body = (await req.json()) as BodyData;

  const authorization = (headersList.get('Authorization') ?? '').split(' ');
  if (authorization.length < 2) {
    return Response.json({ message: 'Not valid token' }, { status: 401 });
  }
  const token = authorization[1];

  try {
    await jwt.verify(token, APP_ENV.INTERNAL_API_SECRET);

    if (body.data === 'blog') {
      if (body.slug) {
        revalidatePath(`/newsroom/${body.slug}`);
      }
    }

    return Response.json({ status: true });
  } catch (e) {
    return Response.json(e, { status: 401 });
  }
}
