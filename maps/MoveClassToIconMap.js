import PhysicalIcon from "../assets/move-class-icons/physical-icon.svg"
import SpecialIcon from "../assets/move-class-icons/special-icon.svg"
import StatusIcon from "../assets/move-class-icons/status-icon.svg"
import { View } from 'react-native'

const IconMoveClassMapper = ({moveClass, ...props}) => {

    const classToIcon = {
        "physical": <PhysicalIcon {...props}/>,
        "special": <SpecialIcon {...props}/>,
        "status": <StatusIcon {...props}/>
    }
    const Icon = classToIcon[moveClass]
    return(
        <>
            {Icon ? Icon : <View style={{width: props.width, height: props.height}}/>}
        </>
    )
}

export default IconMoveClassMapper