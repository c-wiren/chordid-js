const noteNames = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"];

enum ChordType {
  Major,
  Minor,
  Sus2,
  Sus4,
  No3,
  Dim,
  Aug,
  _5
}

export class Chord {
  Root: number;
  HasRoot: boolean;
  Type: ChordType;
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
  b5: boolean;
  Score: number;

  constructor(root: number) {
    this.Root = root;
    this.HasRoot = false;
    this.Type = ChordType.Major;
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
    this.b5 = false;
  }

  toString() {
    let text = "";
    text += noteNames[this.Root];
    switch (this.Type) {
      case ChordType.Dim: text += "dim"; break;
      case ChordType.Aug: text += "aug"; break;
      case ChordType.Minor: text += "m"; break;
      case ChordType._5: text += "5"; break;
      case ChordType.No3: text += "no3"; break;
    }

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
    if (this.b5) {
      if (type.length) type += "/";
      type += "♭5";
    }
    if (type.length) {
      text += " " + type;
    }

    switch (this.Type) {
      case ChordType.Sus2: text += " sus2"; break;
      case ChordType.Sus4: text += " sus4"; break;
    }

    return text;
  }
  static fromRawChord(rawChord: number[], root: number) {
    let chord = new Chord(root);
    if (rawChord[0]) chord.HasRoot = true;
    if (rawChord[4]) {
      chord.Type = ChordType.Major;
    } else if (rawChord[3]) {
      chord.Type = ChordType.Minor;
    } else {
      if (rawChord[7]) {
        if (rawChord[5]) {
          chord.Type = ChordType.Sus4;
        } else if (rawChord[2]) {
          chord.Type = ChordType.Sus2;
        } else {
          chord.Type = ChordType._5;
        }
      } else {
        chord.Type = ChordType.No3;
      }
    }

    if (rawChord[10]) chord._7 = true;
    if (rawChord[11]) chord.Maj7 = true;

    if (rawChord[1]) chord.b9 = true;
    if (rawChord[2] && chord.Type != ChordType.Sus2) chord._9 = true;
    if (rawChord[3] && chord.Type == ChordType.Major) chord.s9 = true;
    if (rawChord[5] && chord.Type != ChordType.Sus4) chord._11 = true;
    if (rawChord[6]) {
      if (chord.Type == ChordType.Minor && !rawChord[7] && !chord._7) {
        chord.Type = ChordType.Dim;
      } else {
        if (rawChord[7]) {
          chord.s11 = true;
        } else {
          chord.b5 = true;
        }
      }
    }
    if (rawChord[8]) {
      if (chord.Type == ChordType.Major && !rawChord[7]) {
        chord.Type = ChordType.Aug;
      } else {
        chord.b13 = true;
      }
    }
    if (rawChord[9]) {
      if (chord.Type == ChordType.Dim) {
        chord._7 = true;
      } else if (chord._7 || chord.Maj7) {
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
    if (chord.HasRoot || chord.Type != ChordType.No3) score += 10;
    score -= Number(chord._7);
    score -= 2 * Number(chord.Maj7) + Number(chord._6);
    score -= 3 * (Number(chord._9) + Number(chord._11) + Number(chord._13));
    score -= 4 * (Number(chord.b9) + Number(chord.s9) + Number(chord.s11) + Number(chord.b13) + Number(chord.b5));
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