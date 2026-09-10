import './AdinkraWatermark.css'

import adinkrahene from '../assets/adinkra/adinkrahene.svg'
import gyeNyame from '../assets/adinkra/gye-nyame.svg'
import dwennimmen from '../assets/adinkra/dwennimmen.svg'
import nyameDua from '../assets/adinkra/nyame-dua.svg'
import mpatapo from '../assets/adinkra/mpatapo.svg'
import sankofa from '../assets/adinkra/sankofa.svg'

const symbols = { adinkrahene, gyeNyame, dwennimmen, nyameDua, mpatapo, sankofa }

function AdinkraWatermark({ name = 'gyeNyame', className = '', size }) {
  const source = symbols[name] || symbols.gyeNyame
  return (
    <span
      className={`adinkra-watermark ${className}`}
      style={{ '--adinkra-image': `url("${source}")`, ...(size ? { '--adinkra-size': size } : {}) }}
      aria-hidden="true"
    />
  )
}

export default AdinkraWatermark
