import LoadingView from "../components/LoadingView"
import { useFonts } from 'expo-font'
import { useRouter } from "expo-router"
import { LogBox } from "react-native"
import { useEffect } from "react"
import PokemonData from '../assets/jsonData/pokemon.json'
import EvoChains from '../assets/jsonData/evolution_chains.json'
import Moves from '../assets/jsonData/moves.json'
import Abilities from '../assets/jsonData/abilities.json'

import { useDexContext } from "../components/hooks/useDexContext"
import { useMovesContext } from "../components/hooks/useMovesContext"
import { useAbilitiesContext } from "../components/hooks/useAbilitiesContext"

export default function Page() {
    const router = useRouter()
    const { dex, evoChains, dispatch } = useDexContext()
    const { moves, dispatch: movesDispatch } = useMovesContext()
    const { abilities, dispatch: abilitiesDispatch } = useAbilitiesContext()

    LogBox.ignoreLogs([
        "Require cycle: components/AbilitiesModal.js -> components/PokemonListView.js -> components/PokemonModal.js -> components/AbilitiesModal.js",
        "Require cycle: components/PokemonListView.js -> components/PokemonModal.js -> components/MovesView.js -> components/MovesModal.js -> components/PokemonListView.js"
    ])

    useEffect(() => {
        if (dex.length === 0) dispatch({type: 'SET_ALL', payload: {dex: PokemonData, chains: EvoChains}})
        if (moves.length === 0) movesDispatch({type: 'SET_MOVES', payload: Moves})
        if (abilities.length === 0) abilitiesDispatch({type: 'SET_ABILITIES', payload: Abilities})
    }, [])

    useEffect(() => {
        console.log("dex updated")
    }, [dex])

    useEffect(() => {
        console.log("chains updated")
    }, [evoChains])
    
    useEffect(() => {
        console.log("moves updated")
    }, [moves])
    
    useEffect(() => {
        console.log("abilities updated")
    }, [abilities])

    let [fontsLoaded] = useFonts({
        "Geologica Regular": require("../assets/fonts/GeologicaRegular.ttf"),
        "Geologica SemiBold": require("../assets/fonts/GeologicaSemiBold.ttf"),
        "Geologica Bold": require("../assets/fonts/GeologicaBold.ttf"),
        "Inconsolata Regular": require("../assets/fonts/InconsolataRegular.ttf"),
        "Inconsolata SemiBold": require("../assets/fonts/InconsolataSemiBold.ttf"),
        "Inconsolata Bold": require("../assets/fonts/InconsolataBold.ttf"),
    })

    useEffect(() => {
        if (fontsLoaded && dex.length > 0 && evoChains.length > 0 && moves.length > 0 && abilities.length > 0) {
            router.push("/Pokedex")
        }
    }, [fontsLoaded, dex, evoChains, moves, abilities])

    return <LoadingView />
}