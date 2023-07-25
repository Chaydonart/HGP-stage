import DE from '@dreamirl/dreamengine';

/**
 * EnnemySeaker.js est l'objet representant l'ennemie "Seaker". 
 * On passe en parametre les position de l'ennemie (x,y), sa vitesse de deplacement (speed)
 * 
 * L'ennemie seaker suit le joueur afin de tenter de le toucher pour lui faire des degats
 */

class EnnemySeaker {
    constructor(x, y, speed) {
      this.x = x;
      this.y = y;
      this.speed = speed;

      this.player = Game.player; // Necessaire pour faire en sorte que l'ennemie suit le player
  
      // Générer des valeurs aléatoires pour les variations de position (afin d'eviter de faire des ennemies qui se superpose)
      this.randomXVariation = (Math.random() - 0.5) * 2; // Variation aléatoire entre -1 et 1
      this.randomYVariation = (Math.random() - 0.5) * 2; // Variation aléatoire entre -1 et 1
  
      this.ennemyObject = new DE.GameObject({
        x: this.x,
        y: this.y,
        interactive: true,
        pv: 10,
        tag: "ennemy",
        renderer: new DE.SpriteRenderer({spriteName: 'seaker',width: 100,height:100,x:25,y:25}),
      });

      this.ennemyObject.update = () => {
        if (this.player) {
          // On calculer la direction vers le joueur (avec un vecteur entre la position de l'ennemi et la position du joueur)
          const direction = new DE.Vector2(this.player.x - this.ennemyObject.x, this.player.y - this.ennemyObject.y);

          // Normalise la direction (valeur entre -1 et 1)
          direction.normalize();

          // On ajoute ensuite des variations aléatoires aux coordonnées x et y de la direction
          // pour éviter des des ennemies qui se superpose et pour avoir un effet essain d'ennemie
          const dx = direction.x * this.speed * DE.Time.deltaTime + this.randomXVariation;
          const dy = direction.y * this.speed * DE.Time.deltaTime + this.randomYVariation;

          // On déplace ensuite l'ennemi selon la direction calculée 
          this.ennemyObject.translate({ x: dx, y: dy });

          // On vérifie constamment la collision avec le joueur
          this.checkPlayerCollision();
        }
      };


      // On met l'ennemie quand il est instancie directement pour eviter de souvent repeter ses deux lignes
      Game.ennemies.push(this);
      Game.scene.add(this.ennemyObject);
    }

    /**
     * Méthode qui permet de savoir si il y a une collision avec le joueur
     * @returns bool
     */
    checkPlayerCollision() {
      const ennemyBounds = this.ennemyObject.getBounds();
      const playerBounds = this.player.getBounds();
      
      //On verifie les collisions
      const isColliding = (
        ennemyBounds.left < playerBounds.right &&
        ennemyBounds.right > playerBounds.left &&
        ennemyBounds.top < playerBounds.bottom  &&
        ennemyBounds.bottom > playerBounds.top 
      );
      // Si il y a une collision
      if (isColliding) {
        // Si le joueur ne dash pas car sinon il est invulnerable
        if(!Game.playerEntity.playerIsDashing()){
          this.playerDamage(this.player); // Le joeur se prend des degats
          
          // Puis on élimine l'ennemie une fois qu'il a touché le joueur
          Game.scene.remove(this.ennemyObject); 
          const index = Game.ennemies.indexOf(this);
          if (index !== -1) {
            Game.ennemies.splice(index, 1);
          }
        }
      }

      return isColliding;
    }

    playerDamage(player) {
      Game.camera.shakeCamera(15,10);
      player.pv--;
      if(player.pv < 1 ){
        Game.scene.remove(player);
      }
    }

  
    /**
     * Retourne l'ennemyObject
     */
    getEnnemyObject() {
      return this.ennemyObject;
    }
  
}

export default EnnemySeaker;
