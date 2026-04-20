export function formatProductName(rawName: string): string {
    if (!rawName) return '';

    let formatted = rawName;

    // 1. Remove Trash and Sizing Data
    // Remove "S-XXL", "S-XXXL", "Size#分#XS-XXL", "XS-XXL", "M-XXL", etc.
    formatted = formatted.replace(/s-xxxx*l/gi, '');
    formatted = formatted.replace(/xs-xxxx*l/gi, '');
    formatted = formatted.replace(/s-xxl/gi, '');
    formatted = formatted.replace(/size#.*?#.*?/gi, '');
    formatted = formatted.replace(/\b(size|talla)\b/gi, '');
    // Remove extra connectors maybe
    formatted = formatted.replace(/Nike connect recognition/gi, '');
    
    // 2. English to Portuguese Replacements (Match whole words primarily)
    const replacements: Record<string, string> = {
        'at home': 'Titular',
        'home': 'Titular',
        'away': 'Reserva',
        'third': '3ª',
        '3rd': '3ª',
        'womens': 'Feminina',
        'women': 'Feminina',
        'woman': 'Feminina',
        'mens': 'Masculina',
        'men': 'Masculina',
        'kids': 'Infantil',
        'kid': 'Infantil',
        'boys': 'Infantil',
        'retro shirt': 'Camisa Retrô',
        'retro jersey': 'Camisa Retrô',
        'retro': 'Retrô',
        'vintage': 'Retrô',
        'player version': '- Versão Jogador',
        'player': '- Versão Jogador',
        'fan version': '- Versão Torcedor',
        'fans version': '- Versão Torcedor',
        'fans': '- Versão Torcedor',
        'fan': '- Versão Torcedor',
        'goalkeeper': 'Goleiro',
        'gk': 'Goleiro',
        'long sleeve': 'Manga Longa',
        'short sleeve': 'Manga Curta',
        'tracksuit': 'Conjunto',
        'suit': 'Conjunto',
        'jacket': 'Jaqueta',
        'windbreaker': 'Corta Vento',
        'shirt': 'Camisa',
        'jersey': 'Camisa',
        'kit': 'Kit',
        'shorts': 'Short',
        'short': 'Short',
        'socks': 'Meião'
    };

    // Replace ignoring case but only full words or phrases
    for (const [eng, ptBR] of Object.entries(replacements)) {
        const regex = new RegExp(`\\b${eng}\\b`, 'gi');
        formatted = formatted.replace(regex, ptBR);
    }

    // 3. Normalizing structural words (e.g. "Camisa Retro" -> "Camisa Retrô", "Brazil" -> "Brasil")
    const specificCountries: Record<string, string> = {
        'brazil': 'Brasil',
        'argentina': 'Argentina',
        'germany': 'Alemanha',
        'german': 'Alemanha',
        'england': 'Inglaterra',
        'spain': 'Espanha',
        'france': 'França',
        'italy': 'Itália',
        'netherlands': 'Holanda',
        'portugal': 'Portugal',
        'belgium': 'Bélgica',
        'mexico': 'México',
        'colombia': 'Colômbia',
        'uruguay': 'Uruguai',
        'japan': 'Japão',
        // NBA
        'lakers': 'Lakers',
        'warriors': 'Warriors',
        'bulls': 'Bulls',
        'celtics': 'Celtics',
        'heat': 'Heat'
    };

    for (const [eng, ptBR] of Object.entries(specificCountries)) {
        const regex = new RegExp(`\\b${eng}\\b`, 'gi');
        formatted = formatted.replace(regex, ptBR);
    }

    // 4. Cleanup excessive spaces and weird formatting
    formatted = formatted.replace(/\s+/g, ' ').trim();

    // 5. Smart prefix fixing
    // Often titles are "2024 Brasil Titular". Let's try to prepend "Camisa " if it lacks product type 
    // and isn't a Kit or Short or Conjunto or Meião or Jaqueta
    const lowerFormatted = formatted.toLowerCase();
    const hasProductType = ['camisa', 'kit', 'short', 'conjunto', 'jaqueta', 'corta vento', 'meião'].some(t => lowerFormatted.includes(t));
    
    // Check if it's NBA (to use Regata instead of Camisa)
    const isNBA = ['lakers', 'warriors', 'bulls', 'celtics', 'heat', 'nba', 'basquete', 'basketball'].some(t => lowerFormatted.includes(t));

    if (!hasProductType) {
        if (isNBA) {
            formatted = `Regata NBA ${formatted}`;
        } else {
            formatted = `Camisa ${formatted}`;
        }
    }

    // Convert strings like "camisa" to capitalized case appropriately if it just got replaced or messed up
    formatted = formatted.replace(/\b(camisa|reserva|titular|retrô|infantil|feminina|goleiro|manga longa|manga curta)\b/gi, (match) => {
        return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
    });

    return formatted;
}
