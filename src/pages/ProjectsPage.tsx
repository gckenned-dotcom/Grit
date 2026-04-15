import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Pencil, Trash2, CheckSquare, LayoutGrid, Tag } from 'lucide-react';
import type { Project, Task } from '../types';
import { ProjectModal } from '../components/ProjectModal';
import { CategoryManagerModal } from '../components/CategoryManagerModal';

interface ProjectsPageProps {
  projects: Project[];
  tasks: Task[];
  categories: string[];
  onCreateProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateProject: (id: string, data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteProject: (id: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
}

export function ProjectsPage({
  projects, tasks, categories,
  onCreateProject, onUpdateProject, onDeleteProject,
  onAddCategory, onDeleteCategory,
}: ProjectsPageProps) {
  const navigate = useNavigate();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const usedCategories = useMemo(
    () => new Set(tasks.map((t) => t.category)),
    [tasks]
  );

  const getTaskStats = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    const done = projectTasks.filter((t) => t.stage === 'done').length;
    return { total: projectTasks.length, done };
  };

  const handleDelete = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    if (confirm(`Delete "${project.name}"? All tasks will also be deleted.`)) {
      onDeleteProject(project.id);
    }
  };

  const handleEdit = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProject(project);
    setShowProjectModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <LayoutGrid size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Grit</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              <Tag size={15} />
              Categories
              <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5 font-medium">
                {categories.length}
              </span>
            </button>
            <button
              onClick={() => { setEditingProject(null); setShowProjectModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1 text-sm">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen size={28} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h2>
            <p className="text-gray-500 text-sm mb-6">Create your first project to start tracking tasks.</p>
            <button
              onClick={() => { setEditingProject(null); setShowProjectModal(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              const stats = getTaskStats(project.id);
              const progress = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
              return (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ backgroundColor: project.color }}
                    >
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleEdit(e, project)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, project)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                  {project.description && (
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                  )}

                  <div className="mt-auto pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <CheckSquare size={12} />
                        <span>{stats.done}/{stats.total} tasks</span>
                      </div>
                      <span className="text-xs font-medium" style={{ color: project.color }}>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${progress}%`, backgroundColor: project.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {showProjectModal && (
        <ProjectModal
          project={editingProject}
          onSave={(data) => {
            if (editingProject) {
              onUpdateProject(editingProject.id, data);
            } else {
              onCreateProject(data);
            }
            setShowProjectModal(false);
            setEditingProject(null);
          }}
          onClose={() => { setShowProjectModal(false); setEditingProject(null); }}
        />
      )}

      {showCategoryModal && (
        <CategoryManagerModal
          categories={categories}
          usedCategories={usedCategories}
          onAdd={onAddCategory}
          onDelete={onDeleteCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  );
}
