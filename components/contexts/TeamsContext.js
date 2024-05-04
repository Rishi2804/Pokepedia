import { createContext, useReducer } from 'react'

export const TeamsContext = createContext()

export const teamsReducer = (state, action) => {
    switch(action.type) {
        case 'SET_TEAMS': {
            return {
                teams: action.payload
            }
        }
        case 'CREATE_TEAM': {
            return {
                teams: [...state.teams, action.payload]
            }
        }
        case 'DELETE_TEAM': {
            return {
                teams: state.teams.filter(team => team.id !== action.payload.id)
            }
        }
        case 'UPDATE_TEAM': {
            const index = state.teams.findIndex(team => team.id === action.payload.id)
            state.teams[index] = action.payload
            return {
                teams: state.teams
            }
        }
        default: 
            return state
    }
}

export const TeamsContextProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(teamsReducer, {
        teams: []
    })
    return (
        <TeamsContext.Provider value={{...state, dispatch}}>
            { children }
        </TeamsContext.Provider>
    )
}