import type { Link, Root, Text } from 'mdast';
import type { Node, Parent } from 'unist';
import flatMap from 'unist-util-flatmap';
import { visitParents } from 'unist-util-visit-parents';

import { DEFAULT_BIBLE_REGEX } from './lib/constants';
import { makeReferenceId, parseReadableReference } from './lib/utils';

export interface RemarkBibleReferencesOptions {
  /**
   * Custom regex to detect references, if you want to override the default.
   */
  bibleRegex?: RegExp;
}

/**
 * remarkBibleReferences: A plugin that:
 * 1) Ignores text nodes in existing links
 * 2) Splits text nodes that match bible references into multiple nodes
 *    (plain text + link).
 */
export function remarkBibleReferences(
  options: RemarkBibleReferencesOptions = {}
) {
  const referenceRegex = options.bibleRegex || DEFAULT_BIBLE_REGEX;

  return function transform(ast: Root) {
    // A set of text nodes we want to skip if inside existing links
    const ignored = new WeakSet<Text>();

    // First pass: mark text nodes that are inside links
    visitParents(ast, 'text', (textNode, parents) => {
      if (parents.some((parent) => parent.type === 'link')) {
        ignored.add(textNode as Text);
      }
    });

    // Second pass: transform text nodes
    flatMap(ast, (node: Node, _index: number, _parent: Parent | null) => {
      // We only care about text nodes not in "ignored"
      if (node.type !== 'text' || ignored.has(node as Text)) {
        return [node];
      }

      const textNode = node as Text;
      const oldText = textNode.value;
      const newNodes: Node[] = [];

      let startIndex = 0;
      let match: RegExpExecArray | null;
      match = referenceRegex.exec(oldText);

      console.log('match', match);

      while (match !== null) {
        const matchedText = match[0];
        const matchIndex = match.index;

        // Insert the text before the match
        if (matchIndex > startIndex) {
          newNodes.push({
            type: 'text',
            value: oldText.slice(startIndex, matchIndex),
          } as Text);
        }

        // Attempt to parse the reference
        const refData = parseReadableReference(matchedText);

        console.log('refData', refData);

        if (refData) {
          // Insert a text node for the matched text itself
          newNodes.push({
            type: 'text',
            value: matchedText,
          } as Text);

          // Also insert a link node for the "scroll" button
          const refId = makeReferenceId(refData);
          const linkNode: Link = {
            type: 'link',
            url: '#', // something safe
            title: `bible:${refId}`, // stash the real data
            children: [
              {
                type: 'text',
                value: ' [scroll]',
              },
            ],
          };

          console.log('linkNode', linkNode);

          newNodes.push(linkNode as Node);
        } else {
          // If not parseable => plain text
          newNodes.push({
            type: 'text',
            value: matchedText,
          } as Text);
        }

        startIndex = matchIndex + matchedText.length;
        match = referenceRegex.exec(oldText);
      }

      // leftover text
      if (startIndex < oldText.length) {
        newNodes.push({
          type: 'text',
          value: oldText.slice(startIndex),
        } as Text);
      }

      return newNodes;
    });

    return ast;
  };
}
