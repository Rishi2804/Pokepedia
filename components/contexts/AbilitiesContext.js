import { createContext, useReducer } from 'react'

export const AbilitiesContext = createContext()

export const abilitiesReducer = (state, action) => {
    switch(action.type) {
        case 'SET_ABILITIES': {
            return {
                abilities: action.payload
            }
        }
        default: 
            return state
    }
}

export const AbilitiesContextProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(abilitiesReducer, {
        abilities: []
    })
    return (
        <AbilitiesContext.Provider value={{...state, dispatch}}>
            { children }
        </AbilitiesContext.Provider>
    )
}