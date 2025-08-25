#!/usr/bin/env -S deno run --quiet --allow-read --allow-env=QPASS_WORDS
/**
 * @file qpass.ts
 * @brief Provide a choice of passwords based on combinations of three letter words and different marks.
 *
 * @author     Simon Rowe <simon@wiremoons.com>
 * @license    open-source released under "MIT License"
 * @source     https://github.com/wiremoons/qpass
 *
 * @date originally created: 30 July 2023
 * @date updated significantly: 24 March 2024
 * @date updated with colour outputs: 20 August 2025
 *
 * @details Provide a choice of passwords based on combinations of three letter words and different marks.
 * Application is written in TypeScript for use with the Deno runtime: https://deno.land/
 *
 * @note The program can be run with Deno using the commands below - either using a local copy, or directly via the applications GitHub URL:
 * @code deno run --quiet --allow-read --allow-env=QPASS_WORDS qpass.ts
 * @code deno run --quiet --allow-read --allow-env=QPASS_WORDS https://raw.githubusercontent.com/wiremoons/qpass/main/qpass.ts
 * @note The program can be installed to 'DENO_INSTALL_ROOT' to using the command:
 * @code deno install -f --quiet --allow-read --allow-env=QPASS_WORDS qpass.ts
 * @code deno install -f --quiet --allow-read --allow-env=QPASS_WORDS https://raw.githubusercontent.com/wiremoons/qpass/main/qpass.ts
 * @note The program can be compiled using the command:
 * @code deno compile --quiet --allow-read --allow-env=QPASS_WORDS qpass.ts
 * @code deno compile --quiet --allow-read --allow-env=QPASS_WORDS https://raw.githubusercontent.com/wiremoons/qpass/main/qpass.ts
 */

//--------------------------------
// MODULE IMPORTS
//--------------------------------

// Deno stdlib imports
import { parseArgs } from "jsr:@std/cli@1.x/parse-args";
import { basename } from "jsr:@std/path@1.x/basename";
import { bold, cyan, green, setColorEnabled } from "jsr:@std/fmt@1.x/colors";

// Other imports
import { version } from "jsr:@wiremoons/version@1.x";

//--------------------------------
// GLOBAL DECLARATIONS
//--------------------------------

// CLI VERSION OPTIONS DECLARATION

/** define options for `cliVersion()` function for application version data */
const versionOptions = {
  version: "0.3.1",
  copyrightName: "Simon Rowe",
  licenseUrl: "https://github.com/wiremoons/qpass/",
  crYear: "2023-2025",
};

/** Define the command line argument switches and options that can be used */
const cliOpts = {
  default: { a: false, h: false, m: false, v: false },
  alias: { a: "about", h: "help", m: "monochrome", v: "version" },
  stopEarly: true,
  //unknown: showUnknown,
};

//--------------------------------
// COMMAND LINE ARGS FUNCTIONS
//--------------------------------

/** obtain any command line arguments and exec them as needed */
async function execCliArgs() {
  //console.log(parse(Deno.args,cliOpts));
  const cliArgs = parseArgs(Deno.args, cliOpts);

  if (cliArgs.help) {
    printHelp();
    Deno.exit(0);
  }

  if (cliArgs.version) {
    await printVersionInfo();
    Deno.exit(0);
  }

  if (cliArgs.about) {
    printAboutInfo();
    Deno.exit(0);
  }

  if (cliArgs.monochrome) {
    // from "jsr:@std/fmt@1.x/colors"
    // used as this not working as runtime change:
    //  Deno.env.set("NO_COLOR", "1");
    setColorEnabled(false);
  }
}

/** Function defined in `cliOpts` so is run automatically by `parse()` if an unknown
 * command line option is given by the user.
 * @code showUnknown(arg: string, k?: string, v?: unknown)
 */
// function showUnknown(arg: string) {
//   console.error(`\nERROR: Unknown argument: '${arg}'`);
//   printHelp();
//   Deno.exit(1);
// }

//--------------------------------
// UTILITY FUNCTIONS
//--------------------------------

