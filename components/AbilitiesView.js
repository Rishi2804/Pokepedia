import { View, Text, StyleSheet } from "react-native";
import { formatText } from "../global/UtiliyFunctions";
import AbilitiesModal from "./AbilitiesModal";
import { useThemeContext } from "./hooks/useThemeContext";

const AbilitiesView = ({ ability }) => {

    const { theme } = useThemeContext()

    return (
        <AbilitiesModal ability={ability}>
            <View style={[styles.container, {borderColor: theme.mode === 'dark' ? "white" : "black", backgroundColor: theme.mode === 'dark' ? "#1c1c1e" : "white"}]}>
                <Text style={[styles.nameText,{color: theme.mode === 'dark' ? "white" : "black"}]}>{formatText(ability.name)}</Text>
            </View>        
        </AbilitiesModal>
    );
}

export default AbilitiesView;

const styles = StyleSheet.create({
    container: {
        flexDirection:"row",
        alignItems: "center",
        borderColor: "black",
        borderWidth: 1.5,
        backgroundColor: "white",
        borderRadius: 10,
        height: 80
    },
    nameText: {
        fontFamily: "Inconsolata Regular",
        fontSize: 20,
        marginLeft: 15
    },
})