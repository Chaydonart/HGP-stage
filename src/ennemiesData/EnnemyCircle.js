import DE from '@dreamirl/dreamengine';
import EnnemyBullet from './EnnemyBullet.js';

/**
 * EnnemyCircle.js est l'objet representant l'ennemie "Circle". 
 * On passe en parametre les position de l'ennemie (x,y), sa vitesse de deplacement (speed),
 * sa cadence de tir (fireRate) et direction (direction de deplacement Vector2)
 * 
 * L'ennemie circle tir avec une certaine cadence plusieurs bullets en cercle (autour de lui)
 */

class EnemyCircle {
  constructor(x, y, speed, fireRate,direction,bulletSpeed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.fireRate = fireRate;
    this.direction = direction;
    this.bulletSpeed = bulletSpeed;


    this.fireTimer = this.fireRate; // Timer pour tirer tout les x temps

    this.enemyObject = new DE.GameObject({
      x: this.x,
      y: this.y,
      largeur: 50,
      hauteur:50,
      interactive: true,
      tag: "ennemy", //Pour detecter et tuer les ennemies qui sortent de la zone
      renderer: new DE.SpriteRenderer({spriteName: 'circle',width: 150,height:150,x:15 ,y:15}),

      //Etat de l'ennemie
      pv: 200,
    });

    //On met l'ennemie quand il est instancie directement pour eviter de souvent repeter ses deux lignes
    Game.scene.add(this.enemyObject);
    Game.ennemies.push(this);

    this.enemyObject.update = () => {
      this.move(); // Appeler la fonction de mouvement de l'ennemi

      // Augmente le compteur de temps de tir avec le temps écoulé depuis la dernière frame
      this.fireTimer += DE.Time.deltaTime;

      // Puis on verifie si le temps écoulé dépasse le taux de tir (fireRate) de l'ennemi
      if (this.fireTimer >= this.fireRate) {
        // Si le taux de tir est atteint, on déclenche la fonction de tir
        this.fire(); 
        this.fireTimer = 0; // Puis on réinitialise le compteur de temps de tir 
      }
    };


  }

  /**
   * Methode qui permet de faire avancer l'ennemie vers la direction passée en parametre
   */
  move() {
    this.enemyObject.translate({ x: this.speed * this.direction.x, y: this.direction.y * this.speed });  
  }

  /**
   * Methode permettant de gérer les tirs de l'ennemie circle
   */
  fire() {
    const numBullets = 10; // Nombre de projectiles à tirer en cercle
    const angleIncrement = (Math.PI * 2) / numBullets; // Angle entre chaque projectile
    
    for (let i = 0; i < numBullets; i++) {
      // On calcule l'angle pour chaque projectile
      const angle = i * angleIncrement;
      
      // Ainsi que la direction du projectile en fonction de l'angle
      const direction = new DE.Vector2(Math.cos(angle), Math.sin(angle));
  
      // Et on créer un nouveau projectile (EnnemyBullet) avec la position de l'ennemi comme point de départ
      // et la direction calculée pour ce projectile
      const bullet = new EnnemyBullet(this.enemyObject.x, this.enemyObject.y, direction, this.bulletSpeed);
  
      // Puis on ajoute le projectile à la scène du jeu
      Game.scene.add(bullet.getBulletObject());
    }
  }
  
  /**
   * Retourne l'ennemyObject
   */
  getEnnemyObject() {
    return this.enemyObject;
  }
}

export default EnemyCircle;
