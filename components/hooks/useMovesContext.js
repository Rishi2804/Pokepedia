import { MovesContext } from "../contexts/MovesContext";
import { useContext } from "react";

export const useMovesContext = () => {
    const context = useContext(MovesContext)

    if (!context) {
        throw Error('useMovesContext must be used inside a MovesProvider')
    }

    return context
}