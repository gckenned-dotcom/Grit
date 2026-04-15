import type { Priority, Stage } from '../types';

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

// Deterministic color palette for user-defined categories
const CATEGORY_PALETTE = [
  { bg: '#e0e7ff', text: '#4338ca', border: '#c7d2fe' }, // indigo
  { bg: '#fce7f3', text: '#be185d', border: '#fbcfe8' }, // pink
  { bg: '#cffafe', text: '#0e7490', border: '#a5f3fc' }, // cyan
  { bg: '#ede9fe', text: '#6d28d9', border: '#ddd6fe' }, // violet
  { bg: '#ccfbf1', text: '#0f766e', border: '#99f6e4' }, // teal
  { bg: '#ffe4e6', text: '#be123c', border: '#fecdd3' }, // rose
  { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' }, // sky
  { bg: '#fef3c7', text: '#92400e', border: '#fde68a' }, // amber
  { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' }, // green
  { bg: '#fed7aa', text: '#c2410c', border: '#fdba74' }, // orange
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function categoryColor(category: string) {
  return CATEGORY_PALETTE[hashStr(category) % CATEGORY_PALETTE.length];
}

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

export function CategoryBadge({ category }: { category: string }) {
  const { bg, text, border } = categoryColor(category);
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border"
      style={{ backgroundColor: bg, color: text, borderColor: border }}
    >
      {category}
    </span>
  );
}

export { priorityConfig, stageConfig };
