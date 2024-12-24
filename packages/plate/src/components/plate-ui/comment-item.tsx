'use client';

import {
  CommentProvider,
  CommentsPlugin,
  useCommentItemContentState,
} from '@udecode/plate-comments/react';
import { useEditorPlugin } from '@udecode/plate-common/react';
import { formatDistance } from 'date-fns';

import { CommentAvatar } from './comment-avatar';
import { CommentMoreDropdown } from './comment-more-dropdown';
import { CommentResolveButton } from './comment-resolve-button';
import { CommentValue } from './comment-value';

type PlateCommentProps = {
  commentId: string;
};

function CommentItemContent() {
  const {
    comment,
    commentText,
    editingValue,
    isMyComment,
    isReplyComment,
    user,
  } = useCommentItemContentState();

  return (
    <div>
      <div className="relative flex items-center gap-2">
        <CommentAvatar userId={comment.userId} />

        <h4 className="font-semibold text-sm leading-none">{user?.name}</h4>

        <div className="text-muted-foreground text-xs leading-none">
          {formatDistance(comment.createdAt, Date.now())} ago
        </div>

        {isMyComment && (
          <div className="-right-0.5 -top-0.5 absolute flex space-x-1">
            {isReplyComment ? null : <CommentResolveButton />}

            <CommentMoreDropdown />
          </div>
        )}
      </div>

      <div className="mb-4 pt-0.5 pl-7">
        {editingValue ? (
          <CommentValue />
        ) : (
          <div className="whitespace-pre-wrap text-sm">{commentText}</div>
        )}
      </div>
    </div>
  );
}

export function CommentItem({ commentId }: PlateCommentProps) {
  const { useOption } = useEditorPlugin(CommentsPlugin);
  const comment = useOption('commentById', commentId);

  if (!comment) {
    return null;
  }

  return (
    <CommentProvider id={commentId} key={commentId}>
      <CommentItemContent />
    </CommentProvider>
  );
}
