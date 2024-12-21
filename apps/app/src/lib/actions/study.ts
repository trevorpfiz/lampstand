"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@lamp/supabase/server";

export async function revalidateStudy(studyId?: string) {
  if (!studyId) return;

  //   TODO: is it good to check user here?
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return;

  revalidatePath(`/study/${studyId}`);
}
