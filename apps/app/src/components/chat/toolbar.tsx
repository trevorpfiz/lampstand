'use client';

import type { ChatRequestOptions, CreateMessage, Message } from 'ai';
import equal from 'fast-deep-equal';
import {
  ArrowDownNarrowWide,
  ArrowUp,
  Languages,
  Link,
  MessageSquareText,
  Square,
} from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { nanoid } from 'nanoid';
import type { Dispatch, JSX, SetStateAction } from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@lamp/ui/components/tooltip';
import { cn } from '@lamp/ui/lib/utils';

import { sanitizeUIMessages } from '~/lib/utils';

interface ToolProps {
  type: 'explain' | 'language-analysis' | 'cross-references';
  description: string;
  icon: JSX.Element;
  selectedTool: string | null;
  setSelectedTool: Dispatch<SetStateAction<string | null>>;
  isToolbarVisible?: boolean;
  setIsToolbarVisible?: Dispatch<SetStateAction<boolean>>;
  isAnimating: boolean;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  input?: string;
  setInput?: Dispatch<SetStateAction<string>>;
}

const Tool = ({
  type,
  description,
  icon,
  selectedTool,
  setSelectedTool,
  isToolbarVisible,
  setIsToolbarVisible,
  isAnimating,
  append,
  input,
  setInput,
}: ToolProps) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (selectedTool !== type) {
      setIsHovered(false);
    }
  }, [selectedTool, type]);

  const handleSelect = () => {
    if (!isToolbarVisible && setIsToolbarVisible) {
      setIsToolbarVisible(true);
      return;
    }

    if (type === 'explain' || type === 'language-analysis') {
      if (!selectedTool) {
        setIsHovered(true);
        setSelectedTool(type);
      } else if (selectedTool !== type) {
        setSelectedTool(type);
      }
      return;
    }

    if (type === 'cross-references') {
      if (!selectedTool) {
        setIsHovered(true);
        setSelectedTool(type);
        return;
      }

      if (selectedTool !== type) {
        setSelectedTool(type);
        return;
      }

      if (selectedTool === type && setInput) {
        let message = '';
        if (input?.trim()) {
          message = `${input.trim()}\n\nWhat are the cross references to this?`;
        } else {
          message = 'What are the cross references to this?';
        }

        append({
          role: 'user',
          content: message,
        });

        setInput('');
        setSelectedTool(null);
      }
    }
  };

  return (
    <Tooltip open={isHovered && !isAnimating}>
      <TooltipTrigger asChild>
        <motion.div
          className={cn('rounded-full p-3', {
            '!text-primary-foreground bg-primary': selectedTool === type,
          })}
          onHoverStart={() => {
            setIsHovered(true);
          }}
          onHoverEnd={() => {
            if (selectedTool !== type) {
              setIsHovered(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSelect();
            }
          }}
          initial={{ scale: 1, opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          exit={{
            scale: 0.9,
            opacity: 0,
            transition: { duration: 0.1 },
          }}
          onClick={() => {
            handleSelect();
          }}
        >
          {selectedTool === type ? <ArrowUp size={16} /> : icon}
        </motion.div>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        sideOffset={16}
        className="rounded-2xl bg-foreground p-3 px-4 text-background"
      >
        {description}
      </TooltipContent>
    </Tooltip>
  );
};

const randomArr = [...new Array(4)].map((_x) => nanoid(5));

const ExplainLevelSelector = ({
  setSelectedTool,
  append,
  isAnimating,
  input,
  setInput,
}: {
  setSelectedTool: Dispatch<SetStateAction<string | null>>;
  isAnimating: boolean;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  input?: string;
  setInput?: Dispatch<SetStateAction<string>>;
}) => {
  // Display labels for the UI
  const LEVELS = [
    'In simple terms',
    'Choose level',
    'Normally',
    'In great depth',
  ];

  // Corresponding messages for each level
  const getLevelMessage = (level: number) => {
    switch (level) {
      case 0: // In simple terms
        return 'Please explain this in simple terms.';
      case 2: // Normally
        return 'Please explain this.';
      case 3: // In great depth
        return 'Please explain this in great depth.';
      default:
        return '';
    }
  };

  const y = useMotionValue(-40);
  const dragConstraints = 3 * 40 + 2;
  const yToLevel = useTransform(y, [0, -dragConstraints], [0, 3]);

  const [currentLevel, setCurrentLevel] = useState(1);
  const [hasUserSelectedLevel, setHasUserSelectedLevel] =
    useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = yToLevel.on('change', (latest) => {
      const level = Math.min(3, Math.max(0, Math.round(Math.abs(latest))));
      setCurrentLevel(level);
    });

    return () => unsubscribe();
  }, [yToLevel]);

  return (
    <div className="relative flex flex-col items-center justify-end">
      {randomArr.map((id) => (
        <motion.div
          key={id}
          className="flex size-[40px] flex-row items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="size-2 rounded-full bg-muted-foreground/40" />
        </motion.div>
      ))}

      <TooltipProvider>
        <Tooltip open={!isAnimating}>
          <TooltipTrigger asChild>
            <motion.div
              className={cn(
                'absolute flex flex-row items-center rounded-full border bg-background p-3',
                {
                  'bg-primary text-primary-foreground': currentLevel !== 1,
                  'bg-background text-foreground': currentLevel === 1,
                }
              )}
              style={{ y }}
              drag="y"
              dragElastic={0}
              dragMomentum={false}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              dragConstraints={{ top: -dragConstraints, bottom: 0 }}
              onDragStart={() => {
                setHasUserSelectedLevel(false);
              }}
              onDragEnd={() => {
                if (currentLevel === 1) {
                  setSelectedTool(null);
                } else {
                  setHasUserSelectedLevel(true);
                }
              }}
              onClick={() => {
                if (currentLevel !== 1 && hasUserSelectedLevel) {
                  let message = '';
                  const levelMessage = getLevelMessage(currentLevel);

                  if (input?.trim()) {
                    message = `${input.trim()}\n\n${levelMessage}`;
                  } else {
                    message = levelMessage;
                  }

                  append({
                    role: 'user',
                    content: message,
                  });

                  if (setInput) {
                    setInput('');
                  }
                  setSelectedTool(null);
                }
              }}
            >
              {currentLevel === 1 ? (
                <ArrowDownNarrowWide size={16} />
              ) : (
                <ArrowUp size={16} />
              )}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            sideOffset={16}
            className="rounded-2xl bg-foreground p-3 px-4 text-background text-sm"
          >
            {LEVELS[currentLevel]}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const LanguageAnalysisSelector = ({
  setSelectedTool,
  append,
  isAnimating,
  input,
  setInput,
}: {
  setSelectedTool: Dispatch<SetStateAction<string | null>>;
  isAnimating: boolean;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  input?: string;
  setInput?: Dispatch<SetStateAction<string>>;
}) => {
  const OPTIONS = ['Greek', 'Choose language', 'Hebrew'];

  const y = useMotionValue(-40);
  const dragConstraints = 2 * 40 + 2;
  const yToOption = useTransform(y, [0, -dragConstraints], [0, 2]);

  const [currentOption, setCurrentOption] = useState(1);
  const [hasUserSelectedOption, setHasUserSelectedOption] =
    useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = yToOption.on('change', (latest) => {
      const option = Math.min(2, Math.max(0, Math.round(Math.abs(latest))));
      setCurrentOption(option);
    });

    return () => unsubscribe();
  }, [yToOption]);

  return (
    <div className="relative flex flex-col items-center justify-end">
      {[...new Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="flex size-[40px] flex-row items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="size-2 rounded-full bg-muted-foreground/40" />
        </motion.div>
      ))}

      <TooltipProvider>
        <Tooltip open={!isAnimating}>
          <TooltipTrigger asChild>
            <motion.div
              className={cn(
                'absolute flex flex-row items-center rounded-full border bg-background p-3',
                {
                  'bg-primary text-primary-foreground': currentOption !== 1,
                  'bg-background text-foreground': currentOption === 1,
                }
              )}
              style={{ y }}
              drag="y"
              dragElastic={0}
              dragMomentum={false}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              dragConstraints={{ top: -dragConstraints, bottom: 0 }}
              onDragStart={() => {
                setHasUserSelectedOption(false);
              }}
              onDragEnd={() => {
                if (currentOption === 1) {
                  setSelectedTool(null);
                } else {
                  setHasUserSelectedOption(true);
                }
              }}
              onClick={() => {
                if (currentOption !== 1 && hasUserSelectedOption) {
                  let message = '';
                  if (input?.trim()) {
                    message = `${input.trim()}\n\nPlease analyze the ${OPTIONS[currentOption]} and its significance in this passage.`;
                  } else {
                    message = `Please analyze the ${OPTIONS[currentOption]} and its significance in this passage.`;
                  }

                  append({
                    role: 'user',
                    content: message,
                  });

                  if (setInput) {
                    setInput('');
                  }
                  setSelectedTool(null);
                }
              }}
            >
              {currentOption === 1 ? (
                <ArrowDownNarrowWide size={16} />
              ) : (
                <ArrowUp size={16} />
              )}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            sideOffset={16}
            className="rounded-2xl bg-foreground p-3 px-4 text-background text-sm"
          >
            {OPTIONS[currentOption]}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const Tools = ({
  isToolbarVisible,
  selectedTool,
  setSelectedTool,
  append,
  isAnimating,
  setIsToolbarVisible,
  input,
  setInput,
}: {
  isToolbarVisible: boolean;
  selectedTool: string | null;
  setSelectedTool: Dispatch<SetStateAction<string | null>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  isAnimating: boolean;
  setIsToolbarVisible: Dispatch<SetStateAction<boolean>>;
  input?: string;
  setInput?: Dispatch<SetStateAction<string>>;
}) => {
  // Define the tools configuration for the expandable toolbar
  const tools = [
    {
      type: 'cross-references',
      description: 'Cross references',
      icon: <Link size={16} />,
    },
    {
      type: 'language-analysis',
      description: 'Original language',
      icon: <Languages size={16} />,
    },
  ] as const;

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <AnimatePresence>
        {isToolbarVisible &&
          tools.map((tool) => (
            <Tool
              key={tool.type}
              type={tool.type}
              description={tool.description}
              icon={tool.icon}
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
              append={append}
              isAnimating={isAnimating}
              input={input}
              setInput={setInput}
            />
          ))}
      </AnimatePresence>

      <Tool
        type="explain"
        description="Explain this"
        icon={<MessageSquareText size={16} />}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        isToolbarVisible={isToolbarVisible}
        setIsToolbarVisible={setIsToolbarVisible}
        append={append}
        isAnimating={isAnimating}
        input={input}
        setInput={setInput}
      />
    </motion.div>
  );
};

