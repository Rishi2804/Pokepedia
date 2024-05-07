import { SafeAreaView, View, StyleSheet, Text } from "react-native";
import { useThemeContext } from "../components/hooks/useThemeContext"
import { TouchableOpacity } from "react-native-gesture-handler";
 
 const Settings = () => {

    const { theme, updateTheme } = useThemeContext()
    const themeSettings1 = theme.mode === "dark" ? "#000" : "#f2f2f7"
    const themeSettings2 = theme.mode === "dark" ? "#1c1c1e" : "#fff"
    const themeSetting3 = theme.mode === "dark" ? "#fff" : "#000"

    return (
        <SafeAreaView style={{backgroundColor: themeSettings1, flex: 1}}>
            <Text style={styles.settingHeaderText}>Theme Settings</Text>
            <View style={[styles.settingContainer, {backgroundColor: themeSettings2}]}>
                <TouchableOpacity onPress={() => {updateTheme({mode: "light"})}}>
                    <View style={styles.settingSection}>
                        <Text style={[styles.settingText, {color: themeSetting3}]}>Light Mode</Text>
                        <View style={[styles.radioButton, {backgroundColor: (theme.mode === "light" && !theme.system)  ? "#b0d85d" : themeSettings2}]}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {updateTheme({mode: "dark"})}}>
                <View style={{height: 1, backgroundColor: "#b0d85d"}}/>
                    <View style={styles.settingSection}>
                        <Text style={[styles.settingText, {color: themeSetting3}]}>Dark Mode</Text>
                        <View style={[styles.radioButton, {backgroundColor: (theme.mode === "dark" && !theme.system)  ? "#b0d85d" : themeSettings2}]}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {updateTheme({system: true})}}>
                <View style={{height: 1, backgroundColor: "#b0d85d"}}/>
                    <View style={styles.settingSection}>
                        <Text style={[styles.settingText, {color: themeSetting3}]}>System</Text>
                        <View style={[styles.radioButton, {backgroundColor: theme.system ? "#b0d85d" : themeSettings2}]}/>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
 }
 
 export default Settings;

 const styles = StyleSheet.create({
    settingHeaderText: {
        fontFamily: "Geologica SemiBold",
        color: "#b0d85d",
        fontSize: 20,
        paddingTop: 20,
        paddingBottom: 10,
        marginLeft: 10
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
    },
    settingText: {
        fontFamily: "Inconsolata Regular",
        fontSize: 17,
        paddingHorizontal: 5
    }
 })