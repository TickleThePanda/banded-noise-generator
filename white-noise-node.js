export {WhiteNoiseNode};

const RATE = 99600;

class WhiteNoiseNode extends AudioBufferSourceNode {

  constructor(ctx) {

    super(ctx, {
      buffer: ctx.createBuffer(1, RATE, RATE),
      loop: true
    });

    this._channel = super.buffer.getChannelData(0);
    this._worker = new Worker("./white-noise-generator-worker.js");
    this._worker.onmessage = (e) => { 
      for (let i = 0; i < e.data.length; i++) {
        this._channel[i] = e.data[i];
      }
    }

  }

  start() {
    const triggerUpdate = () => {
      this._worker.postMessage({
        rate: RATE,
        frames: RATE
      });
    }
    triggerUpdate();
    setInterval(triggerUpdate, 1000);

    super.start();
  }

}
