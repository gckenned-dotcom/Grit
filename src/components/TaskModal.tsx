import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Task, Project, Priority, Stage, Category } from '../types';

interface TaskModalProps {
  task?: Task | null;
  project: Project;
  onSave: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

const priorities: Priority[] = ['low', 'medium', 'high', 'critical'];
const stages: Stage[] = ['backlog', 'todo', 'in-progress', 'review', 'done'];
const categories: Category[] = [
  'development', 'design', 'marketing', 'research', 'operations', 'qa', 'devops', 'other',
];

const priorityLabels: Record<Priority, string> = {
  low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical',
};
const stageLabels: Record<Stage, string> = {
  backlog: 'Backlog', todo: 'To Do', 'in-progress': 'In Progress', review: 'Review', done: 'Done',
};
const categoryLabels: Record<Category, string> = {
  development: 'Development', design: 'Design', marketing: 'Marketing', research: 'Research',
  operations: 'Operations', qa: 'QA', devops: 'DevOps', other: 'Other',
};

export function TaskModal({ task, project, onSave, onClose }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [category, setCategory] = useState<Category>(task?.category ?? 'development');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');
  const [stage, setStage] = useState<Stage>(task?.stage ?? 'todo');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      projectId: project.id,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate,
      stage,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {task ? 'Edit Task' : 'New Task'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{project.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{categoryLabels[c]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>{priorityLabels[p]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as Stage)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              >
                {stages.map((s) => (
                  <option key={s} value={s}>{stageLabels[s]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: project.color }}
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
