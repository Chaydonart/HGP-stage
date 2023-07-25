import DE from '@dreamirl/dreamengine';
import EnnemyBullet from './EnnemyBullet';

/**
 * EnnemyShotgun.js est l'objet representant l'ennemie "Shotgun". 
 * On passe en parametre les position de l'ennemie (x,y), sa vitesse de deplacement (speed),
 * le numero de projectile a envoyer (numProjectiles), la cadence de tir (fireRate) 
 * et la vitesse des projectiles (projectileFireSpeed)
 * 
 * L'ennemie Shotgun envoie plusieurs balles d'un coup tout en suivant le joeur
 */

class EnnemyShotgun {
  constructor(x, y, speed, numProjectiles, fireRate,projectileSpeed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.numProjectiles = numProjectiles;
    this.fireRate = fireRate;
    this.projectileSpeed = projectileSpeed;

    this.player = Game.player; //Necessaire pour que l'ennemie suive le joueur


    this.ennemyObject = new DE.GameObject({
      x: this.x,
      y: this.y,
      largeur: 50,
      hauteur: 50,
      interactive: true,
      pv: 300,
      tag: "ennemy",
      renderer: new DE.SpriteRenderer({spriteName: 'simple',width: 130,height:130,x:32.5,y:32.5}),
    });

    this.ennemyObject.update = () => {
      if (this.player) {
        // On calcule la direction vers le joueur 
        const direction = new DE.Vector2(this.player.x - this.ennemyObject.x, this.player.y - this.ennemyObject.y);
        direction.normalize();

        // Déplacer l'ennemi selon la direction vers le joueur
        const dx = direction.x * this.speed * DE.Time.deltaTime;
        const dy = direction.y * this.speed * DE.Time.deltaTime;

        // On met à jour la position de l'ennemi
        this.ennemyObject.translate({ x: dx, y: dy });

        // Tirer l'essaim de projectiles vers le joueur
        // On vérifie si le délai de tir (fireTimer) est écoulé
        if (this.fireTimer >= this.fireRate) {
          // On appele la fonction fireShotgun() pour tirer l'essaim de projectiles en direction du joueur
          this.fireShotgun(direction);
          // Puis on réinitialise le délai de tir (fireTimer) à 0 pour commencer le compteur à nouveau
          this.fireTimer = 0;
        } else {
          // Si le délai de tir n'est pas encore écoulé, augmenter le compteur de délai de tir (fireTimer)
          this.fireTimer += DE.Time.deltaTime;
        }
      }
    };

    
    this.fireTimer = this.fireRate; // Initialiser le timer pour que l'ennemi tire dès le début

    Game.ennemies.push(this);
    Game.scene.add(this.ennemyObject);
  }

  /**
   * Methode qui permet d'envoyer les projectiles de l'ennemie vers la direction voulu
   */
  fireShotgun(direction) {
    // Angle d'écart entre chaque projectile
    const spreadAngle = Math.PI / 4;
  
    // Angle entre la direction et l'axe x
    const baseAngle = Math.atan2(direction.y, direction.x);
  
    for (let i = 0; i < this.numProjectiles; i++) {
      // Calcul de l'angle pour chaque projectile en ajoutant l'écart
      const angle = baseAngle - spreadAngle / 2 + i * spreadAngle / (this.numProjectiles - 1);
  
      // Calcul de la direction du projectile
      const projectileDirection = new DE.Vector2(Math.cos(angle), Math.sin(angle));
  
      // Création et ajout du projectile à la scène
      const bullet = new EnnemyBullet(this.ennemyObject.x, this.ennemyObject.y, projectileDirection, this.projectileSpeed);
      Game.scene.add(bullet.getBulletObject());
    }
  }
  
  /**
   * Retourne l'ennemyObject
   */
  getEnnemyObject() {
    return this.ennemyObject;
}

}

export default EnnemyShotgun;
