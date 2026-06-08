import type { DrumType, VelocityConfig } from './types'

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const bufferSize = Math.floor(ctx.sampleRate * duration)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

export function playKick(
  ctx: AudioContext,
  destination: AudioNode,
  startTime: number,
  velocityConfig: VelocityConfig
): void {
  const gainNode = ctx.createGain()
  gainNode.connect(destination)
  const peakGain = 0.9 * velocityConfig.gain
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.005)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3)

  const oscillator = ctx.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(150, startTime)
  oscillator.frequency.exponentialRampToValueAtTime(40, startTime + 0.15)
  oscillator.connect(gainNode)

  const clickGain = ctx.createGain()
  clickGain.gain.value = 0.3 * velocityConfig.gain
  clickGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.02)
  clickGain.connect(gainNode)
  const clickOsc = ctx.createOscillator()
  clickOsc.type = 'sine'
  clickOsc.frequency.value = 1000
  clickOsc.connect(clickGain)

  oscillator.start(startTime)
  clickOsc.start(startTime)
  oscillator.stop(startTime + 0.3)
  clickOsc.stop(startTime + 0.02)
}

export function playSnare(
  ctx: AudioContext,
  destination: AudioNode,
  startTime: number,
  velocityConfig: VelocityConfig
): void {
  const gainNode = ctx.createGain()
  gainNode.connect(destination)
  const peakGain = 0.7 * velocityConfig.gain
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.005)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2)

  const noiseBuffer = createNoiseBuffer(ctx, 0.2)
  const noiseSource = ctx.createBufferSource()
  noiseSource.buffer = noiseBuffer
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'highpass'
  noiseFilter.frequency.value = 1000 * velocityConfig.brightness
  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.6
  noiseSource.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(gainNode)

  const oscGain = ctx.createGain()
  oscGain.gain.value = 0.5 * velocityConfig.gain
  oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1)
  oscGain.connect(gainNode)
  const oscillator = ctx.createOscillator()
  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(200, startTime)
  oscillator.frequency.exponentialRampToValueAtTime(100, startTime + 0.1)
  oscillator.connect(oscGain)

  noiseSource.start(startTime)
  oscillator.start(startTime)
  noiseSource.stop(startTime + 0.2)
  oscillator.stop(startTime + 0.1)
}

export function playHihat(
  ctx: AudioContext,
  destination: AudioNode,
  startTime: number,
  velocityConfig: VelocityConfig
): void {
  const gainNode = ctx.createGain()
  gainNode.connect(destination)
  const peakGain = 0.5 * velocityConfig.gain
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.002)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08)

  const noiseBuffer = createNoiseBuffer(ctx, 0.1)
  const noiseSource = ctx.createBufferSource()
  noiseSource.buffer = noiseBuffer

  const filter1 = ctx.createBiquadFilter()
  filter1.type = 'highpass'
  filter1.frequency.value = 5000 * velocityConfig.brightness

  const filter2 = ctx.createBiquadFilter()
  filter2.type = 'bandpass'
  filter2.frequency.value = 8000
  filter2.Q.value = 1

  noiseSource.connect(filter1)
  filter1.connect(filter2)
  filter2.connect(gainNode)

  noiseSource.start(startTime)
  noiseSource.stop(startTime + 0.1)
}

export function playTom(
  ctx: AudioContext,
  destination: AudioNode,
  startTime: number,
  velocityConfig: VelocityConfig
): void {
  const gainNode = ctx.createGain()
  gainNode.connect(destination)
  const peakGain = 0.6 * velocityConfig.gain
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.005)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4)

  const oscillator = ctx.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(250, startTime)
  oscillator.frequency.exponentialRampToValueAtTime(80, startTime + 0.25)
  oscillator.connect(gainNode)

  const osc2Gain = ctx.createGain()
  osc2Gain.gain.value = 0.3
  osc2Gain.connect(gainNode)
  const oscillator2 = ctx.createOscillator()
  oscillator2.type = 'triangle'
  oscillator2.frequency.setValueAtTime(500, startTime)
  oscillator2.frequency.exponentialRampToValueAtTime(160, startTime + 0.25)
  oscillator2.connect(osc2Gain)

  oscillator.start(startTime)
  oscillator2.start(startTime)
  oscillator.stop(startTime + 0.4)
  oscillator2.stop(startTime + 0.4)
}

export function playRide(
  ctx: AudioContext,
  destination: AudioNode,
  startTime: number,
  velocityConfig: VelocityConfig
): void {
  const gainNode = ctx.createGain()
  gainNode.connect(destination)
  const peakGain = 0.5 * velocityConfig.gain
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.003)
  gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.3, startTime + 0.3)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5)

  const noiseBuffer = createNoiseBuffer(ctx, 1.5)
  const noiseSource = ctx.createBufferSource()
  noiseSource.buffer = noiseBuffer

  const filter1 = ctx.createBiquadFilter()
  filter1.type = 'bandpass'
  filter1.frequency.value = 6000 * velocityConfig.brightness
  filter1.Q.value = 2

  const filter2 = ctx.createBiquadFilter()
  filter2.type = 'highpass'
  filter2.frequency.value = 3000

  noiseSource.connect(filter1)
  filter1.connect(filter2)
  filter2.connect(gainNode)

  const pingGain = ctx.createGain()
  pingGain.gain.value = 0.2 * velocityConfig.gain
  pingGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2)
  pingGain.connect(gainNode)
  const pingOsc = ctx.createOscillator()
  pingOsc.type = 'sine'
  pingOsc.frequency.value = 8000
  pingOsc.connect(pingGain)

  noiseSource.start(startTime)
  pingOsc.start(startTime)
  noiseSource.stop(startTime + 1.5)
  pingOsc.stop(startTime + 0.2)
}

export function playCowbell(
  ctx: AudioContext,
  destination: AudioNode,
  startTime: number,
  velocityConfig: VelocityConfig
): void {
  const gainNode = ctx.createGain()
  gainNode.connect(destination)
  const peakGain = 0.5 * velocityConfig.gain
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.003)
  gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.5, startTime + 0.1)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5)

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 900 * velocityConfig.brightness
  filter.Q.value = 5
  filter.connect(gainNode)

  const osc1 = ctx.createOscillator()
  osc1.type = 'square'
  osc1.frequency.value = 560
  osc1.connect(filter)

  const osc2 = ctx.createOscillator()
  osc2.type = 'square'
  osc2.frequency.value = 800
  osc2.connect(filter)

  osc1.start(startTime)
  osc2.start(startTime)
  osc1.stop(startTime + 0.5)
  osc2.stop(startTime + 0.5)
}

const drumPlayers: Record<DrumType, typeof playKick> = {
  kick: playKick,
  snare: playSnare,
  hihat: playHihat,
  tom: playTom,
  ride: playRide,
  cowbell: playCowbell,
}

export function playDrum(
  ctx: AudioContext,
  destination: AudioNode,
  drumType: DrumType,
  startTime: number,
  velocityConfig: VelocityConfig
): void {
  const player = drumPlayers[drumType]
  if (!player) {
    throw new Error(`Unknown drum type: ${drumType}`)
  }
  player(ctx, destination, startTime, velocityConfig)
}
