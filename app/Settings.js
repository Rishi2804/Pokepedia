import { SafeAreaView, View, StyleSheet, Text } from "react-native";
import { useThemeContext } from "../components/hooks/useThemeContext"
import { TouchableOpacity } from "react-native-gesture-handler";
 
 const Settings = () => {

    const { theme, updateTheme } = useThemeContext()

    return (
        <SafeAreaView style={styles.background}>
            <Text style={styles.settingHeaderText}>Theme Settings</Text>
            <View style={styles.settingContainer}>
                <TouchableOpacity onPress={() => {updateTheme({mode: "light"})}}>
                    <View style={styles.settingSection}>
                        <Text>Light Mode</Text>
                        <View style={[styles.radioButton, {backgroundColor: "#b0d85d"}]}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {updateTheme({mode: "dark"})}}>
                <View style={{height: 1, backgroundColor: "#b0d85d"}}/>
                    <View style={styles.settingSection}>
                        <Text>Dark Mode</Text>
                        <View style={[styles.radioButton, {backgroundColor: "#b0d85d"}]}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {updateTheme({system: true})}}>
                <View style={{height: 1, backgroundColor: "#b0d85d"}}/>
                    <View style={styles.settingSection}>
                        <Text>System</Text>
                        <View style={[styles.radioButton, {backgroundColor: "#b0d85d"}]}/>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
 }
 
 export default Settings;

 const styles = StyleSheet.create({
    background: {
        backgroundColor: "#f2f2f7"
    },
    settingHeaderText: {
        fontFamily: "Geologica SemiBold",
        color: "#b0d85d",
        fontSize: 20,
        paddingTop: 20,
        paddingBottom: 10
    },
    settingContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 5,
        marginHorizontal: 10
    },
    settingSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#b0d85d",
        marginRight: 10
    }
 })