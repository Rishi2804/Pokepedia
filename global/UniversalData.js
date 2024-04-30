export const dexes = ["national", "kanto", "original-johto", "hoenn", 
                        "original-sinnoh", "extended-sinnoh", "updated-johto",
                        "original-unova", "updated-unova", "kalos-central", "kalos-coastal",
                        "kalos-mountain", "updated-hoenn", "original-alola", "original-melemele",
                        "original-akala", "original-ulaula", "original-poni", "updated-alola",
                        "updated-melemele", "updated-akala", "updated-ulaula", "updated-poni", "letsgo-kanto",
                        "galar", "isle-of-armor", "crown-tundra", "hisui", "paldea", "kitakami", "blueberry"]

export const versionGroups = ["red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald", 
                                "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver", "black-white", 
                                "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire", "sun-moon", "ultra-sun-ultra-moon", 
                                "lets-go-pikachu-lets-go-eevee", "sword-shield", "brilliant-diamond-and-shining-pearl", 
                                "legends-arceus", "scarlet-violet"]

export const genMap = new Map([
    [1, "i"],
    [2, "ii"],
    [3, "iii"],
    [4, "iv"],
    [5, "v"],
    [6, "vi"],
    [7, "vii"],
    [8, "viii"],
    [9, "ix"]
])

export const genMapUppercase = new Map([
    [1, "I"],
    [2, "II"],
    [3, "III"],
    [4, "IV"],
    [5, "V"],
    [6, "VI"],
    [7, "VII"],
    [8, "VIII"],
    [9, "IX"]
])

export const dexToRegionMap = new Map([
    ['kanto', 'kanto'],
    ['letsgo-kanto', 'kanto'],
    ['original-johto', 'johto'],
    ['updated-johto', 'johto'],
    ['hoenn', 'hoenn'],
    ['updated-hoenn', 'hoenn'],
    ['sinnoh', 'sinnoh'],
    ['original-sinnoh', 'sinnoh'],
    ['extended-sinnoh', 'sinnoh'],
    ['unova', 'unova'],
    ['original-unova', 'unova'],
    ['updated-unova', 'unova'],
    ['kalos-central', 'kalos'],
    ['kalos-coastal', 'kalos'],
    ['kalos-mountain', 'kalos'],
    ['original-alola', 'alola'],
    ['updated-alola', 'alola'],
    ['galar', 'galar'],
    ['isle-of-armor', 'isle-of-armor'],
    ['crown-tundra', 'crown-tundra'],
    ['hisui', 'hisui'],
    ['paldea', 'paldea'],
    ['kitakami', 'kitakami'],
    ['blueberry', 'blueberry']
])

