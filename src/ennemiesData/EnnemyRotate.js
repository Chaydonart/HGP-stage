import DE from '@dreamirl/dreamengine';
import EnnemyBullet from './EnnemyBullet.js';

/**
 * EnnemyRotate.js est l'objet representant l'ennemie "Rotate". 
 * On passe en parametre les position de l'ennemie (x,y), sa vitesse de deplacement (speed)
 * sa direction de deplacement (direction en Vector2),
 * sa cadence de tir (fireRate) et direction de tir (shootDirection (tirer vers la droit ou la gauche))
 * 
 * L'ennemie rotate tire comme un moulin des balles
 */

class EnnemyRotate {
  spawnTimer = 0; 
  incr = 0;
  constructor(x, y, speed,direction,fireRate,shootDirection) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.direction = direction;
    this.fireRate = fireRate;
    this.shootDirection = shootDirection;

    this.rotateEnnemyObj = new DE.GameObject({
      x: this.x,
      y: this.y,
      largeur: 50,
      hauteur:50,
      interactive: true,
      tag: "ennemy",
      renderer: new DE.SpriteRenderer({spriteName: 'rotate',width: 150,height:150,x:3,y:20}),

      //Etat de l'ennemie
      pv: 50,
    });

    this.rotateEnnemyObj.update = () => {
      this.move(); // Mouvement de l'ennemi

      if (this.spawnTimer >= this.fireRate) {
        this.fire();
        this.spawnTimer = 0;  // Réinitialiser le compteur de délai de spawn
      } else {
            this.spawnTimer += DE.Time.deltaTime;  // Mettre à jour le compteur de délai de spawn
      }

    };

    // On met l'ennemie quand il est instancie directement pour eviter de souvent repeter ses deux lignes
    Game.ennemies.push(this);
    Game.scene.add(this.rotateEnnemyObj);
  }

  /**
   * Methode qui permet de faire avancer l'ennemie vers la direction passée en parametre
   */
  move() {
    this.rotateEnnemyObj.translate({ x: this.speed * this.direction.x, y: this.direction.y * this.speed });  
  }

  /**
   * Methode permettant de gérer les tirs de l'ennemie circle
   */
  fire() {
    const numBullets = 10; // Nombre de projectiles à tirer en cercle
    const angleIncrement = (Math.PI * 2) / numBullets; // Angle entre chaque projectile

    // On calcule l'angle de départ du premier projectile en fonction du nombre de tirs déjà effectués qu'on incrémenté à chaque tir
    const angle = this.incr * angleIncrement * this.shootDirection;

    // On calcule la direction du projectile en fonction de l'angle 
    const direction = new DE.Vector2(Math.cos(angle), Math.sin(angle));

    // Puis on créer un nouveau projectile avec les paramètres de position et de direction
    const bullet = new EnnemyBullet(this.rotateEnnemyObj.x, this.rotateEnnemyObj.y, direction, 4);

    // On ajoute le projectile à la scène du jeu
    Game.scene.add(bullet.getBulletObject());

    // Et on incrémente le compteur de tirs 
    this.incr++;
  }

  /**
   * Retourne l'ennemyObject
   */
  getEnnemyObject() {
    return this.rotateEnnemyObj;
  }
}

export default EnnemyRotate;
