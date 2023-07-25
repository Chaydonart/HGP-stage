import DE from '@dreamirl/dreamengine';
import EnnemyBullet from './EnnemyBullet.js';

/**
 * EnnemySimple.js est l'objet representant l'ennemie "Simple". 
 * On passe en parametre les position de l'ennemie (x,y), sa vitesse de deplacement (speed)
 * sa cadence de tir (fireRate), sa direction de deplacement (movementDirection en Vector2),
 *  et direction de tir (shootDirection en Vector2)
 * 
 * L'ennemie simple avance tout droit vers une direction et tire tout droit vers une direction
 */

class EnnemySimple {
    constructor(x, y, speed, fireRate,movementDirection,shootDirection) {
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.fireRate = fireRate;
      this.movementDirection = movementDirection;
      this.shootDirection = shootDirection;
  
      this.fireTimer = 0; // Pour iterer plusieurs tir

      this.enemyObject = new DE.GameObject({
        x: this.x,
        y: this.y,
        largeur: 50,
        hauteur:50,
        interactive: true,
        renderer: new DE.SpriteRenderer({spriteName: 'simple',width: 130,height:130,x:32.5,y:32.5}), 
        //new DE.RectRenderer(50, 50, '0xFF0000'),
        tag: "ennemy",
        //Etat de l'ennemie
        pv: 40,
      });

      this.enemyObject.update = () => {
        // Faire bouger l'ennemie
        this.move();

        // Vérifier si le délai de tir (fireTimer) est écoulé
        if (this.fireTimer >= this.fireRate) {
          // On appele la fonction fire() pour tirer les projectiles
          this.fire();
          // On réinitialise le délai de tir (fireTimer) à 0 pour commencer le compteur à nouveau
          this.fireTimer = 0;
        } else {
          // Si le délai de tir n'est pas encore écoulé, augmenter le compteur de délai de tir (fireTimer)
          this.fireTimer += DE.Time.deltaTime;
        }
      };


      //On met l'ennemie quand il est instancie directement pour eviter de souvent repeter ses deux lignes
      Game.ennemies.push(this);
      Game.scene.add(this.enemyObject);
    }

    
  /**
   * Methode permettant de gérer les tirs de l'ennemie circle
   * On instancie une EnnemyBullet
   */
    fire() {   
        const bullet = new EnnemyBullet(this.enemyObject.x, this.enemyObject.y, this.shootDirection, 1);
        Game.scene.add(bullet.getBulletObject());
    }

      /**
   * Methode qui permet de faire avancer l'ennemie vers la direction passée en parametre
   */
    move(){
      this.enemyObject.translate({ x: this.movementDirection.x * this.speed, y: this.movementDirection.y * this.speed});
    }

    /**
     * Retourne l'ennemyObject
     */
    getEnnemyObject() {
        return this.enemyObject;
    }
}

export default EnnemySimple;
