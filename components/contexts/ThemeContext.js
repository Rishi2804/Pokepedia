import { createContext, useState } from "react"
import { Appearance } from "react-native"

export const ThemeContext = createContext()

export const ThemeContextProvider = ({ children }) => {
    const [ theme, setTheme ] = useState({mode: "light", system: false})

    const updateTheme = (newTheme) => {
        if (!newTheme) {
            const mode = theme.mode === "dark" ? "light" : "dark"
            setTheme({ mode, system: false })
        } else {
            if (newTheme.system) {
                const systemColorScheme = Appearance.getColorScheme()
                const mode = systemColorScheme === "dark" ? "dark" : "light"
                setTheme({ mode, system: true })
            } else {
                setTheme({...newTheme, system: false})
            }
        }
    }

    if (theme.system) {
        Appearance.addChangeListener(({ colorScheme }) => {
            updateTheme({system: true, mode: colorScheme})
        })
    }

    return (
        <ThemeContext.Provider value={{theme, updateTheme}}>
            { children }
        </ThemeContext.Provider>
    )
}
