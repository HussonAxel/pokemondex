export const data = [
  {
    id: 1,
    name: "Bulbasaur",
    generation: "1",
    location: "Kanto",
    firstType: "Grass",
    secondType: "Poison",
    balance: 318,
    joined: new Date(2023, 0, 1),
    catched: true,
  },
  {
    id: 4,
    name: "Charmander",
    generation: "1",
    location: "Kanto",
    firstType: "Fire",
    secondType: "",
    balance: 309,
    joined: new Date(2023, 0, 2),
    catched: false,
  },
  {
    id: 7,
    name: "Squirtle",
    generation: "1",
    location: "Kanto",
    firstType: "Water",
    secondType: "",
    balance: 314,
    joined: new Date(2023, 0, 3),
    catched: true,
  },
];

export const TableHeaderNames = [
  "NAME",
  "TYPE(S)",
  "ABILITIES",
  "STATS",
  "STATUS",
  "ACTIONS",
];

export const typeClassMap: Record<
  string,
  { bg: string; border: string; hover: string }
> = {
  normal: {
    bg: "bg-gray-200/50 dark:bg-gray-600/50",
    border: "border-gray-600 border-[0.5px]",
    hover: "hover:bg-gray-300/50",
  },
  fire: {
    bg: "bg-orange-500/30",
    border: "border-orange-600",
    hover: "hover:bg-orange-600/50",
  },
  water: {
    bg: "bg-blue-500/30",
    border: "border-blue-600",
    hover: "hover:bg-blue-600/30",
  },
  electric: {
    bg: "bg-yellow-600/30",
    border: "border-yellow-700",
    hover: "hover:bg-yellow-700/30",
  },
  grass: {
    bg: "bg-green-500/30",
    border: "border-green-600",
    hover: "hover:bg-green-600/30",
  },
  ice: {
    bg: "bg-cyan-400/30",
    border: "border-cyan-500",
    hover: "hover:bg-cyan-500/30",
  },
  fighting: {
    bg: "bg-red-600/30",
    border: "border-red-700",
    hover: "hover:bg-red-700/30",
  },
  poison: {
    bg: "bg-purple-600/20",
    border: "border-purple-700",
    hover: "hover:bg-purple-600/20",
  },
  ground: {
    bg: "bg-amber-300/30",
    border: "border-amber-400",
    hover: "hover:bg-amber-400/30",
  },
  flying: {
    bg: "bg-indigo-300/30",
    border: "border-indigo-400",
    hover: "hover:bg-indigo-400/30",
  },
  psychic: {
    bg: "bg-pink-500/30",
    border: "border-pink-600",
    hover: "hover:bg-pink-600/30",
  },
  bug: {
    bg: "bg-lime-500/30",
    border: "border-lime-600",
    hover: "hover:bg-lime-600/30",
  },
  rock: {
    bg: "bg-amber-700/30",
    border: "border-amber-800",
    hover: "hover:bg-amber-800/30",
  },
  ghost: {
    bg: "bg-purple-700/50",
    border: "border-purple-800",
    hover: "hover:bg-purple-800/50",
  },
  dragon: {
    bg: "bg-violet-600/30",
    border: "border-violet-700",
    hover: "hover:bg-violet-700/30",
  },
  dark: {
    bg: "bg-gray-700/30",
    border: "border-gray-800",
    hover: "hover:bg-gray-800/30",
  },
  steel: {
    bg: "bg-slate-400/30",
    border: "border-slate-700",
    hover: "hover:bg-slate-500/30",
  },
  fairy: {
    bg: "bg-pink-300/30",
    border: "border-pink-400",
    hover: "hover:bg-pink-400/30",
  },
};

export const getTypeClasses = (type: string) => {
  return (
    typeClassMap[type.toLowerCase()] ?? {
      bg: "bg-gray-200/50 dark:bg-gray-600/50",
      border: "border-gray-600 border-[0.5px]",
      hover: "hover:bg-gray-300/50",
    }
  );
};

