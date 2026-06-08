import type { InstrumentType, VelocityConfig } from './types'
import { NOTE_NAMES, A4_FREQUENCY, A4_MIDI } from './types'

export function noteToFrequency(note: string): number {
  const match = note.match(/^([A-G]#?)(-?\d+)$/)
  if (!match) {
    throw new Error(`Invalid note format: ${note}. Expected format like 'C4', 'A#4', 'B3'`)
  }
  const [, noteName, octaveStr] = match
  const octave = parseInt(octaveStr, 10)
  const noteIndex = NOTE_NAMES.indexOf(noteName)
  if (noteIndex === -1) {
    throw new Error(`Invalid note name: ${noteName}`)
  }
  const midiNote = noteIndex + (octave + 1) * 12
  const semitonesFromA4 = midiNote - A4_MIDI
  return A4_FREQUENCY * Math.pow(2, semitonesFromA4 / 12)
}

function applyEnvelope(
  gainNode: GainNode,
  startTime: number,
  duration: number,
  velocityConfig: VelocityConfig,
  baseGain: number
): void {
  const { attack, release } = velocityConfig
  const peakGain = baseGain * velocityConfig.gain
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack)
  gainNode.gain.setValueAtTime(peakGain, startTime + duration - release)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
}

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const bufferSize = Math.floor(ctx.sampleRate * duration)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

export function playPiano(
  ctx: AudioContext,
  destination: AudioNode,
  frequency: number,
  startTime: number,
  duration: number,
  velocityConfig: VelocityConfig
): void {
  const gainNode = ctx.createGain()
  gainNode.connect(destination)
  applyEnvelope(gainNode, startTime, duration, velocityConfig, 0.5)

  const oscillator1 = ctx.createOscillator()
  oscillator1.type = 'sine'
  oscillator1.frequency.setValueAtTime(frequency, startTime)
  oscillator1.connect(gainNode)

  const osc2Gain = ctx.createGain()
  osc2Gain.gain.value = 0.3 * velocityConfig.brightness
  osc2Gain.connect(gainNode)
  const oscillator2 = ctx.createOscillator()
  oscillator2.type = 'sine'
  oscillator2.frequency.setValueAtTime(frequency * 2, startTime)
  oscillator2.connect(osc2Gain)

  const osc3Gain = ctx.createGain()
  osc3Gain.gain.value = 0.15 * velocityConfig.brightness
  osc3Gain.connect(gainNode)
  const oscillator3 = ctx.createOscillator()
  oscillator3.type = 'sine'
  oscillator3.frequency.setValueAtTime(frequency * 3, startTime)
  oscillator3.connect(osc3Gain)

  oscillator1.start(startTime)
  oscillator2.start(startTime)
  oscillator3.start(startTime)
  oscillator1.stop(startTime + duration)
  oscillator2.stop(startTime + duration)
  oscillator3.stop(startTime + duration)
}

export function playViolin(
  ctx: AudioContext,
  destination: AudioNode,
  frequency: number,
  startTime: number,
  duration: number,
  velocityConfig: VelocityConfig
): void {
  const gainNode = ctx.createGain()
  gainNode.connect(destination)
  applyEnvelope(gainNode, startTime, duration, velocityConfig, 0.4)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(frequency * 3 * velocityConfig.brightness, startTime)
  filter.Q.value = 2
  filter.connect(gainNode)

  const oscillator = ctx.createOscillator()
  oscillator.type = 'sawtooth'
  oscillator.frequency.setValueAtTime(frequency, startTime)
  oscillator.connect(filter)

  const vibratoOsc = ctx.createOscillator()
  vibratoOsc.frequency.value = 5
  const vibratoGain = ctx.createGain()
  vibratoGain.gain.value = frequency * 0.01
  vibratoOsc.connect(vibratoGain)
  vibratoGain.connect(oscillator.frequency)

  oscillator.start(startTime)
  vibratoOsc.start(startTime)
  oscillator.stop(startTime + duration)
  vibratoOsc.stop(startTime + duration)
}

export function playGuitar(
  ctx: AudioContext,
  destination: AudioNode,
  frequency: number,
  startTime: number,
  duration: number,
  velocityConfig: VelocityConfig
): void {
  const gainNode = ctx.createGain()
  gainNode.connect(destination)
  const { attack, release } = velocityConfig
  const peakGain = 0.5 * velocityConfig.gain
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack)
  gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.7, startTime + 0.05)
  gainNode.gain.setValueAtTime(peakGain * 0.5, startTime + duration - release)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(frequency * 4 * velocityConfig.brightness, startTime)
  filter.connect(gainNode)

  const oscillator = ctx.createOscillator()
  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(frequency, startTime)
  oscillator.connect(filter)

  const osc2Gain = ctx.createGain()
  osc2Gain.gain.value = 0.2
  osc2Gain.connect(filter)
  const oscillator2 = ctx.createOscillator()
  oscillator2.type = 'sine'
  oscillator2.frequency.setValueAtTime(frequency * 2, startTime)
  oscillator2.connect(osc2Gain)

  const noiseBuffer = createNoiseBuffer(ctx, 0.02)
  const noiseSource = ctx.createBufferSource()
  noiseSource.buffer = noiseBuffer
  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.1 * velocityConfig.gain
  noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.02)
  noiseSource.connect(noiseGain)
  noiseGain.connect(filter)

  oscillator.start(startTime)
  oscillator2.start(startTime)
  noiseSource.start(startTime)
  oscillator.stop(startTime + duration)
  oscillator2.stop(startTime + duration)
}

