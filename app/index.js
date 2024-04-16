import LoadingView from "../components/LoadingView"
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'

export default function Page() {
    let [fontsLoaded] = useFonts({
        "Geologica Regular": require("../assets/fonts/GeologicaRegular.ttf"),
        "Geologica SemiBold": require("../assets/fonts/GeologicaSemiBold.ttf"),
        "Geologica Bold": require("../assets/fonts/GeologicaBold.ttf"),
        "Inconsolata Regular": require("../assets/fonts/InconsolataRegular.ttf"),
        "Inconsolata Bold": require("../assets/fonts/InconsolataBold.ttf"),
    })
    return <LoadingView />
}