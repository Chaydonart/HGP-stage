/**
* Author
 BEN JAAFAR Chedli

**/

import Player from './playerData/Player.js'
import Utils from './Utils.js';
import WaveManager from './WaveManager.js';
import UI from './UI.js';
import MapManager from './MapManager.js';
import DE from '@dreamirl/dreamengine';


var Game = {
  ennemies: [], //ennemies present sur la map
  utils: new Utils(),
  ui: new UI(),
  waveM: new WaveManager(),
  mapM: new MapManager(),
  player: null, // L'objet player
  playerEntity: null, // L'instanciation du Player.js

  mapWidth: 1920,
  mapHeight: 1080,
};

Game.init = function()
{
  // Create the renderer before assets start loading
  Game.render = new DE.Render('render', {
    resizeMode: 'stretch-ratio',
    width: 1920,
    height: 1080,
    backgroundColor: '0x4047a8',
    roundPixels: true,
    powerPreferences: 'high-performance',
  });
  Game.render.init();

  DE.start();
}

Game.onload = function()
{ 

  //Rajout de fonctionnalites du moteur pour le jeu (A voir dans Utils.js) 
  Game.utils.init();

  //Creation de la scene pour leu
  Game.scene = new DE.Scene("Level-1");


  //La camera du jeu capable de connaitre la position de la souris
  Game.camera = new DE.Camera(0, 0, 1920, 1080, {
    scene: Game.scene,
  });
  Game.camera.interactive = true;
  Game.camera.pointermove = function(pos, e) {
    Game.targetPointer.moveTo(pos, 1);
  };
  Game.render.add(Game.camera);


  //Le target pointer (le viseur du personnage)
  Game.targetPointer = new DE.GameObject({
    x: 500,
    y: 500,
    zindex:50,
    interactive: true,
    renderer: new DE.SpriteRenderer({ spriteName: 'target', scale: 0.3 }),
    tag: "pointer",
  });

  //On instancie notre joueur
  const player = new Player(Game.mapWidth / 2, Game.mapHeight / 2, 1);
  var player_object = player.createPlayerObject();
  Game.player = player_object;
  Game.playerEntity = player;


  //On met notre joueur ainsi que le viseur sur la scene
  Game.scene.add(
    player_object,
    Game.targetPointer,
  );
  
  //On initie ensuite le UI du jeu ainsi que le mapManager qui va tuer les ennemies en dehors de la carte
  Game.ui.init(player);
  Game.mapM.init();
  DE.Audio.fx.play('test_music'); //[cela ne veut pas fonctionner], mais on lance la musique du jeu

  //On lance les vagues d'ennemies avec un delai (laisse le temps au joueur de comprendre ce qu'il se passe)
  Game.utils.delay(() => {
    Game.waveM.vagueInit();
  },300,0);

  // Les touches du joueur
  //Mouvement :
  DE.Inputs.on('keyDown', 'left', function() {
    player.playerObject.axes.x = -2;
  });
  DE.Inputs.on('keyDown', 'right', function() {
    player.playerObject.axes.x = 2;
  });
  DE.Inputs.on('keyUp', 'left', function() {
    player.playerObject.axes.x = 0;
  });
  DE.Inputs.on('keyUp', 'right', function() {
    player.playerObject.axes.x = 0;
  });
  DE.Inputs.on('keyDown', 'up', function() {
    player.playerObject.axes.y = -2;
  });
  DE.Inputs.on('keyDown', 'down', function() {
    player.playerObject.axes.y = 2;
  });
  DE.Inputs.on('keyUp', 'up', function() {
    player.playerObject.axes.y = 0;
  });
  DE.Inputs.on('keyUp', 'down', function() {
    player.playerObject.axes.y = 0;
  });

  //Action : 
  DE.Inputs.on('keyDown', 'fire', function() {
    player.playerObject.addAutomatism('fire', 'fire', { interval: 150 });
    DE.Audio.fx.play('piew');
  });
  DE.Inputs.on('keyUp', 'fire', function() {
    player.playerObject.removeAutomatism('fire', 'fire', { interval: 150 })
  });

  //Permet d'aller lentement
  DE.Inputs.on('keyDown', 'shift', function() {
    player.playerSpeed = 1;
  });
  DE.Inputs.on('keyUp', 'shift', function() {
  player.playerSpeed = 2;
  });
  
}

window.Game = Game;

export default Game;
