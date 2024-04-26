import { createContext, useReducer } from 'react'

export const MovesContext = createContext()

export const movesReducer = (state, action) => {
    switch(action.type) {
        case 'SET_MOVES': {
            return {
                moves: action.payload
            }
        }
        default: 
            return state
    }
}

export const MovesContextProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(movesReducer, {
        moves: []
    })
    return (
        <MovesContext.Provider value={{...state, dispatch}}>
            { children }
        </MovesContext.Provider>
    )
}