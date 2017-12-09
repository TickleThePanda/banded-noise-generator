export { FrequencyDrawer }

class FrequencyDrawer {
  constructor(canvas) {
    this.canvas = canvas;

    this.ctx = canvas.getContext("2d");
  }

  draw(array) {
    const WIDTH = this.canvas.width;
    const HEIGHT = this.canvas.height;

    const BUFFER_LENGTH = array.length;

    const THRESHOLD = BUFFER_LENGTH / 4;

    const BAR_WIDTH = WIDTH / THRESHOLD;

    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
    for(let i = 0; i < THRESHOLD; i++) {
      let barHeight = array[i];
      let x = BAR_WIDTH * i;
  
      this.ctx.fillStyle = 'rgb(' + ( barHeight + 100) + ',50,50)';
      this.ctx.fillRect(x, HEIGHT - barHeight / 2, BAR_WIDTH, barHeight / 2);
    }
  }
}