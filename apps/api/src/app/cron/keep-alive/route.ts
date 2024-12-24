import { eq } from "@lamp/db";
import { db } from "@lamp/db/client";
import { Profile } from "@lamp/db/schema";

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const POST = async () => {
  const [newProfile] = await db
    .insert(Profile)
    .values({
      id: generateUUID(),
      name: "cron-temp",
    })
    .returning();

  if (!newProfile) {
    return new Response("Failed to create profile", { status: 500 });
  }

  await db.delete(Profile).where(eq(Profile.id, newProfile.id));

  return new Response("OK", { status: 200 });
};
