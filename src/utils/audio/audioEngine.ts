import { playInstrument, noteToFrequency } from './instruments'
import { playDrum } from './drums'
import type { InstrumentType, DrumType, VelocityLevel, VelocityConfig, NoteOptions, DrumOptions } from './types'
import { VELOCITY_MAP } from './types'

export class AudioEngine {
  private static instance: AudioEngine | null = null
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private isInitialized = false
  private masterVolume: number = 0.7

  private constructor() {}

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine()
    }
    return AudioEngine.instance
  }

  async init(): Promise<void> {
    if (this.isInitialized && this.audioContext) {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }
      return
    }

    const AudioContextClass = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) {
      throw new Error('Web Audio API is not supported in this browser')
    }

    this.audioContext = new AudioContextClass()
    this.masterGain = this.audioContext.createGain()
    this.masterGain.gain.value = this.masterVolume
    this.masterGain.connect(this.audioContext.destination)

    this.isInitialized = true
  }

  getContext(): AudioContext {
    if (!this.audioContext || !this.isInitialized) {
      throw new Error('AudioEngine is not initialized. Call init() first.')
    }
    return this.audioContext
  }

  getMasterGain(): GainNode {
    if (!this.masterGain) {
      throw new Error('AudioEngine is not initialized. Call init() first.')
    }
    return this.masterGain
  }

  setMasterVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    this.masterVolume = clampedVolume
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(clampedVolume, this.audioContext!.currentTime, 0.01)
    }
  }

  getMasterVolume(): number {
    return this.masterVolume
  }

  getCurrentTime(): number {
    return this.audioContext?.currentTime || 0
  }

  private getVelocityConfig(velocity: VelocityLevel | number | undefined): VelocityConfig {
    if (typeof velocity === 'number') {
      const v = Math.max(0, Math.min(1, velocity))
      return {
        gain: 0.3 + v * 0.6,
        brightness: 0.6 + v * 0.7,
        attack: 0.05 - v * 0.045,
        release: 0.3 - v * 0.15,
      }
    }
    if (velocity && velocity in VELOCITY_MAP) {
      return VELOCITY_MAP[velocity as VelocityLevel]
    }
    return VELOCITY_MAP.mf
  }

  playNote(
    note: string,
    instrument: InstrumentType = 'piano',
    duration: number = 0.5,
    velocity: VelocityLevel | number = 'mf',
    startTime?: number
  ): void {
    const ctx = this.getContext()
    const destination = this.getMasterGain()
    const frequency = noteToFrequency(note)
    const velocityConfig = this.getVelocityConfig(velocity)
    const start = startTime ?? ctx.currentTime
    playInstrument(ctx, destination, instrument, frequency, start, duration, velocityConfig)
  }

  playNoteWithOptions(options: NoteOptions): void {
    this.playNote(
      options.note,
      options.instrument,
      options.duration ?? 0.5,
      options.velocity ?? 'mf',
      options.startTime
    )
  }

  playDrum(
    drumType: DrumType,
    velocity: VelocityLevel | number = 'mf',
    startTime?: number
  ): void {
    const ctx = this.getContext()
    const destination = this.getMasterGain()
    const velocityConfig = this.getVelocityConfig(velocity)
    const start = startTime ?? ctx.currentTime
    playDrum(ctx, destination, drumType, start, velocityConfig)
  }

  playDrumWithOptions(options: DrumOptions): void {
    this.playDrum(options.drumType, options.velocity ?? 'mf', options.startTime)
  }

  async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  async suspend(): Promise<void> {
    if (this.audioContext?.state === 'running') {
      await this.audioContext.suspend()
    }
  }

  close(): void {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
      this.masterGain = null
      this.isInitialized = false
    }
  }

  getState(): AudioContextState {
    return this.audioContext?.state || 'closed'
  }
}

export const audioEngine = AudioEngine.getInstance()
