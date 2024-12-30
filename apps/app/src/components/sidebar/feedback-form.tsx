'use client';

import { MessageCircle } from 'lucide-react';
import { type FormEvent, useState } from 'react';

import { Button } from '@lamp/ui/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@lamp/ui/components/popover';
import { SidebarMenuButton } from '@lamp/ui/components/sidebar';
import { toast } from '@lamp/ui/components/sonner';
import { Spinner } from '@lamp/ui/components/spinner';
import { Textarea } from '@lamp/ui/components/textarea';
import { handleError } from '@lamp/ui/lib/utils';
import { api } from '~/trpc/react';

export function FeedbackForm() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');

  const createMutation = api.feedback.create.useMutation({
    onSuccess: () => {
      toast.success('Thank you for your feedback!');
      setContent('');
      setOpen(false);
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      return;
    }

    createMutation.mutate({
      content,
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <SidebarMenuButton>
          <MessageCircle size={16} strokeWidth={2} />
          <span>Feedback</span>
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-2"
        side="top"
        align="start"
        sideOffset={4}
        alignOffset={4}
      >
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Textarea
            id="feedback"
            placeholder="How can we improve Lampstand?"
            aria-label="Send feedback"
            className="min-h-24"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={createMutation.isPending}
          />
          <div className="flex flex-row justify-between">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setOpen(false)}
              type="button"
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={createMutation.isPending || !content.trim()}
            >
              {createMutation.isPending ? (
                <>
                  <Spinner className="-ms-1 me-2" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
