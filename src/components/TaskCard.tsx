import { Calendar, Pencil, Trash2 } from 'lucide-react';
import type { Task } from '../types';
import { PriorityBadge, StageBadge, CategoryBadge } from './Badge';

interface TaskCardProps {
  task: Task;
  accentColor: string;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

function formatDate(dateStr: string) {
  if (!dateStr) return null;
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dateStr: string) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr + 'T00:00:00') < today;
}

export function TaskCard({ task, accentColor, onEdit, onDelete }: TaskCardProps) {
  const overdue = task.stage !== 'done' && isOverdue(task.dueDate);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-medium text-gray-900 leading-snug flex-1">{task.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Edit task"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        <CategoryBadge category={task.category} />
        <PriorityBadge priority={task.priority} />
        <StageBadge stage={task.stage} />
      </div>

      {task.dueDate && (
        <div className={`flex items-center gap-1.5 text-xs ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
          <Calendar size={12} />
          <span>{overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}</span>
        </div>
      )}

      <div
        className="mt-3 h-0.5 rounded-full opacity-30"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}
