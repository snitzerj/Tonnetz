const Qualities = {
    "Major": [0, 4, 7],
    "Minor": [0, 3, 7]
}


const noteNames = ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"]
class Chord {
    constructor(degree, quality) {
        this.quality = quality
        this.value = this.quality.map(n => (n + degree) % 12)
        this.name = `${noteNames[this.value[0]]}${this.quality[1] === 3 ? "m" : ""}`
    }

    isMajor = () => this.quality[1] === 4

    isMinor = () => this.quality[1] === 3

    oppositeQuality = () => this.isMajor() ? Qualities.Minor : Qualities.Major

    p = () => new Chord(this.value[0], this.oppositeQuality())

    l = () => {
        if (this.isMajor()) {
            return new Chord(this.value[0] + 4, this.oppositeQuality())
        } else {
            return new Chord(this.value[0] + 8, this.oppositeQuality())
        }
    }

    r = () => {
        if (this.isMajor()) {
            return new Chord(this.value[0] + 9, this.oppositeQuality())
        } else {
            return new Chord(this.value[0] + 3, this.oppositeQuality())
        }
    }

    noteNames = () => {
        return this.value.map(v => noteNames[v].replace("s", "#"))
    }

    notePitchOctave = () => {
        return this.noteNames().map(v => `${v}4`)
    }


}

export const chords = () => {
    let chords = {}

    for (let i = 0; i < 12; i++) {
        let major = new Chord(i, Qualities.Major)
        let minor = new Chord(i, Qualities.Minor)

        chords[major.name] = major
        chords[minor.name] = minor
    }

    return chords
}

export const tonnetzMap = () => {
    let tonnetzBuilder = {}
    for (let chordName in chords) {
        let chord = chords[chordName]
        tonnetzBuilder[chord.name] = { p: chord.p(), l: chord.l(), r: chord.r() }
    }

    return tonnetzBuilder
}




