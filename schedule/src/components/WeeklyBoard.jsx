import { useState } from 'react';
import { CheckIcon, ClockIcon, PlusIcon, EditIcon, TrashIcon } from './Icons';
import { PRIORITIES } from '../data/initialData';

export default function WeeklyBoard({
  daysOfWeek,
  tasks,
  projects,
  selectedProjectId,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onAddTaskForDay,
}) {
  const [selectedMobileDayIndex, setSelectedMobileDayIndex] = useState(() => {
    const todayIdx = daysOfWeek.findIndex((d) => d.isToday);
    return todayIdx >= 0 ? todayIdx : 0;
  });
  const [showAllDaysOnMobile, setShowAllDaysOnMobile] = useState(false);

  return (
    <div className="weekly-board-container" role="region" aria-label="Weekly Schedule Board">
      {/* Mobile Day Selector (shown on phones) */}
      <div className="mobile-days-nav">
        <div className="mobile-days-tabs-scroll">
          {daysOfWeek.map((day, idx) => {
            const isDaySelected = !showAllDaysOnMobile && selectedMobileDayIndex === idx;
            const dayTaskCount = tasks.filter((t) => t.dateStr === day.dateStr).length;

            return (
              <button
                key={day.dateStr}
                type="button"
                className={`mobile-day-tab ${isDaySelected ? 'active' : ''} ${day.isToday ? 'is-today' : ''}`}
                onClick={() => {
                  setShowAllDaysOnMobile(false);
                  setSelectedMobileDayIndex(idx);
                }}
              >
                <span className="tab-day-short">{day.shortName}</span>
                <span className="tab-day-num">{day.displayDate.split(' ')[1]}</span>
                {dayTaskCount > 0 && (
                  <span className="tab-task-count-pill" title={`${dayTaskCount} tasks`}>
                    {dayTaskCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={`mobile-all-days-btn ${showAllDaysOnMobile ? 'active' : ''}`}
          onClick={() => setShowAllDaysOnMobile((prev) => !prev)}
        >
          {showAllDaysOnMobile ? 'Single Day' : 'All 7 Days'}
        </button>
      </div>

      <div className={`weekly-board-grid ${!showAllDaysOnMobile ? 'mobile-single-day-mode' : ''}`}>
        {daysOfWeek.map((day, idx) => {
          const isHiddenOnMobile = !showAllDaysOnMobile && selectedMobileDayIndex !== idx;

          // Tasks for this specific date
          let dayTasks = tasks.filter((t) => t.dateStr === day.dateStr);
          if (selectedProjectId) {
            dayTasks = dayTasks.filter((t) => t.projectId === selectedProjectId);
          }

          const completedCount = dayTasks.filter((t) => t.completed).length;
          const dayHours = dayTasks.reduce(
            (sum, t) => sum + (Number(t.estimatedHours) || 0),
            0
          );

          // Extract unique projects active on this day
          const dayProjectIds = Array.from(new Set(dayTasks.map((t) => t.projectId)));
          const dayProjects = dayProjectIds
            .map((id) => projects.find((p) => p.id === id))
            .filter(Boolean);

          return (
            <div
              key={day.dateStr}
              className={`day-column ${day.isToday ? 'is-today' : ''} ${day.isWeekend ? 'is-weekend' : ''} ${
                isHiddenOnMobile ? 'mobile-hidden' : ''
              }`}
            >
              <div className="day-header">
                <div className="day-title-row">
                  <span className="day-name">{day.dayName}</span>
                  {day.isToday && <span className="today-badge">Today</span>}
                </div>
                <div className="day-meta-row">
                  <span className="day-date">{day.displayDate}</span>
                  <div className="day-meta-badges">
                    {dayTasks.length > 0 && (
                      <span className="day-task-count-badge" title={`${dayTasks.length} tasks`}>
                        {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                      </span>
                    )}
                    {dayHours > 0 && (
                      <span className="day-hours-sum">{dayHours}h</span>
                    )}
                  </div>
                </div>

                {/* Day's Projects Chips */}
                {dayProjects.length > 0 && (
                  <div className="day-projects-summary-strip">
                    {dayProjects.map((dp) => (
                      <span
                        key={dp.id}
                        className="day-project-chip"
                        style={{
                          backgroundColor: `${dp.color}15`,
                          color: dp.color,
                          borderLeft: `2.5px solid ${dp.color}`,
                        }}
                        title={`Project on ${day.dayName}: ${dp.name}`}
                      >
                        <span className="dot" style={{ backgroundColor: dp.color }} />
                        {dp.name}
                      </span>
                    ))}
                  </div>
                )}

                {dayTasks.length > 0 && (
                  <div className="day-progress-mini">
                    <div
                      className="day-progress-fill"
                      style={{
                        width: `${Math.round((completedCount / dayTasks.length) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="day-tasks-list">
                {dayTasks.map((task) => {
                  const proj = projects.find((p) => p.id === task.projectId);
                  const priorityObj = PRIORITIES.find((pr) => pr.id === task.priority) || PRIORITIES[1];

                  return (
                    <div
                      key={task.id}
                      className={`task-card ${task.completed ? 'is-completed' : ''}`}
                      style={{
                        borderLeftColor: proj?.color || 'var(--accent)',
                      }}
                    >
                      <div className="task-top">
                        <button
                          type="button"
                          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                          onClick={() => onToggleComplete(task.id)}
                          aria-label={task.completed ? 'Mark incomplete' : 'Mark completed'}
                        >
                          {task.completed && <CheckIcon size={14} />}
                        </button>

                        <div className="task-title-area">
                          <span className="task-title">{task.title}</span>
                        </div>

                        <div className="task-actions-hover">
                          <button
                            type="button"
                            className="task-btn-action"
                            title="Edit task"
                            onClick={() => onEditTask(task)}
                          >
                            <EditIcon size={14} />
                          </button>
                          <button
                            type="button"
                            className="task-btn-action text-danger"
                            title="Delete task"
                            onClick={() => {
                              if (confirm('Delete this task?')) {
                                onDeleteTask(task.id);
                              }
                            }}
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </div>

                      {task.notes && (
                        <p className="task-notes-preview">{task.notes}</p>
                      )}

                      <div className="task-bottom">
                        {proj && (
                          <span
                            className="task-project-pill"
                            style={{
                              color: proj.color,
                              backgroundColor: `${proj.color}15`,
                            }}
                          >
                            <span
                              className="color-dot"
                              style={{ backgroundColor: proj.color }}
                            />
                            {proj.name}
                          </span>
                        )}

                        <div className="task-tags-right">
                          {task.timeSlot && (
                            <span className="time-badge" title="Scheduled time">
                              <ClockIcon size={12} /> {task.timeSlot}
                            </span>
                          )}

                          <span
                            className="priority-badge"
                            style={{
                              backgroundColor: priorityObj.badgeBg,
                              color: priorityObj.badgeText,
                            }}
                          >
                            {task.priority}
                          </span>

                          {task.estimatedHours && (
                            <span className="hours-badge">
                              {task.estimatedHours}h
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {dayTasks.length === 0 && (
                  <div className="empty-day-placeholder">
                    <span className="empty-text">No tasks</span>
                  </div>
                )}
              </div>

              <div className="day-footer">
                <button
                  type="button"
                  className="add-task-day-btn"
                  onClick={() => onAddTaskForDay(day.dateStr)}
                >
                  <PlusIcon size={14} /> Add Task
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
