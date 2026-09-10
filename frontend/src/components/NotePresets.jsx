import './NotePresets.css'

// One-tap common reasons for Stock In/Out notes, so the user doesn't have
// to type the same phrase every time. Tapping a chip fills the notes field
// with that text; the user can still edit it afterward if needed.
function NotePresets({ options, onSelect, activeValue }) {
  return (
    <div className="note-presets">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={activeValue === option ? 'active' : ''}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default NotePresets
