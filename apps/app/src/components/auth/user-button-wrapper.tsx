import { getUser } from '@lamp/supabase/queries';
import { createClient } from '@lamp/supabase/server';
import { Suspense } from 'react';
import { UserButton } from './user-button';

export async function UserButtonWrapper() {
  const supabase = await createClient();
  const user = await getUser(supabase);

  if (!user) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
      }
    >
      <UserButton user={user} />
    </Suspense>
  );
}
