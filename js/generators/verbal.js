// Verbal Reasoning Generator — 100 levels, 500 unique questions
// Covers GL Assessment VR question types

import { getDifficultyParams, getTopicForLevel } from './difficulty.js';

function seededRNG(seed) {
  let s = Math.imul(seed | 0, 1103515245) + 12345;
  return () => { s = Math.imul(s, 1103515245) + 12345; return ((s >>> 16) & 0x7fff) / 0x7fff; };
}
function makeSeed(level, index) { return level * 1049 + index * 163 + 6991; }
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function randInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }
function shuffle(rng, arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// Better selection: multiplicative hash avoids modular arithmetic collisions
function uniquePick(bank, level, index) {
  const hash = ((level * 31 + index * 97 + 53) * 2654435761) >>> 0;
  return bank[hash % bank.length];
}

// Branch-aware seed: same (branch, level) always produces the same pool permutation,
// but different branches at the same level get different permutations.
function branchSeed(branchId, level) {
  const s = `${branchId || '_'}:${level}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) || 1;
}
function seededShuffle(arr, seed) {
  const rng = seededRNG(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===================== THREE-LETTER WORDS =====================

const THREE_LETTER_WORDS = [
  'ace', 'age', 'aid', 'aim', 'air', 'all', 'and', 'ant', 'ape', 'arc',
  'arm', 'art', 'ate', 'bad', 'bag', 'ban', 'bar', 'bat', 'bay', 'bed',
  'big', 'bin', 'bit', 'bow', 'box', 'boy', 'bud', 'bug', 'bun', 'bus',
  'but', 'buy', 'cab', 'can', 'cap', 'car', 'cat', 'cop', 'cow', 'cry',
  'cub', 'cup', 'cut', 'dam', 'day', 'den', 'dew', 'did', 'dig', 'dim',
  'dip', 'dog', 'dot', 'dry', 'dug', 'dye', 'ear', 'eat', 'eel', 'egg',
  'elm', 'end', 'era', 'eve', 'ewe', 'eye', 'fan', 'far', 'fat', 'fax',
  'fed', 'few', 'fig', 'fin', 'fir', 'fit', 'fix', 'fly', 'fog', 'for',
  'fox', 'fry', 'fun', 'fur', 'gag', 'gap', 'gas', 'gem', 'get', 'gin',
  'got', 'gum', 'gun', 'gut', 'guy', 'gym', 'had', 'ham', 'has', 'hat',
  'hay', 'hen', 'her', 'hid', 'him', 'hip', 'his', 'hit', 'hog', 'hop',
  'hot', 'how', 'hub', 'hue', 'hug', 'hum', 'hut', 'ice', 'ill', 'imp',
  'ink', 'inn', 'ion', 'ire', 'its', 'ivy', 'jab', 'jag', 'jam', 'jar',
  'jaw', 'jay', 'jet', 'jig', 'job', 'jog', 'joy', 'jug', 'jut', 'keg',
  'key', 'kid', 'kin', 'kit', 'lab', 'lad', 'lag', 'lap', 'law', 'lay',
  'led', 'leg', 'let', 'lid', 'lie', 'lip', 'lit', 'log', 'lot', 'low',
  'mad', 'man', 'map', 'mat', 'may', 'men', 'met', 'mix', 'mob', 'mop',
  'mow', 'mud', 'mug', 'nap', 'net', 'new', 'nil', 'nip', 'nit', 'nod',
  'nor', 'not', 'now', 'nun', 'nut', 'oak', 'oar', 'oat', 'odd', 'off',
  'oil', 'old', 'one', 'opt', 'orb', 'ore', 'our', 'out', 'owe', 'owl',
  'own', 'pad', 'pal', 'pan', 'paw', 'pay', 'pea', 'peg', 'pen', 'pet',
  'pie', 'pig', 'pin', 'pit', 'ply', 'pod', 'pop', 'pot', 'pow', 'pub',
  'pun', 'pup', 'put', 'rag', 'ram', 'ran', 'rap', 'rat', 'raw', 'ray',
  'red', 'ref', 'rib', 'rid', 'rig', 'rim', 'rip', 'rob', 'rod', 'rot',
  'row', 'rub', 'rug', 'rum', 'run', 'rut', 'rye', 'sad', 'sag', 'sap',
  'sat', 'saw', 'say', 'sea', 'set', 'sew', 'shy', 'sin', 'sip', 'sir',
  'sis', 'sit', 'six', 'ski', 'sky', 'sly', 'sob', 'sod', 'son', 'sop',
  'sow', 'spa', 'spy', 'sty', 'sub', 'sue', 'sum', 'sun', 'sup', 'tab',
  'tad', 'tag', 'tan', 'tap', 'tar', 'tax', 'tea', 'ten', 'the', 'tic',
  'tie', 'tin', 'tip', 'toe', 'ton', 'too', 'top', 'tot', 'tow', 'toy',
  'try', 'tub', 'tug', 'two', 'urn', 'use', 'van', 'vat', 'vet', 'via',
  'vie', 'vim', 'vow', 'wad', 'wag', 'war', 'was', 'wax', 'way', 'web',
  'wed', 'wet', 'who', 'why', 'wig', 'win', 'wit', 'woe', 'wok', 'won',
  'woo', 'wow', 'yak', 'yam', 'yap', 'yaw', 'yea', 'yes', 'yet', 'yew',
  'you', 'zap', 'zed', 'zen', 'zig', 'zip', 'zoo'
];

// ===================== COMPOUND WORD PAIRS =====================

const COMPOUND_PAIRS = [
  ['air', 'port'], ['arm', 'chair'], ['back', 'bone'], ['base', 'ball'], ['bath', 'room'],
  ['bed', 'room'], ['birth', 'day'], ['black', 'bird'], ['black', 'board'], ['blood', 'hound'],
  ['blue', 'bell'], ['blue', 'berry'], ['book', 'case'], ['book', 'mark'], ['break', 'fast'],
  ['butter', 'fly'], ['butter', 'cup'], ['camp', 'fire'], ['car', 'park'], ['class', 'room'],
  ['clock', 'wise'], ['cow', 'boy'], ['cross', 'word'], ['cup', 'board'], ['day', 'light'],
  ['day', 'dream'], ['door', 'bell'], ['door', 'step'], ['door', 'way'], ['down', 'stairs'],
  ['dragon', 'fly'], ['dream', 'land'], ['drive', 'way'], ['ear', 'ring'], ['eye', 'brow'],
  ['eye', 'lash'], ['farm', 'house'], ['farm', 'yard'], ['fire', 'place'], ['fire', 'work'],
  ['finger', 'print'], ['finger', 'tip'], ['fish', 'pond'], ['flag', 'pole'], ['foot', 'ball'],
  ['foot', 'note'], ['foot', 'path'], ['foot', 'print'], ['gold', 'fish'], ['grand', 'mother'],
  ['grass', 'hopper'], ['green', 'house'], ['hair', 'cut'], ['hand', 'bag'], ['hand', 'shake'],
  ['head', 'line'], ['head', 'band'], ['heart', 'beat'], ['home', 'work'], ['horse', 'shoe'],
  ['house', 'hold'], ['house', 'wife'], ['ice', 'berg'], ['key', 'board'], ['land', 'lord'],
  ['land', 'mark'], ['life', 'time'], ['light', 'house'], ['lip', 'stick'], ['master', 'piece'],
  ['moon', 'light'], ['news', 'paper'], ['night', 'mare'], ['note', 'book'], ['out', 'side'],
  ['over', 'coat'], ['pan', 'cake'], ['pass', 'port'], ['pen', 'knife'], ['play', 'ground'],
  ['rain', 'bow'], ['rain', 'coat'], ['road', 'side'], ['sand', 'castle'], ['sea', 'shell'],
  ['sea', 'side'], ['sea', 'weed'], ['shoe', 'lace'], ['side', 'walk'], ['snow', 'ball'],
  ['snow', 'flake'], ['snow', 'man'], ['some', 'thing'], ['some', 'one'], ['star', 'fish'],
  ['step', 'mother'], ['stone', 'wall'], ['sun', 'flower'], ['sun', 'light'], ['sun', 'set'],
  ['sun', 'rise'], ['table', 'cloth'], ['tea', 'pot'], ['thunder', 'storm'], ['time', 'table'],
  ['tooth', 'brush'], ['tooth', 'paste'], ['under', 'ground'], ['up', 'stairs'], ['wall', 'paper'],
  ['water', 'fall'], ['water', 'melon'], ['water', 'proof'], ['week', 'end'], ['wind', 'mill'],
  ['wood', 'pecker'], ['work', 'shop'], ['bed', 'time'], ['book', 'shop'], ['hand', 'writing'],
  ['home', 'sick'], ['life', 'guard'], ['moon', 'shine'], ['over', 'look'], ['rain', 'drop'],
  ['sand', 'paper'], ['snow', 'drop'], ['tooth', 'ache'], ['up', 'stream'], ['water', 'colour'],
  ['wind', 'screen'], ['arm', 'pit'], ['back', 'pack'], ['back', 'yard'], ['ball', 'room'],
  ['bank', 'note'], ['bare', 'foot'], ['bath', 'robe'], ['bell', 'tower'], ['bird', 'cage'],
];

// ===================== HIDDEN WORDS (all verified) =====================

// Each sentence is natural, grammatical English. The hidden word appears
// as consecutive letters crossing a word boundary (e.g. "car petrol" hides CARPET).
// A runtime validator at the bottom strips non-letters and confirms the answer is present.
const HIDDEN_WORD_PUZZLES = [
  { sentence: 'I must go at once to the park', answer: 'GOAT', explain: '"go at" contains G-O-A-T crossing the space' },
  { sentence: 'Please come at sunset', answer: 'MEAT', explain: '"come at" contains M-E-A-T crossing the space' },
  { sentence: 'The man got on the bus', answer: 'MANGO', explain: '"man got" contains M-A-N-G-O crossing the space' },
  { sentence: 'My car petrol is running low', answer: 'CARPET', explain: '"car petrol" contains C-A-R-P-E-T crossing the space' },
  { sentence: 'The disc over the table is mine', answer: 'DISCOVER', explain: '"disc over" contains D-I-S-C-O-V-E-R crossing the space' },
  { sentence: 'The bar gained a reputation', answer: 'BARGAIN', explain: '"bar gained" contains B-A-R-G-A-I-N crossing the space' },
  { sentence: 'After the rain bowed the trees', answer: 'RAINBOW', explain: '"rain bowed" contains R-A-I-N-B-O-W crossing the space' },
  { sentence: 'The war denied their request', answer: 'WARDEN', explain: '"war denied" contains W-A-R-D-E-N crossing the space' },
  { sentence: 'The effort unearthed a clue', answer: 'FORTUNE', explain: '"effort unearthed" contains F-O-R-T-U-N-E crossing the space' },
  { sentence: 'He made his debut tonight', answer: 'BUTTON', explain: '"debut tonight" contains B-U-T-T-O-N crossing the space' },
  { sentence: 'I loved that famous tango show', answer: 'MUSTANG', explain: '"famous tango" contains M-U-S-T-A-N-G crossing the space' },
  { sentence: 'The pelican did not fly away', answer: 'CANDID', explain: '"pelican did" contains C-A-N-D-I-D crossing the space' },
  { sentence: 'The pin knocked over the vase', answer: 'PINK', explain: '"pin knocked" contains P-I-N-K crossing the space' },
  { sentence: 'The net worked perfectly', answer: 'NETWORK', explain: '"net worked" contains N-E-T-W-O-R-K crossing the space' },
  { sentence: 'The cab in the garage is blue', answer: 'CABIN', explain: '"cab in" contains C-A-B-I-N crossing the space' },
  { sentence: 'The car got stuck in the mud', answer: 'CARGO', explain: '"car got" contains C-A-R-G-O crossing the space' },
  { sentence: 'The rug by the door is soft', answer: 'RUGBY', explain: '"rug by" contains R-U-G-B-Y crossing the space' },
  { sentence: 'The fat herd grazed in the field', answer: 'FATHER', explain: '"fat herd" contains F-A-T-H-E-R crossing the space' },
  { sentence: 'The king dominates the board', answer: 'KINGDOM', explain: '"king dominates" contains K-I-N-G-D-O-M crossing the space' },
  { sentence: 'The fan got tangled in the wire', answer: 'FANG', explain: '"fan got" contains F-A-N-G crossing the space' },
  { sentence: 'The robot hung from a thread', answer: 'BOTH', explain: '"robot hung" contains B-O-T-H crossing the space' },
  { sentence: 'I saw the man eagerly waiting', answer: 'MANE', explain: '"man eagerly" contains M-A-N-E crossing the space' },
  { sentence: 'The last angle was too sharp', answer: 'TANG', explain: '"last angle" contains T-A-N-G crossing the space' },
  { sentence: 'The panic on the ship spread quickly', answer: 'ICON', explain: '"panic on" contains I-C-O-N crossing the space' },
  { sentence: 'This lander arrived on Mars first', answer: 'ISLAND', explain: '"this lander" contains I-S-L-A-N-D crossing the space' },
  { sentence: 'The best embers glowed in the ashes', answer: 'STEM', explain: '"best embers" contains S-T-E-M crossing the space' },
].filter(p => {
  const flat = p.sentence.toLowerCase().replace(/[^a-z]/g, '');
  const ans = p.answer.toLowerCase();
  const ok = flat.includes(ans);
  if (!ok) console.warn('[verbal] Hidden-word missing in sentence:', p.sentence, '->', p.answer);
  return ok;
});

// ===================== WORD ANALOGIES =====================

const ANALOGIES = [
  { a: 'hot', b: 'cold', c: 'big', d: 'small', rel: 'opposites' },
  { a: 'puppy', b: 'dog', c: 'kitten', d: 'cat', rel: 'young to adult' },
  { a: 'hand', b: 'glove', c: 'foot', d: 'shoe', rel: 'body part to clothing' },
  { a: 'pen', b: 'write', c: 'knife', d: 'cut', rel: 'tool to action' },
  { a: 'bird', b: 'nest', c: 'bee', d: 'hive', rel: 'animal to home' },
  { a: 'page', b: 'book', c: 'brick', d: 'wall', rel: 'part to whole' },
  { a: 'water', b: 'ocean', c: 'sand', d: 'desert', rel: 'substance to place' },
  { a: 'eye', b: 'see', c: 'ear', d: 'hear', rel: 'organ to function' },
  { a: 'author', b: 'book', c: 'artist', d: 'painting', rel: 'creator to creation' },
  { a: 'teacher', b: 'school', c: 'doctor', d: 'hospital', rel: 'person to workplace' },
  { a: 'fish', b: 'swim', c: 'bird', d: 'fly', rel: 'animal to movement' },
  { a: 'milk', b: 'cow', c: 'egg', d: 'chicken', rel: 'product to source' },
  { a: 'happy', b: 'sad', c: 'light', d: 'dark', rel: 'opposites' },
  { a: 'wood', b: 'tree', c: 'wool', d: 'sheep', rel: 'material to source' },
  { a: 'baker', b: 'bread', c: 'carpenter', d: 'furniture', rel: 'maker to product' },
  { a: 'sun', b: 'day', c: 'moon', d: 'night', rel: 'associated pair' },
  { a: 'petal', b: 'flower', c: 'leaf', d: 'tree', rel: 'part to whole' },
  { a: 'piano', b: 'music', c: 'oven', d: 'food', rel: 'tool to product' },
  { a: 'calf', b: 'cow', c: 'lamb', d: 'sheep', rel: 'young to adult' },
  { a: 'chapter', b: 'novel', c: 'verse', d: 'poem', rel: 'part to whole' },
  { a: 'king', b: 'queen', c: 'prince', d: 'princess', rel: 'male to female' },
  { a: 'glove', b: 'hand', c: 'hat', d: 'head', rel: 'covering to body part' },
  { a: 'cup', b: 'saucer', c: 'knife', d: 'fork', rel: 'associated pair' },
  { a: 'grass', b: 'green', c: 'sky', d: 'blue', rel: 'object to colour' },
  { a: 'nose', b: 'smell', c: 'tongue', d: 'taste', rel: 'organ to sense' },
  { a: 'horse', b: 'foal', c: 'dog', d: 'puppy', rel: 'adult to young' },
  { a: 'flour', b: 'cake', c: 'wool', d: 'jumper', rel: 'material to product' },
  { a: 'rain', b: 'wet', c: 'sun', d: 'dry', rel: 'cause to effect' },
  { a: 'wheel', b: 'car', c: 'wing', d: 'plane', rel: 'part to whole' },
  { a: 'doctor', b: 'patient', c: 'teacher', d: 'pupil', rel: 'professional to client' },
  { a: 'bark', b: 'tree', c: 'skin', d: 'body', rel: 'outer layer to object' },
  { a: 'thermometer', b: 'temperature', c: 'clock', d: 'time', rel: 'instrument to what it measures' },
  { a: 'letter', b: 'word', c: 'word', d: 'sentence', rel: 'smaller unit to larger' },
  { a: 'lion', b: 'pride', c: 'wolf', d: 'pack', rel: 'animal to group name' },
  { a: 'painter', b: 'brush', c: 'writer', d: 'pen', rel: 'person to tool' },
  { a: 'cave', b: 'bear', c: 'burrow', d: 'rabbit', rel: 'home to animal' },
  { a: 'ice', b: 'water', c: 'snow', d: 'rain', rel: 'frozen to liquid' },
  { a: 'fast', b: 'slow', c: 'tall', d: 'short', rel: 'opposites' },
  { a: 'ship', b: 'captain', c: 'school', d: 'headteacher', rel: 'place to leader' },
  { a: 'seed', b: 'plant', c: 'egg', d: 'bird', rel: 'beginning to end' },
  { a: 'finger', b: 'ring', c: 'wrist', d: 'bracelet', rel: 'body part to jewellery' },
  { a: 'library', b: 'books', c: 'gallery', d: 'paintings', rel: 'place to contents' },
  { a: 'sword', b: 'knight', c: 'wand', d: 'wizard', rel: 'weapon to user' },
  { a: 'acorn', b: 'oak', c: 'bulb', d: 'tulip', rel: 'seed to plant' },
  { a: 'copper', b: 'metal', c: 'oak', d: 'tree', rel: 'specific to general' },
];

// ===================== ODD WORD OUT =====================

const ODD_WORD_GROUPS = [
  { group: ['apple', 'banana', 'orange', 'grape'], odd: 'table', category: 'fruits' },
  { group: ['dog', 'cat', 'rabbit', 'hamster'], odd: 'chair', category: 'pets' },
  { group: ['red', 'blue', 'green', 'yellow'], odd: 'happy', category: 'colours' },
  { group: ['Monday', 'Tuesday', 'Friday', 'Sunday'], odd: 'March', category: 'days of the week' },
  { group: ['violin', 'trumpet', 'guitar', 'piano'], odd: 'cricket', category: 'musical instruments' },
  { group: ['Paris', 'London', 'Tokyo', 'Rome'], odd: 'France', category: 'capital cities' },
  { group: ['whale', 'dolphin', 'shark', 'octopus'], odd: 'eagle', category: 'sea creatures' },
  { group: ['oak', 'pine', 'elm', 'birch'], odd: 'rose', category: 'trees' },
  { group: ['surgeon', 'dentist', 'nurse', 'pharmacist'], odd: 'plumber', category: 'medical professions' },
  { group: ['mercury', 'venus', 'mars', 'saturn'], odd: 'moon', category: 'planets' },
  { group: ['algebra', 'geometry', 'calculus', 'arithmetic'], odd: 'biology', category: 'branches of mathematics' },
  { group: ['sonnet', 'haiku', 'limerick', 'ballad'], odd: 'novel', category: 'types of poem' },
  { group: ['simile', 'metaphor', 'alliteration', 'onomatopoeia'], odd: 'paragraph', category: 'literary techniques' },
  { group: ['adverb', 'pronoun', 'conjunction', 'preposition'], odd: 'sentence', category: 'word classes' },
  { group: ['Seine', 'Thames', 'Danube', 'Rhine'], odd: 'Alps', category: 'European rivers' },
  { group: ['football', 'rugby', 'hockey', 'cricket'], odd: 'chess', category: 'team sports' },
  { group: ['sword', 'shield', 'lance', 'armour'], odd: 'pencil', category: 'medieval equipment' },
  { group: ['eagle', 'sparrow', 'robin', 'wren'], odd: 'frog', category: 'birds' },
  { group: ['iron', 'copper', 'gold', 'silver'], odd: 'wood', category: 'metals' },
  { group: ['square', 'triangle', 'circle', 'rectangle'], odd: 'purple', category: 'shapes' },
  { group: ['cello', 'viola', 'violin', 'harp'], odd: 'drum', category: 'stringed instruments' },
  { group: ['Atlantic', 'Pacific', 'Indian', 'Arctic'], odd: 'Sahara', category: 'oceans' },
  { group: ['rose', 'tulip', 'daisy', 'lily'], odd: 'carrot', category: 'flowers' },
  { group: ['hammer', 'saw', 'drill', 'screwdriver'], odd: 'spoon', category: 'tools' },
  { group: ['Mars', 'Snickers', 'Twix', 'KitKat'], odd: 'Coca-Cola', category: 'chocolate bars' },
  { group: ['salmon', 'trout', 'cod', 'haddock'], odd: 'chicken', category: 'fish' },
  { group: ['French', 'Spanish', 'German', 'Italian'], odd: 'Mathematics', category: 'languages' },
  { group: ['inch', 'foot', 'yard', 'mile'], odd: 'kilogram', category: 'units of length' },
  { group: ['January', 'March', 'July', 'October'], odd: 'Sunday', category: 'months' },
  { group: ['ant', 'beetle', 'wasp', 'butterfly'], odd: 'snake', category: 'insects' },
  { group: ['oxygen', 'nitrogen', 'hydrogen', 'helium'], odd: 'water', category: 'elements / gases' },
  { group: ['tennis', 'badminton', 'squash', 'table tennis'], odd: 'swimming', category: 'racquet sports' },
  { group: ['piano', 'organ', 'harpsichord', 'accordion'], odd: 'flute', category: 'keyboard instruments' },
  { group: ['emerald', 'ruby', 'sapphire', 'diamond'], odd: 'granite', category: 'gemstones' },
  { group: ['Shakespeare', 'Dickens', 'Austen', 'Bronte'], odd: 'Churchill', category: 'British authors' },
  { group: ['Amazon', 'Nile', 'Mississippi', 'Ganges'], odd: 'Everest', category: 'rivers' },
  { group: ['comma', 'semicolon', 'colon', 'apostrophe'], odd: 'vowel', category: 'punctuation marks' },
  { group: ['ballet', 'opera', 'theatre', 'symphony'], odd: 'painting', category: 'performing arts' },
  { group: ['granite', 'marble', 'limestone', 'sandstone'], odd: 'bronze', category: 'rocks' },
  { group: ['violin', 'cello', 'flute', 'clarinet'], odd: 'easel', category: 'musical instruments' },
  { group: ['hurricane', 'tornado', 'cyclone', 'typhoon'], odd: 'earthquake', category: 'wind storms' },
  { group: ['maple', 'willow', 'ash', 'beech'], odd: 'daffodil', category: 'trees' },
  { group: ['Mercury', 'Venus', 'Earth', 'Mars'], odd: 'Sun', category: 'planets' },
  { group: ['wool', 'cotton', 'silk', 'linen'], odd: 'rubber', category: 'fabrics' },
  { group: ['dentist', 'optician', 'vet', 'surgeon'], odd: 'teacher', category: 'healthcare professionals' },
];

// ===================== ANAGRAMS =====================

// Every entry verified so that:
//  - jumbled letters are exactly the multiset of answer letters
//  - answer has no common English anagram (so the answer is unique)
//  - every wrong option differs from the answer by at least one letter,
//    so it CANNOT be formed by rearranging the jumbled letters.
const ANAGRAMS = [
  { jumbled: 'HTBA', answer: 'BATH', wrongs: ['PATH', 'MATH', 'BOTH', 'BASH'] },
  { jumbled: 'PLEH', answer: 'HELP', wrongs: ['HELD', 'HEAP', 'HEMP', 'HELM'] },
  { jumbled: 'NKTO', answer: 'KNOT', wrongs: ['KNOB', 'KNEE', 'KNIT', 'KNOW'] },
  { jumbled: 'MLPA', answer: 'LAMP', wrongs: ['LAMB', 'LAND', 'LIMP', 'CAMP'] },
  { jumbled: 'OGFR', answer: 'FROG', wrongs: ['FROM', 'FORK', 'FORM', 'FIRM'] },
  { jumbled: 'IMSW', answer: 'SWIM', wrongs: ['SLIM', 'SKIM', 'SWAM', 'WHIM'] },
  { jumbled: 'UPJM', answer: 'JUMP', wrongs: ['BUMP', 'DUMP', 'HUMP', 'PUMP'] },
  { jumbled: 'DIWN', answer: 'WIND', wrongs: ['WAND', 'FIND', 'MIND', 'KIND'] },
  { jumbled: 'OKRW', answer: 'WORK', wrongs: ['FORK', 'PORK', 'WORN', 'CORK'] },
  { jumbled: 'KLIM', answer: 'MILK', wrongs: ['MILE', 'MINK', 'SILK', 'KILT'] },
  { jumbled: 'WGOR', answer: 'GROW', wrongs: ['GLOW', 'CROW', 'BROW', 'PROW'] },
  { jumbled: 'KGIN', answer: 'KING', wrongs: ['SING', 'WING', 'PING', 'WINK'] },
  { jumbled: 'NBDI', answer: 'BIND', wrongs: ['BEND', 'BAND', 'BIRD', 'BOND'] },
  { jumbled: 'DCOK', answer: 'DOCK', wrongs: ['DUCK', 'LOCK', 'SOCK', 'DUSK'] },
  { jumbled: 'PCOH', answer: 'CHOP', wrongs: ['CHIP', 'SHOP', 'CROP', 'COPY'] },
  { jumbled: 'LDSE', answer: 'SLED', wrongs: ['SLID', 'SLAB', 'SLOT', 'SLOB'] },
  { jumbled: 'MRAW', answer: 'WARM', wrongs: ['WORM', 'FARM', 'HARM', 'WARP'] },
  { jumbled: 'RDOO', answer: 'DOOR', wrongs: ['POOR', 'ROOF', 'ROOM', 'MOOR'] },
  { jumbled: 'EPOH', answer: 'HOPE', wrongs: ['ROPE', 'COPE', 'HOME', 'HOSE'] },
  { jumbled: 'OCLD', answer: 'COLD', wrongs: ['BOLD', 'GOLD', 'FOLD', 'HOLD'] },
  { jumbled: 'HCDLI', answer: 'CHILD', wrongs: ['CHILL', 'CHIEF', 'CLAIM', 'CLIMB'] },
  { jumbled: 'RWTAE', answer: 'WATER', wrongs: ['LATER', 'CATER', 'WAVER', 'WAGER'] },
  { jumbled: 'HILTG', answer: 'LIGHT', wrongs: ['RIGHT', 'NIGHT', 'SIGHT', 'TIGHT'] },
  { jumbled: 'ICHAR', answer: 'CHAIR', wrongs: ['CHAIN', 'CHART', 'CHARM', 'CHAFE'] },
  { jumbled: 'GTREI', answer: 'TIGER', wrongs: ['TIMER', 'TILER', 'TAMER', 'TITER'] },
  { jumbled: 'HTSIR', answer: 'SHIRT', wrongs: ['SHIFT', 'SHIRK', 'SHARP', 'SHORT'] },
  { jumbled: 'VBRAE', answer: 'BRAVE', wrongs: ['GRAVE', 'CRAVE', 'BRAKE', 'BRACE'] },
  { jumbled: 'NBRAI', answer: 'BRAIN', wrongs: ['DRAIN', 'GRAIN', 'BRAND', 'BROWN'] },
  { jumbled: 'RKTIC', answer: 'TRICK', wrongs: ['TRACK', 'TRUCK', 'BRICK', 'CLICK'] },
  { jumbled: 'AFMLE', answer: 'FLAME', wrongs: ['FRAME', 'BLAME', 'SHAME', 'FLAKE'] },
].filter(a => {
  // Runtime guard: answer letters must equal jumbled letters (same multiset)
  const sortStr = s => s.toUpperCase().split('').sort().join('');
  const ok = sortStr(a.jumbled) === sortStr(a.answer);
  if (!ok) console.warn('[verbal] Anagram letter mismatch:', a.jumbled, '->', a.answer);
  return ok;
});

// ===================== CONNECTING WORDS (all verified) =====================

// Verified entries: answer forms a real compound word both with w1 before it AND with w2 after it.
// No entry where answer === w1 or answer === w2 (would produce nonsense like "cupcup").
const CONNECTING_WORDS = [
  { w1: 'foot', w2: 'room', answer: 'ball', wrongs: ['chair', 'step', 'board', 'mat'] },
  { w1: 'rain', w2: 'tie', answer: 'bow', wrongs: ['drop', 'coat', 'knot', 'string'] },
  { w1: 'sun', w2: 'house', answer: 'light', wrongs: ['burn', 'ray', 'beam', 'shine'] },
  { w1: 'snow', w2: 'game', answer: 'ball', wrongs: ['flake', 'storm', 'drift', 'fall'] },
  { w1: 'day', w2: 'bulb', answer: 'light', wrongs: ['time', 'break', 'glow', 'lamp'] },
  { w1: 'news', w2: 'back', answer: 'paper', wrongs: ['reader', 'flash', 'stand', 'clip'] },
  { w1: 'head', w2: 'mark', answer: 'land', wrongs: ['band', 'line', 'master', 'set'] },
  { w1: 'tooth', w2: 'work', answer: 'brush', wrongs: ['paste', 'pick', 'fairy', 'ache'] },
  { w1: 'bed', w2: 'walk', answer: 'side', wrongs: ['post', 'sheet', 'frame', 'head'] },
  { w1: 'door', w2: 'hop', answer: 'bell', wrongs: ['step', 'handle', 'knob', 'frame'] },
  { w1: 'fire', w2: 'man', answer: 'work', wrongs: ['fight', 'place', 'side', 'ball'] },
  { w1: 'black', w2: 'walk', answer: 'board', wrongs: ['bird', 'mail', 'smith', 'out'] },
  { w1: 'hand', w2: 'link', answer: 'cuff', wrongs: ['grip', 'hold', 'shake', 'clap'] },
  { w1: 'time', w2: 'cloth', answer: 'table', wrongs: ['piece', 'line', 'zone', 'bomb'] },
  { w1: 'play', w2: 'work', answer: 'ground', wrongs: ['mate', 'time', 'house', 'pen'] },
  { w1: 'sea', w2: 'power', answer: 'horse', wrongs: ['shell', 'weed', 'side', 'bird'] },
  { w1: 'farm', w2: 'bound', answer: 'house', wrongs: ['yard', 'land', 'hand', 'gate'] },
  { w1: 'moon', w2: 'year', answer: 'light', wrongs: ['beam', 'glow', 'shine', 'star'] },
  { w1: 'key', w2: 'walk', answer: 'board', wrongs: ['hole', 'chain', 'ring', 'lock'] },
  { w1: 'under', w2: 'hog', answer: 'ground', wrongs: ['cover', 'line', 'wear', 'dog'] },
  { w1: 'air', w2: 'hole', answer: 'port', wrongs: ['line', 'plane', 'craft', 'field'] },
  { w1: 'arm', w2: 'lift', answer: 'chair', wrongs: ['band', 'rest', 'pit', 'lock'] },
  { w1: 'butter', w2: 'paper', answer: 'fly', wrongs: ['milk', 'cup', 'knife', 'dish'] },
  { w1: 'side', w2: 'way', answer: 'walk', wrongs: ['road', 'step', 'path', 'lane'] },
  { w1: 'night', w2: 'house', answer: 'club', wrongs: ['fall', 'time', 'gown', 'owl'] },
  { w1: 'class', w2: 'mate', answer: 'room', wrongs: ['work', 'list', 'book', 'time'] },
  { w1: 'grand', w2: 'hood', answer: 'father', wrongs: ['mother', 'stand', 'son', 'kid'] },
  { w1: 'fire', w2: 'mat', answer: 'place', wrongs: ['box', 'man', 'side', 'work'] },
  { w1: 'race', w2: 'back', answer: 'horse', wrongs: ['car', 'track', 'time', 'day'] },
  { w1: 'high', w2: 'side', answer: 'way', wrongs: ['road', 'street', 'land', 'lane'] },
  { w1: 'out', w2: 'walk', answer: 'side', wrongs: ['door', 'line', 'back', 'look'] },
  { w1: 'down', w2: 'ship', answer: 'town', wrongs: ['fall', 'time', 'hill', 'pour'] },
  { w1: 'work', w2: 'keeper', answer: 'shop', wrongs: ['out', 'man', 'bench', 'load'] },
  { w1: 'week', w2: 'game', answer: 'end', wrongs: ['day', 'night', 'time', 'long'] },
  { w1: 'star', w2: 'net', answer: 'fish', wrongs: ['light', 'bright', 'dust', 'shine'] },
  { w1: 'ear', w2: 'tone', answer: 'ring', wrongs: ['drum', 'lobe', 'wax', 'phone'] },
  { w1: 'foot', w2: 'out', answer: 'print', wrongs: ['ball', 'step', 'wear', 'note'] },
  { w1: 'back', w2: 'age', answer: 'pack', wrongs: ['bone', 'ward', 'fire', 'door'] },
  { w1: 'fire', w2: 'over', answer: 'fly', wrongs: ['side', 'work', 'man', 'place'] },
  { w1: 'eye', w2: 'park', answer: 'ball', wrongs: ['brow', 'lid', 'lash', 'sight'] },
];

// ===================== MISSING THREE-LETTER WORD =====================

const MISSING_WORD_SENTENCES = [
  { text: 'The ___ was hanging on the wall', answer: 'MAP', wrongs: ['MOP', 'MUG', 'MAT', 'MAN'] },
  { text: 'She wore a beautiful ___ to the party', answer: 'HAT', wrongs: ['BAG', 'CUP', 'BOW', 'PIN'] },
  { text: 'The ___ flew silently over the garden', answer: 'OWL', wrongs: ['OAR', 'ORE', 'OAK', 'OAT'] },
  { text: 'They found a golden ___ in the cave', answer: 'CUP', wrongs: ['CUB', 'CUT', 'COB', 'COG'] },
  { text: 'The cat chased the ___ across the room', answer: 'RAT', wrongs: ['RUG', 'RAM', 'RAG', 'RAN'] },
  { text: 'He kept his ___ in a wooden chest', answer: 'AXE', wrongs: ['ACE', 'ATE', 'APE', 'AGE'] },
  { text: 'The ship sailed into the ___ at dawn', answer: 'BAY', wrongs: ['BAR', 'BAN', 'BAD', 'BAT'] },
  { text: 'She dipped her ___ in the ink', answer: 'PEN', wrongs: ['PIN', 'PAN', 'PIE', 'PEW'] },
  { text: 'The ___ rolled down the steep hill', answer: 'LOG', wrongs: ['LEG', 'LID', 'LAP', 'LAW'] },
  { text: 'The fisherman cast his ___ into the river', answer: 'NET', wrongs: ['NUT', 'NAP', 'NIT', 'NOD'] },
  { text: 'She lit the ___ to read by candlelight', answer: 'WAX', wrongs: ['WAR', 'WAD', 'WAS', 'WAY'] },
  { text: 'The ___ was too hot to drink', answer: 'TEA', wrongs: ['TIN', 'TIE', 'TAR', 'TAP'] },
  { text: 'He tied a ___ around the parcel', answer: 'BOW', wrongs: ['BOX', 'BOY', 'BIG', 'BIT'] },
  { text: 'The ___ cracked when she dropped it', answer: 'EGG', wrongs: ['EAR', 'EEL', 'ELM', 'END'] },
  { text: 'She used a ___ to dig in the garden', answer: 'HOE', wrongs: ['HOG', 'HOP', 'HOT', 'HUB'] },
  { text: 'The dog buried the ___ in the garden', answer: 'TOY', wrongs: ['TIN', 'TAN', 'TAR', 'TAP'] },
  { text: 'He found a ___ of honey in the cupboard', answer: 'JAR', wrongs: ['JAM', 'JAW', 'JAB', 'JOY'] },
  { text: 'The ___ flew kites on the beach', answer: 'BOY', wrongs: ['BAT', 'BUS', 'BAD', 'BED'] },
  { text: 'She put the ___ on the table for dinner', answer: 'JUG', wrongs: ['JAM', 'JOG', 'JAR', 'JOY'] },
  { text: 'The ___ barked loudly at the postman', answer: 'DOG', wrongs: ['DIG', 'DEN', 'DAM', 'DAY'] },
  { text: 'He wore a ___ to keep warm in winter', answer: 'CAP', wrongs: ['CUP', 'COP', 'COT', 'CUB'] },
  { text: 'The children played with the red ___', answer: 'VAN', wrongs: ['VAT', 'VET', 'VIM', 'VOW'] },
  { text: 'She drew a ___ around the important word', answer: 'BOX', wrongs: ['BOW', 'BOY', 'BUS', 'BUD'] },
  { text: 'He took a ___ from the fruit bowl', answer: 'FIG', wrongs: ['FAN', 'FIN', 'FOG', 'FUN'] },
  { text: 'The ___ blew strongly from the north', answer: 'AIR', wrongs: ['AID', 'AIM', 'APE', 'ARC'] },
  { text: 'She found a large ___ under the rock', answer: 'BUG', wrongs: ['BUN', 'BUS', 'BUT', 'BUD'] },
  { text: 'The ___ was tangled in the branches', answer: 'WEB', wrongs: ['WET', 'WIG', 'WIN', 'WIT'] },
  { text: 'He caught the ___ with his bare hands', answer: 'FLY', wrongs: ['FOX', 'FUN', 'FUR', 'FAT'] },
  { text: 'The baker made a fresh ___ of bread', answer: 'BUN', wrongs: ['BIN', 'BAG', 'BAT', 'BIT'] },
  { text: 'She saw a ___ swimming in the pond', answer: 'KOI', wrongs: ['KIT', 'KEY', 'KIN', 'KID'] },
];

// ===================== CREATE-A-WORD =====================

// Verified entries: every wrong option has at least one letter NOT in the letter set,
// so wrongs cannot be formed using ALL the given letters. Answers have no common anagram.
const LETTER_SETS = [
  { letters: ['P', 'L', 'A', 'N'], answer: 'PLAN', wrongs: ['NAIL', 'PAIL', 'LANE', 'CLAN'] },
  { letters: ['G', 'R', 'O', 'W'], answer: 'GROW', wrongs: ['GLOW', 'CROW', 'PROW', 'BROW'] },
  { letters: ['C', 'L', 'A', 'P'], answer: 'CLAP', wrongs: ['CLOP', 'CLIP', 'CLAY', 'CLAN'] },
  { letters: ['F', 'L', 'A', 'T'], answer: 'FLAT', wrongs: ['FIAT', 'FLAP', 'FLAG', 'FLAB'] },
  { letters: ['S', 'W', 'I', 'M'], answer: 'SWIM', wrongs: ['WHIM', 'SLIM', 'SWAM', 'SKIM'] },
  { letters: ['T', 'R', 'A', 'P'], answer: 'TRAP', wrongs: ['TRIP', 'TRAY', 'TRIM', 'PRAY'] },
  { letters: ['C', 'R', 'A', 'B'], answer: 'CRAB', wrongs: ['GRAB', 'CRAM', 'BARK', 'CARE'] },
  { letters: ['F', 'R', 'O', 'G'], answer: 'FROG', wrongs: ['FROM', 'FORK', 'FORD', 'FORE'] },
  { letters: ['H', 'E', 'L', 'P'], answer: 'HELP', wrongs: ['HEAP', 'HEEL', 'HELD', 'HELM'] },
  { letters: ['J', 'U', 'M', 'P'], answer: 'JUMP', wrongs: ['BUMP', 'DUMP', 'HUMP', 'PUMP'] },
  { letters: ['K', 'N', 'O', 'T'], answer: 'KNOT', wrongs: ['KNOB', 'KNOW', 'KNEE', 'KNIT'] },
  { letters: ['L', 'A', 'M', 'P'], answer: 'LAMP', wrongs: ['LAMB', 'LAND', 'LIMP', 'CAMP'] },
  { letters: ['W', 'I', 'N', 'D'], answer: 'WIND', wrongs: ['WAND', 'FIND', 'MIND', 'KIND'] },
  { letters: ['D', 'U', 'C', 'K'], answer: 'DUCK', wrongs: ['DOCK', 'DECK', 'DICK', 'DUNK'] },
  { letters: ['B', 'A', 'T', 'H'], answer: 'BATH', wrongs: ['PATH', 'MATH', 'BOTH', 'BASH'] },
  { letters: ['W', 'O', 'R', 'K'], answer: 'WORK', wrongs: ['FORK', 'PORK', 'WORN', 'CORK'] },
  { letters: ['M', 'I', 'L', 'K'], answer: 'MILK', wrongs: ['MILE', 'MINK', 'SILK', 'KILT'] },
  { letters: ['K', 'I', 'N', 'G'], answer: 'KING', wrongs: ['SING', 'WING', 'PING', 'WINK'] },
  { letters: ['D', 'O', 'O', 'R'], answer: 'DOOR', wrongs: ['POOR', 'ROOF', 'ROOM', 'MOOR'] },
  { letters: ['H', 'O', 'P', 'E'], answer: 'HOPE', wrongs: ['ROPE', 'COPE', 'HOME', 'HOSE'] },
  { letters: ['B', 'R', 'I', 'C', 'K'], answer: 'BRICK', wrongs: ['TRICK', 'PRICK', 'BRISK', 'CLICK'] },
  { letters: ['F', 'L', 'A', 'M', 'E'], answer: 'FLAME', wrongs: ['BLAME', 'FRAME', 'SHAME', 'FLAKE'] },
  { letters: ['G', 'R', 'A', 'S', 'P'], answer: 'GRASP', wrongs: ['GRABS', 'GRASS', 'GRAPH', 'GRAPE'] },
  { letters: ['C', 'H', 'A', 'I', 'R'], answer: 'CHAIR', wrongs: ['CHAIN', 'CHART', 'CHARM', 'CHAFE'] },
  { letters: ['W', 'A', 'T', 'E', 'R'], answer: 'WATER', wrongs: ['LATER', 'CATER', 'WAVER', 'WAGER'] },
  { letters: ['L', 'I', 'G', 'H', 'T'], answer: 'LIGHT', wrongs: ['RIGHT', 'NIGHT', 'SIGHT', 'TIGHT'] },
  { letters: ['T', 'R', 'I', 'C', 'K'], answer: 'TRICK', wrongs: ['TRACK', 'TRUCK', 'BRICK', 'CLICK'] },
  { letters: ['T', 'I', 'G', 'E', 'R'], answer: 'TIGER', wrongs: ['TIMER', 'TILER', 'TAMER', 'TITER'] },
  { letters: ['B', 'R', 'A', 'V', 'E'], answer: 'BRAVE', wrongs: ['GRAVE', 'CRAVE', 'BRAKE', 'BRACE'] },
  { letters: ['B', 'R', 'A', 'I', 'N'], answer: 'BRAIN', wrongs: ['DRAIN', 'GRAIN', 'BRAND', 'BROWN'] },
].filter(ls => {
  const sortStr = s => s.toUpperCase().split('').sort().join('');
  const ok = sortStr(ls.letters.join('')) === sortStr(ls.answer);
  if (!ok) console.warn('[verbal] LETTER_SET letter mismatch:', ls.letters.join(''), '->', ls.answer);
  return ok;
});

// ===================== NUMBER SEQUENCES =====================

function numberSequenceQuestion(level, index, rng) {
  const types = [];
  if (level <= 30) types.push('add');
  if (level >= 10) types.push('multiply');
  if (level >= 15) types.push('add-increasing');
  if (level >= 20) types.push('alternating');
  if (level >= 25) types.push('squares');
  if (level >= 30) types.push('fibonacci');
  if (level >= 40) types.push('subtract');
  if (level >= 50) types.push('triangular');
  if (level >= 60) types.push('cubes');

  const type = pick(rng, types);
  let terms = [], answer, rule;

  switch (type) {
    case 'add': {
      const start = randInt(rng, 1, 20 + level);
      const step = randInt(rng, 2, 5 + Math.floor(level / 10));
      for (let i = 0; i < 5; i++) terms.push(start + i * step);
      answer = start + 5 * step;
      rule = `Add ${step} each time`;
      break;
    }
    case 'multiply': {
      const start = randInt(rng, 1, 3);
      const ratio = randInt(rng, 2, 3);
      for (let i = 0; i < 5; i++) terms.push(start * Math.pow(ratio, i));
      answer = start * Math.pow(ratio, 5);
      rule = `Multiply by ${ratio} each time`;
      break;
    }
    case 'add-increasing': {
      const start = randInt(rng, 1, 10);
      let val = start;
      terms.push(val);
      for (let i = 1; i <= 5; i++) { val += i; terms.push(val); }
      answer = terms[5];
      terms = terms.slice(0, 5);
      rule = 'Add 1 more each time (+1, +2, +3, +4, +5, +6...)';
      break;
    }
    case 'alternating': {
      const a = randInt(rng, 1, 10);
      const b = randInt(rng, 2, 5);
      const c = randInt(rng, 1, Math.min(b - 1, 4));
      for (let i = 0; i < 5; i++) terms.push(a + i * b + (i % 2 === 0 ? 0 : c));
      answer = a + 5 * b + (5 % 2 === 0 ? 0 : c);
      rule = `Alternating pattern: +${b + c}, +${b - c}, +${b + c}, +${b - c}...`;
      break;
    }
    case 'squares': {
      const offset = randInt(rng, 0, 3);
      for (let i = 1; i <= 5; i++) terms.push(i * i + offset);
      answer = 36 + offset;
      rule = `Square numbers${offset ? ` plus ${offset}` : ''}: 1, 4, 9, 16, 25, 36...`;
      break;
    }
    case 'fibonacci': {
      const a1 = randInt(rng, 1, 5);
      const a2 = randInt(rng, 1, 5);
      terms.push(a1, a2);
      for (let i = 2; i < 6; i++) terms.push(terms[i - 1] + terms[i - 2]);
      answer = terms[5];
      terms = terms.slice(0, 5);
      rule = 'Each number is the sum of the two before it';
      break;
    }
    case 'subtract': {
      const start = randInt(rng, 50, 100 + level);
      const step = randInt(rng, 3, 8 + Math.floor(level / 15));
      for (let i = 0; i < 5; i++) terms.push(start - i * step);
      answer = start - 5 * step;
      rule = `Subtract ${step} each time`;
      break;
    }
    case 'triangular': {
      const offset = randInt(rng, 0, 2);
      for (let i = 1; i <= 5; i++) terms.push((i * (i + 1)) / 2 + offset);
      answer = (6 * 7) / 2 + offset;
      rule = `Triangular numbers${offset ? ` plus ${offset}` : ''}: 1, 3, 6, 10, 15, 21...`;
      break;
    }
    case 'cubes': {
      for (let i = 1; i <= 5; i++) terms.push(i * i * i);
      answer = 216;
      rule = 'Cube numbers: 1, 8, 27, 64, 125, 216...';
      break;
    }
  }

  const opts = new Set([answer]);
  while (opts.size < 5) { opts.add(answer + randInt(rng, -Math.max(3, Math.floor(Math.abs(answer) * 0.2)), Math.max(3, Math.floor(Math.abs(answer) * 0.2)))); }
  const sorted = [...opts].sort((a, b) => a - b);
  return {
    prompt: `What comes next in the sequence?\n\n${terms.join(', ')}, ?`,
    options: sorted.map(String), correctIndex: sorted.indexOf(answer),
    explanation: { steps: [rule, `Next term: ${answer}`], tip: 'Look at the differences between consecutive terms to find the pattern.' }
  };
}

// ===================== LETTER SEQUENCES =====================

function letterSequenceQuestion(level, index, rng) {
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const type = randInt(rng, 0, 3);
  let terms = [], answer, rule;

  if (type === 0) {
    const start = randInt(rng, 0, 15);
    const step = randInt(rng, 1, 4);
    for (let i = 0; i < 5; i++) terms.push(alpha[(start + i * step) % 26]);
    answer = alpha[(start + 5 * step) % 26];
    rule = `Move ${step} letter${step > 1 ? 's' : ''} forward each time`;
  } else if (type === 1) {
    const start = randInt(rng, 15, 25);
    const step = randInt(rng, 1, 3);
    for (let i = 0; i < 5; i++) terms.push(alpha[(start - i * step + 26) % 26]);
    answer = alpha[(start - 5 * step + 26) % 26];
    rule = `Move ${step} letter${step > 1 ? 's' : ''} backward each time`;
  } else if (type === 2) {
    const s1 = randInt(rng, 0, 10);
    for (let i = 0; i < 5; i++) terms.push(alpha[(s1 + i * 2) % 26]);
    answer = alpha[(s1 + 5 * 2) % 26];
    rule = 'Skip one letter each time (move 2 forward)';
  } else {
    // Double letter pairs: AA BB CC...
    const start = randInt(rng, 0, 10);
    for (let i = 0; i < 5; i++) {
      const letter = alpha[(start + Math.floor(i / 2)) % 26];
      terms.push(letter);
    }
    answer = alpha[(start + Math.floor(5 / 2)) % 26];
    rule = 'Each letter appears twice: AA, BB, CC...';
  }

  const wrongs = [];
  for (let i = 0; i < 8; i++) {
    const w = alpha[randInt(rng, 0, 25)];
    if (w !== answer && !wrongs.includes(w)) wrongs.push(w);
  }
  const options = shuffle(rng, [answer, ...wrongs.slice(0, 4)]);
  return {
    prompt: `What letter comes next?\n\n${terms.join('  ')},  ?`,
    options, correctIndex: options.indexOf(answer),
    explanation: { steps: [rule, `Next letter: ${answer}`], tip: 'Number the letters (A=1, B=2...) to help spot the pattern.' }
  };
}

// ===================== COMPOUND WORDS =====================

function compoundWordQuestion(entry, rng) {
  const pair = entry;
  const type = randInt(rng, 0, 1);

  if (type === 0) {
    const answer = pair[0] + pair[1];
    const wrongPairs = shuffle(rng, COMPOUND_PAIRS.filter(p => p !== pair)).slice(0, 4);
    const options = shuffle(rng, [answer, ...wrongPairs.map(p => p[0] + p[1])]);
    return {
      prompt: 'Which is a real compound word?',
      options, correctIndex: options.indexOf(answer),
      explanation: { steps: [`${pair[0]} + ${pair[1]} = ${answer}`], tip: 'A compound word is made from two smaller words joined together.' }
    };
  } else {
    const answer = pair[1];
    const wrongs = shuffle(rng, COMPOUND_PAIRS.filter(p => p !== pair).map(p => p[1]));
    const uniqueWrongs = [...new Set(wrongs.filter(w => w !== answer))].slice(0, 4);
    const options = shuffle(rng, [answer, ...uniqueWrongs]);
    return {
      prompt: `Which word can follow "${pair[0]}" to make a compound word?`,
      options, correctIndex: options.indexOf(answer),
      explanation: { steps: [`${pair[0]} + ${answer} = ${pair[0]}${answer}`], tip: 'Try each option after the given word. Which one makes a real word?' }
    };
  }
}

// ===================== HIDDEN WORDS =====================

function makeHiddenWordQuestion(entry, rng) {
  const p = entry;
  const wrongWords = ['COAT', 'BEAR', 'FISH', 'STAR', 'LAMP', 'TREE', 'MOON', 'GATE', 'KING', 'BELL',
    'FROG', 'CAKE', 'BOAT', 'NEST', 'PLAY', 'ROSE', 'SEED', 'WAVE', 'GOLD', 'SILK',
    'HERO', 'LEAF', 'SAIL', 'TUNE', 'PALM', 'ARCH', 'DOME', 'HELM', 'CLAW', 'HAZE'];
  const available = wrongWords.filter(w => w !== p.answer);
  const picked = shuffle(rng, available).slice(0, 4);
  const options = shuffle(rng, [p.answer, ...picked]);
  return {
    prompt: `Find the hidden word in this sentence:\n\n"${p.sentence}"`,
    options, correctIndex: options.indexOf(p.answer),
    explanation: { steps: [p.explain], tip: 'The hidden word is formed across two adjacent words in the sentence. Read the end of one word into the start of the next.' }
  };
}

// ===================== WORD ANALOGIES =====================

function wordAnalogyQuestion(entry, rng) {
  const a = entry;
  const wrongs = shuffle(rng, ANALOGIES.filter(x => x !== a).map(x => x.d)).slice(0, 4);
  const options = shuffle(rng, [a.d, ...wrongs]);
  return {
    prompt: `${a.a} is to ${a.b} as ${a.c} is to ?`,
    options, correctIndex: options.indexOf(a.d),
    explanation: { steps: [`The relationship is: ${a.rel}`, `${a.a} \u2192 ${a.b} (${a.rel}), so ${a.c} \u2192 ${a.d}`], tip: 'Work out the relationship between the first pair, then apply the same relationship to the second pair.' }
  };
}

// ===================== ODD WORD OUT =====================

function oddWordOutQuestion(entry, rng) {
  const options = shuffle(rng, [...entry.group, entry.odd]);
  return {
    prompt: 'Which word is the odd one out?',
    options, correctIndex: options.indexOf(entry.odd),
    explanation: { steps: [`${entry.group.join(', ')} are all ${entry.category}.`, `"${entry.odd}" does not belong to this group.`], tip: 'Look for the connection between most of the words. The odd one out doesn\'t share it.' }
  };
}

// ===================== ANAGRAMS =====================

function anagramQuestion(entry, rng) {
  const a = entry;
  const options = shuffle(rng, [a.answer, ...a.wrongs.slice(0, 4)]);
  return {
    prompt: `Rearrange the letters to make a word:\n\n${a.jumbled}`,
    options, correctIndex: options.indexOf(a.answer),
    explanation: { steps: [`${a.jumbled} rearranges to make "${a.answer}".`], tip: 'Try different combinations. Start with common letter patterns.' }
  };
}

// ===================== CONNECTING WORDS =====================

function connectingWordsQuestion(entry, rng) {
  const v = entry;
  const options = shuffle(rng, [v.answer, ...v.wrongs]);
  return {
    prompt: `Which word can go after "${v.w1}" and before "${v.w2}" to make two new words?`,
    options, correctIndex: options.indexOf(v.answer),
    explanation: { steps: [`${v.w1}${v.answer} and ${v.answer}${v.w2}`, `The connecting word is "${v.answer}".`], tip: 'Try putting each option between the two words. Both combinations must make real words.' }
  };
}

// ===================== MISSING THREE-LETTER WORD =====================

function missingThreeLetterWord(entry, rng) {
  const s = entry;
  const options = shuffle(rng, [s.answer, ...s.wrongs]);
  return {
    prompt: `Which three-letter word best completes the sentence?\n\n${s.text}`,
    options, correctIndex: options.indexOf(s.answer),
    explanation: { steps: [`The answer is "${s.answer}".`, `"${s.text.replace('___', s.answer)}"`], tip: 'Try reading each option in the sentence. Which one makes the most sense?' }
  };
}

// ===================== CREATE A WORD =====================

function createAWordQuestion(entry, rng) {
  const ls = entry;
  // Shuffle letters so they don't appear in the order that spells the answer.
  // Keep shuffling until the display order is NOT the same as the answer.
  let displayLetters = shuffle(rng, ls.letters);
  let guard = 0;
  while (displayLetters.join('') === ls.answer.toUpperCase() && guard++ < 10) {
    displayLetters = shuffle(rng, ls.letters);
  }
  const options = shuffle(rng, [ls.answer, ...ls.wrongs]);
  return {
    prompt: `Use ALL of these letters to make a word:\n\n${displayLetters.join('   ')}`,
    options, correctIndex: options.indexOf(ls.answer),
    explanation: { steps: [`The letters ${displayLetters.join(', ')} rearrange to make "${ls.answer}".`], tip: 'Try different arrangements. Say them out loud \u2014 sometimes you can hear the word.' }
  };
}

// ===================== CALCULATING WITH LETTERS =====================

function calculatingWithLetters(level, index, rng) {
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const maxLetter = Math.min(8 + Math.floor(level / 8), 20);
  const l1 = randInt(rng, 0, maxLetter);
  const l2 = randInt(rng, 0, Math.min(maxLetter, l1));
  const type = randInt(rng, 0, 2);

  let answer, prompt;
  if (type === 0) {
    answer = (l1 + 1) + (l2 + 1);
    prompt = `If A = 1, B = 2, C = 3 and so on, what is ${alpha[l1]} + ${alpha[l2]}?`;
  } else if (type === 1) {
    answer = (l1 + 1) * (l2 + 1);
    prompt = `If A = 1, B = 2, C = 3 and so on, what is ${alpha[l1]} \u00d7 ${alpha[l2]}?`;
  } else {
    answer = (l1 + 1) - (l2 + 1);
    prompt = `If A = 1, B = 2, C = 3 and so on, what is ${alpha[l1]} \u2212 ${alpha[l2]}?`;
  }

  const opts = new Set([answer]);
  while (opts.size < 5) opts.add(answer + randInt(rng, -4, 4));
  const sorted = [...opts].sort((a, b) => a - b);
  return {
    prompt,
    options: sorted.map(String), correctIndex: sorted.indexOf(answer),
    explanation: { steps: [`${alpha[l1]} = ${l1 + 1}, ${alpha[l2]} = ${l2 + 1}`, `${l1 + 1} ${type === 0 ? '+' : type === 1 ? '\u00d7' : '\u2212'} ${l2 + 1} = ${answer}`], tip: 'Convert each letter to its number (A=1, B=2, C=3...) then calculate.' }
  };
}

// ===================== LETTER CODES =====================

function letterCodeQuestion(level, index, rng) {
  const words = ['CAT', 'DOG', 'SUN', 'BIG', 'HAT', 'PEN', 'CUP', 'MAP', 'BAG', 'RUN',
    'TOP', 'FAN', 'JAM', 'NET', 'BOX', 'RED', 'OWL', 'FIG', 'HOP', 'VAN',
    'WIN', 'LOG', 'MOP', 'TIN', 'HUG', 'WAR', 'DIM', 'FOG', 'NUT', 'SAP'];
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const word = pick(rng, words);
  const shift = randInt(rng, 1, 5 + Math.floor(level / 15));
  const coded = word.split('').map(c => alpha[(alpha.indexOf(c) + shift) % 26]).join('');

  const otherWords = words.filter(w => w !== word);
  const other = pick(rng, otherWords);
  const answer = other.split('').map(c => alpha[(alpha.indexOf(c) + shift) % 26]).join('');

  const wrongs = [];
  for (let i = 0; i < 8; i++) {
    const wrongShift = shift + randInt(rng, 1, 3) * (rng() > 0.5 ? 1 : -1);
    const w = other.split('').map(c => alpha[(alpha.indexOf(c) + wrongShift + 26) % 26]).join('');
    if (w !== answer && !wrongs.includes(w)) wrongs.push(w);
  }
  const options = shuffle(rng, [answer, ...wrongs.slice(0, 4)]);
  while (options.length < 5) options.push(other.split('').map(c => alpha[(alpha.indexOf(c) + randInt(rng, 6, 10)) % 26]).join(''));

  return {
    prompt: `If ${word} is coded as ${coded}, what would ${other} be coded as?`,
    options: options.slice(0, 5), correctIndex: options.indexOf(answer),
    explanation: { steps: [`Each letter is shifted forward by ${shift} in the alphabet`, `${other.split('').map(c => `${c}\u2192${alpha[(alpha.indexOf(c) + shift) % 26]}`).join(', ')}`, `${other} = ${answer}`], tip: 'Find how many places each letter has been shifted, then apply the same shift to the new word.' }
  };
}

// ===================== WORD-NUMBER CODES =====================

function wordNumberCodeQuestion(level, index, rng) {
  const words3 = ['CAT', 'DOG', 'PEN', 'HAT', 'CUP', 'BOX', 'SUN', 'RUN', 'BAG', 'NET',
    'FAN', 'JAM', 'VAN', 'MOP', 'TIN', 'HUG', 'WAR', 'FOG', 'NUT', 'SAP'];
  const w1 = pick(rng, words3);
  const w2 = pick(rng, words3.filter(w => w !== w1));

  const allLetters = new Set([...w1, ...w2]);
  const letterMap = {};
  let num = randInt(rng, 1, 3);
  for (const l of allLetters) {
    letterMap[l] = num;
    num += randInt(rng, 1, 3);
  }

  const code1 = w1.split('').map(c => letterMap[c]).join(' ');
  const code2 = w2.split('').map(c => letterMap[c]).join(' ');

  const letters = [...allLetters];
  const askLetter = pick(rng, letters);
  const answer = letterMap[askLetter];

  const opts = new Set([answer]);
  while (opts.size < 5) opts.add(answer + randInt(rng, -3, 3));
  const sorted = [...opts].sort((a, b) => a - b);

  return {
    prompt: `If ${w1} is coded as ${code1}\nand ${w2} is coded as ${code2}\n\nWhat number represents the letter ${askLetter}?`,
    options: sorted.map(String), correctIndex: sorted.indexOf(answer),
    explanation: {
      steps: [`Compare the codes: ${w1} = ${code1}, ${w2} = ${code2}`, `${askLetter} = ${answer}`],
      tip: 'Match each letter to its number by comparing the two coded words.'
    }
  };
}

// ===================== LOGIC PROBLEMS =====================

function logicProblemQuestion(level, index, rng) {
  const names = shuffle(rng, ['Alice', 'Ben', 'Cara', 'Dan', 'Eve', 'Finn', 'Grace', 'Harry']).slice(0, 3);
  const type = randInt(rng, 0, 2);

  if (type === 0) {
    // Order puzzle — who is youngest/oldest
    const options = shuffle(rng, [...names, 'Cannot tell', 'They are the same age']);
    return {
      prompt: `${names[0]} is older than ${names[1]}.\n${names[1]} is older than ${names[2]}.\n\nWho is the youngest?`,
      options, correctIndex: options.indexOf(names[2]),
      explanation: { steps: [`${names[0]} > ${names[1]} > ${names[2]} in age`, `${names[2]} is the youngest.`], tip: 'Work through each clue and put them in order.' }
    };
  }

  if (type === 1) {
    // Simple elimination — what colour bag
    const colours = shuffle(rng, ['red', 'blue', 'green']);
    const answer = colours[2];
    const options = shuffle(rng, [colours[0], colours[1], colours[2], 'Cannot tell', 'None of these']);
    return {
      prompt: `${names[0]}, ${names[1]} and ${names[2]} each have a different coloured bag: ${colours.join(', ')}.\n\n\u2022 ${names[1]}'s bag is ${colours[1]}.\n\u2022 ${names[2]}'s bag is ${colours[0]}.\n\nWhat colour is ${names[0]}'s bag?`,
      options, correctIndex: options.indexOf(answer),
      explanation: {
        steps: [`${names[1]} = ${colours[1]}, ${names[2]} = ${colours[0]}`, `The only colour left is ${answer}.`, `${names[0]}'s bag is ${answer}.`],
        tip: 'Cross off the colours already taken to find what\'s left.'
      }
    };
  }

  // Who likes what
  const subjects = shuffle(rng, ['football', 'tennis', 'swimming', 'cricket', 'hockey']);
  const options = shuffle(rng, [...names, 'Nobody']);
  return {
    prompt: `${names[0]} likes ${subjects[0]} but not ${subjects[1]}.\n${names[1]} likes ${subjects[1]} and ${subjects[2]}.\n${names[2]} likes ${subjects[0]} and ${subjects[1]}.\n\nWho likes both ${subjects[0]} and ${subjects[1]}?`,
    options, correctIndex: options.indexOf(names[2]),
    explanation: { steps: [`${names[0]}: ${subjects[0]} only. ${names[1]}: ${subjects[1]} and ${subjects[2]}. ${names[2]}: ${subjects[0]} and ${subjects[1]}.`, `${names[2]} likes both.`], tip: 'Make a table with each person and what they like.' }
  };
}

