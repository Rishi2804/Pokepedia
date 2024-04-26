import LoadingView from "../components/LoadingView"
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'
import { useEffect } from "react"
import PokemonData from '../assets/jsonData/pokemon.json'
import EvoChains from '../assets/jsonData/evolution_chains.json'
import Moves from '../assets/jsonData/moves.json'

import { useDexContext } from "../components/hooks/useDexContext"
import { useMovesContext } from "../components/hooks/useMovesContext"

export default function Page() {
    const { dex, evoChains, dispatch } = useDexContext()
    const { moves, dispatch: movesDispatch } = useMovesContext()

    useEffect(() => {
        if (dex.length === 0) dispatch({type: 'SET_ALL', payload: {dex: PokemonData, chains: EvoChains}})
        if (moves.length === 0) movesDispatch({type: 'SET_MOVES', payload: Moves})
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

    let [fontsLoaded] = useFonts({
        "Geologica Regular": require("../assets/fonts/GeologicaRegular.ttf"),
        "Geologica SemiBold": require("../assets/fonts/GeologicaSemiBold.ttf"),
        "Geologica Bold": require("../assets/fonts/GeologicaBold.ttf"),
        "Inconsolata Regular": require("../assets/fonts/InconsolataRegular.ttf"),
        "Inconsolata SemiBold": require("../assets/fonts/InconsolataSemiBold.ttf"),
        "Inconsolata Bold": require("../assets/fonts/InconsolataBold.ttf"),
    })
    return <LoadingView />
}