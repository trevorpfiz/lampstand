"use client";

import { createPlatePlugin } from "@udecode/plate-common/react";

import { FloatingToolbar } from "../../plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "../../plate-ui/floating-toolbar-buttons";

export const FloatingToolbarPlugin = createPlatePlugin({
  key: "floating-toolbar",
  render: {
    afterEditable: () => (
      <FloatingToolbar>
        <FloatingToolbarButtons />
      </FloatingToolbar>
    ),
  },
});
