"use client";

import React from "react";
import { Plate } from "@udecode/plate-common/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Editor, EditorContainer } from "../plate-ui/editor";
import { useCreateEditor } from "./use-create-editor";

export function PlateEditor() {
  const editor = useCreateEditor();

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor}>
        <EditorContainer>
          <Editor variant="default" />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}
