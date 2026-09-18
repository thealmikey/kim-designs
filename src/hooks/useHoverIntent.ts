"use client";

import { useRef, useCallback, useEffect } from "react";

interface HoverIntentOptions {
  /** Delay before opening (ms) */
  enterDelay?: number;
  /** Delay before closing (ms) */
  leaveDelay?: number;
  /** Callback when intent to open is confirmed */
  onOpen?: (key: string) => void;
  /** Callback when intent to close is confirmed */
  onClose?: () => void;
}

export function useHoverIntent(options: HoverIntentOptions = {}) {
  const { enterDelay = 150, leaveDelay = 300, onOpen, onClose } = options;

  const pendingKey = useRef<string | null>(null);
  const enterTimeout = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const currentKey = useRef<string | null>(null);

  const clearTimers = useCallback(() => {
    if (enterTimeout.current) {
      clearTimeout(enterTimeout.current);
      enterTimeout.current = null;
    }
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
      leaveTimeout.current = null;
    }
  }, []);

  const requestOpen = useCallback(
    (key: string) => {
      // Clear any pending close
      clearTimers();

      // If already open on this key, do nothing
      if (currentKey.current === key) return;

      // If there's a different key pending, switch immediately
      if (pendingKey.current && pendingKey.current !== key) {
        pendingKey.current = key;
        return;
      }

      pendingKey.current = key;

      enterTimeout.current = setTimeout(() => {
        currentKey.current = key;
        pendingKey.current = null;
        onOpen?.(key);
        enterTimeout.current = null;
      }, enterDelay);
    },
    [enterDelay, onOpen, clearTimers]
  );

  const requestClose = useCallback(() => {
    clearTimers();

    if (!currentKey.current) return;

    leaveTimeout.current = setTimeout(() => {
      currentKey.current = null;
      pendingKey.current = null;
      onClose?.();
      leaveTimeout.current = null;
    }, leaveDelay);
  }, [leaveDelay, onClose, clearTimers]);

  const forceClose = useCallback(() => {
    clearTimers();
    currentKey.current = null;
    pendingKey.current = null;
    onClose?.();
  }, [onClose, clearTimers]);

  const isOpen = useCallback(
    (key: string) => currentKey.current === key,
    []
  );

  const isPending = useCallback(
    (key: string) => pendingKey.current === key,
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    requestOpen,
    requestClose,
    forceClose,
    isOpen,
    isPending,
    currentKey: currentKey.current,
  };
}

export type HoverIntentReturn = ReturnType<typeof useHoverIntent>;