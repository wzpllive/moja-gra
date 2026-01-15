import { Upgrade, Pet, World, Achievement, GameState, EggTier } from './types';

export const PET_SLOTS = 5;
export const MAX_PET_INVENTORY = 60; 
export const MAX_CPS = 15; // Anti-Cheat Limit

// Sound URLs
export const SOUNDS = {
  UI_CLICK: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.m4a',
  UI_BUY: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.m4a',
  WOOD: 'https://assets.mixkit.co/active_storage/sfx/204/204-preview.m4a',
  STONE: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.m4a',
  GEM: 'https://assets.mixkit.co/active_storage/sfx/222/222-preview.m4a', 
  METAL: 'https://assets.mixkit.co/active_storage/sfx/262/262-preview.m4a',
  SQUISHY: 'https://assets.mixkit.co/active_storage/sfx/255/255-preview.m4a',
  SPACE: 'https://assets.mixkit.co/active_storage/sfx/1697/1697-preview.m4a', 
  WATER: 'https://assets.mixkit.co/active_storage/sfx/2044/2044-preview.m4a',
  MAGIC: 'https://assets.mixkit.co/active_storage/sfx/1443/1443-preview.m4a',
  FIRE: 'https://assets.mixkit.co/active_storage/sfx/131/131-preview.m4a',
  STEAM: 'https://assets.mixkit.co/active_storage/sfx/1606/1606-preview.m4a',
};

