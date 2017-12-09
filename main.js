import { WhiteNoiseApp } from "./white-noise-app.js";
import { FrequencyDrawer } from "./frequency-drawer.js";

window.addEventListener('load', () => {

  let audioContext = new AudioContext();

  let whiteNoiseApp = new WhiteNoiseApp(audioContext);

  let drawer = new FrequencyDrawer(document.getElementById("wave"));

  let volumeInput = document.querySelector('input[name="volume"]');

  volumeInput.value = whiteNoiseApp.masterGain;

  volumeInput.addEventListener('input', () => {
    whiteNoiseApp.masterGain = volumeInput.value;
  });

  whiteNoiseApp.start();

  function draw() {
    window.requestAnimationFrame(draw);
    let analysis = whiteNoiseApp.analysis;

    drawer.draw(analysis);
  }

  window.requestAnimationFrame(draw);

  let bands = whiteNoiseApp.bands;

  function convertFreqToBandName(freq) {
    return `volume-band-${freq}`;
  }

  function getElementForBand(freq) {
    return document.querySelector(`input[name="${convertFreqToBandName(freq)}"]`)
  }

  let bandsContainerElement = document.querySelector(".bands");

  bandsContainerElement.innerHTML = bands.reduce((p, b) => {
    let name = convertFreqToBandName(b.freq);
    p += `
<label for="${name}">volume - ${b.freq}</label>
<input name="${name}" type="range" min="0" max="1" step="0.01" value="0"></input>
    `;

    return p;
  }, "");

  bands.forEach(b => {

    let bandContainerElement = getElementForBand(b.freq);

    bandContainerElement.addEventListener('input', function() {
      b.gain = bandContainerElement.value;
    })

  });

});
