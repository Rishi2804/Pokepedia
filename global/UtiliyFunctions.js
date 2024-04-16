export function darkenColor(color, darkeningFactor) {
    // Convert hex color to RGB
    var r = parseInt(color.substring(1, 3), 16);
    var g = parseInt(color.substring(3, 5), 16);
    var b = parseInt(color.substring(5, 7), 16);

    var newR = Math.max(0, Math.floor(r * (1 - darkeningFactor)));
    var newG = Math.max(0, Math.floor(g * (1 - darkeningFactor)));
    var newB = Math.max(0, Math.floor(b * (1 - darkeningFactor)));

    // Convert RGB back to hex
    var newColor = "#" + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);

    return newColor;
}

export function formatName(name) {
    // Split the name by dash
    let words = name.split('-');

    // Capitalize the first letter of each word
    words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    // Join the words with space
    let formattedName = words.join(' ');

    return formattedName;
}

export function fixFlavourText(str) {
    return str.replace(/\f/g, '\n')  // Replace form feed with newline
              .replace(/\u00ad\n/g, '')  // Replace soft hyphen followed by newline with nothing
              .replace(/\u00ad/g, '')    // Replace standalone soft hyphen with nothing
              .replace(/ -\n/g, ' - ')   // Replace hyphen followed by newline with hyphen and space
              .replace(/-\n/g, '- ')     // Replace hyphen followed by newline with hyphen and space
              .replace(/(\s*\n)+/g, ' ');      // Replace newline with space
}

export function formatGameText(str) {
    switch (str) {
        case "firered": return "FireRed"
        case "leafgreen": return "LeafGreen"
        case "heartgold": return "HeartGold"
        case "soulsilver": return "SoulSilver"
        case "lets-go-pikachu": return "Let's Go Pikachu"
        case "lets-go-eevee": return "Let's Go Eevee"
        case "legends-arceus": return "Legends: Arceus"
        default: return formatName(str)
    }
}