/**
 * Type Guard for qpass Interface object
 */
//// deno-lint-ignore no-explicit-any
// function isObject(arg: any): arg is QpassInterface {
//   return arg !== undefined;
// }

//--------------------------------
// APPLICATION FUNCTIONS
//--------------------------------

/** Return the name of the currently running program without the path included. */
function getAppName(): string {
  return `${basename(Deno.mainModule) ?? "UNKNOWN"}`;
}

/** Check environment variable 'QPASS_WORDS' for numbers of password words to include */
function QpassWordsEnv(): number {
  const qpass_words = parseInt(Deno.env.get("QPASS_WORDS") || "");
  return Number.isInteger(qpass_words) ? qpass_words : 3;
}

/** Provide a random word from the dictionary of three letter words array */
function randomWord(): string {
  const max: number = words.length - 1;
  const random_number: number = Math.floor(Math.random() * max);
  return words.at(random_number) as string;
}

/** Provide a random mark from the selection included in the marks array  */
function randomMark(): string {
  const max: number = marks.length - 1;
  const random_number: number = Math.floor(Math.random() * max);
  return marks.at(random_number) as string;
}

/** Provide a random number between 00 and 99 */
function randomNumber(): number {
  const max: number = 100; // Math.random() is not inclusive
  return Math.floor(Math.random() * max);
}

/** Alter a string to randomly changed characters of either upper of lower case */
function randomCaseString(input: string): string {
  if (input.length < 1) return input;
  let random_case_string: string = "";
  for (const letter of input) {
    random_case_string += (randomNumber() % 2)
      ? letter.toUpperCase()
      : letter.toLowerCase();
  }
  return random_case_string;
}

/** Capitalise the first character of a string */
function toTitleCaseFirstLetter(input: string): string {
  if (input.length === 0) return input;
  return input.charAt(0).toUpperCase() + input.substring(1);
}

/** Add a leading zero to `number` only if it is less then two digits in length */
function padWithLeadingZero(number: number): string {
  return String(number).padStart(2, "0");
}

//--------------------------------
// DISPLAY INFO FUNCTIONS
//--------------------------------

/** Display application version information when requested */
async function printVersionInfo() {
  const versionData = await version(versionOptions);
  console.log(versionData);
}

/** Display application help when requested  */
function printHelp() {
  console.log(`
${bold("Quick Password")} 'qpass':
Provide a choice of passwords based on combinations of three letter words and different marks.

Usage: ${bold(getAppName())} [switches] [arguments]

[Switches]       [Arguments]   [Default Value]   [Description]
-h, --help                          false        display help information
-m, --monochrome                    false        disable colour outputs
-v, --version                       false        display program version
-a, --about                         false        information on password generation

Other environment controlled settings or configurations file parameters can be defined.
See 'How Passwords Are Generated.' information using the '-a' or --about' command
line flags for more detailed help and explanations.
`);
}

/** Display information about password generation */
function printAboutInfo() {
  const qpass_words: number = QpassWordsEnv();
  console.log(`
How Passwords Are Generated.

Passwords are generated randomly using a dictionary of three letter long
English words. The words are combined with 'marks' that consist of
randomly select characters such full stop, colon, dash, etc. The generated
password also include a randomly generated number between zero and ninety nine.

To further increase the entropy of the generated password, the words from the
dictionary can be capitalised, or randomly include upper and lower case characters.

Currently the passwords are generated using the settings:

- Number of marks:                             ${marks.length}
- Three letter word dictionary size:           ${words.length.toLocaleString()}
- Generated password number of words included: ${qpass_words} ${
    qpass_words === 3 ? "[default]" : "[user defined]"
  }
- Include random numbers:                      true
- Include random marks:                        true
- Include title case words:                    true
- Include random upper and lower case letters: false

The above settings can be altered via either environment variables, command
line flags, or the configurations file.

By default number and marks are output with colours. The application supports
the NO_COLOR environmental variable, disabling any coloring output if NO_COLOR
is set. Also see runtime flags option: '-m'  or '--monochrome'.

Optional environment variable settings:
- Defines the number of random three letter words to include [default: 3] : QPASS_WORDS=3
- Disable colour output if required : NO_COLOR=1
  `);
}

