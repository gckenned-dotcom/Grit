import { useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import type { Project, Task } from './types';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const DEFAULT_CATEGORIES = ['Development', 'Design', 'Marketing', 'Research', 'Operations', 'QA'];

function App() {
  const [projects, setProjects] = useLocalStorage<Project[]>('grit-projects', []);
  const [tasks, setTasks] = useLocalStorage<Task[]>('grit-tasks', []);
  const [categories, setCategories] = useLocalStorage<string[]>('grit-categories', DEFAULT_CATEGORIES);

  // Project CRUD
  const handleCreateProject = useCallback((data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setProjects((prev) => [{ ...data, id: generateId(), createdAt: now, updatedAt: now }, ...prev]);
  }, [setProjects]);

  const handleUpdateProject = useCallback((id: string, data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    setProjects((prev) =>
      prev.map((p) => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p)
    );
  }, [setProjects]);

  const handleDeleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
  }, [setProjects, setTasks]);

  // Task CRUD
  const handleCreateTask = useCallback((data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setTasks((prev) => [{ ...data, id: generateId(), createdAt: now, updatedAt: now }, ...prev]);
  }, [setTasks]);

  const handleUpdateTask = useCallback((id: string, data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setTasks((prev) =>
      prev.map((t) => t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t)
    );
  }, [setTasks]);

  const handleDeleteTask = useCallback((id: string) => {
    if (!confirm('Delete this task?')) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, [setTasks]);

  // Category CRUD
  const handleAddCategory = useCallback((name: string) => {
    setCategories((prev) => {
      if (prev.some((c) => c.toLowerCase() === name.toLowerCase())) return prev;
      return [...prev, name];
    });
  }, [setCategories]);

  const handleDeleteCategory = useCallback((name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
  }, [setCategories]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProjectsPage
              projects={projects}
              tasks={tasks}
              categories={categories}
              onCreateProject={handleCreateProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProjectDetailPage
              projects={projects}
              tasks={tasks}
              categories={categories}
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onAddCategory={handleAddCategory}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