// ==================================================
// STARTERS
// ==================================================
export const starters = [
  { name: "Bulbasaur", id: 1 },
  { name: "Ivysaur", id: 2 },
  { name: "Venusaur", id: 3 },
  { name: "Charmander", id: 4 },
  { name: "Charmeleon", id: 5 },
  { name: "Charizard", id: 6 },
  { name: "Squirtle", id: 7 },
  { name: "Wartortle", id: 8 },
  { name: "Blastoise", id: 9 },

  { name: "Chikorita", id: 152 },
  { name: "Bayleef", id: 153 },
  { name: "Meganium", id: 154 },
  { name: "Cyndaquil", id: 155 },
  { name: "Quilava", id: 156 },
  { name: "Typhlosion", id: 157 },
  { name: "Totodile", id: 158 },
  { name: "Croconaw", id: 159 },
  { name: "Feraligatr", id: 160 },

  { name: "Treecko", id: 252 },
  { name: "Grovyle", id: 253 },
  { name: "Sceptile", id: 254 },
  { name: "Torchic", id: 255 },
  { name: "Combusken", id: 256 },
  { name: "Blaziken", id: 257 },
  { name: "Mudkip", id: 258 },
  { name: "Marshtomp", id: 259 },
  { name: "Swampert", id: 260 },

  { name: "Turtwig", id: 387 },
  { name: "Grotle", id: 388 },
  { name: "Torterra", id: 389 },
  { name: "Chimchar", id: 390 },
  { name: "Monferno", id: 391 },
  { name: "Infernape", id: 392 },
  { name: "Piplup", id: 393 },
  { name: "Prinplup", id: 394 },
  { name: "Empoleon", id: 395 },

  { name: "Snivy", id: 495 },
  { name: "Servine", id: 496 },
  { name: "Serperior", id: 497 },
  { name: "Tepig", id: 498 },
  { name: "Pignite", id: 499 },
  { name: "Emboar", id: 500 },
  { name: "Oshawott", id: 501 },
  { name: "Dewott", id: 502 },
  { name: "Samurott", id: 503 },

  { name: "Chespin", id: 650 },
  { name: "Quilladin", id: 651 },
  { name: "Chesnaught", id: 652 },
  { name: "Fennekin", id: 653 },
  { name: "Braixen", id: 654 },
  { name: "Delphox", id: 655 },
  { name: "Froakie", id: 656 },
  { name: "Frogadier", id: 657 },
  { name: "Greninja", id: 658 },

  { name: "Rowlet", id: 722 },
  { name: "Dartrix", id: 723 },
  { name: "Decidueye", id: 724 },
  { name: "Litten", id: 725 },
  { name: "Torracat", id: 726 },
  { name: "Incineroar", id: 727 },
  { name: "Popplio", id: 728 },
  { name: "Brionne", id: 729 },
  { name: "Primarina", id: 730 },

  { name: "Grookey", id: 810 },
  { name: "Thwackey", id: 811 },
  { name: "Rillaboom", id: 812 },
  { name: "Scorbunny", id: 813 },
  { name: "Raboot", id: 814 },
  { name: "Cinderace", id: 815 },
  { name: "Sobble", id: 816 },
  { name: "Drizzile", id: 817 },
  { name: "Inteleon", id: 818 },

  { name: "Sprigatito", id: 906 },
  { name: "Floragato", id: 907 },
  { name: "Meowscarada", id: 908 },
  { name: "Fuecoco", id: 909 },
  { name: "Crocalor", id: 910 },
  { name: "Skeledirge", id: 911 },
  { name: "Quaxly", id: 912 },
  { name: "Quaxwell", id: 913 },
  { name: "Quaquaval", id: 914 },
];

// ==================================================
// REGIONAL BIRD
// ==================================================
export const regionalBird = [
  { name: "Pidgey", id: 16 },
  { name: "Pidgeotto", id: 17 },
  { name: "Pidgeot", id: 18 },
  { name: "Pidgeot (Mega)", id: 10073 },

  { name: "Spearow", id: 21 },
  { name: "Fearow", id: 22 },

  { name: "Hoothoot", id: 163 },
  { name: "Noctowl", id: 164 },

  { name: "Taillow", id: 276 },
  { name: "Swellow", id: 277 },

  { name: "Wingull", id: 278 },
  { name: "Pelipper", id: 279 },

  { name: "Starly", id: 396 },
  { name: "Staravia", id: 397 },
  { name: "Staraptor", id: 398 },

  { name: "Chatot", id: 441 },

  { name: "Pidove", id: 519 },
  { name: "Tranquill", id: 520 },
  { name: "Unfezant", id: 521 },

  { name: "Fletchling", id: 661 },
  { name: "Fletchinder", id: 662 },
  { name: "Talonflame", id: 663 },

  { name: "Pikipek", id: 731 },
  { name: "Trumbeak", id: 732 },
  { name: "Toucannon", id: 733 },

  { name: "Rookidee", id: 821 },
  { name: "Corvisquire", id: 822 },
  { name: "Corviknight", id: 823 },
  { name: "Corviknight (Gigantamax)", id: 10212 },

  { name: "Squawkabilly", id: 931 },

  { name: "Wattrel", id: 940 },
  { name: "Kilowattrel", id: 941 },
];

