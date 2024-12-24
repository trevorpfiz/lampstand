"use client";

import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import type { Dispatch, JSX, SetStateAction } from "react";
import { memo, useEffect, useRef, useState } from "react";
import equal from "fast-deep-equal";
import {
  ArrowDownNarrowWide,
  ArrowUp,
  MessageCircle,
  PenTool,
  Square,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { nanoid } from "nanoid";
import { useOnClickOutside } from "usehooks-ts";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@lamp/ui/components/tooltip";
import { cn } from "@lamp/ui/lib/utils";

import { sanitizeUIMessages } from "~/lib/utils";

interface ToolProps {
  type: "final-polish" | "request-suggestions" | "adjust-reading-level";
  description: string;
  icon: JSX.Element;
  selectedTool: string | null;
  setSelectedTool: Dispatch<SetStateAction<string | null>>;
  isToolbarVisible?: boolean;
  setIsToolbarVisible?: Dispatch<SetStateAction<boolean>>;
  isAnimating: boolean;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
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

    if (!selectedTool) {
      setIsHovered(true);
      setSelectedTool(type);
      return;
    }

    if (selectedTool !== type) {
      setSelectedTool(type);
    } else {
      if (type === "final-polish") {
        void append({
          role: "user",
          content:
            "Please add final polish and check for grammar, add section titles for better structure, and ensure everything reads smoothly.",
        });

        setSelectedTool(null);
      } else if (type === "request-suggestions") {
        void append({
          role: "user",
          content:
            "Please add suggestions you have that could improve the writing.",
        });

        setSelectedTool(null);
      }
    }
  };

  return (
    <Tooltip open={isHovered && !isAnimating}>
      <TooltipTrigger asChild>
        <motion.div
          className={cn("rounded-full p-3", {
            "bg-primary !text-primary-foreground": selectedTool === type,
          })}
          onHoverStart={() => {
            setIsHovered(true);
          }}
          onHoverEnd={() => {
            if (selectedTool !== type) setIsHovered(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
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

const randomArr = [...Array(6)].map((_x) => nanoid(5));

const ReadingLevelSelector = ({
  setSelectedTool,
  append,
  isAnimating,
}: {
  setSelectedTool: Dispatch<SetStateAction<string | null>>;
  isAnimating: boolean;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}) => {
  const LEVELS = [
    "Elementary",
    "Middle School",
    "Keep current level",
    "High School",
    "College",
    "Graduate",
  ];

  const y = useMotionValue(-40 * 2);
  const dragConstraints = 5 * 40 + 2;
  const yToLevel = useTransform(y, [0, -dragConstraints], [0, 5]);

  const [currentLevel, setCurrentLevel] = useState(2);
  const [hasUserSelectedLevel, setHasUserSelectedLevel] =
    useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = yToLevel.on("change", (latest) => {
      const level = Math.min(5, Math.max(0, Math.round(Math.abs(latest))));
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
                "absolute flex flex-row items-center rounded-full border bg-background p-3",
                {
                  "bg-primary text-primary-foreground": currentLevel !== 2,
                  "bg-background text-foreground": currentLevel === 2,
                },
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
                if (currentLevel === 2) {
                  setSelectedTool(null);
                } else {
                  setHasUserSelectedLevel(true);
                }
              }}
              onClick={() => {
                if (currentLevel !== 2 && hasUserSelectedLevel) {
                  void append({
                    role: "user",
                    content: `Please adjust the reading level to ${LEVELS[currentLevel]} level.`,
                  });

                  setSelectedTool(null);
                }
              }}
            >
              {currentLevel === 2 ? (
                <ArrowDownNarrowWide size={16} />
              ) : (
                <ArrowUp size={16} />
              )}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            sideOffset={16}
            className="rounded-2xl bg-foreground p-3 px-4 text-sm text-background"
          >
            {LEVELS[currentLevel]}
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
}: {
  isToolbarVisible: boolean;
  selectedTool: string | null;
  setSelectedTool: Dispatch<SetStateAction<string | null>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  isAnimating: boolean;
  setIsToolbarVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <AnimatePresence>
        {isToolbarVisible && (
          <>
            <Tool
              type="adjust-reading-level"
              description="Adjust reading level"
              icon={<ArrowDownNarrowWide size={16} />}
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
              append={append}
              isAnimating={isAnimating}
            />

            <Tool
              type="request-suggestions"
              description="Request suggestions"
              icon={<MessageCircle size={16} />}
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
              append={append}
              isAnimating={isAnimating}
            />
          </>
        )}
      </AnimatePresence>

      <Tool
        type="final-polish"
        description="Add final polish"
        icon={<PenTool size={16} />}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        isToolbarVisible={isToolbarVisible}
        setIsToolbarVisible={setIsToolbarVisible}
        append={append}
        isAnimating={isAnimating}
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
}: {
  isToolbarVisible: boolean;
  setIsToolbarVisible: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  stop: () => void;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  chatInputHeight: number;
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useOnClickOutside(toolbarRef, () => {
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

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        className="absolute right-2 z-20 flex cursor-pointer flex-col justify-end rounded-full border bg-background p-1.5 shadow"
        style={{
          bottom: chatInputHeight + 12,
        }}
        initial={{ opacity: 0, x: 20, y: 0, scale: 1 }}
        animate={
          isToolbarVisible
            ? selectedTool === "adjust-reading-level"
              ? {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  height: 6 * 43,
                  transition: { delay: 0 },
                  scale: 0.95,
                }
              : {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  height: 3 * 45,
                  transition: { delay: 0 },
                  scale: 1,
                }
            : { opacity: 1, x: 0, y: 0, height: 54, transition: { delay: 0 } }
        }
        exit={{ opacity: 0, y: 0, x: 20, transition: { duration: 0.1 } }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onHoverStart={() => {
          if (isLoading) return;

          cancelCloseTimer();
          setIsToolbarVisible(true);
        }}
        onHoverEnd={() => {
          if (isLoading) return;

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
        {isLoading ? (
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
        ) : selectedTool === "adjust-reading-level" ? (
          <ReadingLevelSelector
            key="reading-level-selector"
            append={append}
            setSelectedTool={setSelectedTool}
            isAnimating={isAnimating}
          />
        ) : (
          <Tools
            key="tools"
            append={append}
            isAnimating={isAnimating}
            isToolbarVisible={isToolbarVisible}
            selectedTool={selectedTool}
            setIsToolbarVisible={setIsToolbarVisible}
            setSelectedTool={setSelectedTool}
          />
        )}
      </motion.div>
    </TooltipProvider>
  );
};

export const Toolbar = memo(PureToolbar, (prevProps, nextProps) => {
  return equal(prevProps, nextProps);
});