// ===================== BALANCE EQUATIONS =====================

function balanceEquation(level, index, rng) {
  const type = randInt(rng, 0, 2);

  if (type === 0) {
    const a = randInt(rng, 2, 8);
    const b = randInt(rng, 2, 8);
    const sum1 = a + a;
    const sum2 = a + b;
    const answer = b;
    const opts = new Set([answer]);
    while (opts.size < 5) opts.add(answer + randInt(rng, -3, 3));
    const sorted = [...opts].sort((x, y) => x - y);
    return {
      prompt: `\u25b2 + \u25b2 = ${sum1}\n\u25b2 + \u25cf = ${sum2}\n\nWhat is \u25cf?`,
      options: sorted.map(String), correctIndex: sorted.indexOf(answer),
      explanation: { steps: [`\u25b2 + \u25b2 = ${sum1}, so \u25b2 = ${a}`, `${a} + \u25cf = ${sum2}, so \u25cf = ${sum2} \u2212 ${a} = ${b}`], tip: 'Solve for the first shape, then use it to find the second.' }
    };
  }

  if (type === 1) {
    const a = randInt(rng, 2, 6);
    const b = randInt(rng, 1, 5);
    const c = randInt(rng, 1, 4);
    const sum1 = a + b;
    const sum2 = b + c;
    const sum3 = a + c;
    const answer = a + b + c;
    const opts = new Set([answer]);
    while (opts.size < 5) opts.add(answer + randInt(rng, -3, 3));
    const sorted = [...opts].sort((x, y) => x - y);
    return {
      prompt: `\u25b2 + \u25cf = ${sum1}\n\u25cf + \u25a0 = ${sum2}\n\u25b2 + \u25a0 = ${sum3}\n\nWhat is \u25b2 + \u25cf + \u25a0?`,
      options: sorted.map(String), correctIndex: sorted.indexOf(answer),
      explanation: { steps: [`Add all three equations: 2(\u25b2 + \u25cf + \u25a0) = ${sum1 + sum2 + sum3}`, `\u25b2 + \u25cf + \u25a0 = ${answer}`], tip: 'Sometimes you can add equations together to find the total.' }
    };
  }

  // Multiplication balance — unique solution via a third equation (no ordering tricks)
  // Pick distinct positive values so (triangle, circle) is fully determined.
  let a = randInt(rng, 2, 5);
  let b = randInt(rng, 2, 6);
  if (a === b) b = a + 1;
  // Force triangle < circle so the constraint text always holds.
  if (a > b) { const t = a; a = b; b = t; }
  const product = a * b;
  const diff = b - a; // strictly positive (circle \u2212 triangle)
  const answer = b; // user asked "what is circle?" — answer the larger value
  const opts = new Set([answer]);
  while (opts.size < 5) opts.add(Math.max(1, answer + randInt(rng, -2, 2)));
  const sorted = [...opts].sort((x, y) => x - y);
  return {
    prompt: `\u25b2 \u00d7 \u25cf = ${product}\n\u25cf \u2212 \u25b2 = ${diff}\n\nWhat is \u25cf?`,
    options: sorted.map(String), correctIndex: sorted.indexOf(answer),
    explanation: {
      steps: [
        `\u25b2 \u00d7 \u25cf = ${product} and \u25cf \u2212 \u25b2 = ${diff}.`,
        `Try factor pairs of ${product}: the pair whose difference is ${diff} is (${a}, ${b}).`,
        `So \u25b2 = ${a} and \u25cf = ${b}.`
      ],
      tip: 'List the factor pairs of the product, then find the pair with the right difference.'
    }
  };
}