// ==================================================
// REGIONAL MAMMAL
// ==================================================
export const regionalMammal = [
  { name: "Rattata", id: 19 },
  { name: "Raticate", id: 20 },
  { name: "Rattata (Alola)", id: 10091 },
  { name: "Raticate (Alola)", id: 10092 },

  { name: "Sentret", id: 161 },
  { name: "Furret", id: 162 },

  { name: "Zigzagoon", id: 263 },
  { name: "Linoone", id: 264 },
  { name: "Zigzagoon (Galar)", id: 10174 },
  { name: "Linoone (Galar)", id: 10175 },
  { name: "Obstagoon", id: 862 },

  { name: "Bidoof", id: 399 },
  { name: "Bibarel", id: 400 },

  { name: "Patrat", id: 504 },
  { name: "Watchog", id: 505 },

  { name: "Lillipup", id: 506 },
  { name: "Herdier", id: 507 },
  { name: "Stoutland", id: 508 },

  { name: "Bunnelby", id: 659 },
  { name: "Diggersby", id: 660 },

  { name: "Yungoos", id: 734 },
  { name: "Gumshoos", id: 735 },

  { name: "Skwovet", id: 819 },
  { name: "Greedent", id: 820 },

  { name: "Nickit", id: 827 },
  { name: "Thievul", id: 828 },

  { name: "Lechonk", id: 915 },
  { name: "Oinkologne", id: 916 },
  { name: "Oinkologne (Female)", id: 10193 },

  { name: "Tandemaus", id: 924 },
  { name: "Maushold", id: 925 },
];

// ==================================================
// REGIONAL BUG
// ==================================================
export const bug = [
  { name: "Caterpie", id: 10 },
  { name: "Metapod", id: 11 },
  { name: "Butterfree", id: 12 },
  { name: "Butterfree (Gigantamax)", id: 10198 },

  { name: "Weedle", id: 13 },
  { name: "Kakuna", id: 14 },
  { name: "Beedrill", id: 15 },
  { name: "Beedrill (Mega)", id: 10090 },

  { name: "Ledyba", id: 165 },
  { name: "Ledian", id: 166 },

  { name: "Spinarak", id: 167 },
  { name: "Ariados", id: 168 },

  { name: "Nincada", id: 290 },
  { name: "Ninjask", id: 291 },
  { name: "Shedinja", id: 292 },

  { name: "Wurmple", id: 265 },
  { name: "Silcoon", id: 266 },
  { name: "Cascoon", id: 267 },
  { name: "Beautifly", id: 268 },
  { name: "Dustox", id: 269 },

  { name: "Surskit", id: 283 },
  { name: "Masquerain", id: 284 },

  { name: "Kricketot", id: 401 },
  { name: "Kricketune", id: 402 },

  { name: "Sewaddle", id: 540 },
  { name: "Swadloon", id: 541 },
  { name: "Leavanny", id: 542 },

  { name: "Venipede", id: 543 },
  { name: "Whirlipede", id: 544 },
  { name: "Scolipede", id: 545 },

  { name: "Joltik", id: 595 },
  { name: "Galvantula", id: 596 },

  { name: "Scatterbug", id: 664 },
  { name: "Spewpa", id: 665 },
  { name: "Vivillon", id: 666 },

  { name: "Grubbin", id: 736 },
  { name: "Charjabug", id: 737 },
  { name: "Vikavolt", id: 738 },

  { name: "Cutiefly", id: 742 },
  { name: "Ribombee", id: 743 },

  { name: "Dewpider", id: 751 },
  { name: "Araquanid", id: 752 },

  { name: "Blipbug", id: 824 },
  { name: "Dottler", id: 825 },
  { name: "Orbeetle", id: 826 },
  { name: "Orbeetle (Gigantamax)", id: 10213 },

  { name: "Tarountula", id: 917 },
  { name: "Spidops", id: 918 },

  { name: "Nymble", id: 919 },
  { name: "Lokix", id: 920 },
];

// ==================================================
// FOSSIL
// ==================================================
export const fossil = [
  { name: "Omanyte", id: 138 },
  { name: "Omastar", id: 139 },
  { name: "Kabuto", id: 140 },
  { name: "Kabutops", id: 141 },
  { name: "Aerodactyl", id: 142 },
  { name: "Aerodactyl (Mega)", id: 10042 },

  { name: "Lileep", id: 345 },
  { name: "Cradily", id: 346 },
  { name: "Anorith", id: 347 },
  { name: "Armaldo", id: 348 },

  { name: "Cranidos", id: 408 },
  { name: "Rampardos", id: 409 },
  { name: "Shieldon", id: 410 },
  { name: "Bastiodon", id: 411 },

  { name: "Tirtouga", id: 564 },
  { name: "Carracosta", id: 565 },

  { name: "Archen", id: 566 },
  { name: "Archeops", id: 567 },

  { name: "Tyrunt", id: 696 },
  { name: "Tyrantrum", id: 697 },

  { name: "Amaura", id: 698 },
  { name: "Aurorus", id: 699 },

  { name: "Dracozolt", id: 880 },
  { name: "Arctozolt", id: 881 },
  { name: "Dracovish", id: 882 },
  { name: "Arctovish", id: 883 },
];

