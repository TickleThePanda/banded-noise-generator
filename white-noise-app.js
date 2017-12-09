import { WhiteNoiseNode } from "./white-noise-node.js";
export { WhiteNoiseApp };

const INITIAL_GAIN = 0.2;
const FFT_SIZE = 4096;

const MAX_FREQUENCY = 8000;
const N_BANDS = 16;
const ROOT = Math.sqrt(2);
const BASE_FREQUENCY = MAX_FREQUENCY / Math.pow(ROOT, N_BANDS - 1);

const ANALYSIS_CONSTANT = 0.95;

class Band {
  constructor(gainNode, freq) {
    this._gainNode = gainNode;
    this._freq = freq;
  }

  get gain() {
    return this._gainNode.gain.value;
  }

  set gain(val) {
    this._gainNode.gain.value = val;
  }

  get freq() {
    return this._freq;
  }
}

class WhiteNoiseApp {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.sourceNode = new WhiteNoiseNode(audioContext);
    this.analyserNode = audioContext.createAnalyser();
    this.masterGainNode = audioContext.createGain();
    this.bandFilterNodes = [];
    this.bandGainNodes = [];
    this.destNode = audioContext.destination;

    this.analyserNode.fftSize = FFT_SIZE;
    this.analyserNode.smoothingTimeConstant = ANALYSIS_CONSTANT;

    this.masterGainNode.gain.value = INITIAL_GAIN;

    for(let i = 0; i < N_BANDS; i++) {
      let frequency = BASE_FREQUENCY * Math.pow(ROOT, i);
      let bandFilterNode = this.audioContext.createBiquadFilter();
      bandFilterNode.type = "highpass";
      bandFilterNode.frequency.value = frequency;
      bandFilterNode.Q.value = 4;
      this.bandFilterNodes.push(bandFilterNode);

      let bandGainNode = this.audioContext.createGain();
      bandGainNode.gain.value = 0;
      this.bandGainNodes.push(bandGainNode);
    }

    for(let i = 0; i < 10; i++) {
      let bF = this.bandFilterNodes[i];
      let bG = this.bandGainNodes[i];

      this.sourceNode.connect(bF);
      bF.connect(bG);
      bG.connect(this.masterGainNode);
      bG.connect(this.analyserNode);
    }

    this.masterGainNode.connect(this.destNode);
  }

  start() {
    this.sourceNode.start();
  }

  set bandWidth(val) {
    for(let i = 0; i < 10; i++) {
      let bF = this.bandFilterNodes[i];

      bF.Q.value = val;
    }
  }

  set masterGain(val) {
    this.masterGainNode.gain.value = val;
  }

  get masterGain() {
    return this.masterGainNode.gain.value;
  }

  get analysis() {
    let arr = new Uint8Array(FFT_SIZE);
    this.analyserNode.getByteFrequencyData(arr);
    return arr;
  }

  get bands() {

    let bands = [];

    for(let i = 0; i < N_BANDS; i++) {
      let f = this.bandFilterNodes[i].frequency.value;
      let gainNode = this.bandGainNodes[i];
      bands.push(new Band(gainNode, f));
    }

    return bands;
  }
}