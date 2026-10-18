import { useState } from 'react';
import { CloseIcon, TrashIcon } from './Icons';
import { PROJECT_COLORS, PRIORITIES } from '../data/initialData';

function ProjectModalForm({
  onClose,
  onSave,
  onDelete,
  projectToEdit,
  categories = [],
  defaultCategoryId = '',
}) {
  const [name, setName] = useState(projectToEdit?.name || '');
  const [categoryId, setCategoryId] = useState(
    projectToEdit?.categoryId || defaultCategoryId || (categories[0]?.id || '')
  );
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [color, setColor] = useState(
    projectToEdit?.color || PROJECT_COLORS[0].hex
  );
  const [priority, setPriority] = useState(projectToEdit?.priority || 'high');
  const [targetHours, setTargetHours] = useState(
    projectToEdit?.targetHours ? String(projectToEdit.targetHours) : '10'
  );
  const [status, setStatus] = useState(projectToEdit?.status || 'in-progress');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: projectToEdit ? projectToEdit.id : `proj-${Date.now()}`,
      categoryId: categoryId || (categories[0]?.id || ''),
      name: name.trim(),
      description: description.trim(),
      color,
      priority,
      targetHours: parseFloat(targetHours) || 8,
      status,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{projectToEdit ? 'Edit Project' : 'Create New Project'}</h3>
            <p className="modal-subtitle">
              Define projects and assign them to a category
            </p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="project-name">Project Name *</label>
            <input
              id="project-name"
              type="text"
              required
              placeholder="e.g., Mobile App Launch or Customer Portal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-category">Category</label>
            <select
              id="project-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              {categories.length === 0 && (
                <option value="">General (No Category)</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="project-desc">Project Goal / Description</label>
            <textarea
              id="project-desc"
              rows={2}
              placeholder="What are the key goals, deliverables or milestones?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Color Theme</label>
            <div className="color-picker-grid">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`color-swatch ${color === c.hex ? 'selected' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setColor(c.hex)}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="proj-priority">Priority</label>
              <select
                id="proj-priority"
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

            <div className="form-group">
              <label htmlFor="proj-status">Status</label>
              <select
                id="proj-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="in-progress">In Progress</option>
                <option value="planning">Planning</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="proj-hours">Target Weekly Hours</label>
            <input
              id="proj-hours"
              type="number"
              min="1"
              max="80"
              value={targetHours}
              onChange={(e) => setTargetHours(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            {projectToEdit && onDelete && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  if (confirm('Delete this project and remove its tag from tasks?')) {
                    onDelete(projectToEdit.id);
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
                {projectToEdit ? 'Save Project' : 'Create Project'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectModal(props) {
  if (!props.isOpen) return null;
  const key = props.projectToEdit ? props.projectToEdit.id : `new-${props.defaultCategoryId || ''}`;
  return <ProjectModalForm key={key} {...props} />;
}
