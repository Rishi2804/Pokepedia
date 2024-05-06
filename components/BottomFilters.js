import {useState, useEffect} from 'react';
import { View, TouchableOpacity, TextInput, KeyboardAvoidingView, StyleSheet, Platform, Keyboard, Dimensions, Pressable, Text, ScrollView } from "react-native";
import { Feather, Octicons, FontAwesome6 } from '@expo/vector-icons';
import { useThemeContext } from './hooks/useThemeContext';

const BottomFilters = ({options, state, setState, selected, setSelected, setSearchTerm}) => {
    const [ search, setSearch ] = useState(false)
    const { theme } = useThemeContext()

    const SortButton = ({text, selected, state, onPress}) => {
        return (
            <Pressable style={{flexDirection: "row", paddingHorizontal: 10}} onPress={onPress}>
                <Text style={[styles.textButn, {color: selected ? state === 1 ? '#b0d85d' : '#eb5545' : theme.mode === 'dark' ? "white" : 'black'}]}>{text}</Text>
                {selected && state === 1 && <FontAwesome6 name="arrow-up" size={23} color="#b0d85d" />}
                {selected && state === 2 && <FontAwesome6 name="arrow-down" size={23} color="#eb5545" />}
            </Pressable>
        );
    }

    const handlePress = (index) => {
        if (selected === index) {
            if (state === 1) {
                setState(2)
            } else {
                setState(1)
            }
        } else {
            setSelected(index)
            setState(1)
        }
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            keyboardVerticalOffset={Dimensions.get('window').height * 0.12} 
            behavior={Platform.OS === 'ios' ? "padding" : "height"}
        >
            <View style={[styles.filterContainer, {backgroundColor: theme.mode === 'dark' ? "#1c1c1e" : "white"}]}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => setSearch(true)}>
                    <Feather name="search" size={30} color="#b0d85d" />
                </TouchableOpacity>
                {!search && <ScrollView horizontal contentContainerStyle={{justifyContent: "center"}}>
                    {
                        options.map((option, index) => <SortButton text={option} selected={index === selected} key={index} state={state} onPress={() => handlePress(index)}/>)
                    }
                </ScrollView>}
                {
                    search && <>
                        <TextInput autoCorrect={false} style={[styles.textInput, {color: theme.mode === "dark" ? "white" : "black", borderColor: theme.mode === "dark" ? "white" : "black"}]} onSubmitEditing={(event) => setSearchTerm(event.nativeEvent.text)}/>
                        <TouchableOpacity onPress={() => {
                            Keyboard.dismiss()
                            setSearch(false)
                        }}>
                            <View style={styles.iconContainer}>
                                <Octicons name="arrow-switch" size={30} color="#b0d85d" style={styles.rotatedIcon} />
                            </View>
                        </TouchableOpacity>   
                    </>
                }
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        width: '100%'
    },
    filterContainer: {
        backgroundColor: "white",
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    iconContainer: {
        paddingHorizontal: 10,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 5,
        flex: 1,
        height: '60%',
        paddingHorizontal: 5,
    },
    rotatedIcon: {
        transform: [{ rotate: '90deg' }],
    },
    textButn: {
        fontFamily: "Inconsolata SemiBold",
        fontSize: 21
    }
});

export default BottomFilters;