const PureToolbar = ({
  isToolbarVisible,
  setIsToolbarVisible,
  append,
  isLoading,
  stop,
  setMessages,
  chatInputHeight,
  input,
  setInput,
}: {
  isToolbarVisible: boolean;
  setIsToolbarVisible: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  stop: () => void;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  chatInputHeight: number;
  input?: string;
  setInput?: Dispatch<SetStateAction<string>>;
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useOnClickOutside(toolbarRef as React.RefObject<HTMLElement>, () => {
    setIsToolbarVisible(false);
    setSelectedTool(null);
  });

  const startCloseTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSelectedTool(null);
      setIsToolbarVisible(false);
    }, 2000);
  };

  const cancelCloseTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      setIsToolbarVisible(false);
    }
  }, [isLoading, setIsToolbarVisible]);

  const getAnimateProps = () => {
    if (!isToolbarVisible) {
      return { opacity: 1, x: 0, y: 0, height: 54, transition: { delay: 0 } };
    }
    if (selectedTool === 'explain') {
      return {
        opacity: 1,
        x: 0,
        y: 0,
        height: 4 * 43,
        transition: { delay: 0 },
        scale: 0.95,
      };
    }
    if (selectedTool === 'language-analysis') {
      return {
        opacity: 1,
        x: 0,
        y: 0,
        height: 3 * 43,
        transition: { delay: 0 },
        scale: 0.95,
      };
    }

    return {
      opacity: 1,
      x: 0,
      y: 0,
      height: 3 * 45,
      transition: { delay: 0 },
      scale: 1,
    };
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div
          key="stop-icon"
          initial={{ scale: 1 }}
          animate={{ scale: 1.4 }}
          exit={{ scale: 1 }}
          className="p-3"
          onClick={() => {
            stop();
            setMessages((messages) => sanitizeUIMessages(messages));
          }}
        >
          <Square size={16} />
        </motion.div>
      );
    }

    if (selectedTool === 'explain') {
      return (
        <ExplainLevelSelector
          key="explain-level-selector"
          append={append}
          setSelectedTool={setSelectedTool}
          isAnimating={isAnimating}
          input={input}
          setInput={setInput}
        />
      );
    }

    if (selectedTool === 'language-analysis') {
      return (
        <LanguageAnalysisSelector
          key="language-analysis-selector"
          append={append}
          setSelectedTool={setSelectedTool}
          isAnimating={isAnimating}
          input={input}
          setInput={setInput}
        />
      );
    }

    return (
      <Tools
        key="tools"
        append={append}
        isAnimating={isAnimating}
        isToolbarVisible={isToolbarVisible}
        selectedTool={selectedTool}
        setIsToolbarVisible={setIsToolbarVisible}
        setSelectedTool={setSelectedTool}
        input={input}
        setInput={setInput}
      />
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        className="absolute right-2 z-20 flex cursor-pointer flex-col justify-end rounded-full border bg-background p-1.5 shadow"
        style={{
          bottom: chatInputHeight + 12,
        }}
        initial={{ opacity: 0, x: 20, y: 0, scale: 1 }}
        animate={getAnimateProps()}
        exit={{ opacity: 0, y: 0, x: 20, transition: { duration: 0.1 } }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onHoverStart={() => {
          if (isLoading) {
            return;
          }

          cancelCloseTimer();
          setIsToolbarVisible(true);
        }}
        onHoverEnd={() => {
          if (isLoading) {
            return;
          }

          startCloseTimer();
        }}
        onAnimationStart={() => {
          setIsAnimating(true);
        }}
        onAnimationComplete={() => {
          setIsAnimating(false);
        }}
        ref={toolbarRef}
      >
        {renderContent()}
      </motion.div>
    </TooltipProvider>
  );
};

export const Toolbar = memo(PureToolbar, (prevProps, nextProps) => {
  return equal(prevProps, nextProps);
});