// ==================================================
// BABY POKEMON
// ==================================================
export const babyPokemon = [
  { name: "Pichu", id: 172 },
  { name: "Cleffa", id: 173 },
  { name: "Igglybuff", id: 174 },
  { name: "Togepi", id: 175 },
  { name: "Tyrogue", id: 236 },
  { name: "Smoochum", id: 238 },
  { name: "Elekid", id: 239 },
  { name: "Magby", id: 240 },
  { name: "Azurill", id: 298 },
  { name: "Wynaut", id: 360 },
  { name: "Budew", id: 406 },
  { name: "Chingling", id: 433 },
  { name: "Bonsly", id: 438 },
  { name: "Mime Jr.", id: 439 },
  { name: "Happiny", id: 440 },
  { name: "Munchlax", id: 446 },
  { name: "Riolu", id: 447 },
  { name: "Mantyke", id: 458 },
];

// ==================================================
// PIKACHU CLONE
// ==================================================
export const pikachuClone = [
  { name: "Plusle", id: 311 },
  { name: "Minun", id: 312 },
  { name: "Pachirisu", id: 417 },
  { name: "Emolga", id: 587 },
  { name: "Dedenne", id: 702 },
  { name: "Togedemaru", id: 777 },
  { name: "Mimikyu", id: 778 },
  { name: "Morpeko", id: 877 },
  { name: "Morpeko (Hangry)", id: 10187 },
  { name: "Pawmi", id: 921 },
  { name: "Pawmo", id: 922 },
  { name: "Pawmot", id: 923 },
];

// ==================================================
// EEVEELUTIONS
// ==================================================
export const eeveeForm = [
  { name: "Eevee", id: 133 },
  { name: "Vaporeon", id: 134 },
  { name: "Jolteon", id: 135 },
  { name: "Flareon", id: 136 },
  { name: "Espeon", id: 196 },
  { name: "Umbreon", id: 197 },
  { name: "Leafeon", id: 470 },
  { name: "Glaceon", id: 471 },
  { name: "Sylveon", id: 700 },
  { name: "Eevee (Gigantamax)", id: 10205 },
];

// ==================================================
// REGIONAL VARIANTS
// ==================================================
export const regionalForm = [
  { name: "Rattata (Alola)", id: 10091 },
  { name: "Raticate (Alola)", id: 10092 },
  { name: "Raichu (Alola)", id: 10100 },

  { name: "Sandshrew (Alola)", id: 10101 },
  { name: "Sandslash (Alola)", id: 10102 },
  { name: "Vulpix (Alola)", id: 10103 },
  { name: "Ninetales (Alola)", id: 10104 },
  { name: "Diglett (Alola)", id: 10105 },
  { name: "Dugtrio (Alola)", id: 10106 },
  { name: "Meowth (Alola)", id: 10107 },
  { name: "Meowth (Galar)", id: 10161 },
  { name: "Persian (Alola)", id: 10108 },
  { name: "Geodude (Alola)", id: 10109 },
  { name: "Graveler (Alola)", id: 10110 },
  { name: "Golem (Alola)", id: 10111 },

  { name: "Ponyta (Galar)", id: 10162 },
  { name: "Rapidash (Galar)", id: 10163 },

  { name: "Slowpoke (Galar)", id: 10164 },
  { name: "Slowbro (Galar)", id: 10165 },
  { name: "Slowking (Galar)", id: 10172 },

  { name: "Farfetch'd (Galar)", id: 10166 },

  { name: "Grimer (Alola)", id: 10112 },
  { name: "Muk (Alola)", id: 10113 },

  { name: "Exeggutor (Alola)", id: 10114 },
  { name: "Marowak (Alola)", id: 10115 },

  { name: "Weezing (Galar)", id: 10167 },
  { name: "Mr. Mime (Galar)", id: 10168 },

  { name: "Articuno (Galar)", id: 10169 },
  { name: "Zapdos (Galar)", id: 10170 },
  { name: "Moltres (Galar)", id: 10171 },

  { name: "Corsola (Galar)", id: 10173 },

  { name: "Zigzagoon (Galar)", id: 10174 },
  { name: "Linoone (Galar)", id: 10175 },

  { name: "Darumaka (Galar)", id: 10176 },
  { name: "Darmanitan (Galar)", id: 10177 },
  { name: "Darmanitan (Galar Zen)", id: 10178 },

  { name: "Yamask (Galar)", id: 10179 },
  { name: "Stunfisk (Galar)", id: 10180 },

  { name: "Growlithe (Hisui)", id: 10229 },
  { name: "Arcanine (Hisui)", id: 10230 },
  { name: "Voltorb (Hisui)", id: 10231 },
  { name: "Electrode (Hisui)", id: 10232 },
  { name: "Typhlosion (Hisui)", id: 10233 },
  { name: "Qwilfish (Hisui)", id: 10234 },
  { name: "Sneasel (Hisui)", id: 10235 },
  { name: "Samurott (Hisui)", id: 10236 },
  { name: "Lilligant (Hisui)", id: 10237 },
  { name: "Zorua (Hisui)", id: 10238 },
  { name: "Zoroark (Hisui)", id: 10239 },
  { name: "Braviary (Hisui)", id: 10240 },
  { name: "Sliggoo (Hisui)", id: 10241 },
  { name: "Goodra (Hisui)", id: 10242 },
  { name: "Avalugg (Hisui)", id: 10243 },
  { name: "Decidueye (Hisui)", id: 10244 },

  { name: "Wooper (Paldea)", id: 10253 },

  { name: "Tauros (Paldea Combat)", id: 10250 },
  { name: "Tauros (Paldea Blaze)", id: 10251 },
  { name: "Tauros (Paldea Aqua)", id: 10252 },
];

