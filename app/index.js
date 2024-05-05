import * as SQLite from "expo-sqlite"
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
import { useTeamsContext } from "../components/hooks/useTeamsContext"

export default function Page() {
    const router = useRouter()
    const db = SQLite.openDatabase('teams.db')
    const { dex, evoChains, dispatch } = useDexContext()
    const { moves, dispatch: movesDispatch } = useMovesContext()
    const { abilities, dispatch: abilitiesDispatch } = useAbilitiesContext()
    const { teams, dispatch: teamsDispatch } = useTeamsContext()

    LogBox.ignoreLogs([
        "Require cycle: components/AbilitiesModal.js -> components/PokemonListView.js -> components/PokemonModal.js -> components/AbilitiesModal.js",
        "Require cycle: components/PokemonListView.js -> components/PokemonModal.js -> components/MovesView.js -> components/MovesModal.js -> components/PokemonListView.js"
    ])

    const sample = [
        {name: "pikachu", teraType: null, shiny: 0, female: 0, moves: ["thunderbolt", "iron-tail", "quick-attack", "electroweb"]},
        {name: "lucario-mega", teraType: null, shiny: 0, female: 0, moves: ["aura-sphere", "bullet-punch", "reversal", "double-team"]},
        {name: "gengar-gmax", teraType: null, shiny: 0, female: 0, moves: ["shadow-ball", "dark-pulse", "dazzling-gleam", "will-o-wisp"]},
        {name: "dragonite", teraType: null, shiny: 0, female: 0, moves: ["hurricane", "draco-meteor", "dragon-claw", "dragon-dance"]},
        {name: "sirfetchd", teraType: null, shiny: 0, female: 0, moves: ["meteor-assault", "brutal-swing", "fury-cutter", "detect"]},
        {name: "dracovish", teraType: null, shiny: 0, female: 0, moves: ["fishious-rend", "dragon-rush", "ice-fang"]},
    ]
    
    const sample2 = [
        {name: "charizard", teraType: null, shiny: 0, female: 0, moves: []},
        {name: "venusaur", teraType: null, shiny: 0, female: 0, moves: []},
        {name: "blastoise", teraType: null, shiny: 0, female: 0, moves: []},
        {name: "pikachu", teraType: null, shiny: 0, female: 0, moves: []},
        {name: "snorlax", teraType: null, shiny: 0, female: 0, moves: []},
    ]

    const createTable = () => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT name FROM sqlite_master WHERE type='table' AND name='teams'`,
                [],
                (_, result) => {
                    if (result.rows.length === 0) {
                        tx.executeSql(`CREATE TABLE IF NOT EXISTS teams (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, team TEXT)`)

                        const sampleData = JSON.stringify(sample)
                        const sample2Data = JSON.stringify(sample2)

                        tx.executeSql(
                            'INSERT INTO teams (name, team) VALUES (?, ?)',
                            ["Ash's Team", sampleData],
                            (_, result) => {
                                console.log("Inserted Ash's Team");
                            }
                        )

                        tx.executeSql(
                            'INSERT INTO teams (name, team) VALUES (?, ?)',
                            ["Red's Team", sample2Data],
                            (_, result) => {
                                console.log("Inserted Red's Team");
                            }
                        )
                    }
                }
            )
        })
    }

    const fetchData = () => {
        return new Promise((resolve, reject) => {
            const dbArray = []
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM teams`,
                    [],
                    (_, results) => {
                        const teams = results.rows._array
                        teams.forEach(team => {
                            const data = {id: team.id, name: team.name, team: JSON.parse(team.team)}
                            dbArray.push(data)
                        })
                        resolve(dbArray)
                    },
                    (_, error) => {
                        reject(error)
                    }
                )
            })
        })
    }

    useEffect(() => {
        if (dex.length === 0) dispatch({type: 'SET_ALL', payload: {dex: PokemonData, chains: EvoChains}})
        if (moves.length === 0) movesDispatch({type: 'SET_MOVES', payload: Moves})
        if (abilities.length === 0) abilitiesDispatch({type: 'SET_ABILITIES', payload: Abilities})
        createTable()
        fetchData().then(payload => {
            teamsDispatch({type: 'SET_TEAMS', payload: payload})  
        })
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
    
    useEffect(() => {
        console.log("teams updated")
    }, [teams])

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