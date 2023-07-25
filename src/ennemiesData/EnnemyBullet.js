import DE from '@dreamirl/dreamengine';

/**
 * Bullet.js est l'objet representant les balles des ennemies. 
 * Ici on instancie la balles a la position de l'enneime et a la vitesse souhaitée ainsi que dans la direction souhaitée.
 */

class EnnemyBullet {

  constructor(x, y, direction, speed) {
    this.x = x;
    this.y = y;
    this.direction = direction; 
    this.speed = speed;

    this.bulletObject = new DE.GameObject({
      x: this.x,
      y: this.y,
      zindex: -5,
      axes: { x: 0, y: 0 },
      tag: 'bullet',
      renderer: new DE.SpriteRenderer({spriteName: 'ennemyBullet',width:70,height:70,x:13,y:13 }),
    });

    this.bulletObject.update = () => {
      // On met a jour les coordonnées en fonction de la direction et de la vitesse
      this.bulletObject.translate({ x: this.direction.x * this.speed, y: this.direction.y * this.speed });
      
      // Et on vérifie si le projectile entre en collision avec le joueur
      this.collideWithPlayer();
    };

    // On ajoute un automatisme au projectile pour le demander à être supprimé après un délai de 2000 ms (2 secondes)
    // L'automatisme ne doit pas persister après la destruction du projectile
    this.bulletObject.addAutomatism('askToKill', 'askToKill', {
      interval: 2000,
      persistent: false,
    });

  }

  /**
   * @returns bulletObject
   */
  getBulletObject() {
    return this.bulletObject;
  }

  /**
   * Methode qui verifie si le projectile de l'ennime entre en collision avec le joeur
   */
  collideWithPlayer(){
    const player = Game.player;
    const playerBounds = player.getBounds();
    const bulletBounds = this.bulletObject.getBounds();
    if (
      bulletBounds.left < playerBounds.right  &&
      bulletBounds.right > playerBounds.left  &&
      bulletBounds.top < playerBounds.bottom  &&
      bulletBounds.bottom > playerBounds.top 
    ) {
      //Si le joueur ne dash pas (et donc n'est pas invulnerable)
      if(!Game.playerEntity.playerIsDashing()){   
        //On supprime le projectile ennemie et on donne des degats au joueur   
        this.bulletObject.askToKill()
        this.playerDamage(player);}

    }
  } 

  /**
   * Methode qui donne des degats au joueur
   */
  playerDamage(player) {
    // On applique un effet de vibration a la camera (retour joueur)
    Game.camera.shakeCamera(15,10);
    player.pv--;
    if(player.pv < 1 ){
      // Si les pv du joueur sont a 0, on le supprime de la scene
      Game.scene.remove(player);
    }
  }

}

export default EnnemyBullet;
