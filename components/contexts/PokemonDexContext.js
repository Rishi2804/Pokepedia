import { createContext, useReducer } from 'react'

export const PokemonDexContext = createContext()

export const dexReducer = (state, action) => {
    switch(action.type) {
        case 'SET_DEX_INFO': {
            return {
                dex: action.payload,
                speciesInfo: state.speciesInfo,
                evoChains: state.evoChains
            }
        }
        case 'ADD_SPECIES_INFO': {
            return {
                dex: state.dex,
                speciesInfo: [action.payload , ...state.speciesInfo],
                evoChains: state.evoChains
            }
        }
        case 'ADD_EVO_CHAIN': {
            return {
                dex: state.dex,
                speciesInfo: state.speciesInfo,
                evoChains: [action.payload, ...state.evoChains]
            }
        }
        default: 
            return state
    }
}

export const PokemonDexContextProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(dexReducer, {
        dex: [],
        speciesInfo: [],
        evoChains: []
    })
    return (
        <PokemonDexContext.Provider value={{...state, dispatch}}>
            { children }
        </PokemonDexContext.Provider>
    )
}