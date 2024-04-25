import { dexToRegionMap } from "../global/UniversalData";
import { fixFlavourText, formatText, formatName, isRegionalVariant } from "../global/UtiliyFunctions";

export function filterEvoChain(chain, name) {
    let containsRegional = false
    for (const subChain of chain) {
        if (subChain.regional) {
            containsRegional = true;
            break;
        }
    }
    if (!containsRegional) return chain

    const fromLines = chain.filter(subchain => subchain.from === name)
    const toLines = chain.filter(subchain => subchain.to === name)

    let finalChain = []
    if (fromLines.length > 0 && toLines.length === 0) {
        finalChain = [...fromLines]
        fromLines.forEach(subline => {
            const temp = chain.filter(subChain => subChain.from === subline.to)
            finalChain = [...finalChain, ...temp]
        });
    } else if (fromLines.length > 0 && toLines.length > 0) {
        finalChain = chain.filter(subchain => {
            return (subchain.from === name || subchain.to === name)
        })
    } else if (fromLines.length === 0 && toLines.length > 0) {
        toLines.forEach(subline => {
            const temp = chain.filter(subChain => subChain.to === subline.from)
            const temp2 = chain.filter(subChain => {return((subChain.from === subline.from) && (subChain.to !== subline.to))})
            finalChain = [...finalChain, ...temp]
        });
        finalChain = [...finalChain, ...toLines]
        toLines.forEach(subline => {
            const temp = chain.filter(subChain => (subline.from === subChain.from && subline.to !== subChain.to && (isRegionalVariant(subline.to) === isRegionalVariant(subChain.to))))
            finalChain = [...finalChain, ...temp]
        })
    }
    return finalChain
}

export function sortDexEntries(dexEntries) {
    const order = ['red', 'blue', 'yellow', 'gold', 'silver', 'crystal', 'ruby',
                        'sapphire', 'emerald', 'firered', 'leafgreen', 'diamond', 
                        'pearl', 'platinum', 'heartgold', 'soulsilver', 'black',
                        'white', 'black-2', 'white-2', 'x', 'y', 'omega-ruby', 'alpha-sapphire',
                        'sun', 'moon', 'ultra-sun', 'ultra-moon', 'lets-go-pikachu', 'lets-go-eevee',
                        'sword', 'shield', 'legends-arceus', 'scarlet', 'violet']
    return dexEntries.sort((a, b) => {
        const indexA = order.indexOf(a.game)
        const indexB = order.indexOf(b.game)
        return indexA - indexB
    });
}

export function catergorizeDexEntries(dexEntries, regionalDexNumbers, generation) {
    const sortedEntries = sortDexEntries(dexEntries)
    let categories = []
    if (generation <= 1) {
        categories.push({games: ['red', 'blue', 'yellow'], dexes: ['kanto'], gen: 1})
    }
    if (generation <= 2) {
        categories.push({games: ['gold', 'silver', 'crystal'], dexes: ['original-johto'], gen: 2})
    }
    if (generation <= 3) {
        categories.push({games: ['ruby', 'sapphire', 'emerald', 'firered', 'leafgreen'], dexes: ['hoenn', 'kanto'], gen: 3})
    }
    if (generation <= 4) {
        categories.push({games: ['diamond', 'pearl', 'platinum', 'heartgold', 'soulsilver'], dexes: ['original-sinnoh', 'extended-sinnoh', 'updated-johto'], gen: 4})
    }
    if (generation <= 5) {
        categories.push({games: ['black', 'white', 'black-2', 'white-2'], dexes: ['original-unova', 'updated-unova'], gen: 5})
    }
    if (generation <= 6) {
        categories.push({games: ['x', 'y', 'omega-ruby', 'alpha-sapphire'], dexes: ['kalos-central', 'kalos-coastal', 'kalos-mountain', 'updated-hoenn'], gen: 6})
    }
    if (generation <= 7) {
        categories.push({games: ['sun', 'moon', 'ultra-sun', 'ultra-moon', 'lets-go-pikachu', 'lets-go-eevee'], dexes: ['original-alola', 'updated-alola', 'letsgo-kanto'], gen: 7})
        // 'original-melemele', 'original-akala', 'original-ulaula', 'original-poni', 'updated-melemele', 'updated-akala', 'updated-ulaula', 'updated-poni',
    }
    if (generation <= 8) {
        categories.push({games: ['sword', 'shield', 'legends-arceus'], dexes: ['galar', 'isle-of-armor', 'crown-tundra', 'hisui'], gen: 8})
    }
    if (generation <= 9) {
        categories.push({games: ['scarlet', 'violet'], dexes: ['paldea', 'kitakami', 'blueberry'], gen: 9})
    }

    let categorizedEntriesAndNumbers = []

    categories.forEach((category) => {
        const filteredEntries = dexEntries.filter(entry => {
            return category.games.includes(entry.game)
        })

        let filteredDexNumbers = []
        category.dexes.forEach(dex => {
            const entry = regionalDexNumbers.find(entry => entry.name === dex)
            if (entry) {
                if (entry.name.split('-').includes('kalos')) {
                    filteredDexNumbers.push({name: entry.name, number: entry.number})    
                } else {
                    filteredDexNumbers.push({name: dexToRegionMap.get(entry.name), number: entry.number})
                }
            } else {
                filteredDexNumbers.push({name: dexToRegionMap.get(dex), number: null})
            }
        })

        if (category.gen === 6) {
            if (!(filteredDexNumbers[0].number || filteredDexNumbers[1].number || filteredDexNumbers[2].number)) {
                filteredDexNumbers = [{name: 'kalos', number: null}, ...filteredDexNumbers.slice(3)]
            } else {
                filteredDexNumbers = filteredDexNumbers.filter((item, index) => (index < 3 && item.number || index >= 3))
            }
        } else if (category.gen === 4 || category.gen === 5 || category.gen === 7) {
            if (filteredDexNumbers[0].number === filteredDexNumbers[1].number) {
                filteredDexNumbers.splice(1, 1)
            }
        } else if (category.gen === 8) {
            if (!(filteredDexNumbers[0].number || filteredDexNumbers[1].number || filteredDexNumbers[2].number)) {
                filteredDexNumbers = [{name: 'galar', number: null}, ...filteredDexNumbers.slice(3)]
            }
        } else if (category.gen === 9) {
            if (!(filteredDexNumbers[0].number || filteredDexNumbers[1].number || filteredDexNumbers[2].number)) {
                filteredDexNumbers = [{name: 'paldea', number: null}]
            }
        }

        categorizedEntriesAndNumbers.push({entries: filteredEntries, dexNumbers: filteredDexNumbers})
    })
    return categorizedEntriesAndNumbers
}