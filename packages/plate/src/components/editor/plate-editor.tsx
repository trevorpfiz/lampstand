"use client";

import React from "react";
import { Plate } from "@udecode/plate-common/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import type { MyEditor, MyValue } from "./plate-types";
import { Editor, EditorContainer } from "../plate-ui/editor";
import { useCreateEditor } from "./use-create-editor";

export function PlateEditor(props: {
  initialContent: any;
  onChange: (value: any) => void;
}) {
  const { initialContent, onChange } = props;

  const editor = useCreateEditor({ value: initialContent ?? [] });

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onChange={({ value, editor }: { value: MyValue; editor: MyEditor }) => {
          // This callback receives the current Slate JSON.
          // We simply pass it through to `onChange` if provided.
          onChange(value);
        }}
      >
        <EditorContainer>
          <Editor variant="default" />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}
