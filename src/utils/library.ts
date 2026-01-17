export type LibraryItem = {
  id: string;
  name: string;
  sgf: string;
  createdAt: number;
  updatedAt: number;
  moveCount: number;
  size: number;
};

const STORAGE_KEY = 'web-katrain:library:v1';

const safeParse = (raw: string | null): LibraryItem[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item === 'object') as LibraryItem[];
  } catch {
    return [];
  }
};

const createId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `lib_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
};

const countMoves = (sgf: string): number => {
  if (!sgf) return 0;
  const matches = sgf.match(/[BW]\[/g);
  return matches ? matches.length : 0;
};

export const loadLibrary = (): LibraryItem[] => {
  if (typeof localStorage === 'undefined') return [];
  return safeParse(localStorage.getItem(STORAGE_KEY));
};

export const saveLibrary = (items: LibraryItem[]): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota/permission errors.
  }
};

export const createLibraryItem = (name: string, sgf: string): LibraryItem => {
  const now = Date.now();
  return {
    id: createId(),
    name: name.trim() || 'Untitled',
    sgf,
    createdAt: now,
    updatedAt: now,
    moveCount: countMoves(sgf),
    size: sgf.length,
  };
};

export const updateLibraryItem = (items: LibraryItem[], id: string, updates: Partial<LibraryItem>): LibraryItem[] => {
  return items.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item));
};

export const deleteLibraryItem = (items: LibraryItem[], id: string): LibraryItem[] => {
  return items.filter((item) => item.id !== id);
};
