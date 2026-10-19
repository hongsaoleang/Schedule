import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import WeekNavigator from './components/WeekNavigator';
import WeeklyProjectFocus from './components/WeeklyProjectFocus';
import WeeklyBoard from './components/WeeklyBoard';
import TaskModal from './components/TaskModal';
import ProjectModal from './components/ProjectModal';
import CategoryModal from './components/CategoryModal';
import ProjectManager from './components/ProjectManager';
import CarryOverModal from './components/CarryOverModal';
import MonthCalendarView from './components/MonthCalendarView';

import {
  getMondayOfWeek,
  getDaysOfWeek,
} from './utils/dateUtils';
import {
  INITIAL_CATEGORIES,
  INITIAL_PROJECTS,
  PROJECT_COLORS,
  getInitialTasks,
} from './data/initialData';
import './App.css';

const LOCAL_STORAGE_CATEGORIES_KEY = 'schedule_categories_v3';
const LOCAL_STORAGE_PROJECTS_KEY = 'schedule_projects_v3';
const LOCAL_STORAGE_TASKS_KEY = 'schedule_tasks_v3';
const LOCAL_STORAGE_THEME_KEY = 'schedule_theme_v2';

function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Current selected week's Monday
  const [currentMonday, setCurrentMonday] = useState(() => getMondayOfWeek(new Date()));

  // Categories state (starts empty if no user input, cleans legacy demo data)
  const [categories, setCategories] = useState(() => {
    try {
      localStorage.removeItem('schedule_categories_v2');
      const saved = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading categories from localStorage', e);
    }
    return INITIAL_CATEGORIES;
  });

  // Projects state (starts empty if no user input, cleans legacy demo data)
  const [projects, setProjects] = useState(() => {
    try {
      localStorage.removeItem('schedule_projects_v2');
      const saved = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((p) => ({
          ...p,
          categoryId: p.categoryId || '',
        }));
      }
    } catch (e) {
      console.error('Error loading projects from localStorage', e);
    }
    return INITIAL_PROJECTS;
  });

  // Tasks state (starts empty by default, removes legacy mock tasks)
  const [tasks, setTasks] = useState(() => {
    try {
      localStorage.removeItem('schedule_tasks_v2');
      const saved = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading tasks from localStorage', e);
    }
    return getInitialTasks();
  });

  // Filter by project
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // View Mode: 'week' | 'month'
  const [viewMode, setViewMode] = useState('week');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskDefaultDateStr, setTaskDefaultDateStr] = useState('');

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [defaultCategoryIdForProject, setDefaultCategoryIdForProject] = useState('');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [isCarryOverModalOpen, setIsCarryOverModalOpen] = useState(false);

  // Sync theme
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  // Sync categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories to localStorage', e);
    }
  }, [categories]);

  // Sync projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Error saving projects to localStorage', e);
    }
  }, [projects]);

  // Sync tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to localStorage', e);
    }
  }, [tasks]);

  // Days for the currently viewed week
  const daysOfWeek = useMemo(() => {
    return getDaysOfWeek(currentMonday);
  }, [currentMonday]);

  // Date strings for current week
  const currentWeekDateStrings = useMemo(() => {
    return new Set(daysOfWeek.map((d) => d.dateStr));
  }, [daysOfWeek]);

  // Tasks belonging to the active week
  const tasksForCurrentWeek = useMemo(() => {
    return tasks.filter((t) => currentWeekDateStrings.has(t.dateStr));
  }, [tasks, currentWeekDateStrings]);

  // Task operations
  const handleSaveTask = (savedTask) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === savedTask.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTask.id ? savedTask : t));
      }
      return [...prev, savedTask];
    });
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleToggleTaskComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleOpenNewTask = (dateStr = '') => {
    setTaskToEdit(null);
    setTaskDefaultDateStr(dateStr || daysOfWeek[0]?.dateStr || '');
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setTaskDefaultDateStr(task.dateStr);
    setIsTaskModalOpen(true);
  };

  // Category operations (CRUD)
  const handleSaveCategory = (savedCategory) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === savedCategory.id);
      if (exists) {
        return prev.map((c) => (c.id === savedCategory.id ? savedCategory : c));
      }
      return [...prev, savedCategory];
    });
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const handleQuickAddCategory = ({ name, color }) => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      name,
      color: color || PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)].hex,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleOpenNewCategory = () => {
    setCategoryToEdit(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat) => {
    setCategoryToEdit(cat);
    setIsCategoryModalOpen(true);
  };

  // Project operations (CRUD)
  const handleSaveProject = (savedProj) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === savedProj.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProj.id ? savedProj : p));
      }
      return [...prev, savedProj];
    });
  };

  const handleDeleteProject = (projId) => {
    setProjects((prev) => prev.filter((p) => p.id !== projId));
    if (selectedProjectId === projId) {
      setSelectedProjectId(null);
    }
  };

  const handleQuickAddProject = ({ name, categoryId }) => {
    const matchingCat = categories.find((c) => c.id === categoryId);
    const newProject = {
      id: `proj-${Date.now()}`,
      categoryId,
      name,
      description: `Project in ${matchingCat ? matchingCat.name : 'General'}`,
      color: matchingCat ? matchingCat.color : PROJECT_COLORS[0].hex,
      priority: 'high',
      status: 'in-progress',
      targetHours: 10,
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const handleOpenNewProject = (categoryId = '') => {
    setProjectToEdit(null);
    setDefaultCategoryIdForProject(categoryId || (categories[0]?.id || ''));
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (proj) => {
    setProjectToEdit(proj);
    setDefaultCategoryIdForProject(proj.categoryId || (categories[0]?.id || ''));
    setIsProjectModalOpen(true);
  };

  const handleAddTaskForProject = (projId) => {
    setTaskToEdit({
      projectId: projId,
      dateStr: daysOfWeek[0]?.dateStr || '',
      title: '',
      estimatedHours: '',
      priority: 'high',
      completed: false,
    });
    setTaskDefaultDateStr(daysOfWeek[0]?.dateStr || '');
    setIsTaskModalOpen(true);
  };

  // Carry over tasks to another week
  const handleCarryOver = ({ tasks: tasksToCarry, targetDateStr, targetMonday }) => {
    const newTasks = tasksToCarry.map((task) => ({
      ...task,
      id: `task-carry-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      dateStr: targetDateStr,
      completed: false,
    }));

    setTasks((prev) => [...prev, ...newTasks]);
    setCurrentMonday(targetMonday);
  };

  // Reset / Clear all data
  const handleResetData = () => {
    localStorage.removeItem(LOCAL_STORAGE_CATEGORIES_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PROJECTS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_TASKS_KEY);
    localStorage.removeItem('schedule_categories_v2');
    localStorage.removeItem('schedule_projects_v2');
    localStorage.removeItem('schedule_tasks_v2');
    setCategories([]);
    setProjects([]);
    setTasks([]);
    setSelectedProjectId(null);
  };

  return (
    <div className="schedule-app-wrapper">
      <Header
        activeWeekTasks={tasksForCurrentWeek}
        activeProjectsCount={projects.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        onOpenNewTask={handleOpenNewTask}
        onOpenNewProject={() => handleOpenNewProject()}
        onOpenProjectManager={() => setIsProjectManagerOpen(true)}
        onResetData={handleResetData}
      />

      <main className="main-content">
        {/* View Switcher: Week Planner vs Month Calendar */}
        <div className="view-mode-bar">
          <div className="view-mode-switch">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              📅 Week Planner View
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              🗓️ Month Calendar View
            </button>
          </div>
          <span className="view-mode-hint">
            {viewMode === 'week'
              ? 'Showing 7-day schedule with project badges and time slots'
              : 'Showing full calendar to see project deliverables on each day'}
          </span>
        </div>

        {/* Schedule View (Week Schedule or Month Calendar) */}
        {viewMode === 'week' ? (
          <>
            <WeekNavigator
              currentMonday={currentMonday}
              onWeekChange={setCurrentMonday}
              onOpenTaskModal={handleOpenNewTask}
              onOpenCarryOverModal={() => setIsCarryOverModalOpen(true)}
            />

            <WeeklyBoard
              daysOfWeek={daysOfWeek}
              tasks={tasks}
              projects={projects}
              selectedProjectId={selectedProjectId}
              onToggleComplete={handleToggleTaskComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onAddTaskForDay={handleOpenNewTask}
            />
          </>
        ) : (
          <MonthCalendarView
            projects={projects}
            tasks={tasks}
            selectedProjectId={selectedProjectId}
            onSelectProjectFilter={setSelectedProjectId}
            onAddTaskForDay={handleOpenNewTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleTaskComplete={handleToggleTaskComplete}
            onJumpToWeek={(mondayStr) => {
              setCurrentMonday(mondayStr);
              setViewMode('week');
            }}
          />
        )}

        {/* Weekly Projects & Category Focus with inline and modal CRUD */}
        <WeeklyProjectFocus
          categories={categories}
          projects={projects}
          tasksForWeek={tasksForCurrentWeek}
          selectedProjectId={selectedProjectId}
          onSelectProjectFilter={setSelectedProjectId}
          onAddTaskForProject={handleAddTaskForProject}
          onOpenNewCategoryModal={handleOpenNewCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onQuickAddCategory={handleQuickAddCategory}
          onOpenNewProjectModal={handleOpenNewProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onQuickAddProject={handleQuickAddProject}
        />
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        taskToEdit={taskToEdit}
        projects={projects}
        defaultDateStr={taskDefaultDateStr}
        daysOfWeek={daysOfWeek}
      />

      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
        projectToEdit={projectToEdit}
        categories={categories}
        defaultCategoryId={defaultCategoryIdForProject}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
        categoryToEdit={categoryToEdit}
      />

      {/* Project & Category Manager */}
      <ProjectManager
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
        projects={projects}
        categories={categories}
        onOpenNewProject={handleOpenNewProject}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        onOpenNewCategory={handleOpenNewCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Carry Over / Multi-Week Planner */}
      <CarryOverModal
        isOpen={isCarryOverModalOpen}
        onClose={() => setIsCarryOverModalOpen(false)}
        currentMonday={currentMonday}
        tasksForCurrentWeek={tasksForCurrentWeek}
        projects={projects}
        onCarryOver={handleCarryOver}
      />
    </div>
  );
}

export default App;
