import * as Tone from "tone";

export function dit(hz: number = 750, timeUnit: number = 0.05) {
  new Tone.Oscillator(hz, "sine").toDestination().start().stop(`+${timeUnit}s`);
}

export function dah(hz: number = 750, timeUnit: number = 0.05) {
  new Tone.Oscillator(hz, "sine")
    .toDestination()
    .start()
    .stop(`+${timeUnit * 3}s`);
}