// ==================================================
// NEW EVOLUTIONS
// ==================================================
export const newEvolutionForms = [
  { name: "Crobat", id: 169 },
  { name: "Bellossom", id: 182 },
  { name: "Politoed", id: 186 },
  { name: "Espeon", id: 196 },
  { name: "Umbreon", id: 197 },
  { name: "Slowking", id: 199 },
  { name: "Steelix", id: 208 },
  { name: "Scizor", id: 212 },
  { name: "Kingdra", id: 230 },
  { name: "Porygon2", id: 233 },
  { name: "Blissey", id: 242 },

  { name: "Roserade", id: 407 },
  { name: "Ambipom", id: 424 },
  { name: "Mismagius", id: 429 },
  { name: "Honchkrow", id: 430 },
  { name: "Weavile", id: 461 },
  { name: "Magnezone", id: 462 },
  { name: "Lickilicky", id: 463 },
  { name: "Rhyperior", id: 464 },
  { name: "Tangrowth", id: 465 },
  { name: "Electivire", id: 466 },
  { name: "Magmortar", id: 467 },
  { name: "Togekiss", id: 468 },
  { name: "Yanmega", id: 469 },
  { name: "Gliscor", id: 472 },
  { name: "Mamoswine", id: 473 },
  { name: "Porygon-Z", id: 474 },
  { name: "Gallade", id: 475 },
  { name: "Probopass", id: 476 },
  { name: "Dusknoir", id: 477 },
  { name: "Froslass", id: 478 },

  { name: "Sylveon", id: 700 },

  { name: "Obstagoon", id: 862 },
  { name: "Perrserker", id: 863 },
  { name: "Cursola", id: 864 },
  { name: "Sirfetch'd", id: 865 },
  { name: "Mr. Rime", id: 866 },
  { name: "Runerigus", id: 867 },

  { name: "Wyrdeer", id: 899 },
  { name: "Kleavor", id: 900 },
  { name: "Ursaluna", id: 901 },
  { name: "Basculegion", id: 902 },
  { name: "Sneasler", id: 903 },
  { name: "Overqwil", id: 904 },

  { name: "Annihilape", id: 979 },
  { name: "Clodsire", id: 980 },
  { name: "Farigiraf", id: 981 },
  { name: "Dudunsparce", id: 982 },
  { name: "Kingambit", id: 983 },
  { name: "Gholdengo", id: 1000 },

  { name: "Archaludon", id: 1018 },
  { name: "Hydrapple", id: 1019 },
];

// ==================================================
// MEGA EVOLUTIONS
// ==================================================
export const megaEvolutions = [
  { name: "Venusaur (Mega)", id: 10033 },
  { name: "Charizard (Mega X)", id: 10034 },
  { name: "Charizard (Mega Y)", id: 10035 },
  { name: "Blastoise (Mega)", id: 10036 },
  { name: "Alakazam (Mega)", id: 10037 },
  { name: "Gengar (Mega)", id: 10038 },
  { name: "Kangaskhan (Mega)", id: 10039 },
  { name: "Pinsir (Mega)", id: 10040 },
  { name: "Gyarados (Mega)", id: 10041 },
  { name: "Aerodactyl (Mega)", id: 10042 },
  { name: "Mewtwo (Mega X)", id: 10043 },
  { name: "Mewtwo (Mega Y)", id: 10044 },
  { name: "Ampharos (Mega)", id: 10045 },
  { name: "Scizor (Mega)", id: 10046 },
  { name: "Heracross (Mega)", id: 10047 },
  { name: "Houndoom (Mega)", id: 10048 },
  { name: "Tyranitar (Mega)", id: 10049 },
  { name: "Blaziken (Mega)", id: 10050 },
  { name: "Gardevoir (Mega)", id: 10051 },
  { name: "Mawile (Mega)", id: 10052 },
  { name: "Aggron (Mega)", id: 10053 },
  { name: "Medicham (Mega)", id: 10054 },
  { name: "Manectric (Mega)", id: 10055 },
  { name: "Banette (Mega)", id: 10056 },
  { name: "Absol (Mega)", id: 10057 },
  { name: "Garchomp (Mega)", id: 10058 },
  { name: "Lucario (Mega)", id: 10059 },
  { name: "Abomasnow (Mega)", id: 10060 },
  { name: "Latias (Mega)", id: 10062 },
  { name: "Latios (Mega)", id: 10063 },
  { name: "Swampert (Mega)", id: 10064 },
  { name: "Sceptile (Mega)", id: 10065 },
  { name: "Sableye (Mega)", id: 10066 },
  { name: "Altaria (Mega)", id: 10067 },
  { name: "Gallade (Mega)", id: 10068 },
  { name: "Audino (Mega)", id: 10069 },
  { name: "Sharpedo (Mega)", id: 10070 },
  { name: "Slowbro (Mega)", id: 10071 },
  { name: "Steelix (Mega)", id: 10072 },
  { name: "Pidgeot (Mega)", id: 10073 },
  { name: "Glalie (Mega)", id: 10074 },
  { name: "Diancie (Mega)", id: 10075 },
  { name: "Metagross (Mega)", id: 10076 },
  { name: "Rayquaza (Mega)", id: 10079 },
  { name: "Camerupt (Mega)", id: 10087 },
  { name: "Lopunny (Mega)", id: 10088 },
  { name: "Salamence (Mega)", id: 10089 },
  { name: "Beedrill (Mega)", id: 10090 },
];