export const types = [
    {
        name: "normal",
        double_damage_from : ["fighting"],
        double_damage_to: [],
        half_damage_from: [],
        half_damage_to: ["rock", "steel"],
        no_damage_from: ["ghost"],
        no_damage_to: ["ghost"]
    },
    {
        name: "fighting",
        double_damage_from : ["flying", "psychic", "fairy"],
        double_damage_to: ["normal", "rock", "steel", "ice", "dark"],
        half_damage_from: ["rock", "bug", "dark"],
        half_damage_to: ["flying", "poison", "psychic", "bug", "fairy"],
        no_damage_from: [],
        no_damage_to: ["ghost"]
    },
    {
        name: "flying",
        double_damage_from : ["rock", "electric", "ice"],
        double_damage_to: ["fighting", "rock", "grass"],
        half_damage_from: ["fighting", "rock", "grass"],
        half_damage_to: ["rock", "steel", "electric"],
        no_damage_from: ["ground"],
        no_damage_to: []
    },
    {
        name: "poison",
        double_damage_from : ["ground", "psychic"],
        double_damage_to: ["grass", "fairy"],
        half_damage_from: ["fighting", "poison", "bug", "grass", "fairy"],
        half_damage_to: ["poison", "ground", "grass", "ghost"],
        no_damage_from: [],
        no_damage_to: ["steel"]
    },
    {
        name: "ground",
        double_damage_from : ["water", "grass", "ice"],
        double_damage_to: ["poision", "rock", "steel", "fire", "electric"],
        half_damage_from: ["poison", "rock"],
        half_damage_to: ["bug", "grass"],
        no_damage_from: ["electric"],
        no_damage_to: ["flying"]
    },
    {
        name: "rock",
        double_damage_from : ["fighting", "ground", "steel", "water", "grass"],
        double_damage_to: ["flying", "bug", "fire", "ice"],
        half_damage_from: ["normal", "flying", "poison", "fire"],
        half_damage_to: ["fighting", "ground", "steel"],
        no_damage_from: [],
        no_damage_to: []
    },
    {
        name: "bug",
        double_damage_from : ["flying", "rock", "fire"],
        double_damage_to: ["grass", "psychic", "dark"],
        half_damage_from: ["fighting", "ground", "grass"],
        half_damage_to: ["fighting", "flying", "poison", "ghost", "steel", "fire", "fairy"],
        no_damage_from: [],
        no_damage_to: []
    },
    {
        name: "ghost",
        double_damage_from : ["ghost", "dark"],
        double_damage_to: ["ghost", "psychic"],
        half_damage_from: ["poison", "bug"],
        half_damage_to: ["dark"],
        no_damage_from: ["fighting", "normal"],
        no_damage_to: ["normal"]
    },
    {
        name: "steel",
        double_damage_from : ["fighting", "ground", "fire"],
        double_damage_to: ["rock", "ice", "fairy"],
        half_damage_from: ["normal", "flying", "rock", "bug", "steel", "grass", "psychic", "ice", "dragon", "fairy"],
        half_damage_to: ["steel", "fire", "water", "electric"],
        no_damage_from: ["poison"],
        no_damage_to: []
    },
    {
        name: "fire",
        double_damage_from : ["ground", "rock", "water"],
        double_damage_to: ["bug", "steel", "grass", "ice"],
        half_damage_from: ["bug", "steel", "fire", "grass", "ice", "fairy"],
        half_damage_to: ["rock", "fire", "water", "dragon"],
        no_damage_from: [],
        no_damage_to: []
    },
    {
        name: "water",
        double_damage_from : ["grass", "electric"],
        double_damage_to: ["ground", "rock", "fire"],
        half_damage_from: ["steel", "fire", "water", "ice"],
        half_damage_to: ["water", "grass", "dragon"],
        no_damage_from: [],
        no_damage_to: []
    },
    {
        name: "grass",
        double_damage_from : ["flying", "poison", "bug", "fire", "ice"],
        double_damage_to: ["ground", "rock", "water"],
        half_damage_from: ["ground", "water", "grass", "electric"],
        half_damage_to: ["flying", "poison", "bug", "steel", "fire", "grass", "dragon"],
        no_damage_from: [],
        no_damage_to: []
    },
    {
        name: "electric",
        double_damage_from : ["ground"],
        double_damage_to: ["flying", "water"],
        half_damage_from: ["flying", "steel", "electric"],
        half_damage_to: ["grass", "electric", "dragon"],
        no_damage_from: [],
        no_damage_to: ["ground"]
    },
    {
        name: "psychic",
        double_damage_from : ["bug", "ghost", "dark"],
        double_damage_to: ["fighting", "poison"],
        half_damage_from: ["fighting", "psychic"],
        half_damage_to: ["steel", "psychic"],
        no_damage_from: [],
        no_damage_to: ["dark"]
    },
    {
        name: "ice",
        double_damage_from : ["fighting", "rock", "steel", "fire"],
        double_damage_to: ["flying", "ground", "grass", "dragon"],
        half_damage_from: ["ice"],
        half_damage_to: ["steel", "fire", "water", "ice"],
        no_damage_from: [],
        no_damage_to: []
    },
    {
        name: "dragon",
        double_damage_from : ["ice", "dragon", "fairy"],
        double_damage_to: ["dragon"],
        half_damage_from: ["fire", "water", "grass", "electric"],
        half_damage_to: ["steel"],
        no_damage_from: [],
        no_damage_to: ["fairy"]
    },
    {
        name: "dark",
        double_damage_from : ["fighting", "bug", "fairy"],
        double_damage_to: ["ghost", "psychic"],
        half_damage_from: ["ghost", "dark"],
        half_damage_to: ["fighting", "dark", "fairy"],
        no_damage_from: ["psychic"],
        no_damage_to: []
    },
    {
        name: "fairy",
        double_damage_from : ["poison", "steel"],
        double_damage_to: ["fighing", "dragon", "dark"],
        half_damage_from: ["fighting", "bug", "dark"],
        half_damage_to: ["poison", "steel", "fire"],
        no_damage_from: ["dragon"],
        no_damage_to: []
    },
]

