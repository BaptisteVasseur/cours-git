const wordToEmoji = {
    'coeur': '❤️',
    'amour': '💕',
    'chat': '🐱',
    'chien': '🐶',
    'soleil': '☀️',
    'lune': '🌙',
    'eau': '💧',
    'feu': '🔥',
    'terre': '🌍'
};

class EmojiConverter {
    constructor(customDictionary = {}) {
        this.dictionary = { ...wordToEmoji, ...customDictionary };
        this._compiledPatterns = this._compilePatterns();
    }

    _compilePatterns() {
        return Object.entries(this.dictionary).map(([word, emoji]) => ({
            regex: new RegExp(`\\b${this._escapeRegExp(word)}\\b`, 'gi'),
            emoji
        }));
    }

    _escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    convert(text) {
        if (typeof text !== 'string') {
            throw new Error('Le texte doit être une chaîne de caractères');
        }

        return this._compiledPatterns.reduce(
            (result, { regex, emoji }) => result.replace(regex, emoji),
            text
        );
    }

    addWord(word, emoji) {
        this.dictionary[word] = emoji;
        this._compiledPatterns = this._compilePatterns();
    }

    removeWord(word) {
        delete this.dictionary[word];
        this._compiledPatterns = this._compilePatterns();
    }

    getDictionary() {
        return { ...this.dictionary };
    }
}

const defaultConverter = new EmojiConverter();

function convertTextToEmoji(text) {
    return defaultConverter.convert(text);
}

function createInteractiveTest() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Entrez votre texte : ', (answer) => {
        try {
            console.log('Résultat :', convertTextToEmoji(answer));
        } catch (error) {
            console.error('Erreur :', error.message);
        }
        rl.close();
    });
}

function runDemo() {
    const storyText = `Il était une fois un aventurier qui aimait son chien fidèle. 
Sous le soleil brillant, ils exploraient des terres mystérieuses. 
Quand la lune se levait, ils allumaient un feu près de l'eau cristalline. 
Son coeur était rempli d'amour pour cette terre sauvage.`;

    console.log("=== Histoire originale ===");
    console.log(storyText);
    console.log("\n=== Histoire avec emojis ===");
    console.log(convertTextToEmoji(storyText));
}

if (require.main === module) {
    runDemo();
}

module.exports = { 
    convertTextToEmoji, 
    wordToEmoji, 
    EmojiConverter, 
    createInteractiveTest 
};