// ==================================================
// GIGANTAMAX POKEMON
// ==================================================
export const gigantamaxPokemon = [
  { name: "Venusaur (Gigantamax)", id: 10195 },
  { name: "Charizard (Gigantamax)", id: 10196 },
  { name: "Blastoise (Gigantamax)", id: 10197 },
  { name: "Butterfree (Gigantamax)", id: 10198 },
  { name: "Pikachu (Gigantamax)", id: 10199 },
  { name: "Meowth (Gigantamax)", id: 10200 },
  { name: "Machamp (Gigantamax)", id: 10201 },
  { name: "Gengar (Gigantamax)", id: 10202 },
  { name: "Kingler (Gigantamax)", id: 10203 },
  { name: "Lapras (Gigantamax)", id: 10204 },
  { name: "Eevee (Gigantamax)", id: 10205 },
  { name: "Snorlax (Gigantamax)", id: 10206 },
  { name: "Garbodor (Gigantamax)", id: 10207 },
  { name: "Melmetal (Gigantamax)", id: 10208 },
  { name: "Rillaboom (Gigantamax)", id: 10209 },
  { name: "Cinderace (Gigantamax)", id: 10210 },
  { name: "Inteleon (Gigantamax)", id: 10211 },
  { name: "Corviknight (Gigantamax)", id: 10212 },
  { name: "Orbeetle (Gigantamax)", id: 10213 },
  { name: "Drednaw (Gigantamax)", id: 10214 },
  { name: "Coalossal (Gigantamax)", id: 10215 },
  { name: "Flapple (Gigantamax)", id: 10216 },
  { name: "Appletun (Gigantamax)", id: 10217 },
  { name: "Sandaconda (Gigantamax)", id: 10218 },
  { name: "Toxtricity (Amped)", id: 10219 },
  { name: "Centiskorch (Gigantamax)", id: 10220 },
  { name: "Hatterene (Gigantamax)", id: 10221 },
  { name: "Grimmsnarl (Gigantamax)", id: 10222 },
  { name: "Alcremie (Gigantamax)", id: 10223 },
  { name: "Copperajah (Gigantamax)", id: 10224 },
  { name: "Duraludon (Gigantamax)", id: 10225 },
  { name: "Urshifu Single Strike (Gigantamax)", id: 10226 },
  { name: "Urshifu Rapid Strike (Gigantamax)", id: 10227 },
  { name: "Toxtricity (Low Key)", id: 10228 },
];

// ==================================================
// PSEUDO LEGEND
// ==================================================
export const pseudoLegend = [
  { name: "Dratini", id: 147 },
  { name: "Dragonair", id: 148 },
  { name: "Dragonite", id: 149 },

  { name: "Larvitar", id: 246 },
  { name: "Pupitar", id: 247 },
  { name: "Tyranitar", id: 248 },

  { name: "Bagon", id: 371 },
  { name: "Shelgon", id: 372 },
  { name: "Salamence", id: 373 },

  { name: "Beldum", id: 374 },
  { name: "Metang", id: 375 },
  { name: "Metagross", id: 376 },

  { name: "Gible", id: 443 },
  { name: "Gabite", id: 444 },
  { name: "Garchomp", id: 445 },

  { name: "Deino", id: 633 },
  { name: "Zweilous", id: 634 },
  { name: "Hydreigon", id: 635 },

  { name: "Goomy", id: 704 },
  { name: "Sliggoo", id: 705 },
  { name: "Goodra", id: 706 },

  { name: "Jangmo-o", id: 782 },
  { name: "Hakamo-o", id: 783 },
  { name: "Kommo-o", id: 784 },

  { name: "Dreepy", id: 885 },
  { name: "Drakloak", id: 886 },
  { name: "Dragapult", id: 887 },

  { name: "Frigibax", id: 996 },
  { name: "Arctibax", id: 997 },
  { name: "Baxcalibur", id: 998 },
];

