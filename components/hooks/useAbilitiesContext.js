import { AbilitiesContext } from "../contexts/AbilitiesContext";
import { useContext } from "react";

export const useAbilitiesContext = () => {
    const context = useContext(AbilitiesContext)

    if (!context) {
        throw Error('useAbiltiesContext must be used inside a AbilitiesProvider')
    }

    return context
}