import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
        <Drawer.Screen 
            name='index'
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
  )
}
