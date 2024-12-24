import { withProps } from '@udecode/cn';
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from '@udecode/plate-code-block/react';
import {
  ParagraphPlugin,
  PlateLeaf,
  usePlateEditor,
} from '@udecode/plate-common/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { PlaceholderPlugin } from '@udecode/plate-media/react';
import { SlashInputPlugin } from '@udecode/plate-slash-command/react';
import { BlockquoteElement } from '../plate-ui/blockquote-element';
import { CodeBlockElement } from '../plate-ui/code-block-element';
import { CodeLeaf } from '../plate-ui/code-leaf';
import { CodeLineElement } from '../plate-ui/code-line-element';
import { CodeSyntaxLeaf } from '../plate-ui/code-syntax-leaf';
import { HeadingElement } from '../plate-ui/heading-element';
import { HighlightLeaf } from '../plate-ui/highlight-leaf';
import { HrElement } from '../plate-ui/hr-element';
import { KbdLeaf } from '../plate-ui/kbd-leaf';
import { LinkElement } from '../plate-ui/link-element';
import { MediaPlaceholderElement } from '../plate-ui/media-placeholder-element';
import { ParagraphElement } from '../plate-ui/paragraph-element';
import { withPlaceholders } from '../plate-ui/placeholder';
import { SlashInputElement } from '../plate-ui/slash-input-element';
import { TocElement } from '../plate-ui/toc-element';
import { withDraggables } from '../plate-ui/with-draggables';
import { editorPlugins } from './plugins/editor-plugins';

export const useCreateEditor = (props: { value: any }) => {
  return usePlateEditor({
    override: {
      components: withDraggables(
        withPlaceholders({
          // [AIPlugin.key]: AILeaf,
          // [AudioPlugin.key]: MediaAudioElement,
          [BlockquotePlugin.key]: BlockquoteElement,
          [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
          [CodeBlockPlugin.key]: CodeBlockElement,
          [CodeLinePlugin.key]: CodeLineElement,
          [CodePlugin.key]: CodeLeaf,
          [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
          // [ColumnItemPlugin.key]: ColumnElement,
          // [ColumnPlugin.key]: ColumnGroupElement,
          // [CommentsPlugin.key]: CommentLeaf,
          // [DatePlugin.key]: DateElement,
          // [EmojiInputPlugin.key]: EmojiInputElement,
          // [ExcalidrawPlugin.key]: ExcalidrawElement,
          // [FilePlugin.key]: MediaFileElement,
          [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
          [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
          [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
          [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
          [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
          [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
          [HighlightPlugin.key]: HighlightLeaf,
          [HorizontalRulePlugin.key]: HrElement,
          // [ImagePlugin.key]: ImageElement,
          [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
          [KbdPlugin.key]: KbdLeaf,
          [LinkPlugin.key]: LinkElement,
          // [MediaEmbedPlugin.key]: MediaEmbedElement,
          // [MentionInputPlugin.key]: MentionInputElement,
          // [MentionPlugin.key]: MentionElement,
          [ParagraphPlugin.key]: ParagraphElement,
          [PlaceholderPlugin.key]: MediaPlaceholderElement,
          [SlashInputPlugin.key]: SlashInputElement,
          [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
          [SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
          [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
          // [TableCellHeaderPlugin.key]: TableCellHeaderElement,
          // [TableCellPlugin.key]: TableCellElement,
          // [TablePlugin.key]: TableElement,
          // [TableRowPlugin.key]: TableRowElement,
          [TocPlugin.key]: TocElement,
          // [TogglePlugin.key]: ToggleElement,
          [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
          // [VideoPlugin.key]: MediaVideoElement,
        })
      ),
    },
    plugins: [...editorPlugins],
    value: props.value,
  });
};