function displayPasswords() {
  // ensure a value exists for number of random words to include.
  const qpass_words: number = QpassWordsEnv();
  let lower_case_words: string = "";
  let title_case_words: string = "";
  let random_case_words: string = "";
  // create passwords requested
  for (let i: number = 0; i < qpass_words; i++) {
    const next_word: string = randomWord();
    lower_case_words = lower_case_words + next_word;
    title_case_words = title_case_words + toTitleCaseFirstLetter(next_word);
    random_case_words = random_case_words + randomCaseString(next_word);
  }
  // create two random numbers for inclusion in the final password output
  const random_number_one = padWithLeadingZero(randomNumber());
  const random_number_two = padWithLeadingZero(randomNumber());
  // create two random marks for inclusion in the final password output
  const random_mark_one = randomMark();
  const random_mark_two = randomMark();
  console.log(
    green(`${random_number_one}`) + cyan(`${random_mark_one}`) +
      lower_case_words +
      cyan(`${random_mark_two}`) +
      green(`${random_number_two}`) + "\t\t" + title_case_words +
      cyan(`${random_mark_one}`) +
      green(`${random_number_one}`) + green(`${random_number_two}`) +
      "\t\t" +
      cyan(`${random_mark_one}`) + green(`${random_number_one}`) +
      random_case_words +
      cyan(`${random_mark_two}`) + green(`${random_number_two}`),
  );
}

//----------------------------------------------------------------
// Password Source Data Start
//----------------------------------------------------------------
// Each character (mark) is used as an additional random value to enhance
// the strength of the generated password.
// deno-fmt-ignore
const marks: Array<string> = ['#', '.', ';', '@', '%', ':', '!', '>', '-', '<'];

