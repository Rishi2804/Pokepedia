import { Drawer } from 'expo-router/drawer';
import { PokemonDexContextProvider } from '../components/contexts/PokemonDexContext';
import { MovesContextProvider } from '../components/contexts/MovesContext';
import { AbilitiesContextProvider } from '../components/contexts/AbilitiesContext';

export default function Layout() {
  return (
    <PokemonDexContextProvider>
        <MovesContextProvider>
            <AbilitiesContextProvider>
                <Drawer>
                    <Drawer.Screen 
                        name='Pokedex'
                        options={{
                            drawerLabel: "Pokedex",
                            headerTitle: "Pokedex"
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
                        name='index'
                        options={{
                            drawerItemStyle: {display: "none"}
                        }}
                    />
                </Drawer>
            </AbilitiesContextProvider>
        </MovesContextProvider>
    </PokemonDexContextProvider>
  )
}
