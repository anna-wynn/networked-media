class Track {
    constructor(i, name, url) {
      this.i = i;
      this.player = new Tone.Player(url).toDestination();
      this.wave = new Tone.Waveform(512);
      this.player.connect(this.wave);
  
    
      let sectionWidth = width / 3;
      let sectionGap = width * 0.05;
      let digitGap = sectionWidth * 0.02;
      
      let sectionIndex = Math.floor(i / 18); // 0 = hours, 1 = minutes, 2 = seconds
      let digitIndex = Math.floor((i % 18) / 9); // 0 = first digit, 1 = second digit
      let waveformIndex = i % 9; // Position within the digit
  
  
      this.x = sectionIndex * (sectionWidth + sectionGap) + digitIndex * (sectionWidth / 2 + digitGap);
      this.y = waveformIndex * (height / 9);
      this.w = sectionWidth / 2 - digitGap; // Width for each digit
      this.h = height / 9; // Each waveform takes up 1/9th of canvas height
      this.color = color(random(0, 360), 100, 100);
    }
  
    draw() {
      let waveform = this.wave.getValue();
  
      // draw waveform
      strokeWeight(2);
      noFill();
      stroke(0);
      beginShape();
      for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, this.x, this.x + this.w);
        let y = this.y + map(waveform[i], -1, 1, this.h, 0);
        vertex(x, y);
      }
      endShape();
  
      if (this.player.state == "stopped") {
        noStroke();
        fill(300, 100, 100, 0.5);
        rect(this.x, this.y, this.w, this.h);
      }
    }
  }
  