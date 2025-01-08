import { notFound } from 'next/navigation';
import { type ReactNode, cache } from 'react';

import {
  getChatsByStudyId,
  getNotesByUserId,
  getStudyById,
} from '@lamp/db/queries';
import { getUser } from '@lamp/supabase/queries';
import { createClient } from '@lamp/supabase/server';

import { AppHeader } from '~/components/app-header';
import { PanelsLayout } from '~/components/panels-layout';
import { BibleViewerStoreProvider } from '~/providers/bible-viewer-store-provider';

export default async function StudyLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ studyId: string }>;
}) {
  const { studyId } = await params;

  const supabase = await createClient();
  const user = await getUser(supabase);

  if (!user) {
    return notFound();
  }

  const studyData = cache(getStudyById)({ studyId, userId: user.id });
  const chatsData = getChatsByStudyId({ studyId, userId: user.id });
  const notesData = getNotesByUserId({ id: user.id });

  const [study, chats, notes] = await Promise.all([
    studyData,
    chatsData,
    notesData,
  ]);

  if (!study.study) {
    return notFound();
  }

  return (
    <>
      <AppHeader isStudyRoute={true} studyTitle={study.study.title} />
      <div className="flex-1 overflow-auto">
        <BibleViewerStoreProvider>
          <PanelsLayout chats={chats.chats} notes={notes.notes}>
            {children}
          </PanelsLayout>
        </BibleViewerStoreProvider>
      </div>
    </>
  );
}
