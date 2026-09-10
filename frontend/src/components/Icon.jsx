const paths = {
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  package: 'M21 16V8l-9-5-9 5v8l9 5 9-5ZM3.3 7.6 12 12.4l8.7-4.8M12 12.4V21',
  tags: 'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3.4 13.4a2 2 0 0 1-.6-1.4V5a2 2 0 0 1 2-2h7a2 2 0 0 1 1.4.6l7.4 7a2 2 0 0 1 0 2.8ZM7.5 7.5h.01',
  truck: 'M3 6h11v10H3zM14 9h4l3 3v4h-7zM6.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  arrowDown: 'M12 3v13M7 11l5 5 5-5M5 21h14',
  arrowUp: 'M12 21V8M7 13l5-5 5 5M5 3h14',
  alert: 'M12 3 2.5 20h19L12 3ZM12 9v5M12 17h.01',
  history: 'M3 12a9 9 0 1 0 3-6.7M3 4v6h6M12 7v5l3 2',
  chart: 'M4 19V5M4 19h17M8 16v-5M12 16V8M16 16v-7M20 16v-4',
  logout: 'M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-5',
  menu: 'M4 6h16M4 12h16M4 18h16',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4',
  chevron: 'm6 9 6 6 6-6',
  search: 'm21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  box: 'M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9ZM4 7.5l8 4.5 8-4.5M12 12v9',
  layers: 'm12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5',
  shield: 'M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3ZM9 12l2 2 4-4',
  building: 'M4 21V4h9v17M13 21h7V9h-7M8 8h1M8 12h1M8 16h1',
  users: 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  download: 'M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
}

export default function Icon({ name, size = 18, strokeWidth = 1.8, className = '' }) {
  const d = paths[name] || paths.box
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}
