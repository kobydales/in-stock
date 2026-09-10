import { DATE_RANGE_PRESETS } from '../utils/dateRange'
import './DateRangePicker.css'

// A single, consistent date-range control (as opposed to two separate raw
// date inputs that can disagree/conflict). `value` is the number of days.
// When `allowCustomDate` is set, an extra date input lets the user pick one
// exact day instead of a rolling preset; `customDate` (a 'YYYY-MM-DD'
// string or null) tracks that separately from the preset value.
function DateRangePicker({ value, onChange, allowCustomDate = false, customDate = null, onCustomDateChange }) {
  return (
    <div className="date-range-picker">
      {DATE_RANGE_PRESETS.map((preset) => (
        <button
          key={preset.value}
          type="button"
          className={!customDate && value === preset.value ? 'active' : ''}
          onClick={() => {
            onChange(preset.value)
            if (onCustomDateChange) onCustomDateChange(null)
          }}
        >
          {preset.label}
        </button>
      ))}
      {allowCustomDate && (
        <input
          type="date"
          className={`date-range-custom-input ${customDate ? 'active' : ''}`}
          value={customDate || ''}
          onChange={(e) => onCustomDateChange(e.target.value || null)}
          aria-label="Choose a specific date"
        />
      )}
    </div>
  )
}

export default DateRangePicker
