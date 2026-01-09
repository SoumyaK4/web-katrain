// Simple synth for stone click
export const playStoneSound = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Simulate a "clack" sound
    // Short, percussive, noise-like or high pitch decaying fast

    // Using a simple sine wave with fast decay for a "ping" or filtered noise is better.
    // Let's try a simple short sine burst first, then maybe something more complex if needed.
    // A wooden click is hard to synthesize with just one oscillator.

    // Let's try a triangle wave, low pitch, short envelope.
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
};
