import { View, Text, StyleSheet } from "react-native";
import { formatText } from "../global/UtiliyFunctions";
import AbilitiesModal from "./AbilitiesModal";

const AbilitiesView = ({ ability }) => {
    return (
        <AbilitiesModal ability={ability}>
            <View style={styles.container}>
                <Text style={styles.nameText}>{formatText(ability.name)}</Text>
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
        borderWidth: 2,
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