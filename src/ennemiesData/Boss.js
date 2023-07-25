import DE from '@dreamirl/dreamengine';
import EnnemyBullet from './EnnemyBullet';
import EnnemySeaker from './EnnemySeaker';
import EnemyCircle from './EnnemyCircle';
import EnnemyRotate from './EnnemyRotate';

/**
 * Boss.js est l'objet representant le boss du jeu. 
 */

class Boss {
  constructor(x, y, numProjectiles, fireRate,projectileSpeed) {
    this.x = x;
    this.y = y;

    this.numProjectiles = numProjectiles;
    this.fireRate = fireRate;
    this.projectileSpeed = projectileSpeed;

    this.player = Game.player; //Necessaire pour que l'ennemie suive le joueur


    this.ennemyObject = new DE.GameObject({
      x: this.x,
      y: this.y,
      zindex: 15,
      largeur: 50,
      hauteur: 50,
      interactive: true,
      pv: 8000,
      tag: "boss",
      renderer: new DE.SpriteRenderer({spriteName: 'boss',x:12}),
    });

    this.fireTimer = this.fireRate; // Initialiser le timer pour que l'ennemi tire dès le début
  }
  
  /**
   * Retourne l'ennemyObject
   */
  getEnnemyObject() {
    return this.ennemyObject;
  }

  //----------------------------------------------------------------------------------------------------//
  //                         Le code des différentes attaques du boss                                  //
  //----------------------------------------------------------------------------------------------------//

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

  attack_one(fireRate){
    this.fireRate = fireRate;
    this.ennemyObject.update = () => {
        if (this.player) {
          // On calcule la direction vers le joueur 
          const direction = new DE.Vector2(this.player.x - this.ennemyObject.x, this.player.y - this.ennemyObject.y);
          direction.normalize();
  
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
  }

  attack_two(){
    this.delete_ennemies();
    new EnemyCircle(200,200,0,50,new DE.Vector2(0,0),3);
    new EnemyCircle(Game.mapWidth - 200,200,0,50,new DE.Vector2(0,0),3);
  }

  attack_three(){
    this.fireRate = 10;
    this.ennemyObject.update = () => {
        // Vérifier si le délai de tir (fireTimer) est écoulé
        if (this.fireTimer >= this.fireRate) {
            const direction = new DE.Vector2(this.player.x - this.ennemyObject.x, this.player.y - this.ennemyObject.y);
            direction.normalize();
    
            // On appele la fonction fire() pour tirer les projectiles
            const bullet = new EnnemyBullet(this.ennemyObject.x, this.ennemyObject.y, direction, 5);
            Game.scene.add(bullet.getBulletObject());
           // On réinitialise le délai de tir (fireTimer) à 0 pour commencer le compteur à nouveau
            this.fireTimer = 0;
        } else {
          // Si le délai de tir n'est pas encore écoulé, augmenter le compteur de délai de tir (fireTimer)
          this.fireTimer += DE.Time.deltaTime;
        }
      };
  }

  attack_four(){
    Game.utils.delay( () => {
      Game.utils.eachTime(() => {
          new EnnemySeaker(Game.mapWidth / 2,200,3);
      },10,5,25);},50,0)
  }

  attack_five(){
    new EnnemyRotate(150,150,2,new DE.Vector2(0,0),10,1);
    new EnnemyRotate(Game.mapWidth - 200,150,2,new DE.Vector2(0,0),10,-1);
    new EnnemyRotate(150,Game.mapHeight - 200,2,new DE.Vector2(0,0),10,-1);
    new EnnemyRotate(Game.mapWidth - 200,Game.mapHeight - 200,2,new DE.Vector2(0,0),10,-1);
  }

  attack_six(){
    new EnnemyRotate(150,150,2,new DE.Vector2(0,0),15,1);
    new EnnemyRotate(Game.mapWidth - 200,150,2,new DE.Vector2(0,0),15,-1);
    new EnnemyRotate(150,Game.mapHeight - 200,2,new DE.Vector2(0,0),15,-1);
    new EnnemyRotate(Game.mapWidth - 200,Game.mapHeight - 200,2,new DE.Vector2(0,0),15,-1);
  }
  
  //On utilise stop attack pour arreter une attaque avant d'enclecher la prochaine
  stop_attack(){
    this.ennemyObject.update = () => {
    };
  }

  //On utilise cette methodes pour supprimer tout les ennemies sur la carte 
  //(pour eviter trop d'ennemie sur la carte en meme temps contre le boss)
  delete_ennemies(){
    // On supprime les ennemies sur la map d'abord
    for (let i = 0; i < Game.ennemies.length; i++) {
      const enemyObject = Game.ennemies[i].getEnnemyObject();
      if (enemyObject.tag === "ennemy") {
          enemyObject.askToKill();
          Game.ennemies.splice(i, 1);
          i--;
      }
    }
  }
  //Initialisation du boss pour le mettre sur le terrain et le faire avancer (mini animation)
  init(){
    Game.ennemies.push(this);
    Game.scene.add(this.ennemyObject);
    this.ennemyObject.update = () => {
      if(this.ennemyObject.y < 200){
        this.ennemyObject.translate({ x: 0, y: 1});
      } else{
        this.attack_one(70);
      }

    }

  }

}

export default Boss;
