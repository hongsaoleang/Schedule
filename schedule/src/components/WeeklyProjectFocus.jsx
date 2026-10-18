import { useState } from 'react';
import {
  PlusIcon,
  FolderIcon,
  TagIcon,
  EditIcon,
  TrashIcon,
} from './Icons';
import { PROJECT_COLORS } from '../data/initialData';
import { toRoman } from '../utils/romanUtils';

export default function WeeklyProjectFocus({
  categories = [],
  projects = [],
  tasksForWeek = [],
  selectedProjectId,
  onSelectProjectFilter,
  onAddTaskForProject,
  onOpenNewCategoryModal,
  onEditCategory,
  onDeleteCategory,
  onQuickAddCategory,
  onOpenNewProjectModal,
  onEditProject,
  onDeleteProject,
  onQuickAddProject,
}) {
  // Local state for quick inline category input
  const [quickCategoryName, setQuickCategoryName] = useState('');
  // Local state for quick inline project input per category
  const [quickProjectInputs, setQuickProjectInputs] = useState({});

  const handleQuickAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!quickCategoryName.trim()) return;
    const randomColor = PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)].hex;
    onQuickAddCategory({
      name: quickCategoryName.trim(),
      color: randomColor,
    });
    setQuickCategoryName('');
  };

  const handleQuickAddProjectSubmit = (e, categoryId) => {
    if (e && e.preventDefault) e.preventDefault();
    const projName = quickProjectInputs[categoryId];
    if (projName && projName.trim()) {
      onQuickAddProject({
        name: projName.trim(),
        categoryId,
      });
      setQuickProjectInputs((prev) => ({
        ...prev,
        [categoryId]: '',
      }));
    } else {
      onOpenNewProjectModal(categoryId);
    }
  };

  const handleProjectInputChange = (categoryId, value) => {
    setQuickProjectInputs((prev) => ({
      ...prev,
      [categoryId]: value,
    }));
  };

  // Compute metrics for each project
  const getProjectStats = (proj) => {
    const projTasks = tasksForWeek.filter((t) => t.projectId === proj.id);
    const completedTasks = projTasks.filter((t) => t.completed);
    const totalHours = projTasks.reduce((acc, t) => acc + (Number(t.estimatedHours) || 0), 0);
    const completedHours = completedTasks.reduce((acc, t) => acc + (Number(t.estimatedHours) || 0), 0);
    const percent = projTasks.length > 0 ? Math.round((completedTasks.length / projTasks.length) * 100) : 0;

    return {
      ...proj,
      tasksCount: projTasks.length,
      completedCount: completedTasks.length,
      totalHours,
      completedHours,
      percent,
    };
  };

  // Group projects by category
  const categorizedProjects = categories.map((cat) => {
    const catProjects = projects.filter((p) => p.categoryId === cat.id).map(getProjectStats);
    const catHours = catProjects.reduce((sum, p) => sum + p.totalHours, 0);
    return {
      ...cat,
      projects: catProjects,
      totalHours: catHours,
    };
  });

  // Projects with no valid category
  const uncategorizedProjects = projects
    .filter((p) => !p.categoryId || !categories.some((c) => c.id === p.categoryId))
    .map(getProjectStats);

  return (
    <section className="weekly-focus-section" aria-label="Weekly Projects and Categories Focus">
      {/* Header and Quick Category Creator */}
      <div className="section-header-row">
        <div className="section-title-wrap">
          <FolderIcon size={22} className="section-icon" />
          <div>
            <h2 className="section-title">Weekly Projects Focus</h2>
            <p className="section-subtitle">
              Input categories, organize your projects, and schedule weekly goals
            </p>
          </div>
          <span className="badge-count">{projects.length} Projects in {categories.length} Categories</span>
        </div>

        <div className="section-header-actions">
          {selectedProjectId && (
            <button
              type="button"
              className="text-btn clear-filter-btn"
              onClick={() => onSelectProjectFilter(null)}
            >
              Clear Project Filter
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onOpenNewProjectModal()}
          >
            <PlusIcon size={14} /> + Add Project
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenNewCategoryModal}
          >
            <PlusIcon size={16} /> + Add Category
          </button>
        </div>
      </div>

      {/* Quick Category Input Bar */}
      <form onSubmit={handleQuickAddCategorySubmit} className="quick-category-form">
        <div className="quick-category-input-wrap">
          <TagIcon size={16} className="input-icon" />
          <input
            type="text"
            className="quick-input"
            placeholder="Type category name (e.g. Design, Mobile, Research) or click + Add Category..."
            value={quickCategoryName}
            onChange={(e) => setQuickCategoryName(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => {
            if (quickCategoryName.trim()) {
              const randomColor = PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)].hex;
              onQuickAddCategory({
                name: quickCategoryName.trim(),
                color: randomColor,
              });
              setQuickCategoryName('');
            } else {
              onOpenNewCategoryModal();
            }
          }}
        >
          <PlusIcon size={16} /> Add Category
        </button>
      </form>

      {/* Category Groups */}
      <div className="category-groups-container">
        {categorizedProjects.map((category) => (
          <div key={category.id} className="category-group-block">
            {/* Category Header with CRUD Controls */}
            <div
              className="category-group-header"
              style={{ borderLeftColor: category.color }}
            >
              <div className="category-title-area">
                <span
                  className="category-color-badge"
                  style={{ backgroundColor: category.color }}
                />
                <h3 className="category-group-name">{category.name}</h3>
                <span className="category-meta-badge">
                  {category.projects.length} {category.projects.length === 1 ? 'project' : 'projects'} • {category.totalHours}h planned
                </span>
              </div>

              <div className="category-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenNewProjectModal(category.id)}
                  title={`Add a project to ${category.name}`}
                >
                  <PlusIcon size={14} /> + Add Project
                </button>
                <button
                  type="button"
                  className="icon-btn-subtle"
                  title={`Edit Category "${category.name}"`}
                  onClick={() => onEditCategory(category)}
                >
                  <EditIcon size={15} />
                </button>
                <button
                  type="button"
                  className="icon-btn-subtle text-danger"
                  title={`Delete Category "${category.name}"`}
                  onClick={() => {
                    if (confirm(`Delete category "${category.name}"? Projects inside will be kept.`)) {
                      onDeleteCategory(category.id);
                    }
                  }}
                >
                  <TrashIcon size={15} />
                </button>
              </div>
            </div>

            {/* Quick Project Input inside this Category */}
            <form
              onSubmit={(e) => handleQuickAddProjectSubmit(e, category.id)}
              className="quick-project-form"
            >
              <input
                type="text"
                className="quick-project-input"
                placeholder={`Type project name or click + Add Project...`}
                value={quickProjectInputs[category.id] || ''}
                onChange={(e) => handleProjectInputChange(category.id, e.target.value)}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={(e) => handleQuickAddProjectSubmit(e, category.id)}
              >
                <PlusIcon size={14} /> Add Project
              </button>
            </form>

            {/* Projects Grid in this Category */}
            <div className="category-projects-grid">
              {category.projects.map((proj) => {
                const isFiltered = selectedProjectId === proj.id;
                return (
                  <div
                    key={proj.id}
                    className={`focus-card ${isFiltered ? 'filter-active' : ''}`}
                    style={{ '--project-color': proj.color }}
                    onClick={() => onSelectProjectFilter(isFiltered ? null : proj.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSelectProjectFilter(isFiltered ? null : proj.id);
                      }
                    }}
                    title={isFiltered ? 'Click to show all projects' : `Filter schedule by ${proj.name}`}
                  >
                    <div className="focus-card-top">
                      <div className="focus-card-title">
                        <span
                          className="dot-indicator"
                          style={{ backgroundColor: proj.color }}
                        />
                        <span className="name">{proj.name}</span>
                      </div>

                      <div className="focus-card-header-btns" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="quick-add-task-btn"
                          title={`Schedule a task for ${proj.name}`}
                          onClick={() => onAddTaskForProject(proj.id)}
                        >
                          <PlusIcon size={13} /> Task
                        </button>
                        <button
                          type="button"
                          className="icon-btn-subtle"
                          title="Edit project"
                          onClick={() => onEditProject(proj)}
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn-subtle text-danger"
                          title="Delete project"
                          onClick={() => {
                            if (confirm(`Delete project "${proj.name}"?`)) {
                              onDeleteProject(proj.id);
                            }
                          }}
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>

                    {proj.description && (
                      <p className="focus-card-desc">{proj.description}</p>
                    )}

                    <div className="focus-card-metrics">
                      <div className="metric-item">
                        <span className="metric-val">
                          {proj.completedCount > 0 ? toRoman(proj.completedCount) : '0'}/{toRoman(proj.tasksCount)}
                        </span>
                        <span className="metric-lbl">Tasks Done</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-val">{proj.totalHours}h</span>
                        <span className="metric-lbl">Planned / {proj.targetHours || 8}h</span>
                      </div>
                    </div>

                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${proj.percent}%`,
                          backgroundColor: proj.color,
                        }}
                      />
                    </div>

                    <div className="progress-footer">
                      <span className="progress-pct">{proj.percent}% complete</span>
                      <span className={`status-pill status-${proj.status}`}>
                        {proj.status}
                      </span>
                      {isFiltered && <span className="filtering-tag">Filtering</span>}
                    </div>
                  </div>
                );
              })}

              {category.projects.length === 0 && (
                <div className="empty-category-notice">
                  <span>No projects in this category yet. Type a project name above to add one.</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Uncategorized projects section if any */}
        {uncategorizedProjects.length > 0 && (
          <div className="category-group-block uncategorized">
            <div className="category-group-header">
              <div className="category-title-area">
                <span className="category-color-badge" style={{ backgroundColor: '#94a3b8' }} />
                <h3 className="category-group-name">General / Uncategorized</h3>
                <span className="category-meta-badge">
                  {uncategorizedProjects.length} projects
                </span>
              </div>
            </div>

            <div className="category-projects-grid">
              {uncategorizedProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="focus-card"
                  style={{ '--project-color': proj.color }}
                  onClick={() => onSelectProjectFilter(selectedProjectId === proj.id ? null : proj.id)}
                >
                  <div className="focus-card-top">
                    <div className="focus-card-title">
                      <span className="dot-indicator" style={{ backgroundColor: proj.color }} />
                      <span className="name">{proj.name}</span>
                    </div>
                    <div className="focus-card-header-btns" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="quick-add-task-btn"
                        onClick={() => onAddTaskForProject(proj.id)}
                      >
                        <PlusIcon size={13} /> Task
                      </button>
                      <button
                        type="button"
                        className="icon-btn-subtle"
                        title="Edit project"
                        onClick={() => onEditProject(proj)}
                      >
                        <EditIcon size={14} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn-subtle text-danger"
                        title="Delete project"
                        onClick={() => {
                          if (confirm(`Delete project "${proj.name}"?`)) {
                            onDeleteProject(proj.id);
                          }
                        }}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="focus-card-metrics">
                    <div className="metric-item">
                      <span className="metric-val">
                        {proj.completedCount > 0 ? toRoman(proj.completedCount) : '0'}/{toRoman(proj.tasksCount)}
                      </span>
                      <span className="metric-lbl">Tasks Done</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-val">{proj.totalHours}h</span>
                      <span className="metric-lbl">Planned</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {categories.length === 0 && (
          <div className="empty-category-notice" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              No categories created yet. Click below to add your first category.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenNewCategoryModal}
            >
              <PlusIcon size={16} /> + Add Category
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
