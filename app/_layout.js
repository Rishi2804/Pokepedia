import { Drawer } from 'expo-router/drawer';
import { PokemonDexContextProvider } from '../components/contexts/PokemonDexContext';
import { MovesContextProvider } from '../components/contexts/MovesContext';
import { AbilitiesContextProvider } from '../components/contexts/AbilitiesContext';
import { TeamsContextProvider } from '../components/contexts/TeamsContext';
import { ThemeContextProvider } from '../components/contexts/ThemeContext';
import { useThemeContext } from '../components/hooks/useThemeContext';


const LayoutContent = () => {
    const { theme } = useThemeContext()
    return (
        <PokemonDexContextProvider>
            <MovesContextProvider>
                <AbilitiesContextProvider>
                    <TeamsContextProvider>
                        <Drawer screenOptions={{
                            drawerStyle: {
                                backgroundColor: theme.mode === "dark" ? "#1c1c1e" : "#fff"
                            },
                            drawerLabelStyle: {
                                color: theme.mode === "dark" ? "#9e9e9e" : "#69696a"
                            },
                            headerStyle: {
                                backgroundColor: theme.mode === "dark" ? "#1c1c1e" : "#fff"
                            },
                            headerTitleStyle: {
                                color: theme.mode === "dark" ? "#fffaf0" : "#202021"
                            }
                        }}>
                            <Drawer.Screen 
                                name='Pokedex'
                                options={{
                                    drawerLabel: "Pokedex",
                                    headerTitle: "Pokedex",
                                }}
                            />
                            <Drawer.Screen 
                                name='Moves'
                                options={{
                                    drawerLabel: "Moves",
                                    headerTitle: "Moves"
                                }}
                            />
                            <Drawer.Screen 
                                name='Abilities'
                                options={{
                                    drawerLabel: "Abilities",
                                    headerTitle: "Abilities"
                                }}
                            />
                            <Drawer.Screen
                                name='Types'
                                options={{
                                    drawerLabel: "Type Analysis",
                                    headerTitle: "Type Analysis"
                                }}
                            />
                            <Drawer.Screen
                                name='Compare'
                                options={{
                                    drawerLabel: "Pokemon Compare",
                                    headerTitle: "Head 2 Head"
                                }}
                            />
                            <Drawer.Screen
                                name='TeamBuilder'
                                options={{
                                    drawerLabel: "Team Builder",
                                    headerTitle: "Build your Teams"
                                }}
                            />
                            <Drawer.Screen
                                name='Settings'
                                options={{
                                    drawerLabel: "Settings",
                                    headerTitle: "Settings"
                                }}
                            />
                            <Drawer.Screen
                                name='index'
                                options={{
                                    drawerItemStyle: {display: "none"}
                                }}
                            />
                        </Drawer>
                    </TeamsContextProvider>
                </AbilitiesContextProvider>
            </MovesContextProvider>
        </PokemonDexContextProvider>
    );
}

export default function Layout() {
  return (
    <ThemeContextProvider>
        <LayoutContent />
    </ThemeContextProvider>
  )
}
