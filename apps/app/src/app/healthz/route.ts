import { type NextRequest, NextResponse } from 'next/server';

// biome-ignore lint/suspicious/useAwait: <explanation>
export const GET = async (req: NextRequest) => {
  if (req.headers.get('user-agent') !== 'healthz') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return new Response('OK', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
