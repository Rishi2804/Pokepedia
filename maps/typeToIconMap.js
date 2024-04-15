import NormalIcon from '../assets/type-icons/normal-icon.svg'
import FireIcon from '../assets/type-icons/fire-icon.svg'
import WaterIcon from '../assets/type-icons/water-icon.svg'
import GrassIcon from '../assets/type-icons/grass-icon.svg'
import ElectricIcon from '../assets/type-icons/electric-icon.svg'
import FlyingIcon from '../assets/type-icons/flying-icon.svg'
import FightingIcon from '../assets/type-icons/fighting-icon.svg'
import PsychicIcon from '../assets/type-icons/psychic-icon.svg'
import DarkIcon from '../assets/type-icons/dark-icon.svg'
import GhostIcon from '../assets/type-icons/ghost-icon.svg'
import IceIcon from '../assets/type-icons/ice-icon.svg'
import BugIcon from '../assets/type-icons/bug-icon.svg'
import GroundIcon from '../assets/type-icons/ground-icon.svg'
import RockIcon from '../assets/type-icons/rock-icon.svg'
import SteelIcon from '../assets/type-icons/steel-icon.svg'
import PoisonIcon from '../assets/type-icons/poison-icon.svg'
import DragonIcon from '../assets/type-icons/dragon-icon.svg'
import FairyIcon from '../assets/type-icons/fairy-icon.svg'
import { Text, View } from 'react-native'

const IconTypeMapper = ({type, ...props}) => {

    const typeToIcon = {
        "normal": <NormalIcon {...props}/>,
        "fire": <FireIcon {...props}/>,
        "water": <WaterIcon {...props}/>,
        "grass": <GrassIcon {...props}/>,
        "electric": <ElectricIcon {...props}/>,
        "flying": <FlyingIcon {...props}/>,
        "fighting": <FightingIcon {...props}/>,
        "psychic": <PsychicIcon {...props}/>,
        "dark": <DarkIcon {...props}/>,
        "ghost": <GhostIcon {...props}/>,
        "ice": <IceIcon {...props}/>,
        "bug": <BugIcon {...props}/>,
        "ground": <GroundIcon {...props}/>,
        "rock": <RockIcon {...props}/>,
        "steel": <SteelIcon {...props}/>,
        "poison": <PoisonIcon {...props}/>,
        "dragon": <DragonIcon {...props}/>,
        "fairy": <FairyIcon {...props}/>
    }
    const Icon = typeToIcon[type]
    return(
        <>
            {Icon ? Icon : <View style={{width: props.width, height: props.height}}/>}
        </>
    )
}

export default IconTypeMapper