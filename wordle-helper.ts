#!/usr/bin/env deno run --allow-read

interface Box   { notChars: Set<string>; char?: string }

function cloneBox(box: Box): Box { return { notChars: new Set(box.notChars), char: box.char }}
function isSolvedBox(box: Box): boolean { return box.char !== undefined }

const BOX_INDEX = [ 0, 1, 2, 3, 4]
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase()
if (ALPHABET.length != 26) console.log(`woops, ALPHABET ain't right!`)

interface ParsedLine { guess: string[]; response: string[] }
const Lines: ParsedLine[] = []

function analyze(lines: ParsedLine[]): void {
  console.log('----------------------------------------------------------')
  const wrongLocationLetters: Set<string> = new Set()
  const availableLetters                  = new Set(ALPHABET.split(''))
  const notAvailableLetters: Set<string>  = new Set()
  const boxes: Box[] = BOX_INDEX.map(() => { return { notChars: new Set<string>() } })
  
  for (const line of lines) {
    printLine(line)

    const { guess, response } = line

    for (const i of BOX_INDEX) {
      const charG = guess[i]
      const charR = response[i]

      switch (charR) {
        case R_NO:
          if (availableLetters.has(charG)) {
            availableLetters.delete(charG)
            notAvailableLetters.add(charG)
          }
          break

        case R_GR:
          boxes[i].char = charG
          break

        case R_YE:
          boxes[i].notChars.add(charG)
          wrongLocationLetters.add(charG)
          break

        default: 
          console.log(`wops; unexpected response char ${charR}`)
          Deno.exit(1)
      }
    }
  }

  console.log()
  console.log(`  available letters:      ${Array.from(availableLetters).join(' ')}`)
  console.log(`  unavailable letters:    ${Array.from(notAvailableLetters).join(' ')}`)
  console.log(`  wrong location letters: ${Array.from(wrongLocationLetters).join(' ')}`)
  console.log()

  let solved = 0
  const wlLettersLeft = new Set(wrongLocationLetters)

  for (const i of BOX_INDEX) {
    const box = boxes[i]
    const name = `box ${i}`
    if (isSolvedBox(box)) {
      console.log(`  ${name}: solved: ${box.char}`)
      solved++
      wlLettersLeft.delete(box.char!)
    } else {
      console.log(`  ${name}: not:    ${Array.from(box.notChars).join(' ')}`)
    }
  }

  const combos = new Set<string>()
  generateCombos(boxes, wlLettersLeft, combos)

  const maxEmpty = boxes.length - solved - wlLettersLeft.size

  console.log('')
  console.log('possibilities:')
  for (const combo of combos) {
    if (emptySpaces(combo) > maxEmpty) continue
    console.log(`  ${combo}`)
  }
  console.log('')
}

function emptySpaces(guess: string): number {
  let result = 0

  for (const char of guess.trim().split('')) {
    if (char === '_') result++
  }
  
  return result
}

function wordFromBoxes(boxes: Box[]): string {
  let result = ''
  for (const box of boxes) {
    result += (isSolvedBox(box) ? box.char : '_')
  }
  return result
}

function generateCombos(boxes: Box[], wlLetters: Set<string>, combos: Set<string>) {
  // console.log(`generateCombos(${wordFromBoxes(boxes)}, ${Array.from(wlLetters)}, ${Array.from(combos).join('/')})`)

  combos.add(wordFromBoxes(boxes)); 

  for (const i of BOX_INDEX) {
    const box = boxes[i]
    if (isSolvedBox(box)) continue
    // console.log(`  processing box   ${i}`)

    for (const wlLetter of wlLetters) {
      // console.log(`  processing letter ${wlLetter}`)
      if (box.notChars.has(wlLetter)) continue

      const newBoxes = boxes.map(box => cloneBox(box))
      const newWlLetters = new Set(wlLetters)
    
      newBoxes[i].char = wlLetter
      newWlLetters.delete(wlLetter)
      generateCombos(newBoxes, newWlLetters, combos)
    }
  }
}

function printLine(line: ParsedLine) {
  console.log(`${line.guess.join(' ')}   ${line.response.join(' ')}`)
}

function onInput(line: string): void {
  const parsed = parseLine(line.trim().toUpperCase())
  if (!parsed) return

  const { guess, response } = parsed

  Lines.push({ guess, response })
  analyze(Lines)
}

interface ParsedLine { guess: string[]; response: string[] }

function parseLine(line: string): undefined | ParsedLine {
  const words = line.split(/\s+/g)
  if (words.length != 2) {
    console.log('you must enter two 5 character strings separated by a space')
    return
  }

  for (const word of words) {
    if (word.length != 5) {
      console.log('you must enter two strings separated by a space, each 5 character long')
      return
    }
  }

  const guess = parseGuess(words[0].split(''))
  const response = parseResponse(words[1].split(''))

  if (guess.length == 0) return
  if (response.length == 0) return

  return { guess, response }
}

const CHARCODE_A = 'A'.charCodeAt(0)
const CHARCODE_Z = 'Z'.charCodeAt(0)

function parseGuess(chars: string[]): string[] {
  for (const char of chars) {
    const code = char.charCodeAt(0)
    if (code < CHARCODE_A || code > CHARCODE_Z) {
      console.log(`invalid character in guess: ${char}`)
      return []
    }
  }
  
  return chars
}

const R_NO = '-'
const R_GR = 'G'
const R_YE = 'Y'

const RESPONSE_SET = new Set([R_NO, R_GR, R_YE])

function parseResponse(chars: string[]): string[] {
  for (const char of chars) {
    if (!RESPONSE_SET.has(char)) {
      console.log(`invalid character in response: ${char}`)
      return []
    }
  }
  return chars
}

async function startCLI() {
  // read from file, if file name passed in
  const [ fileName ] = Deno.args
  if (fileName) {
    const data = await Deno.readTextFile(fileName)
    const lines = data.split('\n')
    for (const line of lines) { 
      if (!line) continue
      onInput(line)
    }
    return
  }

  // read from console
  while (true) {
    const line = prompt('guess and response> ')
    if (!line) continue

    onInput(line)
  }
}

startCLI()
