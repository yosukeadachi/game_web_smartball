import Phaser from "phaser";
import {MyScene} from "./scenes/MyScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 1000,
  physics: {
    default: "matter",
    matter: {
      debug: true,
      gravity: { y: 1 },
    },
  },
  scene: MyScene,
};
new Phaser.Game(config);