// Musica generata e suoni.

let AC = null,
  master,
  musG,
  rainG,
  chatG = null,
  noiseBuf,
  nextBar = 0,
  barI = 0;
function initAudio() {
  if (AC) {
    if (AC.state === 'suspended') AC.resume().catch(() => {});
    return;
  }
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    return;
  }
  master = AC.createGain();
  master.gain.value = st.sound ? 1 : 0;
  master.connect(AC.destination);
  const len = AC.sampleRate * 3,
    b = AC.createBuffer(1, len, AC.sampleRate),
    d = b.getChannelData(0);
  let l = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    l = (l + 0.02 * w) / 1.02;
    d[i] = l * 3 + w * 0.12;
  }
  noiseBuf = b;
  const n = AC.createBufferSource();
  n.buffer = b;
  n.loop = true;
  const f = AC.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 1500;
  rainG = AC.createGain();
  rainG.gain.value = 0;
  n.connect(f).connect(rainG).connect(master);
  n.start();
  const cn = AC.createBufferSource();
  cn.buffer = b;
  cn.loop = true;
  const cf = AC.createBiquadFilter();
  cf.type = 'bandpass';
  cf.frequency.value = 480;
  cf.Q.value = 0.9;
  chatG = AC.createGain();
  chatG.gain.value = 0;
  cn.connect(cf).connect(chatG).connect(master);
  cn.start(0, 1.3);
  musG = AC.createGain();
  musG.gain.value = 0;
  const mf = AC.createBiquadFilter();
  mf.type = 'lowpass';
  mf.frequency.value = 2300;
  musG.connect(mf).connect(master);
  nextBar = AC.currentTime + 0.5;
}
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function tone(dest, freq, t, dur, vol, type) {
  const o = AC.createOscillator(),
    gg = AC.createGain();
  o.type = type || 'triangle';
  o.frequency.value = freq;
  o.detune.value = rnd(-7, 7);
  gg.gain.setValueAtTime(0, t);
  gg.gain.linearRampToValueAtTime(vol, t + 0.03);
  gg.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(gg).connect(dest);
  o.start(t);
  o.stop(t + dur + 0.05);
}
function kick(t) {
  const o = AC.createOscillator(),
    gg = AC.createGain();
  o.frequency.setValueAtTime(110, t);
  o.frequency.exponentialRampToValueAtTime(40, t + 0.18);
  gg.gain.setValueAtTime(0.32, t);
  gg.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  o.connect(gg).connect(musG);
  o.start(t);
  o.stop(t + 0.3);
}
function hat(t, v) {
  const s = AC.createBufferSource();
  s.buffer = noiseBuf;
  const f = AC.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = 6500;
  const gg = AC.createGain();
  gg.gain.setValueAtTime(v, t);
  gg.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  s.connect(f).connect(gg).connect(musG);
  s.start(t, rnd(0, 2));
  s.stop(t + 0.07);
}
const PROG = {
  m: [
    [48, 52, 55, 59],
    [45, 48, 52, 55],
    [50, 53, 57, 60],
    [43, 47, 50, 53]
  ],
  d: [
    [53, 57, 60, 64],
    [52, 55, 59, 62],
    [50, 53, 57, 60],
    [48, 52, 55, 59]
  ],
  n: [
    [50, 53, 57, 60, 64],
    [43, 47, 53, 57],
    [48, 52, 55, 59, 62],
    [45, 49, 52, 55, 58]
  ]
};
function audioTick() {
  if (!AC) return;
  const w = curWx(),
    t0 = AC.currentTime;
  rainG.gain.setTargetAtTime(st.sound ? (cine ? 0.3 : { pioggia: 0.3, temporale: 0.45, nebbia: 0.04, neve: 0.03 }[w] || 0) : 0, t0, 0.8);
  if (chatG) {
    const seated = people.filter(p => p.state === 'sit').length;
    chatG.gain.setTargetAtTime(st.sound && started && !cine && !blackout() ? Math.min(0.07, seated * 0.007) : 0, t0, 1.5);
  }
  const on = st.music > 0 && st.musicOn && st.sound && !blackout() && !cine;
  musG.gain.setTargetAtTime(on ? 0.3 : 0, t0, 0.6);
  if (st.sound && w === 'sereno' && hour() < 11 && Math.random() < 0.12) {
    const f = rnd(2600, 3600);
    tone(master, f, t0, 0.12, 0.012, 'sine');
    tone(master, f * 1.12, t0 + 0.1, 0.1, 0.01, 'sine');
  }
  if (!on) {
    nextBar = t0 + 0.3;
    return;
  }
  while (nextBar < t0 + 0.7) {
    const t = nextBar,
      S0 = STATIONS[st.station || 0],
      B = S0.B,
      h = hour(),
      pr = h < 11 ? PROG.m : h < 20 ? PROG.d : PROG.n,
      ch = pr[barI % 4],
      bt = B / 4;
    ch.forEach((m, i) => tone(musG, mtof(m), t + i * 0.03, B * 0.95, 0.05));
    tone(musG, mtof(ch[0] - 12), t, B * 0.9, 0.1, 'sine');
    for (let k = 0; k < 4; k++) {
      if (k % 2 === 0) kick(t + k * bt + (k ? 0.03 : 0));
      hat(t + k * bt + bt / 2 + 0.04, 0.04);
    }
    if (S0.pop) for (let k = 0; k < 8; k++) hat(t + (k * bt) / 2, 0.022);
    if (S0.bossa) {
      kick(t + bt * 1.5);
      kick(t + bt * 3.5);
    }
    for (let k = 0; k < 3; k++) if (Math.random() < 0.6) hat(t + rnd(0, B), 0.008);
    if (st.music >= 2 || S0.jazz)
      for (let k = 0; k < 4; k++)
        if (Math.random() < 0.5) tone(musG, mtof(pick([72, 74, 76, 79, 81, 84])), t + k * bt + rnd(0, 0.1), 0.9, 0.028, 'sine');
    nextBar += B;
    barI++;
  }
}
setInterval(audioTick, 200);
let lastCoin = 0;
function sfx(k) {
  if (!AC || !st.sound) return;
  const t = AC.currentTime;
  if (k === 'door') {
    tone(master, 1568, t, 0.5, 0.04, 'sine');
    tone(master, 1318, t + 0.12, 0.6, 0.04, 'sine');
  } else if (k === 'coin') {
    if (t - lastCoin < 0.08) return;
    lastCoin = t;
    tone(master, 1320, t, 0.12, 0.035, 'square');
    tone(master, 1760, t + 0.06, 0.18, 0.03, 'square');
  } else if (k === 'tap') tone(master, rnd(500, 640), t, 0.08, 0.05, 'triangle');
  else if (k === 'buy') [660, 880, 1100].forEach((f, i) => tone(master, f, t + i * 0.07, 0.25, 0.05, 'triangle'));
  else if (k === 'story') [523, 659, 784, 1047].forEach((f, i) => tone(master, f, t + i * 0.12, 0.8, 0.05, 'sine'));
  else if (k === 'meow') {
    const o = AC.createOscillator(),
      gg = AC.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(700, t);
    o.frequency.linearRampToValueAtTime(950, t + 0.12);
    o.frequency.linearRampToValueAtTime(600, t + 0.35);
    const f = AC.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1200;
    gg.gain.setValueAtTime(0, t);
    gg.gain.linearRampToValueAtTime(0.06, t + 0.05);
    gg.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    o.connect(f).connect(gg).connect(master);
    o.start(t);
    o.stop(t + 0.45);
  } else if (k === 'thunder') {
    const s = AC.createBufferSource();
    s.buffer = noiseBuf;
    const f = AC.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 170;
    const gg = AC.createGain();
    gg.gain.setValueAtTime(0, t);
    gg.gain.linearRampToValueAtTime(0.7, t + 0.3);
    gg.gain.exponentialRampToValueAtTime(0.001, t + 3);
    s.connect(f).connect(gg).connect(master);
    s.start(t);
    s.stop(t + 3.1);
  } else if (k === 'good') [784, 988, 1175].forEach((f, i) => tone(master, f, t + i * 0.06, 0.3, 0.05, 'triangle'));
  else if (k === 'meh') tone(master, 330, t, 0.3, 0.05, 'triangle');
  else if (k === 'secret') [1047, 1319, 1568, 2093, 2637].forEach((f, i) => tone(master, f, t + i * 0.07, 0.5, 0.03, 'sine'));
  else if (k === 'buzz') {
    tone(master, 120, t, 0.25, 0.035, 'sawtooth');
    tone(master, 180, t + 0.05, 0.15, 0.02, 'square');
  } else if (k === 'knock') {
    tone(master, 190, t, 0.06, 0.09, 'triangle');
    tone(master, 170, t + 0.13, 0.06, 0.09, 'triangle');
  } else if (k === 'bells') [1568, 1760, 1976, 2093, 2349, 2637, 3136].forEach((f, i) => tone(master, f, t + i * 0.09, 0.6, 0.03, 'sine'));
  else if (k === 'pop') tone(master, 880, t, 0.08, 0.05, 'square');
  else if (k === 'soffio') {
    const s = AC.createBufferSource();
    s.buffer = noiseBuf;
    const f = AC.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 2600;
    const gg = AC.createGain();
    gg.gain.setValueAtTime(0.09, t);
    gg.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    s.connect(f);
    f.connect(gg);
    gg.connect(master);
    s.start(t);
    s.stop(t + 0.5);
  } else if (k === 'woof') {
    tone(master, 320, t, 0.09, 0.06, 'square');
    tone(master, 260, t + 0.12, 0.12, 0.06, 'square');
  } else if (k === 'water') [900, 700, 820, 760].forEach((f, i) => tone(master, f, t + i * 0.06, 0.08, 0.02, 'sine'));
  else if (k === 'chime') [784, 1047, 1319].forEach((f, i) => tone(master, f, t + i * 0.28, 1.6, 0.04, 'sine'));
  else if (k === 'hiss') {
    const s = AC.createBufferSource();
    s.buffer = noiseBuf;
    const f = AC.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 3000;
    const gg = AC.createGain();
    gg.gain.setValueAtTime(0.05, t);
    gg.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    s.connect(f).connect(gg).connect(master);
    s.start(t, rnd(0, 2));
    s.stop(t + 0.65);
  }
}
