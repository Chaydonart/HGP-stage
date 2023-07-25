import DE from '@dreamirl/dreamengine';

/**
 * Bullet.js est l'objet representant les balles du joueur. 
 * Ici on instancie la balles a la position du joeur a la vitesse souhaitée.
 * La vitesse de la bullet est passée en parametres pour des potentiels powerup a implementer
 */

class Bullet {
  constructor(x, y, zindex, bulletSpeed) {
    this.x = x;
    this.y = y;
    this.zindex = zindex;
    this.bulletSpeed = bulletSpeed; 

    this.bulletObject = new DE.GameObject({
      x: this.x,
      y: this.y,
      zindex:-1,
      axes: { x: 0, y: 0 },
      tag: 'bullet',
      renderer: new DE.SpriteRenderer({spriteName:'player_bullet',width:50,height:50,x:15,y:15}),
    });

    // On calcul la direction vers le viseur pour pouvoir envoyer les balles vers cette direction
    const targetDirection = {
      x: Game.targetPointer.x - this.x,
      y: Game.targetPointer.y - this.y,
    };
  
      // Normalise la direction vers le viseur
      const targetMagnitude = Math.sqrt(targetDirection.x * targetDirection.x + targetDirection.y * targetDirection.y);
      targetDirection.x /= targetMagnitude;
      targetDirection.y /= targetMagnitude;

      this.bulletObject.update = () => {
        //On fait bouger la balle en direction du viseur
        this.bulletObject.translate({ x: targetDirection.x * this.bulletSpeed, y: targetDirection.y * this.bulletSpeed });
        
        //On la detruit si elle depasse les limites de la carte
        if (this.bulletObject.y < -20 || this.bulletObject.x < -20 || this.bulletObject.x > 1940 || this.bulletObject.y > 1100) {
          this.bulletObject.askToKill();
        }

        //On verifier les collisions avec les ennemies 
        this.collideWithEnnemy(); 
      };
  
      this.bulletObject.addAutomatism('askToKill', 'askToKill', {
        interval: 2000,
        persistent: false,
      });
  }

  /**
   * Methode qui permet de verifier la collision de cet objet avec un ennemie present sur la carte
   */
  collideWithEnnemy(){
    // On verifie la présence d'ennemie sur la carte (En utilisant le tableau Game.ennemies)
    if (Game.ennemies.length > 0) { 

      // On parcourt tous les ennemis sur la scene pour vérifier les collisions avec chaque ennemi
      for (let i = 0; i < Game.ennemies.length; i++) {
        const ennemies = Game.ennemies[i].getEnnemyObject();

        // On obtient les limites de collision de l'ennemi et du projectile
        const ennemiesBounds = ennemies.getBounds();
        const bulletBounds = this.bulletObject.getBounds();

        //Et on vérifie s'il y a une collision entre le projectile et l'ennemi
        if (
          bulletBounds.left < ennemiesBounds.right &&
          bulletBounds.right > ennemiesBounds.left &&
          bulletBounds.top < ennemiesBounds.bottom &&
          bulletBounds.bottom > ennemiesBounds.top
        ) {
          this.ennemyDamage(ennemies, i);
          break; // Sortir de la boucle dès qu'une collision est détectée
        }
      }
    }
  }

  /**
   * @returns bulletObjects
   */
  getBulletObject() {
    return this.bulletObject;
  }

  /**
   * Methodes pour infliger des degats à l'ennemie que la balle touche
   */
  ennemyDamage(ennemies, i){
    if(ennemies.pv > 0){
      ennemies.pv--;
      Game.playerEntity.addScore(1);
    } else {
      //Quand un ennemie meurt, on doit l'enlever de Game.ennemies[] afin que le systeme de collision
      //comprenne qu'il n'est plus sur la carte (et augmente la rapidité)
      Game.ennemies.splice(i, 1);
      Game.scene.remove(ennemies); 
      ennemies.askToKill();
      Game.playerEntity.addScore(10);
    }
  }

}

export default Bullet;
 