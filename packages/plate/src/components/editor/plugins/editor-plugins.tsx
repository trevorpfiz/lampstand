'use client';
import { ParagraphPlugin } from '@udecode/plate-common/react';
import { DocxPlugin } from '@udecode/plate-docx';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  FontSizePlugin,
} from '@udecode/plate-font/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { JuicePlugin } from '@udecode/plate-juice';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import { SlashPlugin } from '@udecode/plate-slash-command/react';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';
import { alignPlugin } from './align-plugin';
import { autoformatPlugin } from './autoformat-plugin';
import { basicNodesPlugins } from './basic-nodes-plugins';
import { blockMenuPlugins } from './block-menu-plugins';
import { cursorOverlayPlugin } from './cursor-overlay-plugin';
import { deletePlugins } from './delete-plugins';
import { dndPlugins } from './dnd-plugins';
import { exitBreakPlugin } from './exit-break-plugin';
import { FloatingToolbarPlugin } from './floating-toolbar-plugin';
import { indentListPlugins } from './indent-list-plugins';
import { lineHeightPlugin } from './line-height-plugin';
import { linkPlugin } from './link-plugin';
import { resetBlockTypePlugin } from './reset-block-type-plugin';
import { softBreakPlugin } from './soft-break-plugin';
import { tocPlugin } from './toc-plugin';

export const viewPlugins = [
  ...basicNodesPlugins,
  HorizontalRulePlugin,
  linkPlugin,
  // DatePlugin,
  // mentionPlugin,
  // tablePlugin,
  // TogglePlugin,
  tocPlugin,
  // ...mediaPlugins,
  // InlineEquationPlugin,
  // EquationPlugin,
  // CalloutPlugin,
  // ColumnPlugin,

  // Marks
  FontColorPlugin,
  FontBackgroundColorPlugin,
  FontSizePlugin,
  HighlightPlugin,
  KbdPlugin,

  // Block Style
  alignPlugin,
  ...indentListPlugins,
  lineHeightPlugin,

  // Collaboration
  // commentsPlugin,
] as const;

export const editorPlugins = [
  // AI
  // ...aiPlugins,

  // Nodes
  ...viewPlugins,

  // Functionality
  SlashPlugin,
  autoformatPlugin,
  cursorOverlayPlugin,
  ...blockMenuPlugins,
  ...dndPlugins,
  // EmojiPlugin,
  exitBreakPlugin,
  resetBlockTypePlugin,
  ...deletePlugins,
  softBreakPlugin,
  TrailingBlockPlugin.configure({ options: { type: ParagraphPlugin.key } }),

  // Deserialization
  DocxPlugin,
  MarkdownPlugin.configure({ options: { indentList: true } }),
  JuicePlugin,

  // UI
  // FixedToolbarPlugin,
  FloatingToolbarPlugin,
];
