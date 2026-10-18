import { useState, useMemo } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  PlusIcon,
  ClockIcon,
  CheckIcon,
  CloseIcon,
  EditIcon,
  TrashIcon,
} from './Icons';
import {
  getMonthCalendarDays,
  formatMonthYear,
  formatDateToISO,
  getMondayOfWeek,
} from '../utils/dateUtils';
import { PRIORITIES } from '../data/initialData';
import { toRoman } from '../utils/romanUtils';

export default function MonthCalendarView({
  projects = [],
  tasks = [],
  selectedProjectId,
  onSelectProjectFilter,
  onAddTaskForDay,
  onEditTask,
  onDeleteTask,
  onToggleTaskComplete,
  onJumpToWeek,
}) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDayDateStr, setSelectedDayDateStr] = useState(formatDateToISO(today));
  const [isDayDrawerOpen, setIsDayDrawerOpen] = useState(false);

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDayDateStr(formatDateToISO(now));
  };

  // Calendar cells
  const calendarCells = useMemo(() => {
    return getMonthCalendarDays(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Tasks mapped by dateStr
  const tasksByDate = useMemo(() => {
    const map = new Map();
    tasks.forEach((t) => {
      if (!map.has(t.dateStr)) map.set(t.dateStr, []);
      map.get(t.dateStr).push(t);
    });
    return map;
  }, [tasks]);

  // Get project summaries for a specific day
  const getDayProjectsSummary = (dateStr) => {
    let dayTasks = tasksByDate.get(dateStr) || [];
    if (selectedProjectId) {
      dayTasks = dayTasks.filter((t) => t.projectId === selectedProjectId);
    }
    if (dayTasks.length === 0) return [];

    // Group tasks by project
    const grouped = new Map();
    dayTasks.forEach((t) => {
      const pId = t.projectId || 'unassigned';
      if (!grouped.has(pId)) {
        grouped.set(pId, {
          projectId: pId,
          tasks: [],
          totalHours: 0,
          completedCount: 0,
        });
      }
      const entry = grouped.get(pId);
      entry.tasks.push(t);
      entry.totalHours += Number(t.estimatedHours) || 0;
      if (t.completed) entry.completedCount += 1;
    });

    return Array.from(grouped.values()).map((entry) => {
      const proj = projects.find((p) => p.id === entry.projectId) || {
        id: entry.projectId,
        name: 'Unassigned',
        color: '#94a3b8',
      };
      return {
        ...entry,
        project: proj,
      };
    });
  };

  // Currently selected day details
  const selectedDayTasks = (tasksByDate.get(selectedDayDateStr) || []).filter(
    (t) => !selectedProjectId || t.projectId === selectedProjectId
  );
  const selectedDayProjectSummaries = getDayProjectsSummary(selectedDayDateStr);

  const handleDayClick = (dateStr) => {
    setSelectedDayDateStr(dateStr);
    setIsDayDrawerOpen(true);
  };

  const handleJumpToWeekFromDay = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const mondayStr = getMondayOfWeek(dateObj);
    onJumpToWeek(mondayStr);
  };

  const weekDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="calendar-view-container">
      {/* Month Navigation & Toolbar */}
      <div className="calendar-toolbar">
        <div className="calendar-nav-left">
          <button
            type="button"
            className="btn btn-outline nav-arrow-btn"
            onClick={handlePrevMonth}
            title="Previous Month"
            aria-label="Previous Month"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleToday}
          >
            <CalendarIcon size={16} /> Today
          </button>
          <button
            type="button"
            className="btn btn-outline nav-arrow-btn"
            onClick={handleNextMonth}
            title="Next Month"
            aria-label="Next Month"
          >
            <ChevronRightIcon size={18} />
          </button>

          <h2 className="calendar-month-title">
            {formatMonthYear(currentYear, currentMonth)}
          </h2>
        </div>

        <div className="calendar-nav-right">
          <div className="project-legend-pills">
            {projects.map((proj) => {
              const isFiltered = selectedProjectId === proj.id;
              return (
                <button
                  key={proj.id}
                  type="button"
                  className={`legend-pill ${isFiltered ? 'active' : ''}`}
                  style={{
                    '--proj-color': proj.color,
                    borderColor: isFiltered ? proj.color : 'transparent',
                  }}
                  onClick={() => onSelectProjectFilter(isFiltered ? null : proj.id)}
                  title={isFiltered ? 'Clear filter' : `Filter calendar by ${proj.name}`}
                >
                  <span className="dot" style={{ backgroundColor: proj.color }} />
                  <span className="name">{proj.name}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onAddTaskForDay(selectedDayDateStr || formatDateToISO(new Date()))}
          >
            <PlusIcon size={16} /> Add Task
          </button>
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div className="month-calendar-grid">
        {/* Day-of-week Headers */}
        <div className="calendar-week-header-row">
          {weekDayLabels.map((lbl, idx) => (
            <div key={lbl} className={`calendar-col-header ${idx >= 5 ? 'is-weekend' : ''}`}>
              {lbl}
            </div>
          ))}
        </div>

        {/* 35 or 42 Day Cells */}
        <div className="calendar-cells-grid">
          {calendarCells.map((cell) => {
            const projectSummaries = getDayProjectsSummary(cell.dateStr);
            const isSelected = selectedDayDateStr === cell.dateStr;

            return (
              <div
                key={cell.dateStr}
                className={`calendar-day-cell ${
                  !cell.isCurrentMonth ? 'is-other-month' : ''
                } ${cell.isToday ? 'is-today' : ''} ${cell.isWeekend ? 'is-weekend' : ''} ${
                  isSelected ? 'is-selected' : ''
                }`}
                onClick={() => handleDayClick(cell.dateStr)}
              >
                <div className="cell-top-bar">
                  <span className={`cell-day-number ${cell.isToday ? 'today-pill' : ''}`}>
                    {cell.dayNumber}
                  </span>

                  <button
                    type="button"
                    className="cell-add-btn"
                    title={`Add project task on ${cell.dateStr}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddTaskForDay(cell.dateStr);
                    }}
                  >
                    <PlusIcon size={13} />
                  </button>
                </div>

                {/* Prominent Project Badges for this day */}
                <div className="cell-projects-list">
                  {projectSummaries.slice(0, 2).map((summary) => (
                    <div
                      key={summary.projectId}
                      className="cell-project-chip"
                      style={{
                        backgroundColor: `${summary.project.color}18`,
                        borderLeftColor: summary.project.color,
                        color: summary.project.color,
                      }}
                      title={`${summary.project.name}: ${summary.tasks.length} deliverables (${summary.totalHours}h)`}
                    >
                      <span className="chip-dot" style={{ backgroundColor: summary.project.color }} />
                      <span className="chip-name">{summary.project.name}</span>
                      <span className="chip-count">{toRoman(summary.tasks.length)}</span>
                    </div>
                  ))}
                  {projectSummaries.length > 2 && (
                    <span className="cell-more-chip">
                      +{projectSummaries.length - 2} more
                    </span>
                  )}
                </div>

                {/* Mobile Dots View (optimized for phones) */}
                <div className="cell-mobile-dots" aria-hidden="true">
                  {projectSummaries.slice(0, 3).map((summary) => (
                    <span
                      key={summary.projectId}
                      className="mobile-dot"
                      style={{ backgroundColor: summary.project.color }}
                    />
                  ))}
                  {projectSummaries.length > 3 && (
                    <span className="mobile-dot-more">+</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Selected Day Agenda (shown directly on phone screens) */}
      <div className="calendar-mobile-agenda">
        <div className="mobile-agenda-header">
          <div>
            <h3 className="mobile-agenda-title">
              {selectedDayDateStr}
            </h3>
            <span className="mobile-agenda-subtitle">
              {selectedDayProjectSummaries.length} {selectedDayProjectSummaries.length === 1 ? 'project' : 'projects'} • {toRoman(selectedDayTasks.length)} tasks
            </span>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onAddTaskForDay(selectedDayDateStr)}
          >
            <PlusIcon size={14} /> Add Task
          </button>
        </div>

        {selectedDayProjectSummaries.length > 0 ? (
          <div className="mobile-agenda-projects">
            {selectedDayProjectSummaries.map((s) => (
              <div
                key={s.projectId}
                className="mobile-agenda-proj-card"
                style={{ borderLeftColor: s.project.color }}
              >
                <div className="mobile-agenda-proj-top">
                  <span className="dot" style={{ backgroundColor: s.project.color }} />
                  <strong>{s.project.name}</strong>
                  <span className="hours">{toRoman(s.tasks.length)} tasks • {s.totalHours}h</span>
                </div>
                <div className="mobile-agenda-tasks">
                  {s.tasks.map((task) => (
                    <div key={task.id} className="mobile-agenda-task-item">
                      <button
                        type="button"
                        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                        onClick={() => onToggleTaskComplete(task.id)}
                      >
                        {task.completed && <CheckIcon size={12} />}
                      </button>
                      <span className={`task-title ${task.completed ? 'is-done' : ''}`}>
                        {task.title}
                      </span>
                      {task.timeSlot && <span className="time-badge">{task.timeSlot}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mobile-agenda-empty">
            <span>No projects scheduled on {selectedDayDateStr}. Tap "+ Add Task" to plan.</span>
          </div>
        )}
      </div>

      {/* Day Details Side Drawer / Modal */}
      {isDayDrawerOpen && (
        <div className="modal-backdrop" onClick={() => setIsDayDrawerOpen(false)}>
          <div className="modal-panel day-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Day Project Schedule</h3>
                <p className="modal-subtitle">
                  {selectedDayDateStr} • {toRoman(selectedDayTasks.length)} total tasks
                </p>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setIsDayDrawerOpen(false)}
                aria-label="Close drawer"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="day-drawer-content">
              {/* Projects Breakdown for Selected Day */}
              <div className="drawer-projects-summary">
                <span className="drawer-section-label">Projects on this Day:</span>
                <div className="drawer-projects-pills">
                  {selectedDayProjectSummaries.map((s) => (
                    <span
                      key={s.projectId}
                      className="drawer-proj-pill"
                      style={{
                        backgroundColor: `${s.project.color}15`,
                        color: s.project.color,
                        border: `1px solid ${s.project.color}40`,
                      }}
                    >
                      <span className="dot" style={{ backgroundColor: s.project.color }} />
                      <strong>{s.project.name}</strong> ({toRoman(s.tasks.length)} tasks • {s.totalHours}h)
                    </span>
                  ))}
                  {selectedDayProjectSummaries.length === 0 && (
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                      No projects scheduled on this date.
                    </span>
                  )}
                </div>
              </div>

              {/* Tasks List */}
              <div className="drawer-tasks-list">
                {selectedDayTasks.map((task) => {
                  const proj = projects.find((p) => p.id === task.projectId);
                  const pr = PRIORITIES.find((item) => item.id === task.priority) || PRIORITIES[1];

                  return (
                    <div
                      key={task.id}
                      className={`drawer-task-card ${task.completed ? 'is-done' : ''}`}
                      style={{ borderLeftColor: proj?.color || 'var(--accent)' }}
                    >
                      <div className="drawer-task-main">
                        <button
                          type="button"
                          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                          onClick={() => onToggleTaskComplete(task.id)}
                        >
                          {task.completed && <CheckIcon size={14} />}
                        </button>
                        <div className="drawer-task-info">
                          <span className="drawer-task-title">{task.title}</span>
                          <div className="drawer-task-meta">
                            {proj && (
                              <span
                                className="project-dot-badge"
                                style={{
                                  color: proj.color,
                                  backgroundColor: `${proj.color}15`,
                                }}
                              >
                                <span className="dot" style={{ backgroundColor: proj.color }} />
                                {proj.name}
                              </span>
                            )}
                            {task.timeSlot && (
                              <span className="time-badge">
                                <ClockIcon size={12} /> {task.timeSlot}
                              </span>
                            )}
                            <span
                              className="priority-badge"
                              style={{
                                backgroundColor: pr.badgeBg,
                                color: pr.badgeText,
                              }}
                            >
                              {task.priority}
                            </span>
                            <span className="hours-badge">{task.estimatedHours}h</span>
                          </div>
                        </div>
                      </div>

                      <div className="drawer-task-actions">
                        <button
                          type="button"
                          className="icon-btn-subtle"
                          title="Edit task"
                          onClick={() => {
                            setIsDayDrawerOpen(false);
                            onEditTask(task);
                          }}
                        >
                          <EditIcon size={15} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn-subtle text-danger"
                          title="Delete task"
                          onClick={() => {
                            if (confirm('Delete this task?')) {
                              onDeleteTask(task.id);
                            }
                          }}
                        >
                          <TrashIcon size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setIsDayDrawerOpen(false);
                  handleJumpToWeekFromDay(selectedDayDateStr);
                }}
              >
                Open in Weekly Planner
              </button>

              <div className="actions-right">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsDayDrawerOpen(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setIsDayDrawerOpen(false);
                    onAddTaskForDay(selectedDayDateStr);
                  }}
                >
                  <PlusIcon size={16} /> Add Task for Day
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
