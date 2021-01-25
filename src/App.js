import './App.css';
import React, { Component, useState } from 'react';
import { chords, tonnetzMap } from './tonnetz'
import * as Tone from 'tone'

const synth = new Tone.PolySynth(Tone.Synth).toDestination();

const Triangle = ({ w = '200', h = '150', columnOffset = 0, direction = 'top', color = '#44a6e8', onMouseDown = null, onMouseUp = null, className="Triangle" }) => {
  const points = {
    top: [`${columnOffset + (w / 2)},0`, `${0 + columnOffset},${h}`, `${w + columnOffset},${h}`],
    //right: [`0,0`, `0,${h}`, `${w},${h / 2}`],
    bottom: [`${0 + columnOffset},0`, `${w + columnOffset},0`, `${columnOffset + (w / 2)},${h}`],
    //left: [`${w},0`, `${w},${h}`, `0,${h / 2}`],
  }

  return (
    <polygon points={points[direction].join(' ')} fill={color} onMouseLeave={onMouseUp} onMouseDown={onMouseDown} onMouseUp={onMouseUp} className={className}/>
  )
}

const Circle = ({ cx = "50", cy = "50", r = "40", fill = "white" }) => {
  return (
    <circle cx={cx} cy={cy} r={r} stroke="black" strokeWidth="3" fill={fill} />
  )
}

const MinorChord = ({ scale = 100, rowIndex = 0, columnOffset = 0, chord = chords().Fsm, className="MinorChord"}) => {
  const w = scale * 2
  const h = scale * 1.5
  const io = rowIndex + scale + columnOffset

  const [playing, setPlaying] = useState(false)
  const play = () => {
    if (!playing) {
      console.log("play")
      let now = Tone.now()
      setPlaying(true)
      chord.notePitchOctave().forEach(element => {
        synth.triggerAttack(element, now)
      })
    }
  }

  const release = () => {
    if (playing) {
      console.log("release")
      let now = Tone.now()
      setPlaying(false)
      chord.notePitchOctave().forEach(element => {
        synth.triggerRelease(element, now)
      })
    }
  }

  return (
    <Triangle w={w} h={h} columnOffset={io} direction='top' color='#606060' onMouseDown={play} onMouseUp={release} className={className} />

  )
}
const MajorChord = ({ scale = 100, rowIndex = 0, columnOffset = 0, chord = chords().Fsm, className="MajorChord" }) => {
  const w = scale * 2
  const h = scale * 1.5
  const io = rowIndex + columnOffset
  const [playing, setPlaying] = useState(false)
  const play = () => {
    if (!playing) {
      console.log("play")
      let now = Tone.now()
      setPlaying(true)
      chord.notePitchOctave().forEach(element => {
        synth.triggerAttack(element, now)
      })
    }
  }

  const release = () => {
    if (playing) {
      console.log("release")
      let now = Tone.now()
      setPlaying(false)
      chord.notePitchOctave().forEach(element => {
        synth.triggerRelease(element, now)
      })
    }
  }

  return (<Triangle w={w} h={h} columnOffset={io} direction='bottom' color='#c4c4c4' onMouseDown={play} onMouseUp={release} className={className} />
  )
}

const MinorChordCircles = ({ chord = chords().Fsm, scale = 100, rowIndex = 0, columnOffset = 0 }) => {

  const w = scale * 2
  const h = scale * 1.5
  const notes = chord.noteNames()

  const fill = note => note.slice(-1) === '#' ? "black" : "white"
  return [
    <Circle cx={w + rowIndex + scale + columnOffset} cy={h} fill={fill(notes[2])} />, //right
    <Circle cx={w + rowIndex + columnOffset} cy={0} fill={fill(notes[1])} />, //top
    <Circle cx={columnOffset + scale} cy={h} fill={fill(notes[0])} /> //left
  ]
}

