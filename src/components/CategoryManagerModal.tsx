import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Tag } from 'lucide-react';
import { categoryColor } from './Badge';

interface CategoryManagerModalProps {
  categories: string[];
  usedCategories: Set<string>;
  onAdd: (name: string) => void;
  onDelete: (name: string) => void;
  onClose: () => void;
}

export function CategoryManagerModal({
  categories, usedCategories, onAdd, onDelete, onClose,
}: CategoryManagerModalProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleAdd = () => {
    const name = input.trim();
    if (!name) return;
    if (categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      setError('Category already exists.');
      return;
    }
    onAdd(name);
    setInput('');
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900">Manage Categories</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Add new */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Add Category</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Backend, Docs, Analytics..."
                maxLength={40}
                autoFocus
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <button
                onClick={handleAdd}
                disabled={!input.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={15} />
                Add
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
          </div>

          {/* List */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Categories <span className="text-gray-400 font-normal">({categories.length})</span>
            </p>
            {categories.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-sm text-gray-400">No categories yet. Add one above.</p>
              </div>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {categories.map((cat) => {
                  const { bg, text, border } = categoryColor(cat);
                  const inUse = usedCategories.has(cat);
                  return (
                    <li key={cat} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-50">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border"
                        style={{ backgroundColor: bg, color: text, borderColor: border }}
                      >
                        {cat}
                      </span>
                      {inUse && (
                        <span className="text-xs text-gray-400 flex-1">in use</span>
                      )}
                      <button
                        onClick={() => {
                          if (inUse && !confirm(`"${cat}" is used by tasks. Delete anyway?`)) return;
                          onDelete(cat);
                        }}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                        title="Delete category"
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