// ===================== MASTER GENERATOR =====================

// Which pool a pool-based builder draws from. Lets the master generator
// shuffle the pool deterministically and feed entries one at a time so
// that no two questions within a single level are duplicates.
const POOL_MAP = new Map([
  [compoundWordQuestion, COMPOUND_PAIRS],
  [makeHiddenWordQuestion, HIDDEN_WORD_PUZZLES],
  [wordAnalogyQuestion, ANALOGIES],
  [oddWordOutQuestion, ODD_WORD_GROUPS],
  [anagramQuestion, ANAGRAMS],
  [connectingWordsQuestion, CONNECTING_WORDS],
  [missingThreeLetterWord, MISSING_WORD_SENTENCES],
  [createAWordQuestion, LETTER_SETS],
]);

// Route each tree branch ID to its generator so the question TYPE matches
// the branch TITLE the child saw. 16/21 are perfect matches; the remaining
// 5 use the closest available generator until dedicated banks land.
const BRANCH_GENERATORS = {
  'A-insert-letter': makeHiddenWordQuestion,
  'B-odd-two-out': oddWordOutQuestion,
  'C-letter-codes': letterCodeQuestion,
  'D-synonyms': wordAnalogyQuestion,
  'E-hidden-word': makeHiddenWordQuestion,
  'F-missing-three-letter': missingThreeLetterWord,
  'G-calculating-letters': calculatingWithLetters,
  'H-antonyms': wordAnalogyQuestion,
  'I-complete-calculation': balanceEquation,
  'J-move-letter': anagramQuestion,
  'K-number-relationships': numberSequenceQuestion,
  'L-letter-sequences': letterSequenceQuestion,
  'M-word-analogies': wordAnalogyQuestion,
  'N-word-number-codes': wordNumberCodeQuestion,
  'O-complete-word-pairs': anagramQuestion,
  'P-number-sequences': numberSequenceQuestion,
  'Q-compound-words': compoundWordQuestion,
  'R-create-word': createAWordQuestion,
  'S-connecting-word': connectingWordsQuestion,
  'U-letter-analogies': letterSequenceQuestion,
  'Z-reading-logic': logicProblemQuestion,
};

