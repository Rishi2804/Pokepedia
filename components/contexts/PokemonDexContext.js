import { createContext, useReducer } from 'react'

export const PokemonDexContext = createContext()

export const dexReducer = (state, action) => {
    switch(action.type) {
        case 'SET_ALL': {
            return {
                dex: action.payload.dex,
                evoChains: action.payload.chains
            }
        }
        case 'SET_DEX_INFO': {
            return {
                dex: action.payload,
                evoChains: state.evoChains
            }
        }
        case 'SET_EVO_CHAINS': {
            return {
                dex: state.dex,
                evoChains: action.payload
            }
        }
        default: 
            return state
    }
}

export const PokemonDexContextProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(dexReducer, {
        dex: [],
        evoChains: []
    })
    return (
        <PokemonDexContext.Provider value={{...state, dispatch}}>
            { children }
        </PokemonDexContext.Provider>
    )
}