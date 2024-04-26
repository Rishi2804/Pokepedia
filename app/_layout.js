import { Drawer } from 'expo-router/drawer';
import { PokemonDexContextProvider } from '../components/contexts/PokemonDexContext';
import { MovesContextProvider } from '../components/contexts/MovesContext';

export default function Layout() {
  return (
    <PokemonDexContextProvider>
        <MovesContextProvider>
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
            </Drawer>
        </MovesContextProvider>
    </PokemonDexContextProvider>
  )
}
