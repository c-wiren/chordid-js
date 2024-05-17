import * as chordId from "../src/chordid";
import assert from "assert";
import "mocha";

function testPrintAndScore(strings: string[], key: string, equals: string) {
    let notes = strings.map(x => chordId.noteNumberFromString(x));
    let chordInKey = chordId.convertNotesToChordInKey(notes, chordId.noteNumberFromString(key));
    let chordWithHighestScore = chordId.convertNotesToChords(notes)[0];
    console.log(chordInKey.toString() + ": " + chordInKey.Score + ", " + chordWithHighestScore.toString() + ": " + chordWithHighestScore.Score);
    it("chord detection for " + equals, () => { assert.equal(chordInKey.toString(), equals); });
    it("chord scoring for " + equals, () => { assert.equal(chordWithHighestScore.toString(), equals); });
}

describe('Testing detection and scoring of chords', function () {
    testPrintAndScore(["Bb2", "E3", "A3"], "C", "C 7/13");
    testPrintAndScore(["F#2", "G2", "B2", "D3"], "G", "G maj7");
    testPrintAndScore(["G2", "A2", "C3", "E3"], "A", "Am 7");
    testPrintAndScore(["C3", "E3", "G3", "A3"], "C", "C 6");
    testPrintAndScore(["C3", "E3", "A3"], "A", "Am");
    testPrintAndScore(["C3", "Eb3", "F#3", "A3"], "C", "Cdim 7");
    testPrintAndScore(["C3", "E3", "F#3"], "C", "C ♭5");
});