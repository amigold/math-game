// Speech Game Data - Syllables and Words for Different Levels

const SPEECH_DATA = {
    // Level 1: Simple syllables with basic vowels
    level1: [
        {
            syllable: 'בָּ',
            sound: 'ba',
            examples: ['בָּא', 'בָּנָה', 'בָּשָׂר'],
            description: 'בּ + קָמַץ = בָּ'
        },
        {
            syllable: 'מִי',
            sound: 'mi',
            examples: ['מִי', 'מִילָה', 'מִדָּה'],
            description: 'מ + חִירִיק + יוֹד = מִי'
        },
        {
            syllable: 'לוֹ',
            sound: 'lo',
            examples: ['לוֹ', 'לוֹקֵחַ', 'לוֹמֵד'],
            description: 'ל + חוֹלָם = לוֹ'
        },
        {
            syllable: 'דַּ',
            sound: 'da',
            examples: ['דַּג', 'דַּף', 'דַּל'],
            description: 'דּ + פַּתַח = דַּ'
        },
        {
            syllable: 'שָׁ',
            sound: 'sha',
            examples: ['שָׁם', 'שָׁלוֹם', 'שָׁנָה'],
            description: 'שׁ + קָמַץ = שָׁ'
        },
        {
            syllable: 'תּוֹ',
            sound: 'to',
            examples: ['תּוֹר', 'תּוֹדָה', 'תּוֹרָה'],
            description: 'תּ + חוֹלָם = תּוֹ'
        },
        {
            syllable: 'רֵ',
            sound: 're',
            examples: ['רֵעַ', 'רֵיק', 'רֵאשׁ'],
            description: 'ר + צֵרֵי = רֵ'
        },
        {
            syllable: 'כָּ',
            sound: 'ka',
            examples: ['כָּךְ', 'כָּבוֹד', 'כָּל'],
            description: 'כּ + קָמַץ = כָּ'
        }
    ],

    // Level 2: More complex syllables
    level2: [
        {
            syllable: 'צְ',
            sound: 'tse',
            examples: ['צְבִי', 'צְדָקָה', 'צְפַרְדֵּעַ'],
            description: 'צ + שְׁוָא = צְ'
        },
        {
            syllable: 'גַּ',
            sound: 'ga',
            examples: ['גַּן', 'גַּם', 'גַּג'],
            description: 'גּ + פַּתַח = גַּ'
        },
        {
            syllable: 'פֶּ',
            sound: 'pe',
            examples: ['פֶּה', 'פֶּרַח', 'פֶּתַח'],
            description: 'פּ + סֶגּוֹל = פֶּ'
        },
        {
            syllable: 'נוּ',
            sound: 'nu',
            examples: ['נוּן', 'נוּר', 'נוּשָׂא'],
            description: 'נ + שׁוּרוּק = נוּ'
        },
        {
            syllable: 'חֵ',
            sound: 'che',
            examples: ['חֵן', 'חֵלֶק', 'חֵץ'],
            description: 'ח + צֵרֵי = חֵ'
        },
        {
            syllable: 'עַ',
            sound: 'a',
            examples: ['עַם', 'עַל', 'עַז'],
            description: 'ע + פַּתַח = עַ'
        },
        {
            syllable: 'סִ',
            sound: 'si',
            examples: ['סִיר', 'סִפּוּר', 'סִדּוּר'],
            description: 'ס + חִירִיק = סִ'
        },
        {
            syllable: 'קוֹ',
            sound: 'ko',
            examples: ['קוֹל', 'קוֹרֵא', 'קוֹפֵץ'],
            description: 'ק + חוֹלָם = קוֹ'
        }
    ],

    // Level 3: Short complete words
    level3: [
        {
            word: 'כֶּלֶב',
            sound: 'kelev',
            description: 'חַיָּה בַּיִת'
        },
        {
            word: 'חָתוּל',
            sound: 'chatul',
            description: 'חַיָּה בַּיִת'
        },
        {
            word: 'יֶלֶד',
            sound: 'yeled',
            description: 'בֵּן אָדָם צָעִיר'
        },
        {
            word: 'בַּיִת',
            sound: 'bayit',
            description: 'מָקוֹם לָגוּר'
        },
        {
            word: 'שֶׁמֶשׁ',
            sound: 'shemesh',
            description: 'מְאִירָה בַּיּוֹם'
        },
        {
            word: 'יָרֵחַ',
            sound: 'yareach',
            description: 'מֵאִיר בַּלַּיְלָה'
        },
        {
            word: 'מַיִם',
            sound: 'mayim',
            description: 'שׁוֹתִים'
        },
        {
            word: 'לֶחֶם',
            sound: 'lechem',
            description: 'אוֹכְלִים'
        },
        {
            word: 'סוּס',
            sound: 'sus',
            description: 'חַיָּה גְּדוֹלָה'
        },
        {
            word: 'פִּיל',
            sound: 'pil',
            description: 'חַיָּה עֲנָקִית'
        }
    ],

    // Level 4: Longer words
    level4: [
        {
            word: 'אוֹפַנַּיִם',
            sound: 'ofanayim',
            description: 'כְּלִי תַּחְבּוּרָה עִם גַּלְגַּלַּיִם'
        },
        {
            word: 'מְכוֹנִית',
            sound: 'mechonit',
            description: 'כְּלִי תַּחְבּוּרָה עִם מָנוֹעַ'
        },
        {
            word: 'פַּרְפַּר',
            sound: 'parpar',
            description: 'חֶרֶק מְעוֹפֵף צִבְעוֹנִי'
        },
        {
            word: 'צְפַרְדֵּעַ',
            sound: 'tsfardeah',
            description: 'חַיָּה יְרֻקָּה שֶׁקּוֹפֶצֶת'
        },
        {
            word: 'אַרְיֵה',
            sound: 'aryeh',
            description: 'מֶלֶךְ הַחַיּוֹת'
        },
        {
            word: 'שׁוּעָל',
            sound: 'shual',
            description: 'חַיָּה חֲכָמָה'
        },
        {
            word: 'קוֹאָלָה',
            sound: 'koala',
            description: 'חַיָּה אֲפוֹרָה מֵאוֹסְטְרַלְיָה'
        },
        {
            word: 'דּוֹלְפִין',
            sound: 'dolfin',
            description: 'חַיָּה חֲכָמָה בַּיָּם'
        }
    ],

    // Prizes for collection (like the other games)
    prizes: [
        { emoji: '🌟', name: 'כּוֹכָב', color: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' },
        { emoji: '🎨', name: 'צִבְעִים', color: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)' },
        { emoji: '🎸', name: 'גִּיטָרָה', color: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)' },
        { emoji: '⚽', name: 'כַּדּוּר', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { emoji: '🚀', name: 'חֲלָלִית', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
        { emoji: '🎯', name: 'מַטָּרָה', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
        { emoji: '🎪', name: 'קִרְקַס', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
        { emoji: '🎭', name: 'מַסֵּכוֹת', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
        { emoji: '🎬', name: 'סֶרֶט', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
        { emoji: '🎲', name: 'קֻבִּיָּה', color: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)' },
        { emoji: '🎺', name: 'חֲצוֹצְרָה', color: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)' },
        { emoji: '🎹', name: 'פְּסַנְתֵּר', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
    ]
};

// Export for use in the game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SPEECH_DATA;
}
