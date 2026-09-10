import { useEffect, useRef, useState } from 'react'
import AdinkraIcon from './AdinkraIcon'
import './CustomSelect.css'

function CustomSelect({ name, value, onChange, options = [], placeholder = 'Select', className = '', disabled = false }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = options.find((option) => String(option.value) === String(value))

  useEffect(() => {
    function handleOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  function selectOption(nextValue) {
    onChange?.({ target: { name, value: nextValue } })
    setOpen(false)
  }

  return (
    <div className={`custom-select ${open ? 'open' : ''} ${disabled ? 'disabled' : ''} ${className}`} ref={ref}>
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className={!selected ? 'placeholder' : ''}>{selected?.label || placeholder}</span>
        <span className="custom-select-chevron"><AdinkraIcon name="nyameDua" /></span>
      </button>

      {open && (
        <div className="custom-select-menu" role="listbox">
          {options.map((option) => {
            const active = String(option.value) === String(value)
            return (
              <button
                type="button"
                role="option"
                aria-selected={active}
                className={`custom-select-option ${active ? 'selected' : ''}`}
                key={String(option.value)}
                onClick={() => selectOption(option.value)}
              >
                <span>{option.label}</span>
                {active && <span className="custom-select-check">✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CustomSelect
