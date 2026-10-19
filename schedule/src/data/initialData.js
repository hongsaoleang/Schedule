export const PROJECT_COLORS = [
  { id: 'indigo', name: 'Indigo', hex: '#6366f1', bg: '#eef2ff', text: '#4338ca' },
  { id: 'emerald', name: 'Emerald', hex: '#10b981', bg: '#ecfdf5', text: '#065f46' },
  { id: 'amber', name: 'Amber', hex: '#f59e0b', bg: '#fffbeb', text: '#92400e' },
  { id: 'rose', name: 'Rose', hex: '#f43f5e', bg: '#fff1f2', text: '#9f1239' },
  { id: 'sky', name: 'Sky', hex: '#0284c7', bg: '#f0f9ff', text: '#075985' },
  { id: 'purple', name: 'Purple', hex: '#a855f7', bg: '#faf5ff', text: '#6b21a8' },
  { id: 'teal', name: 'Teal', hex: '#14b8a6', bg: '#f0fdfa', text: '#115e59' },
  { id: 'orange', name: 'Orange', hex: '#f97316', bg: '#fff7ed', text: '#9a3412' },
];

export const PRIORITIES = [
  { id: 'high', label: 'High Priority', color: '#ef4444', badgeBg: 'rgba(239, 68, 68, 0.15)', badgeText: '#dc2626' },
  { id: 'medium', label: 'Medium', color: '#f59e0b', badgeBg: 'rgba(245, 158, 11, 0.15)', badgeText: '#d97706' },
  { id: 'low', label: 'Low', color: '#10b981', badgeBg: 'rgba(16, 185, 129, 0.15)', badgeText: '#059669' },
];

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Software Development', color: '#6366f1' },
  { id: 'cat-2', name: 'Marketing & Growth', color: '#f59e0b' },
  { id: 'cat-3', name: 'DevOps & Infrastructure', color: '#ec4899' },
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    categoryId: 'cat-1',
    name: 'Website Redesign',
    description: 'Modernize UI/UX, responsive layouts, and Tailwind design system',
    color: '#6366f1',
    priority: 'high',
    status: 'in-progress',
    targetHours: 18,
  },
  {
    id: 'proj-2',
    categoryId: 'cat-1',
    name: 'Customer Portal API',
    description: 'Authentication endpoints, billing webhook integration, and database migrations',
    color: '#10b981',
    priority: 'high',
    status: 'in-progress',
    targetHours: 12,
  },
  {
    id: 'proj-3',
    categoryId: 'cat-2',
    name: 'Q4 Product Launch',
    description: 'Marketing assets, landing page copywriting, and email sequences',
    color: '#f59e0b',
    priority: 'medium',
    status: 'planning',
    targetHours: 8,
  },
  {
    id: 'proj-4',
    categoryId: 'cat-3',
    name: 'Infrastructure & CI/CD',
    description: 'Automate build pipelines, Docker containerization, and AWS monitoring',
    color: '#ec4899',
    priority: 'low',
    status: 'in-progress',
    targetHours: 6,
  },
];

export function getInitialTasks() {
  return [];
}