const MajorChordCircles = ({ chord = chords().Fs, scale = 100, rowIndex = 0, columnOffset = 0 }) => {

  const w = scale * 2
  const h = scale * 1.5
  const notes = chord.noteNames()

  const fill = note => note.slice(-1) === '#' ? "black" : "white"
  return [
    <Circle cx={0 + rowIndex + columnOffset} cy={0} fill={fill(notes[0])} />,
    <Circle cx={w + rowIndex + columnOffset} cy={0} />,
    <Circle cx={columnOffset + scale} cy={h} />
  ]

}

const MinorChordText = ({ scale = 100, rowIndex = 0, columnOffset = 0, chord = chords().Fsm }) => {

  const w = scale * 2
  const h = scale * 1.5
  const notes = chord.noteNames()
  const fill = note => note.slice(-1) === '#' ? "white" : "black"
  return [
    <text x={w + rowIndex + columnOffset} y={0} textAnchor="middle" className="noteText" fill={fill(notes[1])}>{notes[1]}</text>,
    <text x={columnOffset + scale + rowIndex} y={h} textAnchor="middle" className="noteText" fill={fill(notes[0])}>{notes[0]}</text>,
    <text x={w + rowIndex + scale + columnOffset} y={h} textAnchor="middle" className="noteText" fill={fill(notes[2])}>{notes[2]}</text>,
  ]
}

const MajorChordText = ({ scale = 100, rowIndex = 0, columnOffset = 0, chord = chords().Fs }) => {

  const w = scale * 2
  const h = scale * 1.5
  const notes = chord.noteNames()
  const fill = note => note.slice(-1) === '#' ? "white" : "black"
  return [
    <text x={rowIndex + columnOffset} y={0} textAnchor="middle" className="noteText" fill={fill(notes[0])}>{notes[0]}</text>,
    <text x={w + rowIndex + columnOffset} y={0} textAnchor="middle" className="noteText" fill={fill(notes[2])}>{notes[2]}</text>,
    <text x={columnOffset + scale + rowIndex} y={h} textAnchor="middle" className="noteText" fill={fill(notes[1])}>{notes[1]}</text>
  ]

}


const TriangleRow = ({ scale = 100, columnOffset = 0, chord = chords().Fs }) => {
  const majorParts = []
  const minorParts = []


  let rowIndex = 0

  for (let j = 0; j < 8; j++) {
    if (chord.isMinor()) {
      minorParts.push({ chord: chord, rowIndex: rowIndex })
      chord = chord.r()
      rowIndex += scale * 2
    } else if (chord.isMajor()) {
      majorParts.push({ chord: chord, rowIndex: rowIndex })
      chord = chord.l()
    }
  }


  const w = scale * 2 * 10
  const h = scale * 1.5
  const viewBox = `0 0 ${w} ${h}`
  return (
    <div className="TriangleRow">
      <svg width={w} height={h} viewBox={viewBox} className="RowElems">
        {majorParts.map(x => <MajorChord chord={x.chord} rowIndex={x.rowIndex} columnOffset={columnOffset} />)}
        {minorParts.map(x => <MinorChord chord={x.chord} rowIndex={x.rowIndex} columnOffset={columnOffset} />)}
        {majorParts.map(x => <MajorChordCircles chord={x.chord} rowIndex={x.rowIndex} columnOffset={columnOffset} />)}
        {minorParts.map(x => <MinorChordCircles chord={x.chord} rowIndex={x.rowIndex} columnOffset={columnOffset} />)}
        {majorParts.map(x => <MajorChordText chord={x.chord} rowIndex={x.rowIndex} columnOffset={columnOffset} />)}
        {minorParts.map(x => <MinorChordText chord={x.chord} rowIndex={x.rowIndex} columnOffset={columnOffset} />)}
      </svg>
    </div>
  )
}

const Tonnetz = () => {
  const scale = 100
  const rows = []
  let chord = chords().Fs

  for (let i = 0; i < 3; i++) {
    rows.push({ chord: chord, columnOffset: scale * i })
    chord = chord.l().p()
  }
  return (
    <div>
      {rows.map(x => <TriangleRow chord={x.chord} columnOffset={x.columnOffset} />)}
    </div>
  )
}

const App = () => {
  return (
    <div id="div1">
      <div id="div2">
        <Tonnetz />
      </div>
    </div>
  )
}

export default App;
