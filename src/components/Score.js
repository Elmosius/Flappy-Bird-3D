export default class Score {
  constructor() {
    this.score = 0;
    this.createScoreDisplay();
  }

  createScoreDisplay() {
    this.scoreElement = document.createElement("div");
    this.scoreElement.id = "score";
    this.scoreElement.style.position = "absolute";
    this.scoreElement.style.top = "10px";
    this.scoreElement.style.left = "10px";
    this.scoreElement.style.color = "white";
    this.scoreElement.style.fontSize = "24px";
    this.scoreElement.style.fontFamily = "Arial, sans-serif";
    this.scoreElement.innerText = `Score: ${this.score}`;
    document.body.appendChild(this.scoreElement);
  }

  updateScore(points = 0) {
    this.score += points / 4;
    console.log("score apdet", this.score);
    this.scoreElement.innerText = `Score: ${this.score}`;
  }

  resetScore() {
    this.score = 0;
    this.scoreElement.innerText = `Score: ${this.score}`;
  }

  getScore() {
    return this.score;
  }
}
