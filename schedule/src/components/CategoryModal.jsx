import { useState } from 'react';
import { CloseIcon, TrashIcon } from './Icons';
import { PROJECT_COLORS } from '../data/initialData';

function CategoryModalForm({
  onClose,
  onSave,
  onDelete,
  categoryToEdit,
}) {
  const [name, setName] = useState(categoryToEdit?.name || '');
  const [color, setColor] = useState(
    categoryToEdit?.color || PROJECT_COLORS[0].hex
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: categoryToEdit ? categoryToEdit.id : `cat-${Date.now()}`,
      name: name.trim(),
      color,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{categoryToEdit ? 'Edit Category' : 'Create New Category'}</h3>
            <p className="modal-subtitle">
              Group your projects by domain, client, or team category
            </p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="cat-name">Category Name *</label>
            <input
              id="cat-name"
              type="text"
              required
              placeholder="e.g., Development, Client Work, Marketing, Personal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Category Color Tag</label>
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

          <div className="modal-actions">
            {categoryToEdit && onDelete && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  if (confirm(`Delete category "${categoryToEdit.name}"? Projects inside it will become uncategorized.`)) {
                    onDelete(categoryToEdit.id);
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
                {categoryToEdit ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoryModal(props) {
  if (!props.isOpen) return null;
  const key = props.categoryToEdit ? props.categoryToEdit.id : 'new-cat';
  return <CategoryModalForm key={key} {...props} />;
}
