import type { Priority, Stage, Category } from '../types';

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-green-100 text-green-700 border border-green-200' },
  medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-700 border border-orange-200' },
  critical: { label: 'Critical', className: 'bg-red-100 text-red-700 border border-red-200' },
};

const stageConfig: Record<Stage, { label: string; className: string }> = {
  backlog: { label: 'Backlog', className: 'bg-gray-100 text-gray-600 border border-gray-200' },
  todo: { label: 'To Do', className: 'bg-blue-100 text-blue-700 border border-blue-200' },
  'in-progress': { label: 'In Progress', className: 'bg-purple-100 text-purple-700 border border-purple-200' },
  review: { label: 'Review', className: 'bg-amber-100 text-amber-700 border border-amber-200' },
  done: { label: 'Done', className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
};

const categoryConfig: Record<Category, { label: string; className: string }> = {
  development: { label: 'Development', className: 'bg-indigo-100 text-indigo-700 border border-indigo-200' },
  design: { label: 'Design', className: 'bg-pink-100 text-pink-700 border border-pink-200' },
  marketing: { label: 'Marketing', className: 'bg-cyan-100 text-cyan-700 border border-cyan-200' },
  research: { label: 'Research', className: 'bg-violet-100 text-violet-700 border border-violet-200' },
  operations: { label: 'Operations', className: 'bg-teal-100 text-teal-700 border border-teal-200' },
  qa: { label: 'QA', className: 'bg-rose-100 text-rose-700 border border-rose-200' },
  devops: { label: 'DevOps', className: 'bg-sky-100 text-sky-700 border border-sky-200' },
  other: { label: 'Other', className: 'bg-gray-100 text-gray-600 border border-gray-200' },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className } = priorityConfig[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

export function StageBadge({ stage }: { stage: Stage }) {
  const { label, className } = stageConfig[stage];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

export function CategoryBadge({ category }: { category: Category }) {
  const { label, className } = categoryConfig[category];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

export { priorityConfig, stageConfig, categoryConfig };
