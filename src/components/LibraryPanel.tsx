import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaTimes, FaFolderOpen, FaSave, FaTrash, FaPen, FaSearch } from 'react-icons/fa';
import { createLibraryItem, deleteLibraryItem, loadLibrary, saveLibrary, updateLibraryItem, type LibraryItem } from '../utils/library';

interface LibraryPanelProps {
  open: boolean;
  onClose: () => void;
  getCurrentSgf: () => string;
  onLoadSgf: (sgf: string) => void;
  onToast: (msg: string, type: 'info' | 'error' | 'success') => void;
}

export const LibraryPanel: React.FC<LibraryPanelProps> = ({ open, onClose, getCurrentSgf, onLoadSgf, onToast }) => {
  const [items, setItems] = useState<LibraryItem[]>(() => loadLibrary());
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => saveLibrary(items), [items]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, query]);

  const handleSaveCurrent = () => {
    const name = window.prompt('Save to Library as:', `Game ${items.length + 1}`) ?? '';
    if (!name.trim()) return;
    const sgf = getCurrentSgf();
    if (!sgf.trim()) {
      onToast('Nothing to save yet.', 'info');
      return;
    }
    const newItem = createLibraryItem(name, sgf);
    setItems((prev) => [newItem, ...prev]);
    setActiveId(newItem.id);
    onToast(`Saved "${newItem.name}" to Library.`, 'success');
  };

  const handleRename = (item: LibraryItem) => {
    const next = window.prompt('Rename file:', item.name) ?? '';
    if (!next.trim()) return;
    setItems((prev) => updateLibraryItem(prev, item.id, { name: next.trim() }));
  };

  const handleDelete = (item: LibraryItem) => {
    if (!window.confirm(`Delete "${item.name}" from Library?`)) return;
    setItems((prev) => deleteLibraryItem(prev, item.id));
    if (activeId === item.id) setActiveId(null);
  };

  const handleLoad = (item: LibraryItem) => {
    try {
      onLoadSgf(item.sgf);
      setActiveId(item.id);
      onToast(`Loaded "${item.name}".`, 'success');
      if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
        onClose();
      }
    } catch {
      onToast('Failed to load SGF from Library.', 'error');
    }
  };

  const handleImportFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const imported: LibraryItem[] = [];
    for (const file of Array.from(files)) {
      if (!file.name.toLowerCase().endsWith('.sgf')) continue;
      try {
        const text = await file.text();
        const name = file.name.replace(/\.sgf$/i, '');
        imported.push(createLibraryItem(name, text));
      } catch {
        // ignore per-file failures
      }
    }
    if (imported.length === 0) {
      onToast('No SGF files were imported.', 'info');
      return;
    }
    setItems((prev) => [...imported, ...prev]);
    onToast(`Imported ${imported.length} file${imported.length > 1 ? 's' : ''}.`, 'success');
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    await handleImportFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />
      <div
        className={[
          'bg-slate-900 border-r border-slate-700/50 flex flex-col',
          'fixed inset-y-0 left-0 z-40 w-full max-w-sm',
          'lg:static lg:w-80 lg:max-w-none lg:z-auto',
        ].join(' ')}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="h-14 border-b border-slate-700/50 flex items-center gap-2 px-3">
          <button
            type="button"
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded hover:bg-slate-700 text-slate-300 hover:text-white"
            onClick={onClose}
            title="Close library"
          >
            <FaTimes />
          </button>
          <div className="font-semibold text-slate-100">Library</div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="px-2 py-1 rounded bg-slate-800/70 text-xs text-slate-200 hover:bg-slate-700"
              onClick={handleSaveCurrent}
              title="Save current game to Library"
            >
              <FaSave className="inline-block mr-1" /> Save
            </button>
            <button
              type="button"
              className="px-2 py-1 rounded bg-slate-800/70 text-xs text-slate-200 hover:bg-slate-700"
              onClick={() => fileInputRef.current?.click()}
              title="Import SGF files"
            >
              <FaFolderOpen className="inline-block mr-1" /> Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".sgf"
              multiple
              onChange={(e) => void handleImportFiles(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search library…"
              className="w-full bg-slate-800/80 border border-slate-700/50 rounded pl-8 pr-3 py-2 text-sm text-slate-200 focus:border-emerald-500"
            />
          </div>
          {isDragging && (
            <div className="mt-3 text-xs text-emerald-300 border border-emerald-500/40 rounded px-2 py-1 bg-emerald-900/20">
              Drop SGF files to import
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              <div className="font-semibold text-slate-300 mb-2">Library is empty</div>
              <div>Save the current game or drag SGF files here to build your library.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={[
                    'px-3 py-2 flex items-center gap-2 hover:bg-slate-800/60 cursor-pointer',
                    activeId === item.id ? 'bg-slate-800/80' : '',
                  ].join(' ')}
                  onClick={() => handleLoad(item)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-100 truncate">{item.name}</div>
                    <div className="text-xs text-slate-500">
                      {item.moveCount} moves · {(item.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-200 p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(item);
                    }}
                    title="Rename"
                  >
                    <FaPen />
                  </button>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-rose-300 p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
