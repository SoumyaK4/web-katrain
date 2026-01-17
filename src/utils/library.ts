export type LibraryBase = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  parentId: string | null;
  type: 'file' | 'folder';
};

export type LibraryFile = LibraryBase & {
  type: 'file';
  sgf: string;
  moveCount: number;
  size: number;
};

export type LibraryFolder = LibraryBase & {
  type: 'folder';
};

export type LibraryItem = LibraryFile | LibraryFolder;

const STORAGE_KEY = 'web-katrain:library:v1';

const safeParse = (raw: string | null): LibraryItem[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === 'object')
      .map((item) => {
        const parentId = typeof item.parentId === 'string' ? item.parentId : null;
        const createdAt = typeof item.createdAt === 'number' ? item.createdAt : Date.now();
        const updatedAt = typeof item.updatedAt === 'number' ? item.updatedAt : createdAt;
        const name = typeof item.name === 'string' ? item.name : 'Untitled';
        const isFolder = item.type === 'folder' || typeof item.sgf !== 'string';
        if (isFolder) {
          return {
            id: typeof item.id === 'string' ? item.id : createId(),
            name,
            createdAt,
            updatedAt,
            parentId,
            type: 'folder',
          } as LibraryFolder;
        }
        const sgf = typeof item.sgf === 'string' ? item.sgf : '';
        return {
          id: typeof item.id === 'string' ? item.id : createId(),
          name,
          createdAt,
          updatedAt,
          parentId,
          type: 'file',
          sgf,
          moveCount: typeof item.moveCount === 'number' ? item.moveCount : countMoves(sgf),
          size: typeof item.size === 'number' ? item.size : sgf.length,
        } as LibraryFile;
      });
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

export const createLibraryItem = (name: string, sgf: string, parentId: string | null = null): LibraryFile => {
  const now = Date.now();
  return {
    id: createId(),
    name: name.trim() || 'Untitled',
    sgf,
    createdAt: now,
    updatedAt: now,
    moveCount: countMoves(sgf),
    size: sgf.length,
    parentId,
    type: 'file',
  };
};

export const createLibraryFolder = (name: string, parentId: string | null = null): LibraryFolder => {
  const now = Date.now();
  return {
    id: createId(),
    name: name.trim() || 'New Folder',
    createdAt: now,
    updatedAt: now,
    parentId,
    type: 'folder',
  };
};

export const updateLibraryItem = (items: LibraryItem[], id: string, updates: Partial<LibraryItem>): LibraryItem[] => {
  return items.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item));
};

const collectDescendants = (items: LibraryItem[], id: string): Set<string> => {
  const toDelete = new Set<string>([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of items) {
      if (item.parentId && toDelete.has(item.parentId) && !toDelete.has(item.id)) {
        toDelete.add(item.id);
        changed = true;
      }
    }
  }
  return toDelete;
};

export const deleteLibraryItem = (items: LibraryItem[], id: string): LibraryItem[] => {
  const ids = collectDescendants(items, id);
  return items.filter((item) => !ids.has(item.id));
};