// ==================================================
// PSEUDO LEGEND EVOLUTIONS
// ==================================================
export const pseudoLegendEvolutions = [
  { name: "Dragonite", id: 149 },
  { name: "Tyranitar", id: 248 },
  { name: "Salamence", id: 373 },
  { name: "Metagross", id: 376 },
  { name: "Garchomp", id: 445 },
  { name: "Hydreigon", id: 635 },
  { name: "Goodra", id: 706 },
  { name: "Kommo-o", id: 784 },
  { name: "Dragapult", id: 887 },
  { name: "Baxcalibur", id: 998 },
];

// ==================================================
// ULTRA BEASTS
// ==================================================
export const ultraBeasts = [
  { name: "Nihilego", id: 793 },
  { name: "Buzzwole", id: 794 },
  { name: "Pheromosa", id: 795 },
  { name: "Xurkitree", id: 796 },
  { name: "Celesteela", id: 797 },
  { name: "Kartana", id: 798 },
  { name: "Guzzlord", id: 799 },
  { name: "Poipole", id: 803 },
  { name: "Naganadel", id: 804 },
  { name: "Stakataka", id: 805 },
  { name: "Blacephalon", id: 806 },
];

// ==================================================
// PARADOX
// ==================================================
export const paradox = [
  { name: "Great Tusk", id: 984 },
  { name: "Scream Tail", id: 985 },
  { name: "Brute Bonnet", id: 986 },
  { name: "Flutter Mane", id: 987 },
  { name: "Slither Wing", id: 988 },
  { name: "Sandy Shocks", id: 989 },
  { name: "Roaring Moon", id: 1005 },

  { name: "Iron Treads", id: 990 },
  { name: "Iron Bundle", id: 991 },
  { name: "Iron Hands", id: 992 },
  { name: "Iron Jugulis", id: 993 },
  { name: "Iron Moth", id: 994 },
  { name: "Iron Thorns", id: 995 },
  { name: "Iron Valiant", id: 1006 },

  { name: "Walking Wake", id: 1009 },
  { name: "Iron Leaves", id: 1010 },
  { name: "Gouging Fire", id: 1020 },
  { name: "Raging Bolt", id: 1021 },
  { name: "Iron Boulder", id: 1022 },
  { name: "Iron Crown", id: 1023 },
];

// ==================================================
// BOX LEGENDARY
// ==================================================
export const boxLegendary = [
  { name: "Lugia", id: 249 },
  { name: "Ho-Oh", id: 250 },

  { name: "Kyogre", id: 382 },
  { name: "Groudon", id: 383 },
  { name: "Rayquaza", id: 384 },

  { name: "Dialga", id: 483 },
  { name: "Palkia", id: 484 },
  { name: "Giratina (Origin)", id: 10007 },

  { name: "Reshiram", id: 643 },
  { name: "Zekrom", id: 644 },
  { name: "Kyurem", id: 646 },
  { name: "Kyurem (Black)", id: 10022 },
  { name: "Kyurem (White)", id: 10023 },

  { name: "Xerneas", id: 716 },
  { name: "Yveltal", id: 717 },

  { name: "Solgaleo", id: 791 },
  { name: "Lunala", id: 792 },

  { name: "Zacian (Crowned)", id: 10188 },
  { name: "Zamazenta (Crowned)", id: 10189 },

  { name: "Koraidon", id: 1007 },
  { name: "Miraidon", id: 1008 },

  { name: "Terapagos", id: 1024 },
];

// ==================================================
// LEGENDARY
// ==================================================
export const legendary = [
  { name: "Articuno", id: 144 },
  { name: "Zapdos", id: 145 },
  { name: "Moltres", id: 146 },
  { name: "Mewtwo", id: 150 },

  { name: "Raikou", id: 243 },
  { name: "Entei", id: 244 },
  { name: "Suicune", id: 245 },

  { name: "Regirock", id: 377 },
  { name: "Regice", id: 378 },
  { name: "Registeel", id: 379 },
  { name: "Latias", id: 380 },
  { name: "Latios", id: 381 },

  { name: "Uxie", id: 480 },
  { name: "Mesprit", id: 481 },
  { name: "Azelf", id: 482 },
  { name: "Heatran", id: 485 },
  { name: "Regigigas", id: 486 },
  { name: "Cresselia", id: 488 },

  { name: "Cobalion", id: 638 },
  { name: "Terrakion", id: 639 },
  { name: "Virizion", id: 640 },
  { name: "Tornadus", id: 641 },
  { name: "Thundurus", id: 642 },
  { name: "Landorus", id: 645 },

  { name: "Tapu Koko", id: 785 },
  { name: "Tapu Lele", id: 786 },
  { name: "Tapu Bulu", id: 787 },
  { name: "Tapu Fini", id: 788 },

  { name: "Regieleki", id: 894 },
  { name: "Regidrago", id: 895 },
  { name: "Glastrier", id: 896 },
  { name: "Spectrier", id: 897 },
  { name: "Calyrex", id: 898 },

  { name: "Wo-Chien", id: 1001 },
  { name: "Chien-Pao", id: 1002 },
  { name: "Ting-Lu", id: 1003 },
  { name: "Chi-Yu", id: 1004 },
];

