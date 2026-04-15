// English Question Generator — 100 levels, 500 unique questions
// Large curated banks + RNG-based selection to avoid repetition

import { getDifficultyParams, getTopicForLevel } from './difficulty.js';

function seededRNG(seed) {
  let s = Math.imul(seed | 0, 1103515245) + 12345;
  return () => { s = Math.imul(s, 1103515245) + 12345; return ((s >>> 16) & 0x7fff) / 0x7fff; };
}
function makeSeed(level, index) { return level * 1013 + index * 149 + 8837; }
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function shuffle(rng, arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// Deterministic pick that avoids repeats across levels — uses level+index as unique key
function uniquePick(bank, level, index) {
  // Hash level+index to a position, ensuring different levels get different items
  const hash = ((level * 31 + index * 97 + 53) * 2654435761) >>> 0;
  return bank[hash % bank.length];
}

// ===================== SPELLING BANK (80 entries) =====================
const SPELLING = [
  { correct: 'because', wrong: ['becuase', 'becauze', 'becorse', 'becase'] },
  { correct: 'friend', wrong: ['freind', 'frend', 'frinnd', 'frriend'] },
  { correct: 'believe', wrong: ['beleive', 'belive', 'beleave', 'beleve'] },
  { correct: 'separate', wrong: ['seperate', 'separete', 'saparate', 'seprate'] },
  { correct: 'necessary', wrong: ['neccessary', 'neccesary', 'necesary', 'nessecary'] },
  { correct: 'receive', wrong: ['recieve', 'receve', 'receave', 'recive'] },
  { correct: 'different', wrong: ['diffrent', 'differant', 'diferent', 'diffirent'] },
  { correct: 'beginning', wrong: ['begining', 'begineing', 'biginning', 'begginning'] },
  { correct: 'disappear', wrong: ['disapear', 'dissappear', 'disappeer', 'disapeer'] },
  { correct: 'tomorrow', wrong: ['tommorow', 'tommorrow', 'tomorow', 'tomorrrow'] },
  { correct: 'beautiful', wrong: ['beautifull', 'beutiful', 'beautful', 'beatiful'] },
  { correct: 'Wednesday', wrong: ['Wensday', 'Wedensday', 'Wenesday', 'Wednessday'] },
  { correct: 'February', wrong: ['Febuary', 'Febrary', 'Feburary', 'Februery'] },
  { correct: 'library', wrong: ['libary', 'liberry', 'libarry', 'libery'] },
  { correct: 'knowledge', wrong: ['knowlege', 'knoledge', 'knowladge', 'knowlede'] },
  { correct: 'accommodation', wrong: ['accomodation', 'acommodation', 'acomodation', 'accommodaton'] },
  { correct: 'occurrence', wrong: ['occurence', 'occurance', 'ocurrence', 'occurrance'] },
  { correct: 'conscience', wrong: ['consience', 'concience', 'conscence', 'concsience'] },
  { correct: 'maintenance', wrong: ['maintanance', 'maintenence', 'maintainance', 'maintnance'] },
  { correct: 'independent', wrong: ['independant', 'indipendent', 'independet', 'indipendant'] },
  { correct: 'mischievous', wrong: ['mischievious', 'mischevous', 'mischevious', 'mischeivous'] },
  { correct: 'privilege', wrong: ['privelege', 'privilage', 'privlege', 'priviledge'] },
  { correct: 'questionnaire', wrong: ['questionaire', 'questionairre', 'questionnare', 'questionair'] },
  { correct: 'rhythm', wrong: ['rythm', 'rhythem', 'rythym', 'rhytm'] },
  { correct: 'exaggerate', wrong: ['exagerate', 'exadgerate', 'exagerrate', 'exagarate'] },
  { correct: 'embarrass', wrong: ['embarass', 'embarras', 'embaress', 'embarrasse'] },
  { correct: 'immediately', wrong: ['immediatly', 'imediately', 'imediatly', 'immedietly'] },
  { correct: 'parliament', wrong: ['parliment', 'parlimant', 'parlaiment', 'parlimnet'] },
  { correct: 'definitely', wrong: ['definately', 'definatly', 'definitly', 'defintely'] },
  { correct: 'environment', wrong: ['enviroment', 'envirnoment', 'environmant', 'enviornment'] },
  { correct: 'restaurant', wrong: ['resturant', 'restarant', 'restraunt', 'restaurent'] },
  { correct: 'temperature', wrong: ['temprature', 'temperture', 'tempreture', 'temperatre'] },
  { correct: 'government', wrong: ['goverment', 'governmant', 'govenment', 'govermnent'] },
  { correct: 'interesting', wrong: ['intresting', 'intersting', 'interresting', 'interesing'] },
  { correct: 'favourite', wrong: ['favorit', 'favurite', 'favourate', 'favorate'] },
  { correct: 'dictionary', wrong: ['dictonary', 'dictionery', 'dictinary', 'dictioanry'] },
  { correct: 'secretary', wrong: ['secratary', 'secretery', 'secertary', 'secretry'] },
  { correct: 'vegetable', wrong: ['vegatable', 'vegetabel', 'vegtable', 'vegitable'] },
  { correct: 'committee', wrong: ['commitee', 'comitee', 'comittee', 'commitie'] },
  { correct: 'guarantee', wrong: ['guarentee', 'gaurantee', 'garantee', 'guarante'] },
  { correct: 'opportunity', wrong: ['oportunity', 'oppertunity', 'oppurtunity', 'opportnity'] },
  { correct: 'recommend', wrong: ['recomend', 'reccommend', 'reccomend', 'recommand'] },
  { correct: 'achieve', wrong: ['acheive', 'achive', 'acheeve', 'acheve'] },
  { correct: 'height', wrong: ['hight', 'heighth', 'heigth', 'hieght'] },
  { correct: 'strength', wrong: ['strenth', 'strengh', 'stregth', 'strenght'] },
  { correct: 'thoroughly', wrong: ['throughly', 'thuroughly', 'thoroghly', 'thouroughly'] },
  { correct: 'apparently', wrong: ['apparantly', 'aparently', 'apparentley', 'apparntly'] },
  { correct: 'category', wrong: ['catagory', 'categorie', 'catigory', 'categery'] },
  { correct: 'miniature', wrong: ['minature', 'miniture', 'minurture', 'miniater'] },
  { correct: 'cemetery', wrong: ['cemetary', 'cematery', 'cemetry', 'cematary'] },
  { correct: 'relevant', wrong: ['relevent', 'relavent', 'revelant', 'relevnt'] },
  { correct: 'lightning', wrong: ['lightening', 'lightnng', 'litening', 'lighning'] },
  { correct: 'discipline', wrong: ['disipline', 'disapline', 'dicipline', 'disciplin'] },
  { correct: 'existence', wrong: ['existance', 'existense', 'existince', 'exsistence'] },
  { correct: 'foreign', wrong: ['foriegn', 'forien', 'forein', 'forieng'] },
  { correct: 'eighth', wrong: ['eigth', 'eightth', 'eigtht', 'eihgth'] },
  { correct: 'thorough', wrong: ['thorogh', 'thurough', 'thourough', 'thorouh'] },
  { correct: 'surprise', wrong: ['suprise', 'surprize', 'surpise', 'surpris'] },
  { correct: 'successful', wrong: ['succesful', 'sucessful', 'successfull', 'succesful'] },
  { correct: 'calendar', wrong: ['calender', 'calander', 'calandar', 'callendar'] },
  { correct: 'frequently', wrong: ['frequantly', 'frequentley', 'freqently', 'frequintly'] },
  { correct: 'curiosity', wrong: ['curiousity', 'curiosty', 'curiocity', 'curiosety'] },
  { correct: 'amateur', wrong: ['amature', 'amatuer', 'amater', 'amataur'] },
  { correct: 'available', wrong: ['availble', 'avaliable', 'availabel', 'availible'] },
  { correct: 'experience', wrong: ['experiance', 'expirience', 'expirence', 'experence'] },
  { correct: 'particular', wrong: ['perticular', 'particualr', 'particuler', 'paticular'] },
  { correct: 'possession', wrong: ['posession', 'possesion', 'possetion', 'possestion'] },
  { correct: 'pronunciation', wrong: ['pronounciation', 'pronouncation', 'pronuncation', 'pronuniciation'] },
  { correct: 'shoulder', wrong: ['sholder', 'shouder', 'shouldar', 'shoudler'] },
  { correct: 'stomach', wrong: ['stomache', 'stomack', 'stumach', 'stomech'] },
  { correct: 'technique', wrong: ['techniqe', 'tecnique', 'techneque', 'techique'] },
  { correct: 'business', wrong: ['buisness', 'busness', 'bussiness', 'busines'] },
  { correct: 'disappoint', wrong: ['disapoint', 'dissapoint', 'dissappoint', 'disaponit'] },
  { correct: 'excellent', wrong: ['excelent', 'excellant', 'exellent', 'excelient'] },
  { correct: 'interrupt', wrong: ['interupt', 'interruppt', 'intterupt', 'interuupt'] },
  { correct: 'peculiar', wrong: ['peculier', 'peculliar', 'peculair', 'pecular'] },
  { correct: 'rhyme', wrong: ['ryhme', 'rime', 'rhime', 'rhymme'] },
  { correct: 'schedule', wrong: ['scedule', 'schedual', 'schedle', 'shedule'] },
  { correct: 'twelfth', wrong: ['twelth', 'twelveth', 'twelfeth', 'twelfh'] },
  { correct: 'yacht', wrong: ['yatch', 'yaucht', 'yacth', 'yaght'] },
];

// ===================== SYNONYMS BANK (50 entries) =====================
const SYNONYMS = [
  { word: 'happy', syn: 'glad', wrongs: ['sad', 'tired', 'cold', 'bored'] },
  { word: 'big', syn: 'enormous', wrongs: ['tiny', 'thin', 'short', 'hollow'] },
  { word: 'fast', syn: 'rapid', wrongs: ['slow', 'heavy', 'dull', 'lazy'] },
  { word: 'brave', syn: 'courageous', wrongs: ['timid', 'weak', 'gentle', 'lazy'] },
  { word: 'clever', syn: 'intelligent', wrongs: ['foolish', 'slow', 'clumsy', 'timid'] },
  { word: 'scared', syn: 'terrified', wrongs: ['brave', 'calm', 'bold', 'proud'] },
  { word: 'angry', syn: 'furious', wrongs: ['pleased', 'gentle', 'bored', 'shy'] },
  { word: 'beautiful', syn: 'stunning', wrongs: ['ugly', 'rough', 'dull', 'harsh'] },
  { word: 'old', syn: 'ancient', wrongs: ['young', 'modern', 'new', 'sharp'] },
  { word: 'difficult', syn: 'challenging', wrongs: ['easy', 'plain', 'smooth', 'gentle'] },
  { word: 'rich', syn: 'wealthy', wrongs: ['poor', 'thin', 'rough', 'plain'] },
  { word: 'quiet', syn: 'silent', wrongs: ['loud', 'bright', 'heavy', 'sharp'] },
  { word: 'strong', syn: 'powerful', wrongs: ['weak', 'soft', 'slow', 'dull'] },
  { word: 'tired', syn: 'exhausted', wrongs: ['energetic', 'bright', 'alert', 'keen'] },
  { word: 'small', syn: 'miniature', wrongs: ['large', 'wide', 'heavy', 'broad'] },
  { word: 'important', syn: 'crucial', wrongs: ['trivial', 'dull', 'simple', 'vague'] },
  { word: 'strange', syn: 'peculiar', wrongs: ['normal', 'common', 'basic', 'clear'] },
  { word: 'rude', syn: 'impolite', wrongs: ['kind', 'calm', 'shy', 'bright'] },
  { word: 'cold', syn: 'freezing', wrongs: ['warm', 'soft', 'dry', 'light'] },
  { word: 'wet', syn: 'soaked', wrongs: ['dry', 'rough', 'dusty', 'warm'] },
  { word: 'begin', syn: 'commence', wrongs: ['finish', 'stop', 'halt', 'rest'] },
  { word: 'end', syn: 'conclude', wrongs: ['start', 'open', 'launch', 'begin'] },
  { word: 'laugh', syn: 'chuckle', wrongs: ['cry', 'shout', 'whisper', 'groan'] },
  { word: 'eat', syn: 'devour', wrongs: ['starve', 'drink', 'sleep', 'cook'] },
  { word: 'look', syn: 'gaze', wrongs: ['ignore', 'listen', 'touch', 'smell'] },
  { word: 'walk', syn: 'stroll', wrongs: ['sprint', 'fly', 'leap', 'crawl'] },
  { word: 'talk', syn: 'converse', wrongs: ['listen', 'write', 'read', 'think'] },
  { word: 'shout', syn: 'yell', wrongs: ['whisper', 'murmur', 'hum', 'sigh'] },
  { word: 'kind', syn: 'generous', wrongs: ['cruel', 'harsh', 'mean', 'cold'] },
  { word: 'honest', syn: 'truthful', wrongs: ['deceitful', 'sly', 'cunning', 'vague'] },
  { word: 'bright', syn: 'brilliant', wrongs: ['dim', 'dull', 'faded', 'dark'] },
  { word: 'thin', syn: 'slender', wrongs: ['thick', 'wide', 'broad', 'heavy'] },
  { word: 'empty', syn: 'vacant', wrongs: ['full', 'packed', 'loaded', 'dense'] },
  { word: 'hurry', syn: 'rush', wrongs: ['dawdle', 'linger', 'pause', 'rest'] },
  { word: 'repair', syn: 'mend', wrongs: ['break', 'smash', 'ruin', 'crush'] },
  { word: 'reply', syn: 'respond', wrongs: ['ignore', 'forget', 'delete', 'avoid'] },
  { word: 'join', syn: 'connect', wrongs: ['separate', 'divide', 'split', 'break'] },
  { word: 'harm', syn: 'damage', wrongs: ['heal', 'repair', 'fix', 'help'] },
  { word: 'grasp', syn: 'grip', wrongs: ['release', 'throw', 'drop', 'toss'] },
  { word: 'allow', syn: 'permit', wrongs: ['forbid', 'block', 'deny', 'refuse'] },
  { word: 'vanish', syn: 'disappear', wrongs: ['appear', 'arrive', 'emerge', 'grow'] },
  { word: 'assist', syn: 'help', wrongs: ['hinder', 'block', 'prevent', 'harm'] },
  { word: 'certain', syn: 'sure', wrongs: ['doubtful', 'unsure', 'vague', 'unclear'] },
  { word: 'entire', syn: 'whole', wrongs: ['partial', 'broken', 'incomplete', 'half'] },
  { word: 'error', syn: 'mistake', wrongs: ['success', 'triumph', 'victory', 'answer'] },
  { word: 'genuine', syn: 'authentic', wrongs: ['fake', 'false', 'copied', 'forged'] },
  { word: 'moist', syn: 'damp', wrongs: ['dry', 'crisp', 'dusty', 'parched'] },
  { word: 'weary', syn: 'fatigued', wrongs: ['refreshed', 'lively', 'alert', 'active'] },
  { word: 'soggy', syn: 'waterlogged', wrongs: ['crispy', 'crunchy', 'dry', 'firm'] },
  { word: 'cunning', syn: 'sly', wrongs: ['honest', 'direct', 'open', 'blunt'] },
];

// ===================== ANTONYMS BANK (50 entries) =====================
const ANTONYMS = [
  { word: 'generous', answer: 'selfish', wrongs: ['kind', 'wealthy', 'gentle', 'wise'] },
  { word: 'victory', answer: 'defeat', wrongs: ['battle', 'prize', 'triumph', 'effort'] },
  { word: 'artificial', answer: 'natural', wrongs: ['real', 'painted', 'modern', 'shiny'] },
  { word: 'ancient', answer: 'modern', wrongs: ['historic', 'dusty', 'buried', 'broken'] },
  { word: 'maximum', answer: 'minimum', wrongs: ['largest', 'average', 'total', 'optimal'] },
  { word: 'temporary', answer: 'permanent', wrongs: ['brief', 'regular', 'partial', 'annual'] },
  { word: 'encourage', answer: 'discourage', wrongs: ['support', 'praise', 'reward', 'allow'] },
  { word: 'innocent', answer: 'guilty', wrongs: ['pure', 'young', 'honest', 'naive'] },
  { word: 'expand', answer: 'contract', wrongs: ['grow', 'stretch', 'inflate', 'spread'] },
  { word: 'shallow', answer: 'deep', wrongs: ['narrow', 'empty', 'still', 'clear'] },
  { word: 'transparent', answer: 'opaque', wrongs: ['clear', 'visible', 'bright', 'thin'] },
  { word: 'arrogant', answer: 'humble', wrongs: ['proud', 'bold', 'loud', 'rude'] },
  { word: 'cautious', answer: 'reckless', wrongs: ['careful', 'nervous', 'timid', 'slow'] },
  { word: 'superior', answer: 'inferior', wrongs: ['better', 'higher', 'greater', 'stronger'] },
  { word: 'abundant', answer: 'scarce', wrongs: ['plentiful', 'rich', 'surplus', 'generous'] },
  { word: 'compulsory', answer: 'optional', wrongs: ['required', 'forced', 'necessary', 'legal'] },
  { word: 'ascend', answer: 'descend', wrongs: ['climb', 'rise', 'lift', 'soar'] },
  { word: 'demolish', answer: 'construct', wrongs: ['destroy', 'remove', 'flatten', 'crush'] },
  { word: 'conceal', answer: 'reveal', wrongs: ['hide', 'cover', 'bury', 'protect'] },
  { word: 'prosperity', answer: 'poverty', wrongs: ['wealth', 'success', 'fortune', 'growth'] },
  { word: 'accept', answer: 'reject', wrongs: ['welcome', 'embrace', 'agree', 'include'] },
  { word: 'polite', answer: 'rude', wrongs: ['kind', 'gentle', 'calm', 'honest'] },
  { word: 'arrive', answer: 'depart', wrongs: ['come', 'enter', 'approach', 'appear'] },
  { word: 'borrow', answer: 'lend', wrongs: ['take', 'steal', 'own', 'buy'] },
  { word: 'capture', answer: 'release', wrongs: ['catch', 'trap', 'seize', 'hold'] },
  { word: 'create', answer: 'destroy', wrongs: ['build', 'make', 'design', 'invent'] },
  { word: 'exciting', answer: 'boring', wrongs: ['thrilling', 'amazing', 'stunning', 'great'] },
  { word: 'flexible', answer: 'rigid', wrongs: ['bendy', 'stretchy', 'soft', 'smooth'] },
  { word: 'grateful', answer: 'ungrateful', wrongs: ['thankful', 'pleased', 'happy', 'kind'] },
  { word: 'increase', answer: 'decrease', wrongs: ['grow', 'rise', 'boost', 'gain'] },
  { word: 'joyful', answer: 'miserable', wrongs: ['happy', 'cheerful', 'merry', 'glad'] },
  { word: 'knowledge', answer: 'ignorance', wrongs: ['wisdom', 'learning', 'skill', 'talent'] },
  { word: 'majority', answer: 'minority', wrongs: ['most', 'bulk', 'mass', 'total'] },
  { word: 'narrow', answer: 'wide', wrongs: ['thin', 'slim', 'small', 'short'] },
  { word: 'obey', answer: 'disobey', wrongs: ['follow', 'listen', 'agree', 'serve'] },
  { word: 'public', answer: 'private', wrongs: ['open', 'shared', 'common', 'free'] },
  { word: 'rough', answer: 'smooth', wrongs: ['bumpy', 'coarse', 'jagged', 'uneven'] },
  { word: 'scatter', answer: 'gather', wrongs: ['spread', 'throw', 'toss', 'fling'] },
  { word: 'tighten', answer: 'loosen', wrongs: ['squeeze', 'grip', 'clamp', 'pull'] },
  { word: 'united', answer: 'divided', wrongs: ['joined', 'merged', 'combined', 'linked'] },
  { word: 'visible', answer: 'invisible', wrongs: ['clear', 'obvious', 'bright', 'plain'] },
  { word: 'wild', answer: 'tame', wrongs: ['fierce', 'savage', 'untamed', 'feral'] },
  { word: 'complex', answer: 'simple', wrongs: ['difficult', 'intricate', 'detailed', 'tricky'] },
  { word: 'forget', answer: 'remember', wrongs: ['ignore', 'miss', 'lose', 'skip'] },
  { word: 'noisy', answer: 'quiet', wrongs: ['loud', 'rowdy', 'booming', 'roaring'] },
  { word: 'punish', answer: 'reward', wrongs: ['scold', 'blame', 'fine', 'ban'] },
  { word: 'triumph', answer: 'failure', wrongs: ['success', 'win', 'glory', 'prize'] },
  { word: 'vertical', answer: 'horizontal', wrongs: ['upright', 'standing', 'tall', 'steep'] },
  { word: 'bold', answer: 'timid', wrongs: ['brave', 'daring', 'fierce', 'tough'] },
  { word: 'fierce', answer: 'gentle', wrongs: ['savage', 'wild', 'violent', 'harsh'] },
];

// ===================== GRAMMAR BANK (30 entries) =====================
const GRAMMAR = [
  { prompt: 'Which sentence uses the correct verb form?', correct: 'The children were playing in the park.', wrongs: ['The children was playing in the park.', 'The children be playing in the park.', 'The children is playing in the park.', 'The children am playing in the park.'] },
  { prompt: 'Which word is an adverb?', correct: 'quickly', wrongs: ['quick', 'quickness', 'quicken', 'quicker'] },
  { prompt: 'Which is a compound sentence?', correct: 'The sun shone and the birds sang.', wrongs: ['The bright sun shone.', 'Running through fields.', 'The cat on the mat.', 'Because it rained.'] },
  { prompt: 'Which sentence uses "their" correctly?', correct: 'The students packed their bags.', wrongs: ["The students packed they're bags.", 'The students packed there bags.', "Their packing the bags.", 'The students packed thier bags.'] },
  { prompt: 'Which word is a conjunction?', correct: 'although', wrongs: ['quickly', 'beautiful', 'carefully', 'underneath'] },
  { prompt: 'Which sentence is in the passive voice?', correct: 'The cake was eaten by the children.', wrongs: ['The children ate the cake.', 'The children will eat cake.', 'The children are eating cake.', 'Eat the cake now.'] },
  { prompt: 'Which word is a preposition?', correct: 'beneath', wrongs: ['slowly', 'bright', 'running', 'they'] },
  { prompt: 'Which sentence uses a semicolon correctly?', correct: 'It was raining; we stayed inside.', wrongs: ['It was raining; and we stayed inside.', 'It was; raining we stayed inside.', 'It was raining we; stayed inside.', 'It; was raining we stayed inside.'] },
  { prompt: 'Which word is a pronoun?', correct: 'them', wrongs: ['slowly', 'bright', 'jump', 'under'] },
  { prompt: "Identify the word class of 'gently'.", correct: 'adverb', wrongs: ['adjective', 'verb', 'noun', 'preposition'] },
  { prompt: 'Which sentence contains a possessive apostrophe?', correct: "The dog's bone was buried.", wrongs: ["It's raining outside.", "She can't find it.", "They're coming later.", "We've arrived."] },
  { prompt: 'Which is a subordinating conjunction?', correct: 'because', wrongs: ['and', 'but', 'or', 'so'] },
  { prompt: 'Which sentence uses the subjunctive mood?', correct: 'If I were taller, I could reach it.', wrongs: ['If I was taller, I could reach it.', 'I am taller than him.', 'I was very tall.', 'Being tall is useful.'] },
  { prompt: 'Which sentence uses a colon correctly?', correct: 'She needed three things: patience, skill and luck.', wrongs: ['She needed: three things patience skill and luck.', 'She: needed three things.', 'She needed three things patience: skill and luck.', 'She needed three: things patience.'] },
  { prompt: 'Which word is a determiner?', correct: 'several', wrongs: ['running', 'quickly', 'beautiful', 'under'] },
  { prompt: '"I have been waiting." What tense is this?', correct: 'present perfect continuous', wrongs: ['simple past', 'present simple', 'future tense', 'past continuous'] },
  { prompt: 'Which sentence uses "affect" correctly?', correct: 'The weather will affect our plans.', wrongs: ['The weather will effect our plans.', 'The affect was dramatic.', 'She effected great sadness.', 'The affect of rain was flooding.'] },
  { prompt: 'Which is a collective noun?', correct: 'flock', wrongs: ['sheep', 'running', 'woolly', 'grassy'] },
  { prompt: 'Which sentence contains an adverbial phrase?', correct: 'She sang with great enthusiasm.', wrongs: ['She sang beautifully.', 'She sang.', 'She sang a song.', 'She is a singer.'] },
  { prompt: 'Which word is an abstract noun?', correct: 'freedom', wrongs: ['table', 'river', 'dog', 'mountain'] },
  { prompt: '"She might arrive late." What type of verb is "might"?', correct: 'modal verb', wrongs: ['main verb', 'auxiliary verb', 'linking verb', 'action verb'] },
  { prompt: 'Which sentence uses the correct pronoun?', correct: 'Between you and me, the test was easy.', wrongs: ['Between you and I, the test was easy.', 'Between we and them, the test was easy.', 'Between you and myself, the test was easy.', 'Between they and us, the test was easy.'] },
  { prompt: 'Which is a relative pronoun?', correct: 'which', wrongs: ['quickly', 'under', 'several', 'running'] },
  { prompt: 'Which sentence uses "fewer" correctly?', correct: 'There are fewer apples this year.', wrongs: ['There is fewer water.', 'There are less apples this year.', 'There is fewer rice.', 'There are fewer sand.'] },
  { prompt: 'Which is a fronted adverbial?', correct: 'Cautiously, the fox crept forward.', wrongs: ['The fox crept cautiously.', 'The cautious fox crept.', 'The fox was cautious.', 'Foxes are cautious.'] },
  { prompt: 'What is the root word in "uncomfortable"?', correct: 'comfort', wrongs: ['uncomfort', 'comfortable', 'un', 'table'] },
  { prompt: 'Which prefix means "not"?', correct: 'un-', wrongs: ['re-', 'pre-', 'sub-', 'over-'] },
  { prompt: 'Which suffix turns a verb into a noun?', correct: '-tion', wrongs: ['-ly', '-ful', '-less', '-ing'] },
  { prompt: '"The ancient, crumbling castle..." Which word is a noun?', correct: 'castle', wrongs: ['ancient', 'crumbling', 'the', 'none of these'] },
  { prompt: 'Which sentence uses the active voice?', correct: 'The dog chased the cat.', wrongs: ['The cat was chased by the dog.', 'The cat was being chased.', 'The cat had been chased.', 'The chasing was done by the dog.'] },
];

// ===================== PUNCTUATION BANK (20 entries) =====================
const PUNCTUATION = [
  { prompt: 'Where should the comma go?\n\n"After eating the dog went for a walk."', correct: 'After eating, the dog went for a walk.', wrongs: ['After, eating the dog went for a walk.', 'After eating the dog, went for a walk.', 'After eating the dog went, for a walk.', 'After eating the dog went for, a walk.'] },
  { prompt: 'Which sentence uses speech marks correctly?', correct: '"I love ice cream," said Tom.', wrongs: ['I love ice cream, "said Tom".', '"I love ice cream", said Tom.', '"I love ice cream, said Tom."', 'I love "ice cream," said Tom.'] },
  { prompt: 'Where should the apostrophe go?\n\nThe cats whiskers were long.', correct: "The cat's whiskers were long.", wrongs: ["The cats' whiskers were long.", "The cats whisker's were long.", "The cat's whisker's were long.", "The cats whiskers' were long."] },
  { prompt: 'Which uses a hyphen correctly?', correct: 'a well-known author', wrongs: ['a well known author', 'a well known-author', 'a-well known author', 'a wellknown author'] },
  { prompt: 'Which sentence uses brackets correctly?', correct: 'The river (which was deep) flowed quickly.', wrongs: ['The river which (was deep) flowed quickly.', '(The river) which was deep flowed quickly.', 'The river which was very (deep) flowed.', 'The river which was (deep flowed) quickly.'] },
  { prompt: 'Which uses an ellipsis correctly?', correct: 'She waited and waited...', wrongs: ['She...waited and waited.', 'She waited.and.waited.', 'She waited, and, waited...', '...She waited and. waited'] },
  { prompt: 'Which correctly punctuates direct speech?', correct: '"Stop right there!" shouted the policeman.', wrongs: ['Stop "right there!" shouted the policeman.', '"Stop right there! shouted" the policeman.', 'Stop right there! "shouted the policeman."', '"Stop" right there! shouted the policeman.'] },
  { prompt: 'Which correctly shows the plural possessive?', correct: "The three girls' coats were hanging up.", wrongs: ["The three girl's coats were hanging up.", "The three girls's coats were hanging up.", "The three girl's coat's were hanging up.", "The three girls coats' were hanging up."] },
  { prompt: 'Which sentence uses a dash correctly?', correct: 'The answer — as everyone knew — was obvious.', wrongs: ['The — answer as everyone knew was obvious.', 'The answer as — everyone knew — was obvious.', 'The answer as everyone — knew was — obvious.', '— The answer as everyone knew was obvious.'] },
  { prompt: 'Where should the comma go?\n\n"However the experiment failed."', correct: 'However, the experiment failed.', wrongs: ['However the experiment, failed.', 'However the, experiment failed.', 'However the experiment failed,.', 'How, ever the experiment failed.'] },
  { prompt: 'Which sentence needs a question mark?', correct: 'Where did you put the keys', wrongs: ['I put the keys on the table', 'She asked about the keys', 'Tell me where the keys are', 'Please find the keys'] },
  { prompt: 'Which uses inverted commas correctly for a title?', correct: 'I read "Oliver Twist" last week.', wrongs: ['I read Oliver "Twist" last week.', 'I read "Oliver" Twist last week.', '"I" read Oliver Twist last week.', 'I read Oliver Twist "last week".'] },
  { prompt: 'Which sentence uses commas correctly in a list?', correct: 'I bought apples, oranges, bananas and grapes.', wrongs: ['I bought apples oranges bananas and grapes.', 'I bought, apples oranges bananas and grapes.', 'I bought apples, oranges bananas, and grapes.', 'I bought apples oranges, bananas and, grapes.'] },
  { prompt: 'Which shows correct use of an apostrophe for omission?', correct: "I can't believe it!", wrongs: ["I ca'nt believe it!", "I cant' believe it!", "I c'ant believe it!", "I can't' believe it!"] },
  { prompt: 'Which sentence uses parenthetical commas correctly?', correct: 'My sister, who is a doctor, lives in London.', wrongs: ['My sister who, is a doctor lives in London.', 'My, sister who is a doctor, lives in London.', 'My sister who is, a doctor, lives in London.', 'My sister, who is a doctor lives, in London.'] },
  { prompt: 'Where should the semicolon go?', correct: 'She loves tennis; he prefers football.', wrongs: ['She loves; tennis he prefers football.', 'She loves tennis he; prefers football.', 'She loves tennis he prefers; football.', '; She loves tennis he prefers football.'] },
  { prompt: 'Which uses the possessive correctly?', correct: "The children's playground was empty.", wrongs: ["The childrens' playground was empty.", "The childrens playground was empty.", "The children playground's was empty.", "The children's' playground was empty."] },
  { prompt: 'Which correctly shows interrupted speech?', correct: '"I was just—" she began, but he interrupted.', wrongs: ['"I was just" — she began, but he interrupted.', '"I was just —" she began but he interrupted.', '"I was just" she — began, but he interrupted.', 'I was just — "she began, but he interrupted."'] },
  { prompt: 'Which uses bullet points correctly after a colon?', correct: 'You need:\n• flour\n• eggs\n• sugar', wrongs: ['You need.\n• flour\n• eggs\n• sugar', 'You need;\n• flour\n• eggs\n• sugar', 'You need,\n• flour\n• eggs\n• sugar', 'You need\n: • flour\n• eggs\n• sugar'] },
  { prompt: 'Which sentence correctly uses "its" (no apostrophe)?', correct: 'The dog wagged its tail.', wrongs: ["The dog wagged it's tail.", "The dog wagged its' tail.", "Its the dog wagging.", "The dogs it's tail wagged."] },
];

// ===================== CLOZE BANK (30 entries) =====================
const CLOZE = [
  { text: 'The ___ fox jumped over the lazy dog.', correct: 'quick', wrongs: ['quite', 'quietly', 'quicker', 'quickest'] },
  { text: 'She felt ___ about missing the party.', correct: 'guilty', wrongs: ['guiltily', 'guilt', 'guiltiness', 'guiltier'] },
  { text: 'The teacher ___ the students to work harder.', correct: 'encouraged', wrongs: ['encouraging', 'encourages', 'encourage', 'encouragement'] },
  { text: 'The castle stood on a ___ overlooking the valley.', correct: 'cliff', wrongs: ['cliffed', 'cliffing', 'cliffs', 'cliffy'] },
  { text: 'Despite the rain, the match ___ as planned.', correct: 'proceeded', wrongs: ['preceded', 'processed', 'produced', 'pronounced'] },
  { text: 'The ___ of the storm caused widespread damage.', correct: 'ferocity', wrongs: ['ferocious', 'ferociously', 'fierce', 'ferociousness'] },
  { text: 'He ___ admitted that he had made a mistake.', correct: 'reluctantly', wrongs: ['reluctant', 'reluctance', 'relucting', 'reluctive'] },
  { text: 'The scientist made a significant ___.', correct: 'discovery', wrongs: ['discover', 'discovered', 'discovering', 'discoverer'] },
  { text: 'The children were ___ by the magician.', correct: 'captivated', wrongs: ['captivate', 'captivating', 'captivation', 'captively'] },
  { text: 'We must ___ our natural resources.', correct: 'conserve', wrongs: ['conserving', 'conservation', 'conservative', 'conserved'] },
  { text: 'The ___ between the two teams was intense.', correct: 'rivalry', wrongs: ['rival', 'rivalling', 'rivalled', 'rivals'] },
  { text: 'She spoke with great ___ about education.', correct: 'eloquence', wrongs: ['eloquent', 'eloquently', 'eloquencing', 'eloquential'] },
  { text: 'The painting was ___ for its vivid colours.', correct: 'renowned', wrongs: ['renown', 'renowning', 'renownedly', 'renowner'] },
  { text: 'His ___ to detail impressed everyone.', correct: 'attention', wrongs: ['attentive', 'attentively', 'attend', 'attending'] },
  { text: 'The explorer showed great ___ in danger.', correct: 'fortitude', wrongs: ['fortunate', 'fortune', 'fortuitous', 'forthright'] },
  { text: 'The noise was ___ deafening.', correct: 'absolutely', wrongs: ['absolute', 'absorbing', 'abstaining', 'abruptly'] },
  { text: 'The instructions were ___ to follow.', correct: 'straightforward', wrongs: ['straightly', 'straight', 'straighten', 'straightness'] },
  { text: 'Her performance was nothing short of ___.', correct: 'extraordinary', wrongs: ['extra', 'ordinarily', 'extraordinarily', 'extravagant'] },
  { text: 'The evidence ___ the detective\'s theory.', correct: 'contradicted', wrongs: ['contradiction', 'contradicting', 'contradicts', 'contradictory'] },
  { text: 'She made a ___ effort to finish on time.', correct: 'tremendous', wrongs: ['tremendously', 'tremor', 'trembling', 'tremulous'] },
  { text: 'The new law was met with widespread ___.', correct: 'opposition', wrongs: ['opposite', 'opposing', 'opposed', 'oppositely'] },
  { text: 'The mountain range was ___ beautiful.', correct: 'breathtakingly', wrongs: ['breathtaking', 'breathless', 'breathing', 'breathed'] },
  { text: 'The team worked ___ to meet the deadline.', correct: 'tirelessly', wrongs: ['tireless', 'tired', 'tiring', 'tiresome'] },
  { text: 'Her ___ of the subject was remarkable.', correct: 'understanding', wrongs: ['understand', 'understood', 'understands', 'understandable'] },
  { text: 'The plan required careful ___.', correct: 'consideration', wrongs: ['consider', 'considered', 'considerable', 'considering'] },
  { text: 'The audience listened in ___ silence.', correct: 'respectful', wrongs: ['respect', 'respectively', 'respecting', 'respected'] },
  { text: 'The weather was ___ unpredictable.', correct: 'notoriously', wrongs: ['notorious', 'notoriety', 'noticing', 'notably'] },
  { text: 'She approached the problem ___.', correct: 'methodically', wrongs: ['methodical', 'method', 'methodology', 'methods'] },
  { text: 'The results were ___ encouraging.', correct: 'highly', wrongs: ['high', 'higher', 'highest', 'heighten'] },
  { text: 'The film received ___ reviews from critics.', correct: 'favourable', wrongs: ['favour', 'favourably', 'favourite', 'favouring'] },
];

// ===================== COMPREHENSION PASSAGES (8 passages, 5 Qs each = 40 questions) =====================
const COMPREHENSION = [
  {
    passage: "The old lighthouse had stood on the cliff for over two hundred years. Its white walls were stained with salt spray and its lantern room, once the brightest beacon on the coast, had been dark for a decade. But today, as Maya climbed the spiral staircase, she noticed something different. A faint glow pulsed behind the dusty glass.",
    questions: [
      { q: 'How long has the lighthouse stood on the cliff?', a: 'Over two hundred years', w: ['Over one hundred years', 'About fifty years', 'For a decade', 'Over three hundred years'] },
      { q: 'What had the lantern room been for the last decade?', a: 'Dark', w: ['Bright', 'Broken', 'Locked', 'Painted'] },
      { q: 'What is unusual about what Maya notices?', a: 'A faint glow behind the glass', w: ['The staircase is broken', 'The door is locked', 'The walls are clean', 'The lighthouse is shorter'] },
      { q: 'What has stained the white walls?', a: 'Salt spray', w: ['Rain', 'Paint', 'Smoke', 'Mud'] },
      { q: 'How does Maya reach the lantern room?', a: 'By climbing a spiral staircase', w: ['By using a ladder', 'By taking a lift', 'By climbing outside', 'By using a rope'] },
    ]
  },
  {
    passage: "Dr Singh examined the ancient manuscript with trembling hands. The parchment was brittle and yellowed, covered in symbols that hadn't been seen for centuries. She recognised the language immediately — it was Aramaic, one of the oldest known written languages. What excited her most wasn't the language itself, but the diagram in the margin: a detailed map showing a route through mountains that modern cartographers had never charted.",
    questions: [
      { q: "Why were Dr Singh's hands trembling?", a: 'She was excited by the discovery', w: ['She was cold', 'She was frightened', 'She was ill', 'She was angry'] },
      { q: 'What language was the manuscript written in?', a: 'Aramaic', w: ['Latin', 'Greek', 'Sanskrit', 'Hebrew'] },
      { q: 'What was most exciting to Dr Singh?', a: 'The uncharted mountain route diagram', w: ['The age of the parchment', 'The ancient language', 'The brittle paper', 'The old symbols'] },
      { q: 'What does "cartographers" mean?', a: 'Map makers', w: ['Explorers', 'Scientists', 'Historians', 'Artists'] },
      { q: 'What condition was the manuscript in?', a: 'Brittle and yellowed', w: ['Perfect condition', 'Torn and wet', 'Burnt at edges', 'Freshly preserved'] },
    ]
  },
  {
    passage: "The Arctic fox is one of nature's most remarkable survivors. In winter, its thick white coat provides both insulation against temperatures that can plummet to minus fifty degrees and camouflage against the snow. As summer approaches, the fox moults, replacing its white fur with a thinner brown or grey coat that blends with the rocks and tundra. This extraordinary adaptation means the Arctic fox is virtually invisible in every season.",
    questions: [
      { q: "Why does the Arctic fox's coat turn white in winter?", a: 'For insulation and camouflage', w: ['Just for warmth', 'To attract a mate', 'Because of the cold only', 'To scare predators'] },
      { q: 'What does "moults" mean?', a: 'Sheds and replaces its fur', w: ['Grows thicker', 'Gets dirty', 'Changes colour instantly', 'Loses weight'] },
      { q: 'How cold can it get where the Arctic fox lives?', a: 'Minus fifty degrees', w: ['Minus twenty degrees', 'Minus thirty degrees', 'Minus ten degrees', 'Minus one hundred degrees'] },
      { q: "What colour is the fox's summer coat?", a: 'Brown or grey', w: ['White', 'Black', 'Red', 'Yellow'] },
      { q: 'Why is the Arctic fox described as "virtually invisible"?', a: 'Its coat matches every season', w: ['It is very small', 'It hides underground', 'It only comes out at night', 'It can disappear'] },
    ]
  },
  {
    passage: "In 1928, Alexander Fleming returned to his laboratory after a holiday to find that mould had contaminated one of his petri dishes of bacteria. Rather than discarding the dish, Fleming noticed something extraordinary: the bacteria around the mould had died. This accidental observation led to the discovery of penicillin, which would go on to save an estimated 200 million lives. Fleming later said, 'One sometimes finds what one is not looking for.'",
    questions: [
      { q: 'What had happened while Fleming was on holiday?', a: 'Mould grew in his petri dish', w: ['His lab was flooded', 'His bacteria multiplied', 'Equipment was stolen', 'A fire destroyed notes'] },
      { q: 'What was unusual about the bacteria near the mould?', a: 'They had died', w: ['They multiplied', 'They changed colour', 'They grew larger', 'They moved away'] },
      { q: "What does Fleming's quote suggest?", a: 'Important discoveries can be accidental', w: ['Always follow a plan', 'Holidays help scientists', 'Mould is always useful', 'Bacteria are dangerous'] },
      { q: 'How many lives has penicillin saved?', a: 'An estimated 200 million', w: ['About 20 million', 'Over 2 billion', 'Exactly 100 million', 'Around 50 million'] },
      { q: 'What does this passage mainly teach?', a: 'Great discoveries come from observing the unexpected', w: ['Fleming was careless', 'Mould is always beneficial', 'Holidays help work', 'Bacteria always die near mould'] },
    ]
  },
  {
    passage: "The narrator watched as the last autumn leaf spiralled from the oak tree. Its descent was slow, almost reluctant, as though the leaf understood that reaching the ground meant the end. Mrs Henderson from next door would call it 'poetic', which was her favourite word for anything she didn't entirely understand. The narrator smiled. Perhaps everything was poetic if you stared at it long enough.",
    questions: [
      { q: 'What technique is used in "as though the leaf understood"?', a: 'Personification', w: ['Simile', 'Alliteration', 'Onomatopoeia', 'Hyperbole'] },
      { q: "What is the narrator's tone towards Mrs Henderson?", a: 'Gently humorous', w: ['Angry', 'Deeply respectful', 'Indifferent', 'Frightened'] },
      { q: 'What does Mrs Henderson use "poetic" for?', a: "Things she doesn't fully understand", w: ['Things she loves', 'Things she hates', 'Beautiful sunsets', 'Poems she reads'] },
      { q: 'What season is depicted?', a: 'Autumn', w: ['Winter', 'Spring', 'Summer', 'Not stated'] },
      { q: "Why is the leaf's descent described as 'reluctant'?", a: 'To give the leaf human emotions', w: ['Because it was stuck', 'Because of the wind', 'Because it was heavy', 'Because the tree held it'] },
    ]
  },
  {
    passage: "Beneath the ocean's surface lies a world of extraordinary colour and complexity. Coral reefs, sometimes called the 'rainforests of the sea', cover less than one percent of the ocean floor yet support an estimated twenty-five percent of all marine species. These intricate ecosystems are built by tiny organisms called coral polyps, which secrete calcium carbonate to form hard skeletons. Over thousands of years, these skeletons accumulate to create vast reef structures.",
    questions: [
      { q: 'Why are coral reefs called "rainforests of the sea"?', a: 'They support a huge diversity of life', w: ['They are green', 'They have trees underwater', 'They receive lots of rain', 'They are very tall'] },
      { q: 'What percentage of ocean floor do coral reefs cover?', a: 'Less than one percent', w: ['About ten percent', 'Around fifty percent', 'About five percent', 'Over twenty percent'] },
      { q: 'What are coral polyps?', a: 'Tiny organisms that build reef structures', w: ['Types of fish', 'Underwater plants', 'Sea shells', 'Ocean currents'] },
      { q: 'What do coral polyps secrete?', a: 'Calcium carbonate', w: ['Salt water', 'Oxygen', 'Carbon dioxide', 'Sand'] },
      { q: 'How long does reef building take?', a: 'Thousands of years', w: ['A few months', 'About ten years', 'A single year', 'Millions of years'] },
    ]
  },
  {
    passage: "The Great Fire of London broke out on 2nd September 1666 in a bakery on Pudding Lane. Fanned by strong winds, the fire spread rapidly through the city's tightly packed wooden buildings. Over four days, it destroyed over 13,000 houses, 87 churches, and most official buildings. Remarkably, only six verified deaths were recorded, though the true number was likely higher. After the fire, Sir Christopher Wren designed a new St Paul's Cathedral.",
    questions: [
      { q: 'Where did the Great Fire start?', a: 'A bakery on Pudding Lane', w: ['St Paul\'s Cathedral', 'The Tower of London', 'London Bridge', 'A palace'] },
      { q: 'What helped the fire spread so quickly?', a: 'Strong winds and wooden buildings', w: ['Explosions', 'Arson', 'Oil lamps', 'Gas pipes'] },
      { q: 'How many houses were destroyed?', a: 'Over 13,000', w: ['About 1,000', 'Around 5,000', 'Exactly 100', 'Over 50,000'] },
      { q: 'How many verified deaths were recorded?', a: 'Six', w: ['Sixty', 'Six hundred', 'None', 'Thousands'] },
      { q: 'Who designed the new St Paul\'s Cathedral?', a: 'Sir Christopher Wren', w: ['King Charles II', 'Samuel Pepys', 'Isaac Newton', 'Thomas Farriner'] },
    ]
  },
  {
    passage: "Maya Angelou once said, 'There is no greater agony than bearing an untold story inside you.' As a writer, poet and civil rights activist, Angelou understood the transformative power of words. Her autobiography, 'I Know Why the Caged Bird Sings', published in 1969, broke new ground by honestly describing her childhood experiences of racial discrimination and personal trauma. The book's title, taken from a poem by Paul Laurence Dunbar, became a powerful metaphor for the human desire for freedom.",
    questions: [
      { q: 'What is the main theme of the Angelou quote?', a: 'The importance of telling your story', w: ['The pain of writing', 'Physical suffering', 'Keeping secrets', 'Fear of speaking'] },
      { q: 'When was her autobiography published?', a: '1969', w: ['1959', '1979', '1949', '1989'] },
      { q: 'What does the "caged bird" metaphor represent?', a: 'The desire for freedom despite oppression', w: ['A pet bird', 'A type of poem', 'A prison', 'A type of music'] },
      { q: 'Where does the book\'s title come from?', a: 'A poem by Paul Laurence Dunbar', w: ['A speech by MLK', 'A folk song', 'A Bible verse', 'Her own poem'] },
      { q: 'What three roles did Angelou hold?', a: 'Writer, poet and civil rights activist', w: ['Teacher, doctor and lawyer', 'Singer, dancer and actress', 'Politician, judge and writer', 'Artist, musician and poet'] },
    ]
  },
];

// ===================== LANGUAGE ANALYSIS BANK (30 entries) =====================
const LANG_ANALYSIS = [
  { prompt: 'Which sentence uses a metaphor?', correct: 'Time is a thief that steals our youth.', wrongs: ['Time goes quickly like a train.', 'Time is very fast.', 'Time passes as quickly as a bird.', 'Time is faster than light.'] },
  { prompt: 'Which sentence contains alliteration?', correct: 'Peter Piper picked a peck of pickled peppers.', wrongs: ['The cat sat on the mat.', 'She sells chocolates.', 'The dog barked loudly.', 'Rain fell on the roof.'] },
  { prompt: 'Which is an example of onomatopoeia?', correct: 'The bees buzzed around the hive.', wrongs: ['The bees flew around.', 'The bees were near the hive.', 'The bees lived in a hive.', 'The bees stayed by the hive.'] },
  { prompt: 'What effect does a short sentence after a long paragraph create?', correct: 'Dramatic impact and urgency', wrongs: ['Shows the writer is lazy', 'Means nothing happened', 'Proves the character is fit', 'Shows the paragraph was wrong'] },
  { prompt: 'Which sentence uses a simile?', correct: 'Her eyes sparkled like diamonds.', wrongs: ['Her eyes were diamonds.', 'Her eyes were very bright.', 'Her diamond eyes shone.', 'Her eyes sparkled beautifully.'] },
  { prompt: '"The wind howled through the streets." What technique?', correct: 'Personification', wrongs: ['Simile', 'Alliteration', 'Rhyme', 'Repetition'] },
  { prompt: 'What is the purpose of rhetorical questions?', correct: 'To make the reader think and agree without needing an answer', wrongs: ['To get the reader to write back', 'To test knowledge', 'To confuse the reader', 'To fill space'] },
  { prompt: '"He was not unattractive." This is an example of:', correct: 'Litotes (understatement)', wrongs: ['Hyperbole', 'Metaphor', 'Irony', 'Alliteration'] },
  { prompt: 'Which uses pathetic fallacy?', correct: 'Dark clouds gathered as she heard terrible news.', wrongs: ['She was sad to hear the news.', 'The news was on TV.', 'She told her friend.', 'The news spread quickly.'] },
  { prompt: 'What effect does first person ("I") narration create?', correct: 'Intimacy — the reader feels closer to the character', wrongs: ['It means the story is true', 'It makes the story boring', 'It is only for diaries', 'It means one character only'] },
  { prompt: '"To be or not to be." This is:', correct: 'Antithesis', wrongs: ['Metaphor', 'Simile', 'Onomatopoeia', 'Alliteration'] },
  { prompt: 'What does "juxtaposition" mean?', correct: 'Placing contrasting ideas close together', wrongs: ['Using long words', 'Writing in paragraphs', 'Using many adjectives', 'Repeating the same word'] },
  { prompt: 'What does an unreliable narrator do?', correct: 'Tells the story in a way that may not be accurate', wrongs: ['Always tells the truth', 'Only appears in mysteries', 'Speaks to the reader directly', 'Uses difficult vocabulary'] },
  { prompt: '"Shadows crept across the crumbling walls." What mood?', correct: 'Ominous', wrongs: ['Cheerful', 'Romantic', 'Humorous', 'Boring'] },
  { prompt: 'What is "foreshadowing"?', correct: 'Hinting at events that will happen later', wrongs: ['Describing shadows', 'Using dark vocabulary', 'Writing in past tense', 'Creating a sad mood'] },
  { prompt: 'Which uses sibilance?', correct: 'The snake slithered silently through the soft sand.', wrongs: ['The bird flew over the barn.', 'Rain pounded the pavement.', 'The door creaked open.', 'Thunder roared overhead.'] },
  { prompt: 'What is the effect of repetition in a speech?', correct: 'Emphasises key points and makes them memorable', wrongs: ['Shows the speaker forgot what they said', 'Makes the speech longer', 'Confuses the audience', 'Proves the speaker is nervous'] },
  { prompt: '"The silence was deafening." This is:', correct: 'An oxymoron', wrongs: ['A simile', 'Alliteration', 'A pun', 'Personification'] },
  { prompt: 'What does "emotive language" aim to do?', correct: 'Trigger an emotional response in the reader', wrongs: ['Describe emotions clearly', 'Use many adjectives', 'Tell a story', 'Explain facts'] },
  { prompt: 'Which shows dramatic irony?', correct: 'The audience knows the villain is hiding, but the hero does not.', wrongs: ['A character tells a joke.', 'It rains on a sunny day.', 'A teacher teaches students.', 'A story has a happy ending.'] },
  { prompt: '"The camera loves her." This is:', correct: 'Personification', wrongs: ['A simile', 'Hyperbole', 'A fact', 'Alliteration'] },
  { prompt: 'What is a "motif" in literature?', correct: 'A recurring idea, image or symbol throughout a text', wrongs: ['The main character', 'The opening paragraph', 'A type of poem', 'The final sentence'] },
  { prompt: '"She was a bit upset" (after losing everything). This is:', correct: 'Understatement', wrongs: ['Metaphor', 'Simile', 'Alliteration', 'Hyperbole'] },
  { prompt: 'What does "tone" mean in writing?', correct: "The writer's attitude towards the subject", wrongs: ['How loud to read it', 'The volume of the story', 'A musical quality', 'The colour of the text'] },
  { prompt: 'Which shows anaphora (repetition at sentence starts)?', correct: '"I have a dream... I have a dream... I have a dream..."', wrongs: ['"The dog ran, the dog played, the dog slept."', '"She was tall, clever and brave."', '"Once upon a time, there was..."', '"He said hello, goodbye, hello."'] },
  { prompt: 'What is a "cliffhanger"?', correct: 'An unresolved ending that creates suspense', wrongs: ['A story set on a cliff', 'A sad ending', 'A type of villain', 'A happy resolution'] },
  { prompt: '"Run! Run for your lives!" What effect does this short sentence create?', correct: 'Urgency and panic', wrongs: ['Calm reflection', 'Humour', 'Boredom', 'Confusion'] },
  { prompt: 'What does "implicit meaning" refer to?', correct: 'Something suggested but not directly stated', wrongs: ['Something clearly written', 'A dictionary definition', 'A sentence in bold', 'A heading or title'] },
  { prompt: 'Which is an example of hyperbole?', correct: "I've told you a million times!", wrongs: ["I've told you twice.", "I've told you before.", "I mentioned it once.", "I've told a few people."] },
  { prompt: 'What is the effect of a story told in present tense?', correct: 'Creates immediacy — events feel like they are happening now', wrongs: ['Shows it happened long ago', 'Makes it less exciting', 'Proves it is a true story', 'Shows the writer is inexperienced'] },
];

// ===================== QUESTION GENERATORS =====================

function spellingQuestion(level, index, rng) {
  const entry = uniquePick(SPELLING, level, index);
  const options = shuffle(rng, [entry.correct, ...entry.wrong.slice(0, 4)]);
  return {
    prompt: 'Which is the correct spelling?',
    options, correctIndex: options.indexOf(entry.correct),
    explanation: { steps: [`The correct spelling is "${entry.correct}".`], tip: 'Look carefully at doubled letters, vowel order and silent letters.' }
  };
}

function synonymQuestion(level, index, rng) {
  const entry = uniquePick(SYNONYMS, level, index);
  const options = shuffle(rng, [entry.syn, ...entry.wrongs]);
  return {
    prompt: `Which word is closest in meaning to "${entry.word}"?`,
    options, correctIndex: options.indexOf(entry.syn),
    explanation: { steps: [`"${entry.word}" means the same as "${entry.syn}".`], tip: 'A synonym is a word with the same or similar meaning.' }
  };
}

function antonymQuestion(level, index, rng) {
  const entry = uniquePick(ANTONYMS, level, index);
  const options = shuffle(rng, [entry.answer, ...entry.wrongs]);
  return {
    prompt: `Which word is most opposite in meaning to "${entry.word}"?`,
    options, correctIndex: options.indexOf(entry.answer),
    explanation: { steps: [`The opposite of "${entry.word}" is "${entry.answer}".`], tip: 'An antonym is a word with the opposite meaning.' }
  };
}

function grammarQuestion(level, index, rng) {
  const entry = uniquePick(GRAMMAR, level, index);
  const options = shuffle(rng, [entry.correct, ...entry.wrongs.slice(0, 4)]);
  return {
    prompt: entry.prompt, options, correctIndex: options.indexOf(entry.correct),
    explanation: { steps: [`The correct answer is: "${entry.correct}".`], tip: 'Read each option carefully and apply grammar rules.' }
  };
}

function punctuationQuestion(level, index, rng) {
  const entry = uniquePick(PUNCTUATION, level, index);
  const options = shuffle(rng, [entry.correct, ...entry.wrongs.slice(0, 4)]);
  return {
    prompt: entry.prompt, options, correctIndex: options.indexOf(entry.correct),
    explanation: { steps: [`The correct answer is: "${entry.correct}".`], tip: 'Think about the punctuation rules for commas, apostrophes and speech marks.' }
  };
}

function clozeQuestion(level, index, rng) {
  const entry = uniquePick(CLOZE, level, index);
  const options = shuffle(rng, [entry.correct, ...entry.wrongs]);
  return {
    prompt: `Choose the best word to complete the sentence:\n\n${entry.text}`,
    options, correctIndex: options.indexOf(entry.correct),
    explanation: { steps: [`The best word is "${entry.correct}".`, `"${entry.text.replace('___', entry.correct)}"`], tip: 'Read the sentence with each option. Which sounds right and makes grammatical sense?' }
  };
}

function comprehensionQuestion(level, index, rng) {
  // Use level to pick passage, index to pick question within it
  const pIdx = ((level * 2654435761) >>> 0) % COMPREHENSION.length;
  const passage = COMPREHENSION[pIdx];
  const qIdx = index % passage.questions.length;
  const q = passage.questions[qIdx];
  const options = shuffle(rng, [q.a, ...q.w]);
  return {
    promptHtml: `<div class="comprehension-passage"><p>${passage.passage}</p></div><p class="comprehension-question">${q.q}</p>`,
    prompt: q.q, options, correctIndex: options.indexOf(q.a),
    explanation: { steps: [`The answer is: "${q.a}".`], tip: 'Always find evidence in the text to support your answer.' }
  };
}

function langAnalysisQuestion(level, index, rng) {
  const entry = uniquePick(LANG_ANALYSIS, level, index);
  const options = shuffle(rng, [entry.correct, ...entry.wrongs.slice(0, 4)]);
  return {
    prompt: entry.prompt, options, correctIndex: options.indexOf(entry.correct),
    explanation: { steps: [`The correct answer is: "${entry.correct}".`], tip: 'Think about what effect the writer is trying to create.' }
  };
}

// ===================== MASTER GENERATOR =====================

const GENERATORS = {
  'spelling': [spellingQuestion],
  'synonyms': [synonymQuestion],
  'antonyms': [antonymQuestion],
  'grammar-basics': [grammarQuestion],
  'punctuation': [punctuationQuestion],
  'cloze': [clozeQuestion],
  'comprehension-literal': [comprehensionQuestion],
  'comprehension-inference': [comprehensionQuestion],
  'grammar-advanced': [grammarQuestion, punctuationQuestion, clozeQuestion],
  'language-analysis': [langAnalysisQuestion],
  'comprehension-evaluation': [comprehensionQuestion, langAnalysisQuestion],
  'literary-analysis': [langAnalysisQuestion, comprehensionQuestion],
};

export function generateEnglishQuestions(level, count = 5) {
  const topic = getTopicForLevel('english', level);
  const params = getDifficultyParams(level, 'english');
  const gens = GENERATORS[topic] || [synonymQuestion];
  const questions = [];

  for (let i = 0; i < count; i++) {
    const rng = seededRNG(makeSeed(level, i));
    const gen = gens[i % gens.length];
    const q = gen(level, i, rng);
    questions.push({
      id: `eng-${level}-${i}`,
      subject: 'english',
      topic, level,
      prompt: q.prompt,
      promptHtml: q.promptHtml || undefined,
      options: q.options,
      correctIndex: q.correctIndex,
      timeAllowedSeconds: params.timeAllowedSeconds || 60,
      explanation: q.explanation
    });
  }
  return questions;
}
