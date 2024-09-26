let totalTime;
let timerRunning = false;
let sizeOfFont;
let inputHours, inputMinutes, inputSeconds;
let moveTimer;
let hoursText, minutesText, secondsText;
let interval;

let players = [];
let trackNames = [
  "integer1",
  "integer2",
  "integer3",
  "integer4",
  "integer5",
  "integer6",
  "integer7",
  "integer8",
  "integer9"
];
let tracks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  sizeOfFont = windowHeight * 0.05;

  moveTimer = -windowWidth * 0.10;

  // Create input fields for hours, minutes, and seconds
  inputHours = createInput('0');
  inputHours.position(windowWidth / 2 - 200 + moveTimer, 10); // Adjusted position for hours
  inputHours.size(50);
  hoursText = createDiv('hour');
  hoursText.position(windowWidth / 2 - 120 + moveTimer, 10); // Adjusted position for hours text

  inputMinutes = createInput('0');
  inputMinutes.position(windowWidth / 2 - 60 + moveTimer, 10); // Keep minutes position
  inputMinutes.size(50);
  minutesText = createDiv('min');
  minutesText.position(windowWidth / 2 + 20 + moveTimer, 10); // Adjusted position for minutes text

  inputSeconds = createInput('0');
  inputSeconds.position(windowWidth / 2 + 80 + moveTimer, 10); // Adjusted position for seconds
  inputSeconds.size(50);
  secondsText = createDiv('sec');
  secondsText.position(windowWidth / 2 + 160 + moveTimer, 10); // Adjusted position for seconds text

  // Move the Start button further right and add more space
  startButton = createButton('Start');
  startButton.position(windowWidth / 2 + 240 + moveTimer, 10); // Further right for more space
  startButton.mousePressed(startTimerAndAudio);

  // Load audio tracks
  for (let i = 0; i < 54; i++) { // Create 54 tracks (18 per section)
    tracks[i] = new Track(i, "Track " + i, trackNames[i % 9] + ".mp3");
  }

  // Enable button only after tracks are loaded
  Tone.loaded().then(function() {
    startButton.removeAttribute("disabled");
  });

  noStroke();
}


function draw() {
  background(255);

  // Display constant countdown in the top-right corner
  if (timerRunning) {
    let hours = floor(totalTime / 3600);
    let minutes = floor((totalTime % 3600) / 60);
    let seconds = floor(totalTime % 60);

    let secondsFormatted = seconds < 10 ? '0' + seconds : seconds;
    let minutesFormatted = minutes < 10 ? '0' + minutes : minutes;

    textSize(sizeOfFont);
    textAlign(RIGHT, TOP);
    text(hours + ":" + minutesFormatted + ":" + secondsFormatted, width - 20, 20); // Constant display in top-right
  }

  // Draw waveforms for all tracks
  for (let i = 0; i < tracks.length; i++) {
    tracks[i].draw();
  }
}

function startTimerAndAudio() {
  Tone.start(); // Start the audio context

  // Set up timer values
  let hoursValue = inputHours.value();
  let minutesValue = inputMinutes.value();
  let secondsValue = inputSeconds.value();
  totalTime = int(hoursValue) * 3600 + int(minutesValue) * 60 + int(secondsValue);
  timerRunning = true;

  // Hide input fields and start button
  inputHours.hide();
  hoursText.hide();
  inputMinutes.hide();
  minutesText.hide();
  inputSeconds.hide();
  secondsText.hide();
  startButton.hide();

  // Start countdown and audio tracks playing on appropriate digits
  interval = setInterval(decrementTimer, 1000);
}

function decrementTimer() {
  if (totalTime > 0) {
    totalTime--; // Decrease timer by 1 second

    // Get digit values
    let secondsDigit = totalTime % 60;
    let minutesDigit = floor((totalTime % 3600) / 60);
    let hoursDigit = floor(totalTime / 3600);

    // Play tracks for corresponding digits
    playTracksForDigits(hoursDigit, minutesDigit, secondsDigit);
  } else {
    clearInterval(interval); // Stop timer when countdown reaches 0
    timerRunning = false;

    // Play all tracks simultaneously at the end of the countdown
    playAllTracksSimultaneously();

    // Show input fields and button again
    inputHours.show();
    hoursText.show();
    inputMinutes.show();
    minutesText.show();
    inputSeconds.show();
    secondsText.show();
    startButton.show();
  }
}

function playTracksForDigits(hours, minutes, seconds) {
  let hourFirstDigit = Math.floor(hours / 10);
  let hourSecondDigit = hours % 10;
  let minuteFirstDigit = Math.floor(minutes / 10);
  let minuteSecondDigit = minutes % 10;
  let secondFirstDigit = Math.floor(seconds / 10);
  let secondSecondDigit = seconds % 10;

  if (hourFirstDigit >= 1 && hourFirstDigit <= 9) {
    tracks[hourFirstDigit - 1].player.start();
  }
  if (hourSecondDigit >= 1 && hourSecondDigit <= 9) {
    tracks[9 + hourSecondDigit - 1].player.start();
  }

  if (minuteFirstDigit >= 1 && minuteFirstDigit <= 9) {
    tracks[18 + minuteFirstDigit - 1].player.start();
  }
  if (minuteSecondDigit >= 1 && minuteSecondDigit <= 9) {
    tracks[27 + minuteSecondDigit - 1].player.start();
  }

  if (secondFirstDigit >= 1 && secondFirstDigit <= 9) {
    tracks[36 + secondFirstDigit - 1].player.start();
  }
  if (secondSecondDigit >= 1 && secondSecondDigit <= 9) {
    tracks[45 + secondSecondDigit - 1].player.start();
  }
}

function playAllTracksSimultaneously() {
  // Play all tracks at the same time when the countdown ends
  for (let i = 0; i < tracks.length; i++) {
    tracks[i].player.start();
  }
}
