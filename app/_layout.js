import { Drawer } from 'expo-router/drawer';
import { PokemonDexContextProvider } from '../components/contexts/PokemonDexContext';

export default function Layout() {
  return (
    <PokemonDexContextProvider>
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
    </PokemonDexContextProvider>
  )
}