// Each string in the array that contains three letter english words used
// to generate a password string.
// deno-fmt-ignore
const words:Array<string> = [
    "aah", "aal", "aas", "aba", "abb", "abo", "abs", "aby", "ace", "ach", "act",
    "add", "ado", "ads", "adz", "aff", "aft", "aga", "age", "ago", "ags", "aha",
    "ahi", "ahs", "aia", "aid", "ail", "aim", "ain", "air", "ais", "ait", "aka",
    "ake", "ala", "alb", "ale", "alf", "all", "alp", "als", "alt", "alu", "ama",
    "ame", "ami", "amp", "amu", "ana", "and", "ane", "ani", "ann", "ans", "ant",
    "any", "ape", "apo", "app", "apt", "arb", "arc", "ard", "are", "arf", "ark",
    "arm", "ars", "art", "ary", "ash", "ask", "asp", "ass", "ate", "ats", "att",
    "aua", "aue", "auf", "auk", "ava", "ave", "avo", "awa", "awe", "awk", "awl",
    "awn", "axe", "aye", "ays", "ayu", "azo", "baa", "bac", "bad", "bag", "bah",
    "bal", "bam", "ban", "bap", "bar", "bas", "bat", "bay", "bed", "bee", "beg",
    "bel", "ben", "bes", "bet", "bey", "bez", "bib", "bid", "big", "bin", "bio",
    "bis", "bit", "biz", "boa", "bob", "bod", "bog", "boh", "boi", "bok", "bon",
    "boo", "bop", "bor", "bos", "bot", "bow", "box", "boy", "bra", "bro", "brr",
    "bru", "bub", "bud", "bug", "bum", "bun", "bur", "bus", "but", "buy", "bye",
    "bys", "caa", "cab", "cad", "cag", "cam", "can", "cap", "car", "cat", "caw",
    "cay", "caz", "cee", "cel", "cep", "cha", "che", "chi", "cid", "cig", "cis",
    "cit", "cly", "cob", "cod", "cog", "col", "con", "coo", "cop", "cor", "cos",
    "cot", "cow", "cox", "coy", "coz", "cru", "cry", "cub", "cud", "cue", "cum",
    "cup", "cur", "cut", "cuz", "cwm", "dab", "dad", "dae", "dag", "dah", "dak",
    "dal", "dam", "dan", "dap", "das", "daw", "day", "deb", "dee", "def", "deg",
    "dei", "del", "den", "dev", "dew", "dex", "dey", "dib", "did", "die", "dif",
    "dig", "dim", "din", "dip", "dis", "dit", "div", "dob", "doc", "dod", "doe",
    "dof", "dog", "doh", "dol", "dom", "don", "doo", "dop", "dor", "dos", "dot",
    "dow", "doy", "dry", "dso", "dub", "dud", "due", "dug", "duh", "dui", "dun",
    "duo", "dup", "dux", "dye", "dzo", "ean", "ear", "eas", "eat", "eau", "ebb",
    "ech", "eco", "ecu", "edh", "eds", "eek", "eel", "een", "eff", "efs", "eft",
    "egg", "ego", "ehs", "eik", "eke", "eld", "elf", "elk", "ell", "elm", "els",
    "elt", "eme", "emo", "ems", "emu", "end", "ene", "eng", "ens", "eon", "era",
    "ere", "erf", "erg", "erk", "erm", "ern", "err", "ers", "ess", "est", "eta",
    "eth", "euk", "eve", "evo", "ewe", "ewk", "ewt", "exo", "eye", "faa", "fab",
    "fad", "fae", "fag", "fah", "fan", "fap", "far", "fas", "fat", "faw", "fax",
    "fay", "fed", "fee", "feg", "feh", "fem", "fen", "fer", "fes", "fet", "feu",
    "few", "fey", "fez", "fib", "fid", "fie", "fig", "fil", "fin", "fir", "fit",
    "fix", "fiz", "flu", "fly", "fob", "foe", "fog", "foh", "fon", "fop", "for",
    "fou", "fox", "foy", "fra", "fro", "fry", "fub", "fud", "fug", "fum", "fun",
    "fur", "gab", "gad", "gae", "gag", "gak", "gal", "gam", "gan", "gap", "gar",
    "gas", "gat", "gau", "gaw", "gay", "ged", "gee", "gel", "gem", "gen", "geo",
    "ger", "get", "gey", "ghi", "gib", "gid", "gie", "gif", "gig", "gin", "gio",
    "gip", "gis", "git", "gju", "gnu", "goa", "gob", "god", "goe", "gon", "goo",
    "gor", "gos", "got", "gov", "gox", "goy", "gub", "gue", "gul", "gum", "gun",
    "gup", "gur", "gus", "gut", "guv", "guy", "gym", "gyp", "had", "hae", "hag",
    "hah", "haj", "ham", "han", "hao", "hap", "has", "hat", "haw", "hay", "heh",
    "hem", "hen", "hep", "her", "hes", "het", "hew", "hex", "hey", "hic", "hid",
    "hie", "him", "hin", "hip", "his", "hit", "hmm", "hoa", "hob", "hoc", "hod",
    "hoe", "hog", "hoh", "hoi", "hom", "hon", "hoo", "hop", "hos", "hot", "how",
    "hox", "hoy", "hub", "hue", "hug", "huh", "hui", "hum", "hun", "hup", "hut",
    "hye", "hyp", "ice", "ich", "ick", "icy", "ide", "ids", "iff", "ifs", "igg",
    "ilk", "ill", "imp", "ing", "ink", "inn", "ins", "ion", "ios", "ire", "irk",
    "ish", "ism", "iso", "ita", "its", "ivy", "iwi", "jab", "jag", "jai", "jak",
    "jam", "jap", "jar", "jaw", "jay", "jee", "jet", "jeu", "jew", "jib", "jig",
    "jin", "jiz", "job", "joe", "jog", "jol", "jor", "jot", "jow", "joy", "jud",
    "jug", "jun", "jus", "jut", "kab", "kae", "kaf", "kai", "kak", "kam", "kas",
    "kat", "kaw", "kay", "kea", "keb", "ked", "kef", "keg", "ken", "kep", "ket",
    "kex", "key", "khi", "kid", "kif", "kin", "kip", "kir", "kis", "kit", "koa",
    "kob", "koi", "kon", "kop", "kor", "kos", "kow", "kue", "kye", "kyu", "lab",
    "lac", "lad", "lag", "lah", "lam", "lap", "lar", "las", "lat", "lav", "law",
    "lax", "lay", "lea", "led", "lee", "leg", "lei", "lek", "lep", "les", "let",
    "leu", "lev", "lew", "lex", "ley", "lez", "lib", "lid", "lie", "lig", "lin",
    "lip", "lis", "lit", "lob", "lod", "log", "loo", "lop", "lor", "los", "lot",
    "lou", "low", "lox", "loy", "lud", "lug", "lum", "lur", "luv", "lux", "luz",
    "lye", "lym", "maa", "mac", "mad", "mae", "mag", "mak", "mal", "mam", "man",
    "map", "mar", "mas", "mat", "maw", "max", "may", "med", "mee", "meg", "meh",
    "mel", "mem", "men", "mes", "met", "meu", "mew", "mho", "mib", "mic", "mid",
    "mig", "mil", "mim", "mir", "mis", "mix", "miz", "mna", "moa", "mob", "moc",
    "mod", "moe", "mog", "moi", "mol", "mom", "mon", "wit", "moo", "mop", "mor",
    "mos", "mot", "mou", "mow", "moy", "moz", "mud", "mug", "mum", "mun", "mus",
    "mut", "mux", "myc", "nab", "nae", "nag", "nah", "nam", "nan", "nap", "nas",
    "nat", "naw", "nay", "neb", "ned", "nee", "nef", "neg", "nek", "nep", "net",
    "new", "nib", "nid", "nie", "nil", "nim", "nip", "nis", "nit", "nix", "nob",
    "nod", "nog", "noh", "nom", "non", "noo", "nor", "nos", "not", "now", "nox",
    "noy", "nth", "nub", "nun", "nur", "nus", "nut", "nye", "nys", "oaf", "oak",
    "oar", "oat", "oba", "obe", "obi", "obo", "obs", "oca", "och", "oda", "odd",
    "ode", "ods", "oes", "off", "oft", "ohm", "oho", "ohs", "oik", "oil", "ois",
    "oka", "oke", "old", "ole", "olm", "oms", "one", "ono", "ons", "ony", "oof",
    "ooh", "oom", "oon", "oop", "oor", "oos", "oot", "ope", "ops", "opt", "ora",
    "orb", "orc", "ord", "ore", "orf", "ors", "ort", "ose", "oud", "ouk", "oup",
    "our", "ous", "out", "ova", "owe", "owl", "own", "owt", "oxo", "oxy", "oye",
    "oys", "pac", "pad", "pah", "pal", "pam", "pan", "pap", "par", "pas", "pat",
    "pav", "paw", "pax", "pay", "pea", "pec", "ped", "pee", "peg", "peh", "pel",
    "pen", "pep", "per", "pes", "pet", "pew", "phi", "pho", "pht", "pia", "pic",
    "pie", "pig", "pin", "pip", "pir", "pis", "pit", "piu", "pix", "plu", "ply",
    "poa", "pod", "poh", "poi", "pol", "pom", "poo", "pop", "pos", "pot", "pow",
    "pox", "poz", "pre", "pro", "pry", "psi", "pst", "pub", "pud", "pug", "puh",
    "pul", "pun", "pup", "pur", "pus", "put", "puy", "pya", "pye", "pyx", "qat",
    "qis", "qua", "qin", "rad", "rag", "rah", "rai", "raj", "ram", "ran", "rap",
    "ras", "rat", "rav", "raw", "rax", "ray", "reb", "rec", "red", "ree", "ref",
    "reg", "reh", "rei", "rem", "ren", "reo", "rep", "res", "ret", "rev", "rew",
    "rex", "rez", "rho", "rhy", "ria", "rib", "rid", "rif", "rig", "rim", "rin",
    "rip", "rit", "riz", "rob", "roc", "rod", "roe", "rok", "rom", "roo", "rot",
    "row", "rub", "ruc", "rud", "rue", "rug", "rum", "run", "rut", "rya", "rye",
    "sab", "sac", "sad", "sae", "sag", "sai", "sal", "sam", "san", "sap", "sar",
    "sat", "sau", "sav", "saw", "sax", "say", "SAY", "saz", "sea", "sec", "sed",
    "see", "seg", "sei", "sel", "sen", "ser", "set", "sew", "sex", "sey", "sez",
    "sha", "she", "shh", "shy", "sib", "sic", "sif", "sik", "sim", "sin", "sip",
    "sir", "sis", "sit", "six", "ska", "ski", "sky", "sly", "sma", "sny", "sob",
    "soc", "sod", "sog", "soh", "sol", "som", "son", "sop", "sos", "sot", "sou",
    "sov", "sow", "sox", "soy", "soz", "spa", "spy", "sri", "sty", "sub", "sud",
    "sue", "sug", "sui", "suk", "sum", "sun", "sup", "suq", "sur", "sus", "swy",
    "sye", "syn", "tab", "tad", "tae", "tag", "tai", "taj", "tak", "tam", "tan",
    "tao", "tap", "tar", "tas", "tat", "tau", "tav", "taw", "tax", "tay", "tea",
    "tec", "ted", "tee", "tef", "teg", "tel", "ten", "tes", "tet", "tew", "tex",
    "the", "tho", "thy", "tic", "tid", "tie", "tig", "tik", "til", "tin", "tip",
    "tis", "tit", "tix", "toc", "tod", "toe", "tog", "tom", "ton", "too", "top",
    "tor", "tot", "tow", "toy", "try", "tsk", "tub", "tug", "tui", "tum", "tun",
    "tup", "tut", "tux", "twa", "two", "twp", "tye", "tyg", "udo", "uds", "uey",
    "ufo", "ugh", "ugs", "uke", "ule", "ulu", "umm", "ump", "ums", "umu", "uni",
    "uns", "upo", "ups", "urb", "urd", "ure", "urn", "urp", "use", "uta", "ute",
    "uts", "utu", "uva", "vac", "vae", "vag", "van", "var", "vas", "vat", "vau",
    "vav", "vaw", "vee", "veg", "vet", "vex", "via", "vid", "vie", "vig", "vim",
    "vin", "vis", "vly", "voe", "vol", "vor", "vow", "vox", "vug", "vum", "wab",
    "wad", "wae", "wag", "wai", "wan", "wap", "war", "was", "wat", "waw", "wax",
    "way", "web", "wed", "wee", "wem", "wen", "wet", "wex", "wey", "wha", "who",
    "why", "wig", "win", "wis", "wit", "wiz", "woe", "wof", "wog", "wok", "won",
    "woo", "wop", "wos", "wot", "wow", "wox", "wry", "wud", "wus", "wye", "wyn",
    "xis", "yad", "yae", "yag", "yah", "yak", "yam", "yap", "yar", "yaw", "yay",
    "yea", "yeh", "yen", "yep", "yes", "yet", "yew", "yex", "ygo", "yid", "yin",
    "yip", "yob", "yod", "yok", "yom", "yon", "you", "yow", "yug", "yuk", "yum",
    "yup", "yus", "zag", "zap", "zas", "zax", "zea", "zed", "zee", "zek", "zel",
    "zep", "zex", "zho", "zig", "zin", "zip", "zit", "ziz", "zoa", "zol", "zoo",
    "zos", "zuz", "zzz"];

//----------------------------------------------------------------
// MAIN : Deno script execution start
//----------------------------------------------------------------

if (import.meta.main) {
  // only returns if execCliArgs() did not find options to execute
  if (Deno.args.length > 0) await execCliArgs();
  // default execute action if no cli args given - offer some passwords
  console.log("\n'qpass' suggested passwords are:\n");
  for (let i: number = 0; i < 3; i++) {
    displayPasswords();
  }
}
