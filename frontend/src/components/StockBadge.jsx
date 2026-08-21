import { getStockStatus, stockStatusConfig } from '../utils/stockStatus'

function StockBadge({ product }) {
  const status = getStockStatus(product)
  const config = stockStatusConfig[status]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.8em',
        backgroundColor: `${config.color}22`,
        color: config.color,
      }}
    >
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: config.color }} />
      {config.label}
    </span>
  )
}

export default StockBadge