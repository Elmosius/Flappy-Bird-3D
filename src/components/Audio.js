import { Audio, AudioListener, AudioLoader } from "three";

export function Audio(camera) {
  const listener = new AudioListener();
  camera.add(listener);

  const sound = new Audio(listener);
  const audioLoader = new AudioLoader();

  audioLoader.load("./assets/audio/backsound_squid_game.mp3", (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
  });

  return sound;
}
