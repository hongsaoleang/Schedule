import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  PlusIcon,
  CopyIcon,
  SparklesIcon,
} from './Icons';
import {
  getMondayOfWeek,
  addWeeksToMonday,
  formatWeekRange,
  getWeekLabel,
} from '../utils/dateUtils';

export default function WeekNavigator({
  currentMonday,
  onWeekChange,
  onOpenTaskModal,
  onOpenCarryOverModal,
}) {
  const realCurrentMonday = getMondayOfWeek(new Date());
  const isCurrentWeek = currentMonday === realCurrentMonday;
  const weekLabel = getWeekLabel(currentMonday);
  const weekRange = formatWeekRange(currentMonday);

  const nextMonday = addWeeksToMonday(realCurrentMonday, 1);
  const plusTwoMonday = addWeeksToMonday(realCurrentMonday, 2);

  const handlePrev = () => {
    onWeekChange(addWeeksToMonday(currentMonday, -1));
  };

  const handleNext = () => {
    onWeekChange(addWeeksToMonday(currentMonday, 1));
  };

  const handleCurrent = () => {
    onWeekChange(realCurrentMonday);
  };

  return (
    <div className="week-navigator-card">
      <div className="nav-left-group">
        <div className="nav-arrows">
          <button
            type="button"
            className="btn btn-outline nav-arrow-btn"
            onClick={handlePrev}
            title="Previous Week"
            aria-label="Previous Week"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <button
            type="button"
            className={`btn ${isCurrentWeek ? 'btn-primary' : 'btn-outline'}`}
            onClick={handleCurrent}
          >
            <CalendarIcon size={16} /> This Week
          </button>
          <button
            type="button"
            className="btn btn-outline nav-arrow-btn"
            onClick={handleNext}
            title="Next Week"
            aria-label="Next Week"
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>

        <div className="quick-week-pills">
          <button
            type="button"
            className={`pill-tab ${currentMonday === realCurrentMonday ? 'active' : ''}`}
            onClick={() => onWeekChange(realCurrentMonday)}
          >
            Current Week
          </button>
          <button
            type="button"
            className={`pill-tab ${currentMonday === nextMonday ? 'active' : ''}`}
            onClick={() => onWeekChange(nextMonday)}
          >
            <SparklesIcon size={14} /> Plan Next Week
          </button>
          <button
            type="button"
            className={`pill-tab ${currentMonday === plusTwoMonday ? 'active' : ''}`}
            onClick={() => onWeekChange(plusTwoMonday)}
          >
            +2 Weeks Ahead
          </button>
        </div>
      </div>

      <div className="nav-center-title">
        <div className="date-range-display">
          <h2 className="week-date-text">{weekRange}</h2>
          {weekLabel && <span className="week-badge">{weekLabel}</span>}
        </div>
      </div>

      <div className="nav-right-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onOpenCarryOverModal}
          title="Roll over incomplete tasks to next week or plan another week"
        >
          <CopyIcon size={16} /> Plan / Roll Over
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onOpenTaskModal()}
        >
          <PlusIcon size={18} /> Add Task
        </button>
      </div>
    </div>
  );
}
