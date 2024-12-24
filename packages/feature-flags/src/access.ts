import type { ApiData } from "@vercel/flags";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAccess } from "@vercel/flags";

import * as flags from "./index";

export const getFlags = async (request: NextRequest) => {
  const access = await verifyAccess(request.headers.get("Authorization"));

  if (!access) {
    return NextResponse.json(null, { status: 401 });
  }

  const definitions = Object.fromEntries(
    Object.values(flags).map((flag) => [
      flag.key,
      {
        origin: flag.origin,
        description: flag.description,
        options: flag.options,
      },
    ]),
  );

  return NextResponse.json<ApiData>({
    definitions,
  });
};
