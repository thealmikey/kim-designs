"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { projects } from "@/lib/projects";

type SelectionContextValue = {
  selected: string[];
  selectedProjects: (typeof projects)[number][];
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  whatsappLink: () => string;
  hydrated: boolean;
};

const STORAGE_KEY = "kim.v5.selection.v1";

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Hydration: localStorage is not available during SSR, so we set
          // the initial state from storage after mount. This is the canonical
          // exception to "no setState in effect".
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSelected(parsed.filter((id): id is string => typeof id === "string"));
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {
      // ignore quota errors
    }
  }, [selected, hydrated]);

  const toggle = useCallback((id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const add = useCallback((id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const remove = useCallback((id: string) => {
    setSelected((prev) => prev.filter((x) => x !== id));
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const isSelected = useCallback(
    (id: string) => selected.includes(id),
    [selected]
  );

  const selectedProjects = useMemo(
    () => selected.map((id) => projects.find((p) => p.id === id)).filter(Boolean) as (typeof projects)[number][],
    [selected]
  );

  const whatsappLink = useCallback(() => {
    const base = "https://wa.me/?text=";
    if (selectedProjects.length === 0) return base;
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");
    const lines = [
      "Hello Kim Interior Designs,",
      "",
      "I'd like to inquire about the following projects:",
      ...selectedProjects.map(
        (p, i) => `${i + 1}. ${p.title} — ${p.category} (${p.year})`
      ),
      "",
      `Source: ${origin}/`,
    ];
    return base + encodeURIComponent(lines.join("\n"));
  }, [selectedProjects]);

  return (
    <SelectionContext.Provider
      value={{
        selected,
        selectedProjects,
        isSelected,
        toggle,
        add,
        remove,
        clear,
        whatsappLink,
        hydrated,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return ctx;
}
