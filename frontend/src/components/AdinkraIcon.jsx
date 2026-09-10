import adinkrahene from '../assets/adinkra/adinkrahene.svg'
import gyeNyame from '../assets/adinkra/gye-nyame.svg'
import dwennimmen from '../assets/adinkra/dwennimmen.svg'
import nyameDua from '../assets/adinkra/nyame-dua.svg'
import mpatapo from '../assets/adinkra/mpatapo.svg'
import sankofa from '../assets/adinkra/sankofa.svg'
import './AdinkraIcon.css'

const symbols = { adinkrahene, gyeNyame, dwennimmen, nyameDua, mpatapo, sankofa }

function AdinkraIcon({ name = 'mpatapo', className = '' }) {
  const source = symbols[name] || symbols.mpatapo
  return <span className={`adinkra-icon ${className}`} style={{ '--adinkra-image': `url("${source}")` }} aria-hidden="true" />
}

export default AdinkraIcon
