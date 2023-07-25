import DE from '@dreamirl/dreamengine';

/**
 * UI.js permet de gerer l'affichage du jeu
 * 
 * On utilise un objet qui ecoute constamment la scene et metr a jour les informations
 * du UI  pour le joueur
 */

class UI{
    reset = false;
    constructor(){
        this.UIObject = null; 
    }

    /**
     * On initie avec le "player" pour pouvoir avoir accéder aux point de vies du joueur
     * */
    init(player) {
        this.UIObject = new DE.GameObject({
            x: 0,
            y: 0,
            zindex: 5,
            renderers: [
              //Affichage des vies du joueur
              new DE.SpriteRenderer({spriteName: 'vie', x: 1820, y: 50,scale:0.6},),
              new DE.SpriteRenderer({spriteName: 'vie', x: 1820 -50, y: 50,scale: 0.6}),
              new DE.SpriteRenderer({spriteName: 'vie', x: 1820 - 100, y: 50,scale: 0.6}),
              new DE.SpriteRenderer({spriteName: 'vie', x: 1820 - 150, y: 50, scale: 0.6}),
              new DE.SpriteRenderer({spriteName: 'vie', x: 1820 - 200, y: 50, scale: 0.6}),
        
              //Affichage du numero de vague d'ennemie
              new DE.TextRenderer('', {
                text: "Vague " + Game.waveM.numberVague,
                x: 70,
                y: 20,
                textStyle: {
                  fill: 'white',
                  fontSize: 30,
                  fontFamily: 'Snippet, Monaco, monospace',
                },
              }),
            ],
        
            //On met dans un update qui va ecouter la scene constamment pour mettre a jour les informations ! 
            update: () => {
              const pvPlayer = player.getPlayerPV();
              //Pour enlever les coeurs representant les points de vies du joueur
              if(pvPlayer < 5 && pvPlayer > 0){
                this.UIObject.renderers[pvPlayer].scale = 0;
              } 
              //Cas du GAMEOVER
              if (pvPlayer <= 0){
                //On affiche GAMEOVER sur l'ecran
                const gameOverScren = new DE.GameObject({
                  x: 1920 / 2,
                  y: 1080 / 2, 
                  renderer: new DE.TextRenderer('',{
                    x:0,
                    y:0,
                    text:'GAME OVER',
                    textStyle: {
                      fill: 'white',
                      fontSize: 250,
                      fontFamily: 'Snippet, Monaco, monospace',
                      strokeThickness: 1,
                      align: 'center',
                    },
                    fontSize: 1000,
                  }),
                });
                //Et le score du joueur
                const score = new DE.GameObject({
                  x: 960,
                  y: 540 + 150, 
                  renderer: new DE.TextRenderer('',{
                    x:0,
                    y:0,
                    text: "Score : " + Game.playerEntity.getScore(),
                    textStyle: {
                      fill: 'white',
                      fontSize: 100,
                      fontFamily: 'Snippet, Monaco, monospace',
                      strokeThickness: 1,
                      align: 'center',
                    },
                    fontSize: 1000,
                  }),
                });
                Game.scene.deleteAll();
                Game.scene.add(gameOverScren);
                Game.scene.add(score);
              }
              //Afficheur des vagues d'ennemies (pour tenir au courant de la progression du joueur)
              this.UIObject.renderers[5].text = "Vague " + Game.waveM.numberVague;
        
            }
        })
        
        //On ajoute l'objet a la scene pour qu'il puisse ecouter constamment ce qui se passe
        Game.scene.add(this.UIObject);
    }

    /**
     * resetUI() est la meme que init(), elle est utilisé dans la partie du boss
     * dans la WaveManager.js afin de reset l'afficheur pour les points de vies du joueur
     */
    resetUI(player){
      Game.scene.remove(this.UIObject);
      this.UIObject = new DE.GameObject({
        x: 0,
        y: 0,
        zindex: 5,
        renderers: [
          //Affichage des vies du joueur
          new DE.SpriteRenderer({spriteName: 'vie', x: 1820, y: 50,scale:0.6},),
          new DE.SpriteRenderer({spriteName: 'vie', x: 1820 -50, y: 50,scale: 0.6}),
          new DE.SpriteRenderer({spriteName: 'vie', x: 1820 - 100, y: 50,scale: 0.6}),
          new DE.SpriteRenderer({spriteName: 'vie', x: 1820 - 150, y: 50, scale: 0.6}),
          new DE.SpriteRenderer({spriteName: 'vie', x: 1820 - 200, y: 50, scale: 0.6}),
    
          //Affichage du numero de vague d'ennemie
          new DE.TextRenderer('', {
            text: "BOSS",
            x: 70,
            y: 20,
            textStyle: {
              fill: 'white',
              fontSize: 30,
              fontFamily: 'Snippet, Monaco, monospace',
            },
          }),
        ],
    
        //On met dans un update qui va ecouter la scene constamment pour mettre a jour les informations ! 
        update: () => {
          const pvPlayer = player.getPlayerPV();
          //Pour enlever les coeurs representant les points de vies du joueur
          if(pvPlayer < 5 && pvPlayer > 0){
            this.UIObject.renderers[pvPlayer].scale = 0;
          } 
          //Cas du gameover
          if (pvPlayer <= 0){
            //On affiche un GAMEOVER
            const gameOverScren = new DE.GameObject({
              x: 1920 / 2,
              y: 1080 / 2, 
              renderer: new DE.TextRenderer('',{
                x:0,
                y:0,
                text:'GAME OVER',
                textStyle: {
                  fill: 'white',
                  fontSize: 250,
                  fontFamily: 'Snippet, Monaco, monospace',
                  strokeThickness: 1,
                  align: 'center',
                },
                fontSize: 1000,
              }),
            });
            //Ainsi que le score du joueur
            const score = new DE.GameObject({
              x: 960,
              y: 540 + 150, 
              renderer: new DE.TextRenderer('',{
                x:0,
                y:0,
                text: "Score : " + Game.playerEntity.getScore(),
                textStyle: {
                  fill: 'white',
                  fontSize: 100,
                  fontFamily: 'Snippet, Monaco, monospace',
                  strokeThickness: 1,
                  align: 'center',
                },
                fontSize: 1000,
              }),
            });
            Game.scene.deleteAll();
            Game.scene.add(gameOverScren);
            Game.scene.add(score);
          }
        }
    })
    
    //On ajoute l'objet a la scene pour qu'il puisse ecouter constamment ce qui se passe
    Game.scene.add(this.UIObject);
    } 
    


}

export default UI;