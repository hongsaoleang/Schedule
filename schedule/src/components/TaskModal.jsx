import { useState } from 'react';
import { CloseIcon, TrashIcon } from './Icons';
import { PRIORITIES } from '../data/initialData';

function TaskModalForm({
  onClose,
  onSave,
  onDelete,
  taskToEdit,
  projects,
  defaultDateStr,
  daysOfWeek = [],
}) {
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [projectId, setProjectId] = useState(
    taskToEdit?.projectId || (projects[0]?.id || '')
  );
  const [dateStr, setDateStr] = useState(
    taskToEdit?.dateStr || defaultDateStr || (daysOfWeek[0]?.dateStr || '')
  );
  const [timeSlot, setTimeSlot] = useState(
    taskToEdit ? (taskToEdit.timeSlot || '') : '09:00 - 11:00'
  );
  const [estimatedHours, setEstimatedHours] = useState(
    taskToEdit?.estimatedHours != null && taskToEdit.estimatedHours !== ''
      ? String(taskToEdit.estimatedHours)
      : ''
  );
  const [priority, setPriority] = useState(taskToEdit?.priority || 'medium');
  const [notes, setNotes] = useState(taskToEdit?.notes || '');
  const [completed, setCompleted] = useState(Boolean(taskToEdit?.completed));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedHours = parseFloat(estimatedHours);
    const validHours = !isNaN(parsedHours) && parsedHours > 0 ? parsedHours : null;

    onSave({
      id: taskToEdit ? taskToEdit.id : `task-${Date.now()}`,
      title: title.trim(),
      projectId: projectId || (projects[0]?.id || ''),
      dateStr,
      timeSlot: timeSlot.trim(),
      estimatedHours: validHours,
      priority,
      notes: notes.trim(),
      completed,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{taskToEdit ? 'Edit Scheduled Task' : 'Add New Task'}</h3>
            <p className="modal-subtitle">
              Schedule your deliverables for the week
            </p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title">Task Title *</label>
            <input
              id="task-title"
              type="text"
              required
              placeholder="e.g., Build schedule dashboard UI component"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-project">{projects.length > 0 ? 'Project *' : 'Project (Optional)'}</label>
              <select
                id="task-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required={projects.length > 0}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
                {projects.length === 0 && (
                  <option value="">No projects yet (General / Unassigned)</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {PRIORITIES.map((pr) => (
                  <option key={pr.id} value={pr.id}>
                    {pr.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-date">Scheduled Day *</label>
              <select
                id="task-date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                required
              >
                {daysOfWeek.map((day) => (
                  <option key={day.dateStr} value={day.dateStr}>
                    {day.dayName} ({day.displayDate}) {day.isToday ? '— Today' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <div className="label-with-hint">
                <label htmlFor="task-hours">Estimated Hours</label>
                <span className="field-hint">Custom</span>
              </div>
              <input
                id="task-hours"
                type="number"
                step="any"
                min="0"
                placeholder="e.g. 2, 1.5, 0.5..."
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
              />
              <div className="quick-hours-presets">
                {[0.5, 1, 1.5, 2, 3, 4, 6].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    className={`hour-preset-chip ${estimatedHours === String(hrs) ? 'active' : ''}`}
                    onClick={() => setEstimatedHours(String(hrs))}
                  >
                    {hrs}h
                  </button>
                ))}
                {estimatedHours && (
                  <button
                    type="button"
                    className="hour-preset-clear"
                    onClick={() => setEstimatedHours('')}
                    title="Clear hours"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-timeslot">Time Slot (Optional)</label>
            <input
              id="task-timeslot"
              type="text"
              placeholder="e.g., 09:30 - 11:30 or Afternoon"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-notes">Notes / Details</label>
            <textarea
              id="task-notes"
              rows={2}
              placeholder="Key notes, links, or acceptance criteria..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {taskToEdit && (
            <div className="form-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                />
                Mark as Completed
              </label>
            </div>
          )}

          <div className="modal-actions">
            {taskToEdit && onDelete && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  if (confirm('Delete this task?')) {
                    onDelete(taskToEdit.id);
                    onClose();
                  }
                }}
              >
                <TrashIcon /> Delete
              </button>
            )}

            <div className="actions-right">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {taskToEdit ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TaskModal(props) {
  if (!props.isOpen) return null;
  const key = props.taskToEdit ? props.taskToEdit.id : `new-${props.defaultDateStr || ''}`;
  return <TaskModalForm key={key} {...props} />;
}