export function playFlute(
  ctx: AudioContext,
  destination: AudioNode,
  frequency: number,
  startTime: number,
  duration: number,
  velocityConfig: VelocityConfig
): void {
  const gainNode = ctx.createGain()
  gainNode.connect(destination)
  const { attack, release } = velocityConfig
  const peakGain = 0.45 * velocityConfig.gain
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack)
  gainNode.gain.setValueAtTime(peakGain, startTime + duration - release)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  const oscillator = ctx.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, startTime)
  oscillator.connect(gainNode)

  const osc2Gain = ctx.createGain()
  osc2Gain.gain.value = 0.15 * velocityConfig.brightness
  osc2Gain.connect(gainNode)
  const oscillator2 = ctx.createOscillator()
  oscillator2.type = 'sine'
  oscillator2.frequency.setValueAtTime(frequency * 2, startTime)
  oscillator2.connect(osc2Gain)

  const noiseBuffer = createNoiseBuffer(ctx, duration)
  const noiseSource = ctx.createBufferSource()
  noiseSource.buffer = noiseBuffer
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.value = frequency * 1.5
  noiseFilter.Q.value = 0.5
  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.05 * velocityConfig.gain
  noiseSource.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(gainNode)

  const vibratoOsc = ctx.createOscillator()
  vibratoOsc.frequency.value = 6
  const vibratoGain = ctx.createGain()
  vibratoGain.gain.value = frequency * 0.005
  vibratoOsc.connect(vibratoGain)
  vibratoGain.connect(oscillator.frequency)

  oscillator.start(startTime)
  oscillator2.start(startTime)
  noiseSource.start(startTime)
  vibratoOsc.start(startTime)
  oscillator.stop(startTime + duration)
  oscillator2.stop(startTime + duration)
  noiseSource.stop(startTime + duration)
  vibratoOsc.stop(startTime + duration)
}

export function playTrumpet(
  ctx: AudioContext,
  destination: AudioNode,
  frequency: number,
  startTime: number,
  duration: number,
  velocityConfig: VelocityConfig
): void {
  const gainNode = ctx.createGain()
  gainNode.connect(destination)
  const { attack, release } = velocityConfig
  const peakGain = 0.5 * velocityConfig.gain
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack)
  gainNode.gain.setValueAtTime(peakGain, startTime + duration - release)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(frequency * 5 * velocityConfig.brightness, startTime)
  filter.connect(gainNode)

  const oscillator = ctx.createOscillator()
  oscillator.type = 'square'
  oscillator.frequency.setValueAtTime(frequency, startTime)
  oscillator.connect(filter)

  const osc2Gain = ctx.createGain()
  osc2Gain.gain.value = 0.5 * velocityConfig.brightness
  osc2Gain.connect(filter)
  const oscillator2 = ctx.createOscillator()
  oscillator2.type = 'square'
  oscillator2.frequency.setValueAtTime(frequency * 2, startTime)
  oscillator2.connect(osc2Gain)

  const osc3Gain = ctx.createGain()
  osc3Gain.gain.value = 0.25 * velocityConfig.brightness
  osc3Gain.connect(filter)
  const oscillator3 = ctx.createOscillator()
  oscillator3.type = 'square'
  oscillator3.frequency.setValueAtTime(frequency * 3, startTime)
  oscillator3.connect(osc3Gain)

  oscillator.start(startTime)
  oscillator2.start(startTime)
  oscillator3.start(startTime)
  oscillator.stop(startTime + duration)
  oscillator2.stop(startTime + duration)
  oscillator3.stop(startTime + duration)
}

export function playSynth(
  ctx: AudioContext,
  destination: AudioNode,
  frequency: number,
  startTime: number,
  duration: number,
  velocityConfig: VelocityConfig
): void {
  const gainNode = ctx.createGain()
  gainNode.connect(destination)
  applyEnvelope(gainNode, startTime, duration, velocityConfig, 0.4)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(frequency * 6 * velocityConfig.brightness, startTime)
  filter.Q.value = 3
  filter.connect(gainNode)

  const osc1 = ctx.createOscillator()
  osc1.type = 'sawtooth'
  osc1.frequency.setValueAtTime(frequency, startTime)
  osc1.connect(filter)

  const osc2 = ctx.createOscillator()
  osc2.type = 'square'
  osc2.frequency.setValueAtTime(frequency * 1.005, startTime)
  osc2.connect(filter)

  const lfo = ctx.createOscillator()
  lfo.frequency.value = 4
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = frequency * 0.1
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)

  osc1.start(startTime)
  osc2.start(startTime)
  lfo.start(startTime)
  osc1.stop(startTime + duration)
  osc2.stop(startTime + duration)
  lfo.stop(startTime + duration)
}

const instrumentPlayers: Record<InstrumentType, typeof playPiano> = {
  piano: playPiano,
  violin: playViolin,
  guitar: playGuitar,
  flute: playFlute,
  trumpet: playTrumpet,
  synth: playSynth,
}

export function playInstrument(
  ctx: AudioContext,
  destination: AudioNode,
  instrument: InstrumentType,
  frequency: number,
  startTime: number,
  duration: number,
  velocityConfig: VelocityConfig
): void {
  const player = instrumentPlayers[instrument]
  if (!player) {
    throw new Error(`Unknown instrument: ${instrument}`)
  }
  player(ctx, destination, frequency, startTime, duration, velocityConfig)
}
