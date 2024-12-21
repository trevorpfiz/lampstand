import type { ForwardedRef } from "react";
import type { TextareaAutosizeProps } from "react-textarea-autosize";
import React, { forwardRef } from "react";
import UnstyledTextareaAutosize from "react-textarea-autosize";

export const TextareaAutosize = forwardRef(
  (
    { className = "", ...otherProps }: TextareaAutosizeProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    return (
      <UnstyledTextareaAutosize
        ref={ref}
        className={`overflow-wrap-break-word no-focus-ring resize-none bg-transparent outline-none ${className}`}
        {...otherProps}
      />
    );
  },
);
TextareaAutosize.displayName = "TextareaAutosize";