// ==================================================
// MYTHICALS
// ==================================================
export const mythicals = [
  { name: "Mew", id: 151 },
  { name: "Celebi", id: 251 },
  { name: "Jirachi", id: 385 },
  { name: "Deoxys", id: 386 },
  { name: "Phione", id: 489 },
  { name: "Manaphy", id: 490 },
  { name: "Darkrai", id: 491 },
  { name: "Shaymin", id: 492 },
  { name: "Arceus", id: 493 },
  { name: "Victini", id: 494 },
  { name: "Keldeo", id: 647 },
  { name: "Meloetta", id: 648 },
  { name: "Genesect", id: 649 },
  { name: "Diancie", id: 719 },
  { name: "Hoopa", id: 720 },
  { name: "Volcanion", id: 721 },
  { name: "Magearna", id: 801 },
  { name: "Marshadow", id: 802 },
  { name: "Zeraora", id: 807 },
  { name: "Meltan", id: 808 },
  { name: "Melmetal", id: 809 },
  { name: "Zarude", id: 893 },
  { name: "Pecharunt", id: 1025 },
];

type PokemonCollectionEntry = {
  id: number;
  name: string;
};

const toPokemonIds = (entries: PokemonCollectionEntry[]) => {
  return [...new Set(entries.map((entry) => entry.id))];
};

export const pokemonCollectionFilterKeys = [
  "starters",
  "regional-birds",
  "regional-mammals",
  "regional-bugs",
  "fossils",
  "babies",
  "pikachu-clones",
  "eeveelutions",
  "regional-variants",
  "new-evolutions",
  "mega-evolutions",
  "gigantamax",
  "pseudo-legends",
  "ultra-beasts",
  "paradoxes",
  "legendaries",
  "mythicals",
] as const;

export type PokemonCollectionFilterKey =
  (typeof pokemonCollectionFilterKeys)[number];

export const pokemonCollectionFilters = [
  {
    key: "starters",
    title: "Starters",
    pokemonIds: toPokemonIds(starters),
  },
  {
    key: "regional-birds",
    title: "Regional Birds",
    pokemonIds: toPokemonIds(regionalBird),
  },
  {
    key: "regional-mammals",
    title: "Regional Mammals",
    pokemonIds: toPokemonIds(regionalMammal),
  },
  {
    key: "regional-bugs",
    title: "Regional Bugs",
    pokemonIds: toPokemonIds(bug),
  },
  {
    key: "fossils",
    title: "Fossils",
    pokemonIds: toPokemonIds(fossil),
  },
  {
    key: "babies",
    title: "Babies",
    pokemonIds: toPokemonIds(babyPokemon),
  },
  {
    key: "pikachu-clones",
    title: "Pikachu Clones",
    pokemonIds: toPokemonIds(pikachuClone),
  },
  {
    key: "eeveelutions",
    title: "Eeveelutions",
    pokemonIds: toPokemonIds(eeveeForm),
  },
  {
    key: "regional-variants",
    title: "Regional Variants",
    pokemonIds: toPokemonIds(regionalForm),
  },
  {
    key: "new-evolutions",
    title: "New Evolutions",
    pokemonIds: toPokemonIds(newEvolutionForms),
  },
  {
    key: "mega-evolutions",
    title: "Mega Evolutions",
    pokemonIds: toPokemonIds(megaEvolutions),
  },
  {
    key: "gigantamax",
    title: "Gigantamax",
    pokemonIds: toPokemonIds(gigantamaxPokemon),
  },
  {
    key: "pseudo-legends",
    title: "Pseudos Legends",
    pokemonIds: toPokemonIds(pseudoLegend),
  },
  {
    key: "ultra-beasts",
    title: "Ultra Beasts",
    pokemonIds: toPokemonIds(ultraBeasts),
  },
  {
    key: "paradoxes",
    title: "Paradoxes",
    pokemonIds: toPokemonIds(paradox),
  },
  {
    key: "legendaries",
    title: "Legendaries",
    pokemonIds: toPokemonIds(legendary),
  },
  {
    key: "mythicals",
    title: "Mythicals",
    pokemonIds: toPokemonIds(mythicals),
  },
] as const satisfies ReadonlyArray<{
  key: PokemonCollectionFilterKey;
  title: string;
  pokemonIds: number[];
}>;

export const pokemonCollectionFilterMap = Object.fromEntries(
  pokemonCollectionFilters.map((filter) => [filter.key, filter]),
) as Record<
  PokemonCollectionFilterKey,
  (typeof pokemonCollectionFilters)[number]
>;
