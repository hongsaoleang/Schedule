import { getMondayOfWeek, addWeeksToMonday, getDaysOfWeek } from '../utils/dateUtils';

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
  const currentMonday = getMondayOfWeek(new Date());
  const nextMonday = addWeeksToMonday(currentMonday, 1);
  const currentDays = getDaysOfWeek(currentMonday);
  const nextDays = getDaysOfWeek(nextMonday);

  return [
    // This Week tasks
    {
      id: 'task-1',
      title: 'Review landing page wireframes with team',
      projectId: 'proj-1',
      dateStr: currentDays[0].dateStr, // Monday
      timeSlot: '09:30 - 11:00',
      estimatedHours: 1.5,
      priority: 'high',
      completed: true,
      notes: 'Finalize component hierarchy and theme palette'
    },
    {
      id: 'task-2',
      title: 'Setup JWT authentication & refresh token API',
      projectId: 'proj-2',
      dateStr: currentDays[0].dateStr, // Monday
      timeSlot: '13:00 - 16:00',
      estimatedHours: 3,
      priority: 'high',
      completed: true,
      notes: 'Include rate limiting on login routes'
    },
    {
      id: 'task-3',
      title: 'Implement weekly schedule grid component',
      projectId: 'proj-1',
      dateStr: currentDays[1].dateStr, // Tuesday
      timeSlot: '10:00 - 12:30',
      estimatedHours: 2.5,
      priority: 'high',
      completed: true,
      notes: 'Make it keyboard accessible with date formatting'
    },
    {
      id: 'task-4',
      title: 'Draft email blast copy and banner graphics',
      projectId: 'proj-3',
      dateStr: currentDays[2].dateStr, // Wednesday
      timeSlot: '14:00 - 16:00',
      estimatedHours: 2,
      priority: 'medium',
      completed: false,
      notes: 'Coordinate with marketing lead on CTA buttons'
    },
    {
      id: 'task-5',
      title: 'Configure GitHub Actions test & deploy workflows',
      projectId: 'proj-4',
      dateStr: currentDays[3].dateStr, // Thursday
      timeSlot: '11:00 - 13:00',
      estimatedHours: 2,
      priority: 'low',
      completed: false,
      notes: 'Add cache for node_modules and lint checks'
    },
    {
      id: 'task-6',
      title: 'Connect client portal profile page to API',
      projectId: 'proj-2',
      dateStr: currentDays[4].dateStr, // Friday
      timeSlot: '10:00 - 12:00',
      estimatedHours: 2,
      priority: 'high',
      completed: false,
      notes: 'Verify error states and validation toast messages'
    },
    {
      id: 'task-7',
      title: 'End of week code review & backlog grooming',
      projectId: 'proj-1',
      dateStr: currentDays[4].dateStr, // Friday
      timeSlot: '15:30 - 16:30',
      estimatedHours: 1,
      priority: 'medium',
      completed: false,
      notes: 'Review PRs and organize upcoming milestones'
    },

    // Next Week planned tasks ("plan for another week")
    {
      id: 'task-101',
      title: 'Deliver mobile responsiveness overhaul',
      projectId: 'proj-1',
      dateStr: nextDays[0].dateStr, // Next Monday
      timeSlot: '09:00 - 12:00',
      estimatedHours: 3,
      priority: 'high',
      completed: false,
      notes: 'Test on iOS Safari and Chrome Android'
    },
    {
      id: 'task-102',
      title: 'Implement Stripe webhook handler & billing portal',
      projectId: 'proj-2',
      dateStr: nextDays[1].dateStr, // Next Tuesday
      timeSlot: '10:00 - 14:00',
      estimatedHours: 4,
      priority: 'high',
      completed: false,
      notes: 'Test test-mode subscription invoices'
    },
    {
      id: 'task-103',
      title: 'A/B Test ad creative variations for product launch',
      projectId: 'proj-3',
      dateStr: nextDays[2].dateStr, // Next Wednesday
      timeSlot: '13:00 - 15:30',
      estimatedHours: 2.5,
      priority: 'medium',
      completed: false,
      notes: 'Track conversion rates on v1 vs v2 headlines'
    },
    {
      id: 'task-104',
      title: 'Setup Prometheus & Grafana performance dashboards',
      projectId: 'proj-4',
      dateStr: nextDays[3].dateStr, // Next Thursday
      timeSlot: '14:00 - 17:00',
      estimatedHours: 3,
      priority: 'low',
      completed: false,
      notes: 'Alerts for 5xx responses and CPU spikes'
    },
  ];
}
