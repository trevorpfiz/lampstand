import { unstable_flag as flag } from "@vercel/flags/next";

import { analytics } from "@lamp/analytics/posthog/server";
import { createClient } from "@lamp/supabase/server";

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    async decide(this: { defaultValue: boolean }) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return this.defaultValue;
      }

      const isEnabled = await analytics.isFeatureEnabled(key, user.id);

      return isEnabled ?? this.defaultValue;
    },
  });
