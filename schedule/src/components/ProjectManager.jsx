import { useState } from 'react';
import { CloseIcon, PlusIcon, EditIcon, TrashIcon, TagIcon, FolderIcon } from './Icons';

export default function ProjectManager({
  isOpen,
  onClose,
  projects,
  categories = [],
  onOpenNewProject,
  onEditProject,
  onDeleteProject,
  onOpenNewCategory,
  onEditCategory,
  onDeleteCategory,
}) {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'categories'

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-panel modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Categories &amp; Projects Manager</h3>
            <p className="modal-subtitle">
              Manage categories, project allocations, and color codes
            </p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        <div className="project-manager-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FolderIcon size={16} /> Projects ({projects.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <TagIcon size={16} /> Categories ({categories.length})
          </button>
        </div>

        <div className="project-manager-content">
          {activeTab === 'projects' ? (
            <>
              <div className="manager-toolbar">
                <span className="project-count-pill">{projects.length} Total Projects</span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    onClose();
                    onOpenNewProject();
                  }}
                >
                  <PlusIcon size={16} /> New Project
                </button>
              </div>

              <div className="projects-grid">
                {projects.map((proj) => {
                  const cat = categories.find((c) => c.id === proj.categoryId);
                  return (
                    <div
                      key={proj.id}
                      className="project-card"
                      style={{ borderLeft: `4px solid ${proj.color}` }}
                    >
                      <div className="project-card-header">
                        <div className="project-title-area">
                          <span
                            className="project-color-badge"
                            style={{ backgroundColor: proj.color }}
                          />
                          <h4 className="project-name">{proj.name}</h4>
                        </div>
                        <span className={`status-pill status-${proj.status}`}>
                          {proj.status}
                        </span>
                      </div>

                      {cat && (
                        <div className="project-card-cat-tag">
                          <TagIcon size={12} /> {cat.name}
                        </div>
                      )}

                      <p className="project-description">
                        {proj.description || 'No description provided'}
                      </p>

                      <div className="project-card-footer">
                        <div className="project-stats">
                          <span className="stat-label">Target:</span>
                          <strong className="stat-value">{proj.targetHours || 8}h / week</strong>
                        </div>

                        <div className="project-card-actions">
                          <button
                            type="button"
                            className="icon-btn-subtle"
                            title="Edit Project"
                            onClick={() => {
                              onClose();
                              onEditProject(proj);
                            }}
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn-subtle text-danger"
                            title="Delete Project"
                            onClick={() => {
                              if (confirm(`Delete project "${proj.name}"?`)) {
                                onDeleteProject(proj.id);
                              }
                            }}
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {projects.length === 0 && (
                  <div className="empty-category-notice" style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>No projects created yet.</p>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        onClose();
                        onOpenNewProject();
                      }}
                    >
                      <PlusIcon size={14} /> Create Your First Project
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="manager-toolbar">
                <span className="project-count-pill">{categories.length} Total Categories</span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    onClose();
                    onOpenNewCategory();
                  }}
                >
                  <PlusIcon size={16} /> New Category
                </button>
              </div>

              <div className="categories-grid">
                {categories.map((cat) => {
                  const catProjects = projects.filter((p) => p.categoryId === cat.id);
                  return (
                    <div
                      key={cat.id}
                      className="category-card"
                      style={{ borderLeft: `4px solid ${cat.color}` }}
                    >
                      <div className="category-card-header">
                        <div className="category-title-area">
                          <span
                            className="category-color-badge"
                            style={{ backgroundColor: cat.color }}
                          />
                          <h4 className="category-name">{cat.name}</h4>
                        </div>
                        <span className="cat-count-badge">
                          {catProjects.length} {catProjects.length === 1 ? 'project' : 'projects'}
                        </span>
                      </div>

                      <div className="category-card-footer">
                        <div className="project-card-actions">
                          <button
                            type="button"
                            className="icon-btn-subtle"
                            title="Edit Category"
                            onClick={() => {
                              onClose();
                              onEditCategory(cat);
                            }}
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn-subtle text-danger"
                            title="Delete Category"
                            onClick={() => {
                              if (confirm(`Delete category "${cat.name}"?`)) {
                                onDeleteCategory(cat.id);
                              }
                            }}
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {categories.length === 0 && (
                  <div className="empty-category-notice" style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>No categories created yet.</p>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        onClose();
                        onOpenNewCategory();
                      }}
                    >
                      <PlusIcon size={14} /> Create Your First Category
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
