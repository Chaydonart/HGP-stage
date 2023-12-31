/**
 * @ContributorsList
 * @Inateno / http://inateno.com / http://dreamirl.com
 *
 * this is the images file sample that will be loaded by the project in the ResourcesManager module
 * it can also load .json files (for sheets and particles)
 * Please declare in the same way than this example.
 * To load image as default just set "load" to true.
 *
 * Otherwise you can load/add images when you want, load images by calling the DREAM_ENGINE.ImageManager.pushImage function
 *
 * - [ name, url, { load:Bool, totalFrame:Int, totalLine:Int, interval:Int (ms), animated:Bool, isReversed:Bool } ]
 *
 * name, and url are required
 */
const images = {
  // images folder name 
  baseUrl: "imgs/",
  
  // usage name, real name (can contain subpath), extension, parameters
  pools: {
    // loaded when engine is inited
    default: [
      // [ "example", "example", "png", { "totalFrame": 4, "totalLine": 2, "interval": 50, "animated":true, "isReversed": false } ]
      // [ "ship", "ayera/ship.png", { "totalFrame": 10, "totalLine": 1, "interval": 100, "animated":true, "isReversed": false } ]

      [ "target", "shmup/target.png" ],


      //ENNEMIES
      ["seaker","ennemies/seaker.png"],
      ["simple","ennemies/simple.png"],
      ["ennemyBullet","ennemies/ennemyBullet.png"],
      ["circle","ennemies/circle.png"],
      ["rotate", "ennemies/rotate.png"],
      ["boss", "ennemies/boss.png"],
      
      //UI
      ["vie","UI/vie.png"],

      //BACKGROUND
      ["background", "background.png"],

      //PLAYER
      ["player","player.png"],
      ["soul","soul.png"],
      ["soul_shift","soul_shift.png"],
      ["player_bullet","player_bullet.png"]
    ],
    
    // a custom pool not loaded by default, you have to load it whenever you want (you can display a custom loader or just the default loader)
    aCustomPool: [
      // resources
    ]
  }
};

export default images;
