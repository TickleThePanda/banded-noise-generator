class GaussianRandom {
  constructor() {
    this.saved = null;
  }

  generatePair() {
    let s, x, y;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      s = x * x + y * y;
    } while (s === 0 || s >= 1);

    let mul = Math.sqrt(-2 * Math.log(s) / s);
    
    return {x: x * mul, y: y * mul};
  }

  next(mean, std) {
    let val;

    if (this.saved === null) {
      let pair = this.generatePair();

      this.saved = pair.y;

      val = pair.x;
    } else {
      val = this.saved;
      this.saved = null;
    }

    return mean + val * std;
  }
  
}

const random = new GaussianRandom();

function generate(rate, frames, seconds) {
  let noise = [];

  for(var i = 0; i < frames; i++) {
    noise.push(random.next(0, 1/3));
  }

  return noise;
}

onmessage = function(e) {
  let data = e.data;

  postMessage(generate(data.rate, data.frames));
}