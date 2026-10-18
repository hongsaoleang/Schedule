import { useState } from 'react';
import { CloseIcon, CopyIcon } from './Icons';
import { addWeeksToMonday, formatWeekRange, getDaysOfWeek } from '../utils/dateUtils';

export default function CarryOverModal({
  isOpen,
  onClose,
  currentMonday,
  tasksForCurrentWeek,
  projects,
  onCarryOver,
}) {
  const [targetOffset, setTargetOffset] = useState(1); // 1 = Next Week
  const [selectedTaskIds, setSelectedTaskIds] = useState(() => {
    // Default select all incomplete tasks
    return tasksForCurrentWeek.filter((t) => !t.completed).map((t) => t.id);
  });
  const [targetDayIndex, setTargetDayIndex] = useState(0); // 0 = Monday

  if (!isOpen) return null;

  const incompleteTasks = tasksForCurrentWeek.filter((t) => !t.completed);
  const targetMonday = addWeeksToMonday(currentMonday, targetOffset);
  const targetWeekRange = formatWeekRange(targetMonday);
  const targetDays = getDaysOfWeek(targetMonday);

  const toggleTask = (taskId) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTaskIds(incompleteTasks.map((t) => t.id));
  };

  const handleDeselectAll = () => {
    setSelectedTaskIds([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTaskIds.length === 0) return;

    const chosenTargetDate = targetDays[targetDayIndex].dateStr;
    const tasksToMove = tasksForCurrentWeek.filter((t) => selectedTaskIds.includes(t.id));

    onCarryOver({
      tasks: tasksToMove,
      targetDateStr: chosenTargetDate,
      targetMonday,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Plan for Another Week</h3>
            <p className="modal-subtitle">
              Carry over incomplete tasks or schedule deliverables into upcoming weeks
            </p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Select Target Week to Plan</label>
            <div className="week-target-selector">
              <button
                type="button"
                className={`pill-btn ${targetOffset === 1 ? 'active' : ''}`}
                onClick={() => setTargetOffset(1)}
              >
                Next Week
              </button>
              <button
                type="button"
                className={`pill-btn ${targetOffset === 2 ? 'active' : ''}`}
                onClick={() => setTargetOffset(2)}
              >
                In 2 Weeks
              </button>
              <button
                type="button"
                className={`pill-btn ${targetOffset === 3 ? 'active' : ''}`}
                onClick={() => setTargetOffset(3)}
              >
                In 3 Weeks
              </button>
            </div>
            <div className="target-week-preview">
              Target: <strong>{targetWeekRange}</strong>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="target-day">Schedule onto which day?</label>
            <select
              id="target-day"
              value={targetDayIndex}
              onChange={(e) => setTargetDayIndex(Number(e.target.value))}
            >
              {targetDays.map((d) => (
                <option key={d.dayIndex} value={d.dayIndex}>
                  {d.dayName} ({d.displayDate})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <div className="task-selection-header">
              <label>
                Select Tasks to Move ({selectedTaskIds.length}/{incompleteTasks.length})
              </label>
              <div className="selection-quick-links">
                <button type="button" className="text-btn" onClick={handleSelectAll}>
                  Select All
                </button>
                <span>•</span>
                <button type="button" className="text-btn" onClick={handleDeselectAll}>
                  Clear
                </button>
              </div>
            </div>

            {incompleteTasks.length === 0 ? (
              <div className="empty-tasks-callout">
                <p>🎉 All tasks for this week are completed!</p>
                <small>You can switch directly to next week using the week navigator to start fresh.</small>
              </div>
            ) : (
              <div className="task-carryover-list">
                {incompleteTasks.map((task) => {
                  const proj = projects.find((p) => p.id === task.projectId);
                  const isChecked = selectedTaskIds.includes(task.id);
                  return (
                    <label key={task.id} className={`carryover-item ${isChecked ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleTask(task.id)}
                      />
                      <div className="carryover-content">
                        <div className="carryover-title">{task.title}</div>
                        <div className="carryover-meta">
                          {proj && (
                            <span
                              className="project-dot-badge"
                              style={{
                                color: proj.color,
                                backgroundColor: `${proj.color}18`,
                              }}
                            >
                              <span
                                className="dot"
                                style={{ backgroundColor: proj.color }}
                              />
                              {proj.name}
                            </span>
                          )}
                          <span className="task-hours-badge">{task.estimatedHours}h</span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={selectedTaskIds.length === 0}
            >
              <CopyIcon /> Roll Over Selected to {targetDays[targetDayIndex].dayName}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
