import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Plus, Search, SlidersHorizontal,
  LayoutGrid, List, CheckSquare, Clock, AlertTriangle, X,
} from 'lucide-react';
import type { Task, Project, Stage, Priority } from '../types';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { stageConfig } from '../components/Badge';

interface ProjectDetailPageProps {
  projects: Project[];
  tasks: Task[];
  categories: string[];
  onCreateTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (id: string, data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteTask: (id: string) => void;
  onAddCategory: (name: string) => void;
}

type ViewMode = 'board' | 'list';
type SortKey = 'dueDate' | 'priority' | 'title' | 'createdAt';

const stages: Stage[] = ['backlog', 'todo', 'in-progress', 'review', 'done'];

const priorityOrder: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };

function sortTasks(tasks: Task[], sortKey: SortKey): Task[] {
  return [...tasks].sort((a, b) => {
    if (sortKey === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (sortKey === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sortKey === 'title') return a.title.localeCompare(b.title);
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function ProjectDetailPage({
  projects, tasks, categories,
  onCreateTask, onUpdateTask, onDeleteTask, onAddCategory,
}: ProjectDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');
  const [filterCategory, setFilterCategory] = useState('');
  // Default sort is priority — tasks always ordered critical → high → medium → low
  const [sortKey, setSortKey] = useState<SortKey>('priority');
  const [showFilters, setShowFilters] = useState(false);

  // Categories that exist on this project's tasks (for filter dropdown)
  const projectCategories = useMemo(() => {
    const used = new Set(tasks.filter((t) => t.projectId === id).map((t) => t.category));
    return categories.filter((c) => used.has(c));
  }, [tasks, id, categories]);

  const projectTasks = useMemo(() => {
    let filtered = tasks.filter((t) => t.projectId === id);
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    if (filterPriority) filtered = filtered.filter((t) => t.priority === filterPriority);
    if (filterCategory) filtered = filtered.filter((t) => t.category === filterCategory);
    return sortTasks(filtered, sortKey);
  }, [tasks, id, search, filterPriority, filterCategory, sortKey]);

  const stats = useMemo(() => {
    const all = tasks.filter((t) => t.projectId === id);
    return {
      total: all.length,
      done: all.filter((t) => t.stage === 'done').length,
      overdue: all.filter((t) => {
        if (!t.dueDate || t.stage === 'done') return false;
        return new Date(t.dueDate + 'T00:00:00') < new Date(new Date().toDateString());
      }).length,
      inProgress: all.filter((t) => t.stage === 'in-progress').length,
    };
  }, [tasks, id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Project not found.</p>
          <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline text-sm">
            Back to projects
          </button>
        </div>
      </div>
    );
  }

  const handleSaveTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, data);
    } else {
      onCreateTask(data);
    }
    setShowModal(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const hasActiveFilters = filterPriority || filterCategory;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ backgroundColor: project.color }}
            >
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">{project.name}</h1>
              {project.description && (
                <p className="text-xs text-gray-500 truncate">{project.description}</p>
              )}
            </div>
            <button
              onClick={() => { setEditingTask(null); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors shrink-0"
              style={{ backgroundColor: project.color }}
            >
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Tasks', value: stats.total, icon: CheckSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Completed', value: stats.done, icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                <Icon size={16} className={color} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
                hasActiveFilters
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && (
                <span className="w-4 h-4 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center">
                  {[filterPriority, filterCategory].filter(Boolean).length}
                </span>
              )}
            </button>

            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="priority">Priority</option>
              <option value="dueDate">Due date</option>
              <option value="createdAt">Newest first</option>
              <option value="title">Title A–Z</option>
            </select>

            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-2 transition-colors ${viewMode === 'board' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Board view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-600">Priority:</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as Priority | '')}
                className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
              >
                <option value="">All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-600">Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
              >
                <option value="">All</option>
                {projectCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => { setFilterPriority(''); setFilterCategory(''); }}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        )}

        {/* Board View */}
        {viewMode === 'board' ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map((stage) => {
              const stageTasks = projectTasks.filter((t) => t.stage === stage);
              const { label } = stageConfig[stage];
              return (
                <div key={stage} className="flex-shrink-0 w-72">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 font-medium">
                        {stageTasks.length}
                      </span>
                    </div>
                    <button
                      onClick={() => { setEditingTask(null); setShowModal(true); }}
                      className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      title={`Add task to ${label}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="space-y-3 min-h-16">
                    {stageTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        accentColor={project.color}
                        onEdit={handleEditTask}
                        onDelete={onDeleteTask}
                      />
                    ))}
                    {stageTasks.length === 0 && (
                      <div className="border-2 border-dashed border-gray-100 rounded-xl h-16 flex items-center justify-center">
                        <span className="text-xs text-gray-300">No tasks</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {projectTasks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-400 text-sm">No tasks found.</p>
              </div>
            ) : (
              projectTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  accentColor={project.color}
                  onEdit={handleEditTask}
                  onDelete={onDeleteTask}
                />
              ))
            )}
          </div>
        )}
      </main>

      {showModal && (
        <TaskModal
          task={editingTask}
          project={project}
          categories={categories}
          onSave={handleSaveTask}
          onAddCategory={onAddCategory}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
}
