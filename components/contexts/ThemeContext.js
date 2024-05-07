import { createContext, useEffect, useState } from "react"
import { Appearance } from "react-native"
import { getData, storeData } from "../../global/UtiliyFunctions"

export const ThemeContext = createContext()

export const ThemeContextProvider = ({ children }) => {
    const [ theme, setTheme ] = useState({mode: "dark"})

    const updateTheme = (newTheme) => {
        if (!newTheme) {
            const mode = theme.mode === "dark" ? "light" : "dark"
            newTheme = { mode, system: false }
        } else {
            if (newTheme.system) {
                const systemColorScheme = Appearance.getColorScheme()
                const mode = systemColorScheme === "dark" ? "dark" : "light"
                newTheme = { mode, system: true }
            } else {
                newTheme = {mode: newTheme.mode, system: false}
            }
        }
        if (newTheme) {
            setTimeout(() => {
                setTheme(newTheme)
                storeData("theme", newTheme)
                console.log("updated", newTheme)
            }, 0)
        }
    }

    if (theme.system) {
        Appearance.addChangeListener(({ colorScheme }) => {
            console.log("system change")
            updateTheme({system: true, mode: colorScheme})
        })
    }

    useEffect(() => {
        const fetchThemeData = async () => {
            try {
                const themeData = await getData("theme")
                if (themeData) {
                    updateTheme(themeData)
                }
            } catch({message}) {
                alert(message)
            }
        }
        fetchThemeData()
    },[])

    return (
        <ThemeContext.Provider value={{theme, updateTheme}}>
            { children }
        </ThemeContext.Provider>
    )
}
