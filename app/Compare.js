import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import Dropdown from 'react-native-input-select';
import { useDexContext } from '../components/hooks/useDexContext';
import { useThemeContext } from '../components/hooks/useThemeContext';
import { useState } from 'react';
import { formatName, formatText, getTypeMatchups } from '../global/UtiliyFunctions';
import { typeToColourMap } from '../maps/typeToColourMap';
import IconTypeMapper from '../maps/typeToIconMap';
import { BarChart } from 'react-native-gifted-charts';
import { AntDesign } from "@expo/vector-icons"

const Compare = () => {
    const { theme } = useThemeContext()
    const { dex } = useDexContext()
    const [ selectedPokemon, setSelectedPokemon ] = useState([])
    const options = dex.flatMap(mon => Object.values(mon.forms))

    const themeSetting1 = theme.mode === "dark" ? "#fff" : "#000"
    const themeSetting2 = theme.mode === "dark" ? "#0c0c0c" : "#fff"

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: themeSetting2}}>
            <View style={{marginHorizontal: 5}}>
                <Text style={[styles.titleText, {color: themeSetting1}]}>Compare Pokemon</Text>
                <Dropdown
                    isSearchable
                    placeholder='Select Pokemon to Compare'
                    disabled={selectedPokemon.length >= 8}
                    options={options.map(item => {return{value: item, label: formatName(item.name)}})}
                    dropdownStyle={{borderColor: themeSetting1, backgroundColor: themeSetting2}}
                    selectedItemStyle={{color: themeSetting1}}
                    placeholderStyle={{color: themeSetting1}}
                    dropdownIcon={<AntDesign name="down" size={20} color={themeSetting1} />}
                    dropdownIconStyle={{top: 20}}
                    modalControls={{
                        modalOptionsContainerStyle: {
                            backgroundColor: themeSetting2
                        }
                    }}
                    checkboxControls={{
                        checkboxLabelStyle: {
                            color: themeSetting1
                        },
                        checkboxStyle: {
                            borderColor: themeSetting1
                        },
                    }}
                    searchControls={{
                        textInputStyle :{
                            color: themeSetting1,
                            backgroundColor: themeSetting2,
                            borderColor: themeSetting1
                        }
                    }}
                    onValueChange={value => {
                        if (!selectedPokemon.includes(value)) {
                            setSelectedPokemon(prev => [...prev, value])
                        }
                    }}
                />
                <ScrollView>
                <View style={{flexDirection: "row", paddingBottom: 100}}>
                    <View>
                        {
                            selectedPokemon.length > 0 &&
                            <View style={{borderRightWidth: 1, borderColor: themeSetting1}}>
                                <View style={{borderBottomWidth: 1, height: 205, borderColor: themeSetting1}} />
                                <View style={{height: 70, justifyContent: 'center', borderBottomWidth: 1, borderColor: themeSetting1}}>
                                    <Text style={[styles.headerText, {color: themeSetting1}]}>Abilities</Text>
                                </View>
                                <View style={{height: 240, justifyContent: 'center', borderBottomWidth: 1, borderColor: themeSetting1}}>
                                    <Text style={[styles.headerText, {color: themeSetting1}]}>Base Stats</Text>
                                </View>
                                <View style={{height: 400, justifyContent: 'center'}}>
                                    <Text style={[styles.headerText, {color: themeSetting1}]}>Types</Text>
                                </View>
                            </View>            
                        }
                    </View>
                    <ScrollView horizontal>
                        {
                            selectedPokemon.map(mon => {
                                const statData = [
                                    {value: mon.stats[0].stat, label: "HP"},
                                    {value: mon.stats[1].stat, label: "Atk"},
                                    {value: mon.stats[2].stat, label: "Def"},
                                    {value: mon.stats[3].stat, label: "Sp Atk"},
                                    {value: mon.stats[4].stat, label: "Sp Def"},
                                    {value: mon.stats[5].stat, label: "Speed"}
                                ]
                                const typeRelations = getTypeMatchups(mon.types)

                                return (
                                    <View style={{borderRightWidth: 1, width: 240, borderColor: themeSetting1}}>
                                        <View style={{paddingHorizontal: 4, alignItems: "center", height: 205, borderBottomWidth: 1, borderColor: themeSetting1}}>
                                            <TouchableOpacity 
                                                style={styles.button} 
                                                onPress={() => {
                                                    setSelectedPokemon(prev => prev.filter(item => item !== mon))
                                                }}
                                            >
                                                <Text style={styles.buttonText}>X</Text>
                                            </TouchableOpacity>
                                            <Image
                                                source={{uri: mon.image}}
                                                style={{width: 100, height: 100}}
                                            />
                                            <Text style={[styles.headerText, {color: themeSetting1}]}>{formatName(mon.name)}</Text>
                                            <View>
                                                <View style={[styles.typeContainter, {backgroundColor: typeToColourMap[mon.types[0]]}]}>
                                                    <IconTypeMapper type={mon.types[0]} width={32} height={32} fill="white"/>
                                                    <View style={styles.textContainer}>
                                                        <Text style={styles.typeIconText}>{mon.types[0].toUpperCase()}</Text>
                                                    </View>
                                                </View>
                                                {
                                                    mon.types[1] ? 
                                                    <View style={[styles.typeContainter, {backgroundColor: typeToColourMap[mon.types[1]]}]}>
                                                        <IconTypeMapper type={mon.types[1]} width={32} height={32} fill="white"/>
                                                        <View style={styles.textContainer}>
                                                            <Text style={styles.typeIconText}>{mon.types[1].toUpperCase()}</Text>
                                                        </View>
                                                    </View>
                                                    : <View style={[styles.typeContainter]}/>
                                                }
                                            </View>
                                        </View>
                                        <View style={{alignItems: "center", justifyContent: 'center', borderBottomWidth: 1, height: 70, borderColor: themeSetting1}}>
                                            {
                                                mon.abilities.map((ability, index) => {
                                                    return (
                                                        <View style={{flexDirection: "row"}} key={index}>
                                                            <Text style={[styles.defaultText, {color: themeSetting1}]}>{formatText(ability.name)}</Text>
                                                            {
                                                                ability.hidden && 
                                                                <View style={styles.hiddenIndicator}>
                                                                    <Text style={styles.buttonText}>H</Text>
                                                                </View>
                                                            }
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                        <View style={{borderBottomWidth: 1, height: 240, borderColor: themeSetting1}}>
                                            <BarChart
                                                data={statData}
                                                initialSpacing={0}
                                                maxValue={265}
                                                frontColor={typeToColourMap[mon.types[0]]}
                                                barBorderRadius={5}
                                                spacing={7}
                                                dashWidth={0}
                                                disablePress={true}
                                                disableScroll={true}
                                                hideYAxisText={true}
                                                yAxisThickness={0}
                                                xAxisThickness={0}
                                                showValuesAsTopLabel={true}
                                                xAxisLabelTextStyle={[styles.defaultText, {color: themeSetting1}]}
                                                topLabelTextStyle={[styles.defaultText, {color: themeSetting1}]}
                                            />
                                        </View>
                                        <View>
                                            <View>
                                                {
                                                    typeRelations.doubleWeakness.length > 0 &&
                                                    <View>
                                                        <Text style={[styles.typeRelationBox, {borderColor: "#eb5545", color: themeSetting1}]}>x4</Text>
                                                        <View style={{flexDirection: "row", marginBottom: 5, flexWrap: "wrap"}}>
                                                        {
                                                            typeRelations.doubleWeakness.map((item, index) => {
                                                                return (
                                                                    <View style={{backgroundColor: typeToColourMap[item], marginHorizontal: 3, borderRadius: 5}} key={index}>
                                                                        <IconTypeMapper type={item} width={32} height={32} fill="#fff"/>
                                                                    </View>
                                                                )
                                                            })
                                                        }    
                                                        </View>
                                                    </View>
                                                }
                                                {
                                                    typeRelations.weaknesses.length > 0 &&
                                                    <View>
                                                        <Text style={[styles.typeRelationBox, {borderColor: "#eb5545", color: themeSetting1}]}>x2</Text>
                                                        <View style={{flexDirection: "row", marginBottom: 5, flexWrap: "wrap"}}>
                                                        {
                                                            typeRelations.weaknesses.map((item, index) => {
                                                                return (
                                                                    <View style={{backgroundColor: typeToColourMap[item], marginHorizontal: 3, borderRadius: 5}} key={index}>
                                                                        <IconTypeMapper type={item} width={32} height={32} fill="#fff"/>
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                        </View>
                                                    </View>
                                                }
                                            </View>
                                            {
                                                typeRelations.resistances.length > 0 &&
                                                <View>
                                                    <Text style={[styles.typeRelationBox, {borderColor: "#68c367", color: themeSetting1}]}>x1/2</Text>
                                                    <View style={{flexDirection: "row", flexWrap: "wrap", flexWrap: "wrap"}}>
                                                    {
                                                        typeRelations.resistances.map((item, index) => {
                                                            return (
                                                                <View style={{backgroundColor: typeToColourMap[item], marginHorizontal: 3, borderRadius: 5, marginBottom: 2}} key={index}>
                                                                    <IconTypeMapper type={item} width={32} height={32} fill="#fff"/>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                    </View>
                                                </View>
                                            }
                                            {
                                                typeRelations.doubleResistances.length > 0 &&
                                                <View>
                                                    <Text style={[styles.typeRelationBox, {borderColor: "#68c367", color: themeSetting1}]}>x1/4</Text>
                                                    <View style={{flexDirection: "row", marginBottom: 5}}>
                                                    {
                                                        typeRelations.doubleResistances.map((item, index) => {
                                                            return (
                                                                <View style={{backgroundColor: typeToColourMap[item], marginHorizontal: 3, borderRadius: 5}} key={index}>
                                                                    <IconTypeMapper type={item} width={32} height={32} fill="#fff"/>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                    </View>
                                                </View>
                                            }
                                            {
                                                typeRelations.immunities.length > 0 &&
                                                <View>
                                                    <Text style={[styles.typeRelationBox, {borderColor: "#68c367", color: themeSetting1}]}>x0</Text>
                                                    <View style={{flexDirection: "row"}}>
                                                    {
                                                        typeRelations.immunities.map((item, index) => {
                                                            return (
                                                                <View style={{backgroundColor: typeToColourMap[item], marginHorizontal: 3, borderRadius: 5}} key={index}>
                                                                    <IconTypeMapper type={item} width={32} height={32} fill="#fff"/>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                    </View>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default Compare;

const styles = StyleSheet.create({
    titleText: {
        fontFamily: "Geologica Bold",
        fontSize: 20,
        marginTop: 15,
        marginBottom: 17
    },
    button: {
        backgroundColor: '#808080',
        borderRadius: 20,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: "center"
      },
      buttonText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
      },
      hiddenIndicator: {
        backgroundColor: "#909090",
        borderRadius: 10,
        width: 15,
        alignItems: "center",
        marginLeft: 4
      },
      typeContainter: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        width: 90,
        height: 25,
        marginTop: 6,
        marginHorizontal: 2,
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        marginLeft: -10
    },
    typeIconText: {
        fontFamily: "Geologica Bold",
        color: "white",
        fontSize: 12,
        textAlign: "center",
    },
    headerText: {
        fontFamily: "Inconsolata Regular",
        fontSize: 16
    },
    defaultText: {
        fontFamily: "Inconsolata Regular",
        fontSize: 14
    },
    typeRelationBox: {
        borderRadius: 6, 
        borderWidth: 2, 
        marginVertical: 5,
        width: 50,
        marginHorizontal: 2,
        fontFamily: "Inconsolata Regular",
        fontSize: 18,
        textAlign: "center"
    }
})