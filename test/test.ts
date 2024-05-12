import * as chordId from "../src/chordid";
import assert from "assert";
import "mocha";


function convert(strings) {
    let notes = strings.map(x => chordId.noteNumberFromString(x));
    return chordId.convertNotesToChords(notes)[0].toString();
}

describe('Test score', function () {
    it("C713", () => { assert.equal(convert(["Bb2", "E3", "A3"]), "C 7/13"); });
    it("Gmaj7", () => { assert.equal(convert(["F#2", "G2", "B2", "D3"]), "G maj7"); });
    it("Am7", () => { assert.equal(convert(["G2", "A2", "C3", "E3"]), "Am 7"); });
    it("Am7", () => { assert.equal(convert(["C3", "E3", "G3", "A3"]), "C 6"); });
    it("Am", () => { assert.equal(convert(["C3", "E3", "A3"]), "Am"); });
});