import { PokemonDexContext } from "../contexts/PokemonDexContext";
import { useContext } from "react";

export const useDexContext = () => {
    const context = useContext(PokemonDexContext)

    if (!context) {
        throw Error('useDexContext must be used inside a PokemonDexContextProvider')
    }

    return context
}