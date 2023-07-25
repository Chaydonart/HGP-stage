import DE from '@dreamirl/dreamengine';

/**
 * Utils.js permet d'ajouter des methodes utile au fonctionnement du jeu : 
 * - Gestion des Hitbox 
 * - Delay pour jouer un code
 * - Jouer une partie de code tout x fois tout les x temps
 */

class Utils {

    mapManagerObj = null;
    mapLimite = 140;

    //Ajout de fonctionnalité necessaire
    init() {
      // -> getWorldPosition et getBounds permettent de gérer les Hitbox

      // Ajouter une méthode getWorldPosition à la classe GameObject
      DE.GameObject.prototype.getWorldPosition = function() {
        // On intialise la position avec les coordonnées locales de l'objet (x et y)
        let position = { x: this.x, y: this.y };

        // Parcourir la hiérarchie parentale pour ajouter les coordonnées des parents à la position
        let parent = this.parent;
        while (parent) {
          position.x += parent.x;
          position.y += parent.y;
          parent = parent.parent;
        }

        // Retourner la position globale (par rapport à la scène)
        return position;
      };

      // Ajouter une méthode getBounds à la classe GameObject
      DE.GameObject.prototype.getBounds = function() {
        // Obtenir la position globale de l'objet
        const position = this.getWorldPosition();
        
        // Obtenir le pivot, l'échelle, la largeur et la hauteur du premier renderer de l'objet
        const pivot = this.renderers[0].pivot || { x: 0, y: 0 };
        const scale = this.renderers[0].scale || { x: 1, y: 1 };
        const width = this.renderers[0].width;
        const height = this.renderers[0].height;

        // Calculer les limites (bounds) de l'objet en fonction de sa position globale, du pivot et de l'échelle
        const bounds = {
          left: position.x - pivot.x * scale.x,
          top: position.y - pivot.y * scale.y,
          right: position.x + (width - pivot.x) * scale.x,
          bottom: position.y + (height - pivot.y) * scale.y,
        };

        // Retourner les limites de l'objet (rectangle englobant son rendu)
        return bounds;
      };

        
        //Code pour secouer la camera du jeu
        DE.Camera.prototype.shakeCamera = function(intensity, duration) {
          var shakeObj = new DE.GameObject({});
          Game.scene.add(shakeObj);
      
          const originalPositionX = this.x; // Position originale de la caméra
          const originalPositionY = this.y;
          let shakeTimer = 0; // Compteur pour mesurer la durée de la secousse

          shakeObj.update = () => {
            if (shakeTimer <= duration) {
              const offsetX = Math.random() * intensity * 2 - intensity; // Décalage aléatoire en X
              const offsetY = Math.random() * intensity * 2 - intensity; // Décalage aléatoire en Y
              
              // Appliquer le décalage à la position de la caméra
              this.x = originalPositionX + offsetX;
              this.y = originalPositionY + offsetY;
              
              shakeTimer += DE.Time.deltaTime; // Mettre à jour le compteur de temps
            } else {
              Game.scene.remove(shakeObj);
              shakeObj.update = () => {};
              // La durée de la secousse est écoulée, rétablir la position originale de la caméra
              this.x = originalPositionX;
              this.y = originalPositionY;
            }
          }
        }
    }

    //Methode qui permmet de jouer un code apres un delai de spawnDelay (utilisé dans le VagueManager)
    delay(fun, spawnDelay, spawnTimer) {
      const spawnWithTime = new DE.GameObject();
      Game.scene.add(spawnWithTime);
      spawnWithTime.update = () => {
        if (spawnTimer >= spawnDelay) {
            fun();
            spawnWithTime.update = () => {}
        } else {
            spawnTimer += DE.Time.deltaTime;  
        }
     }
    }

    //Methode qui permet de jouer une partie de code x fois avec un certains delai (utilisé dans le VagueManager)
    eachTime(fun, spawnDelay, spawnTimer, numberOfOccurence) {
      const spawnWithTime = new DE.GameObject();
      var i = 0;
      Game.scene.add(spawnWithTime);
      spawnWithTime.update = () => {
        if (spawnTimer >= spawnDelay && i < numberOfOccurence) {
            fun();
            i++;
            spawnTimer = 0;
        } else if (i >= numberOfOccurence){
          spawnWithTime.update = () => {}
        } else {
            spawnTimer += DE.Time.deltaTime;  
        } 
     }
    }

}

export default Utils;
  