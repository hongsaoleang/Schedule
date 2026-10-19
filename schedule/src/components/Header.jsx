import {
  CalendarIcon,
  SunIcon,
  MoonIcon,
  PlusIcon,
  BarChartIcon,
  FolderIcon,
} from './Icons';
import scheduleIcon from '../assets/schedule-icon.svg';

export default function Header({
  activeWeekTasks,
  activeProjectsCount,
  isDarkMode,
  onToggleDarkMode,
  onOpenNewTask,
  onOpenNewProject,
  onOpenProjectManager,
  onResetData,
}) {
  const totalTasks = activeWeekTasks.length;
  const completedTasks = activeWeekTasks.filter((t) => t.completed).length;
  const totalHours = activeWeekTasks.reduce(
    (sum, t) => sum + (Number(t.estimatedHours) || 0),
    0
  );
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-logo-area">
          <div className="brand-icon-box">
            <img src={scheduleIcon} alt="Schedule Icon" width="40" height="40" style={{ borderRadius: '10px', display: 'block' }} />
          </div>
          <div>
            <h1 className="brand-title">Schedule</h1>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onOpenProjectManager}
          >
            <FolderIcon size={16} /> Projects ({activeProjectsCount})
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenNewProject}
          >
            <PlusIcon size={16} /> New Project
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onOpenNewTask()}
          >
            <PlusIcon size={18} /> New Task
          </button>

          <button
            type="button"
            className="icon-btn-round"
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
          >
            {isDarkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>

          <button
            type="button"
            className="btn btn-subtle text-muted"
            title="Clear all data and reset schedule"
            onClick={() => {
              if (confirm('Clear all schedule data, projects, and categories?')) {
                onResetData();
              }
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="header-stats-bar">
        <div className="stat-card">
          <div className="stat-icon-wrap stat-blue">
            <BarChartIcon size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-number">{completedTasks}/{totalTasks}</span>
            <span className="stat-label">Tasks Completed ({completionRate}%)</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-purple">
            <CalendarIcon size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-number">{totalHours}h</span>
            <span className="stat-label">Planned Schedule</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-green">
            <FolderIcon size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-number">{activeProjectsCount}</span>
            <span className="stat-label">Active Projects</span>
          </div>
        </div>
      </div>
    </header>
  );
}