// Legacy topic → generator fallback (only hit if no branchId is supplied)
const LEGACY_TOPIC_GENERATORS = {
  'hidden-words': makeHiddenWordQuestion,
  'number-sequences': numberSequenceQuestion,
  'compound-words': compoundWordQuestion,
  'synonyms-antonyms': wordAnalogyQuestion,
  'letter-sequences': letterSequenceQuestion,
  'letter-codes': letterCodeQuestion,
  'move-a-letter': anagramQuestion,
  'missing-three-letter-word': missingThreeLetterWord,
  'word-number-codes': wordNumberCodeQuestion,
  'word-analogies': wordAnalogyQuestion,
  'connecting-words': connectingWordsQuestion,
  'odd-words-out': oddWordOutQuestion,
  'calculating-with-letters': calculatingWithLetters,
  'number-relationships': numberSequenceQuestion,
  'balance-equations': balanceEquation,
  'create-a-word': createAWordQuestion,
  'logic-problems': logicProblemQuestion,
  'complex-letter-codes': letterCodeQuestion,
  'multi-step-codes': wordNumberCodeQuestion,
};

export function generateVerbalQuestions(level, count = 5, branchId = null) {
  const params = getDifficultyParams(level, 'verbal');
  const topic = branchId || getTopicForLevel('verbal', level);

  let gen = BRANCH_GENERATORS[branchId];
  if (!gen) gen = LEGACY_TOPIC_GENERATORS[topic] || numberSequenceQuestion;

  const pool = POOL_MAP.get(gen);
  const seed = branchSeed(branchId, level);
  const questions = [];
  const seenPrompts = new Set();

  if (pool) {
    // Pool-based: a deterministic shuffle of the full pool guarantees no
    // two questions within this level share the same seed entry.
    const shuffled = seededShuffle(pool, seed);
    for (let i = 0; i < count; i++) {
      const entry = shuffled[i % shuffled.length];
      const rng = seededRNG(seed ^ (i * 2654435761));
      const q = gen(entry, rng);
      if (seenPrompts.has(q.prompt)) continue;
      seenPrompts.add(q.prompt);
      questions.push(wrapQuestion(q, level, questions.length, topic, params));
    }
  } else {
    // Algorithmic: retry up to N times per slot if the generated prompt
    // collides with one we've already accepted at this level.
    for (let i = 0; i < count; i++) {
      let q, tries = 0;
      do {
        const rng = seededRNG((seed ^ (i * 2654435761) ^ (tries * 40503)) >>> 0);
        q = gen(level, i * 17 + tries, rng);
        tries++;
      } while (seenPrompts.has(q.prompt) && tries < 12);
      seenPrompts.add(q.prompt);
      questions.push(wrapQuestion(q, level, questions.length, topic, params));
    }
  }

  return questions;
}

function wrapQuestion(q, level, index, topic, params) {
  return {
    id: `vr-${level}-${index}`,
    subject: 'verbal',
    topic,
    level,
    prompt: q.prompt,
    options: q.options,
    correctIndex: q.correctIndex,
    timeAllowedSeconds: params.timeAllowedSeconds || 60,
    explanation: q.explanation
  };
}
