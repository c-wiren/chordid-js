const noteNames = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"];

export class Chord {
  Root: number;
  HasRoot: boolean;
  Major: boolean;
  Minor: boolean;
  sus2: boolean;
  sus4: boolean;
  no3: boolean;
  dim: boolean;
  aug: boolean;
  _5: boolean;
  _6: boolean;
  _7: boolean;
  Maj7: boolean;
  _9: boolean;
  _11: boolean;
  _13: boolean;
  b9: boolean;
  s9: boolean;
  s11: boolean;
  b13: boolean;
  Score: number;

  constructor(root: number) {
    this.Root = root;
    this.HasRoot = false;
    this.Major = false;
    this.Minor = false;
    this.sus2 = false;
    this.sus4 = false;
    this.no3 = false;
    this.dim = false;
    this.aug = false;
    this._5 = false;
    this._6 = false;
    this._7 = false;
    this.Maj7 = false;
    this._9 = false;
    this._11 = false;
    this._13 = false;
    this.b9 = false;
    this.s9 = false;
    this.s11 = false;
    this.b13 = false;
  }

  toString() {
    let text = "";
    text += noteNames[this.Root];
    if (this.dim)
      text += "dim";
    else if (this.aug)
      text += "aug";
    else if (this.Minor)
      text += "m";
    else if (this._5)
      text += "5";
    else if (this.no3)
      text += "no3";

    let type = "";
    if (this._6) {
      type += "6";
    }
    if (this._7) {
      if (type.length) type += "/";
      type += "7";
    }
    if (this.Maj7) {
      if (type.length) type += "/";
      type += "maj7";
    }
    if (this.b9) {
      if (type.length) type += "/";
      type += "♭9";
    }
    if (this._9) {
      if (type.length) type += "/";
      type += "9";
    }
    if (this.s9) {
      if (type.length) type += "/";
      type += "♯9";
    }
    if (this._11) {
      if (type.length) type += "/";
      type += "11";
    }
    if (this.s11) {
      if (type.length) type += "/";
      type += "♯11";
    }
    if (this.b13) {
      if (type.length) type += "/";
      type += "♭13";
    }
    if (this._13) {
      if (type.length) type += "/";
      type += "13";
    }
    if (type.length) {
      text += " " + type;
    }

    if (this.sus2) text += " sus2";
    if (this.sus4) text += " sus4";

    return text;
  }
  static fromRawChord(rawChord: number[], root: number) {
    let chord = new Chord(root);
    if (rawChord[0]) chord.HasRoot = true;
    if (rawChord[4]) {
      chord.Major = true;
    } else if (rawChord[3]) {
      chord.Minor = true;
    } else {
      if (rawChord[7]) {
        if (rawChord[5]) {
          chord.sus4 = true;
        } else if (rawChord[2]) {
          chord.sus2 = true;
        } else {
          chord._5 = true;
        }
      } else {
        chord.no3 = true;
      }
    }

    if (rawChord[10]) chord._7 = true;
    if (rawChord[11]) chord.Maj7 = true;

    if (rawChord[1]) chord.b9 = true;
    if (rawChord[2] && !chord.sus2) chord._9 = true;
    if (rawChord[3] && chord.Major) chord.s9 = true;
    if (rawChord[5] && !chord.sus4) chord._11 = true;
    if (rawChord[6]) {
      if (chord.Minor && !rawChord[7]) {
        chord.dim = true;
      } else {
        chord.s11 = true;
      }
    }
    if (rawChord[8]) {
      if (chord.Major && !rawChord[7]) {
        chord.aug = true;
      } else {
        chord.b13 = true;
      }
    }
    if (rawChord[9]) {
      if (chord._7 || chord.Maj7) {
        chord._13 = true;
      } else {
        chord._6 = true;
      }
    }

    chord.Score = this.calculateProbability(chord);

    return chord;
  }

  static calculateProbability(chord: Chord) {
    let score = 0;
    if (chord.HasRoot) score += 1;
    if (chord.HasRoot || !chord.no3) score += 10;
    score -= Number(chord._7);
    score -= 2 * Number(chord.Maj7) + Number(chord._6);
    score -= 3 * (Number(chord._9) + Number(chord._11) + Number(chord._13));
    score -= 4 * (Number(chord.b9) + Number(chord.s9) + Number(chord.s11) + Number(chord.b13));
    return score;
  }
}

export function noteNumberFromString(string: string) {
  if (string.length < 1) throw "Invalid note";
  let note;
  switch (string[0]) {
    case 'C':
      note = 0;
      break;
    case 'D':
      note = 2;
      break;
    case 'E':
      note = 4;
      break;
    case 'F':
      note = 5;
      break;
    case 'G':
      note = 7;
      break;
    case 'A':
      note = 9;
      break;
    case 'H':
    case 'B':
      note = 11;
      break;
    default:
      throw "Invalid note base";
  }
  let i = 1;
  for (; i < string.length; i++) {
    if (string[i] == '#')
      note++;
    else if (string[i] == 'b')
      note--;
    else
      break;
  }
  note += 12 * (1 + parseInt(string.substr(i)));
  return note;
}

function convertNotesToRawChord(notes: number[]) {
  let rawChord = new Array(12).fill(0);
  for (let note of notes) {
    rawChord[note % 12]++;
  }
  return rawChord;
}

export function convertNotesToChords(notes: number[]) {
  let rawChord = convertNotesToRawChord(notes);
  let chords: Chord[] = [];
  for (let i = 0; i < 12; i++) {
    chords.push(Chord.fromRawChord(rawChord, i));
    rawChord.push(rawChord.shift());
  }

  chords.sort((a, b) => b.Score - a.Score);

  return chords;
}