import { db } from '@lamp/db/client';
import { Profile } from '@lamp/db/schema';
import { parseError } from '@lamp/observability/error';

export async function resetLlmUsageDaily() {
  // Set both usage fields back to zero for all users
  try {
    await db.update(Profile).set({
      llmUsage: 0,
      premiumLlmUsage: 0,
    });
  } catch (error) {
    const message = parseError(error);

    return new Response(message, { status: 500 });
  }

  return new Response('OK', { status: 200 });
}