// ... Click Stages remain same ...
export const CLICK_STAGES: Record<number, { threshold: number; image: string; name: string; sound: string }[]> = {
  1: [ 
    { threshold: 0, image: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Wood/3D/wood_3d.png', name: 'Kłoda Drewna', sound: SOUNDS.WOOD },
    { threshold: 50, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Moai.png', name: 'Kamienny Posąg', sound: SOUNDS.STONE },
    { threshold: 500, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gem%20Stone.png', name: 'Kamień Szlachetny', sound: SOUNDS.GEM },
    { threshold: 2500, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Diamond%20with%20a%20Dot.png', name: 'Diament', sound: SOUNDS.GEM },
    { threshold: 10000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Treasure%20Chest.png', name: 'Skarb', sound: SOUNDS.WOOD },
  ],
  2: [
    { threshold: 0, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Satellite%20Antenna.png', name: 'Satelita', sound: SOUNDS.METAL },
    { threshold: 500, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Comet.png', name: 'Kometa', sound: SOUNDS.STONE },
    { threshold: 5000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Ringed%20Planet.png', name: 'Planeta', sound: SOUNDS.SPACE },
    { threshold: 20000, image: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Astronaut/3D/astronaut_3d.png', name: 'Astronauta', sound: SOUNDS.SQUISHY },
  ],
  3: [
    { threshold: 0, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Sweet/Lollipop.png', name: 'Lizak', sound: SOUNDS.SQUISHY },
    { threshold: 1000, image: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Doughnut/3D/doughnut_3d.png', name: 'Pączek', sound: SOUNDS.SQUISHY },
    { threshold: 10000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Sweet/Shortcake.png', name: 'Ciastko', sound: SOUNDS.SQUISHY },
    { threshold: 50000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Sweet/Birthday%20Cake.png', name: 'Gigantyczny Tort', sound: SOUNDS.SQUISHY },
  ],
  4: [
    { threshold: 0, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Floppy%20Disk.png', name: 'Dyskietka', sound: SOUNDS.METAL },
    { threshold: 2000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Computer%20Disk.png', name: 'Dysk Twardy', sound: SOUNDS.METAL },
    { threshold: 20000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Laptop.png', name: 'Laptop Kwantowy', sound: SOUNDS.SPACE },
    { threshold: 100000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png', name: 'AI Overlord', sound: SOUNDS.SPACE },
  ],
  5: [
    { threshold: 0, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Shell.png', name: 'Muszla', sound: SOUNDS.STONE },
    { threshold: 5000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Amphora.png', name: 'Amfora', sound: SOUNDS.STONE },
    { threshold: 50000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Trident%20Emblem.png', name: 'Trójząb', sound: SOUNDS.METAL },
    { threshold: 200000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Spouting%20Whale.png', name: 'Wieloryb', sound: SOUNDS.WATER },
  ],
  6: [
    { threshold: 0, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/New%20Moon.png', name: 'Ciemna Materia', sound: SOUNDS.MAGIC },
    { threshold: 10000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Crystal%20Ball.png', name: 'Kula Cieni', sound: SOUNDS.GEM },
    { threshold: 100000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Spider%20Web.png', name: 'Sieć Dusz', sound: SOUNDS.SQUISHY },
    { threshold: 500000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Skull.png', name: 'Czaszka Chaosu', sound: SOUNDS.STONE },
  ],
  7: [
    { threshold: 0, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Volcano.png', name: 'Wulkaniczna Skała', sound: SOUNDS.STONE },
    { threshold: 20000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Fire.png', name: 'Płomień', sound: SOUNDS.FIRE },
    { threshold: 100000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bomb.png', name: 'Bomba', sound: SOUNDS.METAL },
    { threshold: 500000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Ogre.png', name: 'Serce Demona', sound: SOUNDS.MAGIC },
  ],
  8: [
    { threshold: 0, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Cloud.png', name: 'Obłok', sound: SOUNDS.SQUISHY },
    { threshold: 50000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dove.png', name: 'Gołąb Pokoju', sound: SOUNDS.MAGIC },
    { threshold: 250000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Ring.png', name: 'Aureola', sound: SOUNDS.GEM },
    { threshold: 1000000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Fantasy/Angel.png', name: 'Archanioł', sound: SOUNDS.MAGIC },
  ],
  9: [
    { threshold: 0, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png', name: 'Zębatka', sound: SOUNDS.METAL },
    { threshold: 50000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Nut%20and%20Bolt.png', name: 'Śruba', sound: SOUNDS.METAL },
    { threshold: 500000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Locomotive.png', name: 'Maszyna Parowa', sound: SOUNDS.STEAM },
    { threshold: 2000000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Compass.png', name: 'Kompas Czasu', sound: SOUNDS.GEM },
  ],
  10: [
    { threshold: 0, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Atom%20Symbol.png', name: 'Atom', sound: SOUNDS.SPACE },
    { threshold: 100000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/DNA.png', name: 'Kod Wszechświata', sound: SOUNDS.SQUISHY },
    { threshold: 1000000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Milky%20Way.png', name: 'Galaktyka', sound: SOUNDS.MAGIC },
    { threshold: 10000000, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Infinity.png', name: 'Nieskończoność', sound: SOUNDS.SPACE },
  ]
};

// --- INCREASED COSTS FOR SLOWER PROGRESSION ---
export const WORLDS: World[] = [
  { 
    id: 1, 
    name: 'Ziemia', 
    cost: 0, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Globe%20Showing%20Europe-Africa.png', 
    baseClickMult: 1.0, 
    currency: 'Złoto', 
    currencyGenitive: 'Złota',
    description: 'Nasza planeta. Początek przygody.' 
  },
  { 
    id: 2, 
    name: 'Kosmos', 
    cost: 2_500_000_000_000, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png', 
    baseClickMult: 0.5, 
    currency: 'Pył Kosmiczny',
    currencyGenitive: 'Pyłu Kosmicznego',
    description: 'Podróż w nieznane.' 
  },
  { 
    id: 3, 
    name: 'Cukierkowa Kraina', 
    cost: 10_000_000_000_000, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Sweet/Candy.png', 
    baseClickMult: 2.0, 
    currency: 'Patyczki',
    currencyGenitive: 'Patyczków',
    description: 'Słodki świat.' 
  },
  { 
    id: 4, 
    name: 'Cyber Świat', 
    cost: 5_000_000_000_000_000, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Alien%20Monster.png', 
    baseClickMult: 5.0, 
    currency: 'Bity',
    currencyGenitive: 'Bitów',
    description: 'Cyfrowa rzeczywistość.' 
  },
  { 
    id: 5, 
    name: 'Atlantyda', 
    cost: 500_000_000_000_000_000_000, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Spouting%20Whale.png', 
    baseClickMult: 15.0, 
    currency: 'Muszle',
    currencyGenitive: 'Muszli',
    description: 'Zaginione miasto.' 
  },
  { 
    id: 6, 
    name: 'Wymiar Cienia', 
    cost: 5_000_000_000_000_000_000_000, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/New%20Moon.png', 
    baseClickMult: 50.0, 
    currency: 'Czarna Materia',
    currencyGenitive: 'Czarnej Materii',
    description: 'Mroczna energia.' 
  },
  { 
    id: 7, 
    name: 'Inferno', 
    cost: 100_000_000_000_000_000_000_000_000, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Volcano.png', 
    baseClickMult: 150.0, 
    currency: 'Obsydian',
    currencyGenitive: 'Obsydianu',
    description: 'Kraina ognia.' 
  },
  { 
    id: 8, 
    name: 'Niebiosa', 
    cost: 500_000_000_000_000_000_000_000_000_000, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Cloud.png', 
    baseClickMult: 500.0, 
    currency: 'Pióra',
    currencyGenitive: 'Piór',
    description: 'Światło ponad wszystko.' 
  },
  { 
    id: 9, 
    name: 'Steampunk', 
    cost: 1_000_000_000_000_000_000_000_000_000_000_000, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png', 
    baseClickMult: 2000.0, 
    currency: 'Zębatki',
    currencyGenitive: 'Zębatek',
    description: 'Para i technologia.' 
  },
  { 
    id: 10, 
    name: 'Osobliwość', 
    cost: 10_000_000_000_000_000_000_000_000_000_000_000, 
    image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Infinity.png', 
    baseClickMult: 10000.0, 
    currency: 'Kwarki',
    currencyGenitive: 'Kwarków',
    description: 'Koniec czasu i przestrzeni.' 
  },
];

// --- NERFED EGG SYSTEM: Reduced multipliers significantly ---
export const WORLD_EGGS: Record<number, EggTier[]> = {
  1: [
    {
      id: 0, name: 'Jajko Farmy', costMult: 1, image: 'deprecated', color: 'text-yellow-400',
      pets: [
        { pet: { id: 'w1_chicken', name: 'Kurczak', rarity: 'Common', multiplier: 1.05, world: 1, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Chicken.png' }, chance: 35 },
        { pet: { id: 'w1_dog', name: 'Roki', rarity: 'Rare', multiplier: 1.15, world: 1, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dog%20Face.png' }, chance: 30 },
        { pet: { id: 'w1_cat', name: 'Kot', rarity: 'Epic', multiplier: 1.35, world: 1, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Cat%20Face.png' }, chance: 20 },
        { pet: { id: 'w1_fox', name: 'Lis', rarity: 'Legendary', multiplier: 1.8, world: 1, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Fox.png' }, chance: 10 },
        { pet: { id: 'w1_dragon', name: 'Smok', rarity: 'Mythical', multiplier: 4.0, world: 1, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dragon.png' }, chance: 4 },
        { pet: { id: 'w1_unicorn', name: 'Jednorożec', rarity: 'Secret', multiplier: 10.0, world: 1, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Unicorn.png' }, chance: 1 },
      ]
    },
    {
      id: 1, name: 'Leśne Jajko', costMult: 15, image: 'deprecated', color: 'text-green-600',
      pets: [
        { pet: { id: 'w1_t2_raccoon', name: 'Szop', rarity: 'Rare', multiplier: 2.0, world: 1, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Raccoon.png' }, chance: 60 },
        { pet: { id: 'w1_t2_bear', name: 'Niedźwiedź', rarity: 'Epic', multiplier: 3.5, world: 1, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png' }, chance: 30 },
        { pet: { id: 'w1_t2_wolf', name: 'Wilk', rarity: 'Legendary', multiplier: 6.0, world: 1, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Wolf.png' }, chance: 10 },
      ]
    },
    {
      id: 2, name: 'Złote Jajko', costMult: 250, image: 'deprecated', color: 'text-amber-500',
      pets: [
        { pet: { id: 'w1_t3_goose', name: 'Złota Gęś', rarity: 'Legendary', multiplier: 8.0, world: 1, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Rooster.png' }, chance: 80 },
        { pet: { id: 'w1_t3_spirit', name: 'Duch Lasu', rarity: 'Mythical', multiplier: 15.0, world: 1, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Hatching%20Chick.png' }, chance: 20 },
      ]
    }
  ],
  2: [
    {
      id: 0, name: 'Jajko Kosmiczne', costMult: 1, image: 'deprecated', color: 'text-blue-400',
      pets: [
        { pet: { id: 'w2_common', name: 'Sowa Kosmosu', rarity: 'Common', multiplier: 1.2, world: 2, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Owl.png' }, chance: 40 },
        { pet: { id: 'w2_rare', name: 'Gwiezdny Nietoperz', rarity: 'Rare', multiplier: 1.8, world: 2, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bat.png' }, chance: 30 },
        { pet: { id: 'w2_legendary', name: 'Duch Próżni', rarity: 'Legendary', multiplier: 3.5, world: 2, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Ghost.png' }, chance: 20 },
        { pet: { id: 'w2_mythical_1', name: 'Feniks', rarity: 'Mythical', multiplier: 6.0, world: 2, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Eagle.png' }, chance: 5 },
        { pet: { id: 'w2_mythical_2', name: 'Gryf', rarity: 'Mythical', multiplier: 8.0, world: 2, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Lion.png' }, chance: 4 },
        { pet: { id: 'w2_secret', name: 'Kosmita', rarity: 'Secret', multiplier: 25.0, world: 2, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Alien.png' }, chance: 1 },
      ]
    },
    {
      id: 1, name: 'Jajko Mgławicy', costMult: 15, image: 'deprecated', color: 'text-indigo-500',
      pets: [
         { pet: { id: 'w2_t2_comet', name: 'Odłamek Komety', rarity: 'Rare', multiplier: 5.0, world: 2, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Comet.png' }, chance: 60 },
         { pet: { id: 'w2_t2_astro', name: 'Astronauta', rarity: 'Epic', multiplier: 9.0, world: 2, image: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Astronaut/3D/astronaut_3d.png' }, chance: 40 },
      ]
    },
    {
      id: 2, name: 'Jajko Galaktyczne', costMult: 250, image: 'deprecated', color: 'text-fuchsia-500',
      pets: [
         { pet: { id: 'w2_t3_robot', name: 'Cyber Strażnik', rarity: 'Legendary', multiplier: 15.0, world: 2, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png' }, chance: 70 },
         { pet: { id: 'w2_t3_dragon', name: 'Cyber Smok', rarity: 'Mythical', multiplier: 30.0, world: 2, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dragon.png' }, chance: 30 },
      ]
    }
  ],
  3: [ 
    { id: 0, name: 'Jajko Słodkie', costMult: 1, image: 'deprecated', color: 'text-pink-300', pets: [
       { pet: { id: 'w3_common', name: 'Myszka', rarity: 'Common', multiplier: 2.5, world: 3, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Mouse.png' }, chance: 50 },
       { pet: { id: 'w3_rare', name: 'Świnka', rarity: 'Rare', multiplier: 5.0, world: 3, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Pig%20Face.png' }, chance: 30 },
       { pet: { id: 'w3_epic', name: 'Panda', rarity: 'Epic', multiplier: 8.0, world: 3, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Panda.png' }, chance: 15 },
       { pet: { id: 'w3_mythical', name: 'T-Rex', rarity: 'Mythical', multiplier: 20.0, world: 3, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/T-Rex.png' }, chance: 4.5 },
       { pet: { id: 'w3_secret', name: 'Cukrowy Król', rarity: 'Secret', multiplier: 50.0, world: 3, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Crown.png' }, chance: 0.5 },
    ]},
    { id: 1, name: 'Jajko Lukrowe', costMult: 15, image: 'deprecated', color: 'text-pink-500', pets: [
       { pet: { id: 'w3_t2_cookie', name: 'Ciastek', rarity: 'Rare', multiplier: 10.0, world: 3, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Sweet/Cookie.png' }, chance: 60 },
       { pet: { id: 'w3_t2_cake', name: 'Pan Torcik', rarity: 'Epic', multiplier: 18.0, world: 3, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Sweet/Shortcake.png' }, chance: 40 },
    ]},
    { id: 2, name: 'Jajko Czekoladowe', costMult: 250, image: 'deprecated', color: 'text-amber-700', pets: [
       { pet: { id: 'w3_t3_choco', name: 'Czekoladowy Miś', rarity: 'Legendary', multiplier: 30.0, world: 3, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png' }, chance: 80 },
       { pet: { id: 'w3_t3_donut', name: 'Donut Lord', rarity: 'Mythical', multiplier: 60.0, world: 3, image: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Doughnut/3D/doughnut_3d.png' }, chance: 20 },
    ]}
  ],
  4: [
    { id: 0, name: 'Jajko Danych', costMult: 1, image: 'deprecated', color: 'text-cyan-400', pets: [
      { pet: { id: 'w4_common', name: 'Dyskietka', rarity: 'Common', multiplier: 8.0, world: 4, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Floppy%20Disk.png' }, chance: 50 }, 
      { pet: { id: 'w4_rare', name: 'Trybik', rarity: 'Rare', multiplier: 15.0, world: 4, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png' }, chance: 35 },
      { pet: { id: 'w4_legendary', name: 'Rakieta', rarity: 'Legendary', multiplier: 35.0, world: 4, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png' }, chance: 12.7 },
      { pet: { id: 'w4_mythical', name: 'UFO', rarity: 'Mythical', multiplier: 75.0, world: 4, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Flying%20Saucer.png' }, chance: 2.0 },
      { pet: { id: 'w4_secret', name: 'Cyber Demon', rarity: 'Secret', multiplier: 150.0, world: 4, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Alien%20Monster.png' }, chance: 0.3 },
    ]},
    { id: 1, name: 'Jajko Systemowe', costMult: 15, image: 'deprecated', color: 'text-blue-600', pets: [
      { pet: { id: 'w4_t2_laptop', name: 'Laptop', rarity: 'Rare', multiplier: 30.0, world: 4, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Laptop.png' }, chance: 60 },
      { pet: { id: 'w4_t2_phone', name: 'Smartfon', rarity: 'Epic', multiplier: 50.0, world: 4, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Mobile%20Phone.png' }, chance: 40 },
    ]},
    { id: 2, name: 'Jajko Wirusa', costMult: 250, image: 'deprecated', color: 'text-green-500', pets: [
      { pet: { id: 'w4_t3_robot', name: 'AI Bot', rarity: 'Legendary', multiplier: 80.0, world: 4, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png' }, chance: 80 },
      { pet: { id: 'w4_t3_skull', name: 'Wirus.exe', rarity: 'Mythical', multiplier: 200.0, world: 4, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Radioactive.png' }, chance: 20 },
    ]}
  ],
  5: [
    { id: 0, name: 'Jajko Wodne', costMult: 1, image: 'deprecated', color: 'text-blue-300', pets: [
      { pet: { id: 'w5_common', name: 'Rybka', rarity: 'Common', multiplier: 12.0, world: 5, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Tropical%20Fish.png' }, chance: 55 },
      { pet: { id: 'w5_rare', name: 'Delfin', rarity: 'Rare', multiplier: 25.0, world: 5, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dolphin.png' }, chance: 30 },
      { pet: { id: 'w5_epic', name: 'Ośmiornica', rarity: 'Epic', multiplier: 60.0, world: 5, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Octopus.png' }, chance: 13.9 },
      { pet: { id: 'w5_mythical', name: 'Wieloryb', rarity: 'Mythical', multiplier: 150.0, world: 5, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Spouting%20Whale.png' }, chance: 1.0 },
      { pet: { id: 'w5_secret', name: 'Skarb Atlantydy', rarity: 'Secret', multiplier: 350.0, world: 5, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gem%20Stone.png' }, chance: 0.1 },
    ]},
    { id: 1, name: 'Jajko Głębin', costMult: 15, image: 'deprecated', color: 'text-indigo-700', pets: [
      { pet: { id: 'w5_t2_shark', name: 'Rekin', rarity: 'Rare', multiplier: 80.0, world: 5, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Shark.png' }, chance: 60 },
      { pet: { id: 'w5_t2_shell', name: 'Magiczna Muszla', rarity: 'Epic', multiplier: 120.0, world: 5, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Spiral%20Shell.png' }, chance: 40 },
    ]},
    { id: 2, name: 'Jajko Posejdona', costMult: 250, image: 'deprecated', color: 'text-yellow-400', pets: [
      { pet: { id: 'w5_t3_coral', name: 'Duch Rafy', rarity: 'Legendary', multiplier: 250.0, world: 5, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Blowfish.png' }, chance: 80 },
      { pet: { id: 'w5_t3_trident', name: 'Strażnik Trójzębu', rarity: 'Mythical', multiplier: 400.0, world: 5, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Trident%20Emblem.png' }, chance: 20 },
    ]}
  ],
  6: [
    { id: 0, name: 'Jajko Mroku', costMult: 1, image: 'deprecated', color: 'text-gray-600', pets: [
      { pet: { id: 'w6_common', name: 'Cień', rarity: 'Common', multiplier: 40.0, world: 6, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Neutral%20Face.png' }, chance: 60 }, 
      { pet: { id: 'w6_rare', name: 'Pająk', rarity: 'Rare', multiplier: 100.0, world: 6, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Spider.png' }, chance: 30 },
      { pet: { id: 'w6_epic', name: 'Czaszka Chaosu', rarity: 'Epic', multiplier: 250.0, world: 6, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Skull.png' }, chance: 9.45 },
      { pet: { id: 'w6_mythical', name: 'Wilk Cienia', rarity: 'Mythical', multiplier: 500.0, world: 6, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Wolf.png' }, chance: 0.5 },
      { pet: { id: 'w6_secret', name: 'Serce Pustki', rarity: 'Secret', multiplier: 1000.0, world: 6, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Black%20Heart.png' }, chance: 0.05 },
    ]},
    { id: 1, name: 'Jajko Koszmaru', costMult: 15, image: 'deprecated', color: 'text-gray-800', pets: [
      { pet: { id: 'w6_t2_web', name: 'Tkacz Snów', rarity: 'Rare', multiplier: 300.0, world: 6, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Spider%20Web.png' }, chance: 60 },
      { pet: { id: 'w6_t2_bat', name: 'Wampir', rarity: 'Epic', multiplier: 600.0, world: 6, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bat.png' }, chance: 40 },
    ]},
    { id: 2, name: 'Jajko Otchłani', costMult: 250, image: 'deprecated', color: 'text-black', pets: [
      { pet: { id: 'w6_t3_ghost', name: 'Zjawa', rarity: 'Legendary', multiplier: 1200.0, world: 6, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Ghost.png' }, chance: 80 },
      { pet: { id: 'w6_t3_orb', name: 'Kula Mroku', rarity: 'Mythical', multiplier: 3000.0, world: 6, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Black%20Circle.png' }, chance: 20 },
    ]}
  ],
  7: [
    { id: 0, name: 'Jajko Ognia', costMult: 1, image: 'deprecated', color: 'text-red-500', pets: [
      { pet: { id: 'w7_common', name: 'Chochlik', rarity: 'Common', multiplier: 150.0, world: 7, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Goblin.png' }, chance: 62 },
      { pet: { id: 'w7_rare', name: 'Ifrit', rarity: 'Rare', multiplier: 300.0, world: 7, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Ogre.png' }, chance: 28 },
      { pet: { id: 'w7_epic', name: 'Cerber', rarity: 'Epic', multiplier: 600.0, world: 7, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Poodle.png' }, chance: 9.73 },
      { pet: { id: 'w7_mythical', name: 'Władca Piekieł', rarity: 'Mythical', multiplier: 1500.0, world: 7, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Angry%20Face%20with%20Horns.png' }, chance: 0.25 },
      { pet: { id: 'w7_secret', name: 'Ogień Wieczny', rarity: 'Secret', multiplier: 3000.0, world: 7, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Fire.png' }, chance: 0.02 },
    ]},
    { id: 1, name: 'Jajko Magmy', costMult: 15, image: 'deprecated', color: 'text-orange-600', pets: [
      { pet: { id: 'w7_t2_bomb', name: 'Żywa Bomba', rarity: 'Rare', multiplier: 800.0, world: 7, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bomb.png' }, chance: 60 },
      { pet: { id: 'w7_t2_volcano', name: 'Duch Wulkanu', rarity: 'Epic', multiplier: 1500.0, world: 7, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Volcano.png' }, chance: 40 },
    ]},
    { id: 2, name: 'Jajko Piekieł', costMult: 250, image: 'deprecated', color: 'text-red-900', pets: [
      { pet: { id: 'w7_t3_dragon', name: 'Smok Inferna', rarity: 'Legendary', multiplier: 3500.0, world: 7, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dragon.png' }, chance: 80 },
      { pet: { id: 'w7_t3_devil', name: 'Diabeł Wcielony', rarity: 'Mythical', multiplier: 8000.0, world: 7, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Horns.png' }, chance: 20 },
    ]}
  ],
  8: [
    { id: 0, name: 'Jajko Chmur', costMult: 1, image: 'deprecated', color: 'text-blue-200', pets: [
      { pet: { id: 'w8_common', name: 'Gołąb', rarity: 'Common', multiplier: 400.0, world: 8, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dove.png' }, chance: 65 },
      { pet: { id: 'w8_rare', name: 'Cherubin', rarity: 'Rare', multiplier: 800.0, world: 8, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Fantasy/Baby%20Angel.png' }, chance: 25 },
      { pet: { id: 'w8_epic', name: 'Pegaz', rarity: 'Epic', multiplier: 1500.0, world: 8, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Horse.png' }, chance: 9.89 },
      { pet: { id: 'w8_mythical', name: 'Archanioł', rarity: 'Mythical', multiplier: 4000.0, world: 8, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Halo.png' }, chance: 0.1 },
      { pet: { id: 'w8_secret', name: 'Boskie Światło', rarity: 'Secret', multiplier: 8000.0, world: 8, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Sun.png' }, chance: 0.01 },
    ]},
    { id: 1, name: 'Jajko Światła', costMult: 15, image: 'deprecated', color: 'text-yellow-200', pets: [
      { pet: { id: 'w8_t2_star', name: 'Gwiazdka', rarity: 'Rare', multiplier: 2000.0, world: 8, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Star.png' }, chance: 60 },
      { pet: { id: 'w8_t2_fairy', name: 'Wróżka', rarity: 'Epic', multiplier: 5000.0, world: 8, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Fantasy/Woman%20Fairy.png' }, chance: 40 },
    ]},
    { id: 2, name: 'Jajko Boskie', costMult: 250, image: 'deprecated', color: 'text-amber-100', pets: [
      { pet: { id: 'w8_t3_seraph', name: 'Serafin', rarity: 'Legendary', multiplier: 10000.0, world: 8, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Owl.png' }, chance: 80 },
      { pet: { id: 'w8_t3_god', name: 'Bóstwo', rarity: 'Mythical', multiplier: 25000.0, world: 8, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Sun.png' }, chance: 20 },
    ]}
  ],
  9: [
    { id: 0, name: 'Jajko Mosiężne', costMult: 1, image: 'deprecated', color: 'text-amber-600', pets: [
      { pet: { id: 'w9_common', name: 'Mechaniczny Żuk', rarity: 'Common', multiplier: 1000.0, world: 9, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Beetle.png' }, chance: 70 },
      { pet: { id: 'w9_rare', name: 'Parowy Golem', rarity: 'Rare', multiplier: 2500.0, world: 9, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png' }, chance: 20 },
      { pet: { id: 'w9_epic', name: 'Mechaniczny Skorpion', rarity: 'Epic', multiplier: 5000.0, world: 9, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Scorpion.png' }, chance: 9.945 },
      { pet: { id: 'w9_mythical', name: 'Pan Czasu', rarity: 'Mythical', multiplier: 12000.0, world: 9, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Watch.png' }, chance: 0.05 },
      { pet: { id: 'w9_secret', name: 'Silnik Nieskończoności', rarity: 'Secret', multiplier: 25000.0, world: 9, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png' }, chance: 0.005 },
    ]},
    { id: 1, name: 'Jajko Zębate', costMult: 15, image: 'deprecated', color: 'text-stone-500', pets: [
      { pet: { id: 'w9_t2_wrench', name: 'Duch Klucza', rarity: 'Rare', multiplier: 6000.0, world: 9, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Wrench.png' }, chance: 60 },
      { pet: { id: 'w9_t2_loco', name: 'Lokomotywa', rarity: 'Epic', multiplier: 15000.0, world: 9, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Locomotive.png' }, chance: 40 },
    ]},
    { id: 2, name: 'Jajko Czasu', costMult: 250, image: 'deprecated', color: 'text-amber-800', pets: [
      { pet: { id: 'w9_t3_compass', name: 'Kompas Losu', rarity: 'Legendary', multiplier: 30000.0, world: 9, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Compass.png' }, chance: 80 },
      { pet: { id: 'w9_t3_factory', name: 'Żywa Fabryka', rarity: 'Mythical', multiplier: 75000.0, world: 9, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Factory.png' }, chance: 20 },
    ]}
  ],
  10: [
    { id: 0, name: 'Jajko Kwarków', costMult: 1, image: 'deprecated', color: 'text-indigo-400', pets: [
      { pet: { id: 'w10_common', name: 'Kwark', rarity: 'Common', multiplier: 2500.0, world: 10, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Atom%20Symbol.png' }, chance: 75 },
      { pet: { id: 'w10_rare', name: 'Antymateria', rarity: 'Rare', multiplier: 5000.0, world: 10, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Purple%20Circle.png' }, chance: 20 },
      { pet: { id: 'w10_epic', name: 'Horyzont Zdarzeń', rarity: 'Epic', multiplier: 12000.0, world: 10, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Black%20Circle.png' }, chance: 4.989 },
      { pet: { id: 'w10_mythical', name: 'Czarna Dziura', rarity: 'Mythical', multiplier: 25000.0, world: 10, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Black%20Large%20Square.png' }, chance: 0.01 },
      { pet: { id: 'w10_secret', name: 'KONIEC', rarity: 'Secret', multiplier: 50000.0, world: 10, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Infinity.png' }, chance: 0.001 },
    ]},
    { id: 1, name: 'Jajko Horyzontu', costMult: 15, image: 'deprecated', color: 'text-violet-600', pets: [
      { pet: { id: 'w10_t2_dna', name: 'DNA Wszechświata', rarity: 'Rare', multiplier: 15000.0, world: 10, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/DNA.png' }, chance: 60 },
      { pet: { id: 'w10_t2_galaxy', name: 'Galaktyka', rarity: 'Epic', multiplier: 30000.0, world: 10, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Milky%20Way.png' }, chance: 40 },
    ]},
    { id: 2, name: 'Jajko Końca', costMult: 250, image: 'deprecated', color: 'text-white', pets: [
      { pet: { id: 'w10_t3_singularity', name: 'Osobliwość', rarity: 'Legendary', multiplier: 60000.0, world: 10, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/New%20Moon.png' }, chance: 80 },
      { pet: { id: 'w10_t3_star', name: 'Supernova', rarity: 'Mythical', multiplier: 100000.0, world: 10, image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Eight-Pointed%20Star.png' }, chance: 20 },
    ]}
  ]
};

export const UPGRADES_LIST: Upgrade[] = [
  // New Unified Auto Clicker - NERFED
  { 
      id: 'auto_clicker_percent', 
      name: 'Auto Klikacz', 
      description: 'Klika automatycznie za 2% Twojej siły (+2% co poziom).', 
      baseCost: 200, 
      costMultiplier: 1.6, 
      level: 0, 
      maxLevel: 20, 
      type: 'auto' 
  },
  
  // Standard Click Upgrades - AVAILABLE IN ALL WORLDS
  // Fixed costs (handled in App.tsx)
  { id: 'click_power', name: 'Lepszy Młot', description: '+1 do kliknięcia', baseCost: 50, costMultiplier: 1.8, level: 0, type: 'click' },
  { id: 'mega_click', name: 'Mega Kliknięcie', description: '+5 do kliknięcia', baseCost: 1000, costMultiplier: 1.9, level: 0, type: 'click' },
  { id: 'click_frenzy', name: 'Szał Klikania', description: '+10 Bazowego kliknięcia', baseCost: 30000, costMultiplier: 1.8, level: 0, type: 'click' },
  { id: 'reinforced_handle', name: 'Wzmocniony Trzonek', description: '+15 za kliknięcie', baseCost: 50000, costMultiplier: 1.8, level: 0, type: 'click' },
  
  // Chance Upgrades
  { id: 'lucky_click', name: 'Szczęśliwy Klik', description: '+10% szansy na 2x klik (max 10 lvl)', baseCost: 10000, costMultiplier: 2.5, level: 0, maxLevel: 10, type: 'chance' },
  { id: 'burst_click', name: 'Eksplozja', description: '+5% szansy na 3x klik (max 20 lvl)', baseCost: 25000, costMultiplier: 2.2, level: 0, maxLevel: 20, type: 'chance' },
  { id: 'crit_strike', name: 'Cios Krytyczny', description: '+1% szansy na 5x klik (max 50 lvl)', baseCost: 20000, costMultiplier: 1.8, level: 0, maxLevel: 50, type: 'chance' },
  
  // Multipliers
  { id: 'gem_polish', name: 'Polerowanie Klejnotów', description: 'Globalny mnożnik x1.2', baseCost: 2000000, costMultiplier: 3.0, level: 0, worldReq: 1, type: 'multiplier' },
];

export const REBIRTH_UPGRADES_LIST: Upgrade[] = [
  { 
    id: 'more_pets_1', 
    name: 'Większe Stado I', 
    description: 'Zwiększa limit założonych zwierzaków o +3.', 
    baseCost: 15, 
    costMultiplier: 1, 
    level: 0, 
    maxLevel: 1,
    type: 'special' 
  },
  { 
    id: 'more_pets_2', 
    name: 'Większe Stado II', 
    description: 'Zwiększa limit założonych zwierzaków o kolejne +2.', 
    baseCost: 75, 
    costMultiplier: 1, 
    level: 0, 
    maxLevel: 1,
    type: 'special' 
  },
  { 
    id: 'unlock_golden', 
    name: 'Złota Transformacja', 
    description: 'Odblokowuje tworzenie Złotych Petów (x4.5) w Craftingu.', 
    baseCost: 3, 
    costMultiplier: 1, 
    level: 0, 
    maxLevel: 1,
    type: 'special' 
  },
  { 
    id: 'unlock_rainbow', 
    name: 'Tęczowa Transformacja', 
    description: 'Odblokowuje tworzenie Tęczowych Petów (x9) w Craftingu.', 
    baseCost: 15, 
    costMultiplier: 1, 
    level: 0, 
    maxLevel: 1,
    type: 'special' 
  },
  { 
    id: 'unlock_dark_matter', 
    name: 'Czarna Materia', 
    description: 'Odblokowuje tworzenie Czarnej Materii (x36) w Craftingu.', 
    baseCost: 60, 
    costMultiplier: 1, 
    level: 0, 
    maxLevel: 1,
    type: 'special' 
  },
  { 
    id: 'egg_luck', 
    name: 'Szczęście Odkrywcy', 
    description: 'Zwiększa szansę na lepsze pety (+20% wagi rzadkości)', 
    baseCost: 5, 
    costMultiplier: 2.5, 
    level: 0, 
    maxLevel: 10,
    type: 'special' 
  },
  { 
    id: 'unlock_triple_egg', 
    name: 'Potrójne Jajo', 
    description: 'Odblokowuje opcję otwierania 3 jajek naraz (x3 prędkość).', 
    baseCost: 10, 
    costMultiplier: 1, 
    level: 0, 
    maxLevel: 1,
    type: 'special' 
  },
  { 
    id: 'unlock_auto_hatch', 
    name: 'Auto Otwieranie', 
    description: 'Odblokowuje opcję automatycznego otwierania jajek.', 
    baseCost: 25, 
    costMultiplier: 1, 
    level: 0, 
    maxLevel: 1,
    type: 'special' 
  },
  {
    id: 'hatch_speed',
    name: 'Szybkie Wykluwanie',
    description: 'Przyspiesza animację otwierania jajek o 30%.',
    baseCost: 5,
    costMultiplier: 1,
    level: 0,
    maxLevel: 1,
    type: 'special'
  },
  { 
    id: 'divine_power', 
    name: 'Boska Moc', 
    description: 'Permanentny mnożnik +50% do wszystkiego', 
    baseCost: 15, 
    costMultiplier: 3.0, 
    level: 0, 
    maxLevel: 100,
    type: 'multiplier' 
  }
];

export const INITIAL_STATE: GameState = {
  points: 0,
  totalClicks: 0,
  worldClicks: { 1: 0 }, 
  lifetimePoints: 0,
  upgrades: {},
  multiActive: false,
  rebirthPoints: 0,
  rebirthsPerformed: 0,
  rebirthUpgrades: {},
  ownedPets: [],
  equippedPets: [],
  discoveredPets: [], 
  autoDeleteFlags: [], 
  isAutoHatching: false, 
  currentWorld: 1,
  unlockedWorlds: [1],
  worldStates: {},
  settings: { sfxVolume: 0.5, musicVolume: 0.5, theme: 'dark' },
  cheatUnlocked: false,
  lastSaveTime: Date.now(),
  startTime: Date.now(),
  comboActive: false,
  comboStartTime: 0,
  comboDuration: 0,
  comboMultiplier: 1,
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 1, name: 'Pierwszy Klik!', description: 'Kliknij pierwszy raz.', reward: 10, condition: (s) => s.totalClicks >= 1 },
  { id: 2, name: 'Setka!', description: 'Zbierz 100 jednostek.', reward: 50, condition: (s) => s.points >= 100 },
  { id: 3, name: 'Tysiąc!', description: 'Zbierz 1,000 jednostek.', reward: 200, condition: (s) => s.points >= 1000 },
  { id: 4, name: 'Milioner', description: 'Zbierz 1,000,000 jednostek.', reward: 100000, condition: (s) => s.points >= 1000000 },
  { id: 5, name: 'Mistrz Klikania', description: 'Kliknij 1000 razy.', reward: 5000, condition: (s) => s.totalClicks >= 1000 },
];

export const PETS_WORLD_1 = []; 
export const PETS_WORLD_2 = [];
export const PETS_WORLD_3 = [];
export const PETS_WORLD_4 = [];
export const PETS_WORLD_5 = [];
export const PETS_WORLD_6 = [];
export const PETS_WORLD_7 = [];
export const PETS_WORLD_8 = [];
export const PETS_WORLD_9 = [];
export const PETS_WORLD_10 = [];