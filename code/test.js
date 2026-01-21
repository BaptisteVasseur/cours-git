const { convertTextToEmoji, wordToEmoji, EmojiConverter } = require('./main.js');

class TestRunner {
    constructor() {
        this.testsPassés = 0;
        this.testsTotal = 0;
        this.testSuites = [];
    }

    assertEquals(actual, expected, testName) {
        this.testsTotal++;
    if (actual === expected) {
        console.log(`✅ ${testName} : RÉUSSI`);
            this.testsPassés++;
        return true;
    } else {
        console.log(`❌ ${testName} : ÉCHEC`);
        console.log(`   Attendu: "${expected}"`);
        console.log(`   Obtenu:  "${actual}"`);
        return false;
    }
}

    assertContains(text, word, testName) {
        this.testsTotal++;
    if (text.includes(word)) {
        console.log(`✅ ${testName} : RÉUSSI`);
            this.testsPassés++;
        return true;
    } else {
        console.log(`❌ ${testName} : ÉCHEC`);
        console.log(`   Le texte "${text}" ne contient pas "${word}"`);
        return false;
    }
}

    assertThrows(fn, testName) {
        this.testsTotal++;
        try {
            fn();
            console.log(`❌ ${testName} : ÉCHEC - Aucune erreur levée`);
            return false;
        } catch (error) {
            console.log(`✅ ${testName} : RÉUSSI`);
            this.testsPassés++;
            return true;
        }
    }

    runTest(testFn, suiteName) {
        console.log(`\n=== ${suiteName} ===`);
        testFn.call(this);
    }

    runAllTests() {
        console.log('=== Tests du convertisseur emoji ===\n');
        
        this.runTest(this.testConversionsBasiques, 'Tests de conversions basiques');
        this.runTest(this.testCasseSensitive, 'Tests de sensibilité à la casse');
        this.runTest(this.testDictionnaire, 'Tests du dictionnaire');
        this.runTest(this.testHistoireComplete, 'Test histoire complète');
        this.runTest(this.testGestionErreurs, 'Tests de gestion d\'erreurs');
        this.runTest(this.testClasseEmojiConverter, 'Tests de la classe EmojiConverter');
        
        this.afficherResume();
    }

    afficherResume() {
        console.log('\n=== RÉSUMÉ DES TESTS ===');
        console.log(`Tests réussis: ${this.testsPassés}/${this.testsTotal}`);

        if (this.testsPassés === this.testsTotal) {
            console.log('🎉 TOUS LES TESTS SONT RÉUSSIS ! 🎉');
        } else {
            console.log('⚠️  Certains tests ont échoué. Vérifie le code.');
        }
    }
}

TestRunner.prototype.testConversionsBasiques = function() {
    this.assertEquals(
        convertTextToEmoji("J'aime mon chat"),
        "J'aime mon 🐱",
        "Conversion chat"
    );

    this.assertEquals(
        convertTextToEmoji("Le soleil brille et mon coeur bat"),
        "Le ☀️ brille et mon ❤️ bat",
        "Conversion multiple"
    );

    this.assertEquals(
        convertTextToEmoji("Bonjour le monde"),
        "Bonjour le monde",
        "Aucune conversion"
    );

    this.assertEquals(
        convertTextToEmoji("J'ai du courage dans le coeur"),
        "J'ai du courage dans le ❤️",
        "Mots partiels"
    );

    this.assertEquals(
        convertTextToEmoji("coeur amour chat chien soleil lune eau feu terre"),
        "❤️ 💕 🐱 🐶 ☀️ 🌙 💧 🔥 🌍",
        "Tous les emojis"
    );
};

TestRunner.prototype.testCasseSensitive = function() {
    this.assertEquals(
        convertTextToEmoji("J'aime le SOLEIL"),
        "J'aime le ☀️",
        "Casse majuscule"
    );

    this.assertEquals(
        convertTextToEmoji("Mon Chien est gentil"),
        "Mon 🐶 est gentil",
        "Casse mixte"
    );
};

TestRunner.prototype.testDictionnaire = function() {
const expectedKeys = ['coeur', 'amour', 'chat', 'chien', 'soleil', 'lune', 'eau', 'feu', 'terre'];
const actualKeys = Object.keys(wordToEmoji);

    this.assertEquals(
        actualKeys.length,
        expectedKeys.length,
        "Nombre de mots dans le dictionnaire"
    );

    this.assertEquals(wordToEmoji.chat, '🐱', "Emoji chat");
    this.assertEquals(wordToEmoji.soleil, '☀️', "Emoji soleil");
    this.assertEquals(wordToEmoji.coeur, '❤️', "Emoji coeur");
};

TestRunner.prototype.testHistoireComplete = function() {
const histoire = `Il était une fois un aventurier qui aimait son chien fidèle. 
Sous le soleil brillant, ils exploraient des terres mystérieuses. 
Quand la lune se levait, ils allumaient un feu près de l'eau cristalline. 
Son coeur était rempli d'amour pour cette terre sauvage.`;

const histoireResult = convertTextToEmoji(histoire);

    this.assertContains(histoireResult, '🐶', "Chien présent dans l'histoire");
    this.assertContains(histoireResult, '☀️', "Soleil présent dans l'histoire");
    this.assertContains(histoireResult, '🌙', "Lune présente dans l'histoire");
    this.assertContains(histoireResult, '❤️', "Coeur présent dans l'histoire");
};

TestRunner.prototype.testGestionErreurs = function() {
    this.assertThrows(
        () => convertTextToEmoji(null),
        "Erreur avec valeur null"
    );

    this.assertThrows(
        () => convertTextToEmoji(undefined),
        "Erreur avec valeur undefined"
    );

    this.assertThrows(
        () => convertTextToEmoji(123),
        "Erreur avec nombre"
    );
};

TestRunner.prototype.testClasseEmojiConverter = function() {
    const converter = new EmojiConverter();
    
    this.assertEquals(
        converter.convert("J'aime mon chat"),
        "J'aime mon 🐱",
        "Conversion avec instance de classe"
    );

    converter.addWord("test", "🧪");
    this.assertEquals(
        converter.convert("Un test"),
        "Un 🧪",
        "Ajout de nouveau mot"
    );

    converter.removeWord("test");
    this.assertEquals(
        converter.convert("Un test"),
        "Un test",
        "Suppression de mot"
    );

    const customConverter = new EmojiConverter({ "hello": "👋" });
    this.assertEquals(
        customConverter.convert("hello world"),
        "👋 world",
        "Dictionnaire personnalisé"
    );
};

const testRunner = new TestRunner();

if (require.main === module) {
    testRunner.runAllTests();
}

module.exports = {
    get testsPassés() { return testRunner.testsPassés; },
    get testsTotal() { return testRunner.testsTotal; },
    get allTestsPassed() { return testRunner.testsPassés === testRunner.testsTotal; },
    TestRunner
};
