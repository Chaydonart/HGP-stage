import DE from '@dreamirl/dreamengine';
import Bullet from './Bullet.js';

/**
 * Player.js est l'objet representant le joueur. 
 * Ici nous avons l'etat du joueur (ses PV et des details sur son etat), et les methodes necessaire a son mouvement
 * et ses capacites (tirer et dasher)
 */

class Player {
    playerSpeed = 2; // Vitesse du joueur
    score = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.playerObject = null;
        this.isDashing = false; 
        this.dashDuration = 5 ; // Durée du dash 
        this.dashCooldown = 40; // Temps de recharge 
        this.dashSpeed = 1;
        this.dashTimer = 0; // Compteur de temps pour le dash et le temps de recharge
        
        this.createPlayerObject();
    }

    /**
     * Permet de creer l'objet joueur avec ses mouvements et capacité
     */
    createPlayerObject() {
        this.playerObject = new DE.GameObject({
            x: this.x,
            y: this.y,
            tag: "player",
            pv: 5,

            renderers: [new DE.RectRenderer(40, 40, '0xd74e4e'),
            new DE.SpriteRenderer({spriteName: 'player',x:21,y:12}),
            //new DE.SpriteRenderer({spriteName: 'soul',x:20,y:20 }),
            new DE.TextureRenderer({ spriteName: 'soul',x:20, y:20 })],

            axes: { x: 0, y: 0 },

            /**
             * Methode qui se joeur constamment afin de faire bouger le joueur
             */
            checkInputs: () => {
                console.log(this.playerObject.pv);
                // Vérification des limites horizontales
                if (this.playerObject.x + this.playerObject.axes.x < 0) {
                    // Le joueur dépasse la limite gauche de la carte
                    this.playerObject.x = 0; // Réglez la position du joueur à la limite gauche
                } else if (this.playerObject.x + this.playerObject.axes.x > Game.mapWidth - this.playerObject.renderers[0].width) {
                    // Le joueur dépasse la limite droite de la carte
                    this.playerObject.x = Game.mapWidth - this.playerObject.renderers[0].width; // Réglez la position du joueur à la limite droite
                } else {
                    // Déplacement normal du joueur
                    this.playerObject.translate({ x: this.playerObject.axes.x * this.playerSpeed* this.dashSpeed, y: this.playerObject.axes.y * this.playerSpeed * this.dashSpeed});
                }
                // Vérification des limites verticales
                if (this.playerObject.y + this.playerObject.axes.y < 0) {
                    // Le joueur dépasse la limite supérieure de la carte
                    this.playerObject.y = 0; // Réglez la position du joueur à la limite supérieure
                } else if (this.playerObject.y + this.playerObject.axes.y > Game.mapHeight - this.playerObject.renderers[0].height) {
                    // Le joueur dépasse la limite inférieure de la carte
                    this.playerObject.y = Game.mapHeight - this.playerObject.renderers[0].height; // Réglez la position du joueur à la limite inférieure
                } else {
                    // Déplacement normal du joueur
                    this.playerObject.translate({ x: this.playerObject.axes.x * this.playerSpeed * this.dashSpeed, y: this.playerObject.axes.y * this.playerSpeed * this.dashSpeed });
                }


                // Cooldown du dash
                this.dashTimer += DE.Time.deltaTime;

                //Si on detecte un clic de souris on effectue le dash
                document.addEventListener('mousedown', (event) => {
                    //Si le temps est superieur au cooldown
                    if (this.dashTimer >= this.dashCooldown) {
                        this.dashTimer = 0; // Réinitialiser le timer de recharge
                        this.dashSpeed = 5; // Augmente la vitesse du joueur temporairement
                        this.isDashing = true;
                        
                        //Puis on retable l'etat intial avec un certains temps
                        Game.utils.delay(() => {
                            this.dashSpeed = 1;
                            this.isDashing = false;
                        },this.dashDuration,0);
                    }   
                  });

            },
            automatisms: [['checkInputs', 'checkInputs']],
            
            /**
             * Methode permettant au joueur de tirer.
             * On instancie une Bullet() et on la place sur la scene.
             */
            fire: function() {
                const bullet = new Bullet(this.x + 12, this.y + 12, this.zindex, 25);
                Game.scene.add(bullet.getBulletObject());
            },
        });
       return this.playerObject; 
    }

    /**
     * Retoune les pv actuels du joueur.
     */
    getPlayerPV(){return this.playerObject.pv}

    /**
     * Permet d'obtenir la direction actuelle du joueur pour effectuer le dash
     */
    getDashDirection() {
        const direction = new DE.Vector2(this.playerObject.axes.x, this.playerObject.axes.y);
        direction.normalize();
        return direction;
    }

    /**
     * Retourne si le joueur est entrain de dash ou pas 
     * Necessaire pour permettre le joueur d'etre invulnerable durant son dash
     */
    playerIsDashing() {
        return this.isDashing;
    }
    
    /**
     * Rajoute des points au score
     */
    addScore(value){
        this.score = this.score + value;
    }

    getScore(){
        return this.score;
    }

  }

export default Player;
