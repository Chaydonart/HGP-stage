import DE from '@dreamirl/dreamengine';

class MapManager {

  mapLimite = 140;

  constructor() {
    // Créer l'objet qui gère le mapManagement
    this.mapManagerObj = new DE.GameObject({
      x: 0,
      y: 0,
      tag: "map_manager",
    });

   
    this.mapManagerObj.update = () => {
        // On parcours tous les objets de la scène
        if(Game.scene.gameObjects.length > 0 ){
               for (let i = 0; i < Game.scene.gameObjects.length; i++) {
          const object = Game.scene.gameObjects[i];

          // Puur verifier si l'objet est en dehors des limites de la carte
          if (
            (object.x < -this.mapLimite ||
            object.x > Game.mapWidth + this.mapLimite ||
            object.y < -this.mapLimite ||
            object.y > Game.mapHeight + this.mapLimite)
            && object.tag != "pointer"  // Ignorer le traitement viseur
          ) {
            // On supprime l'objet de la liste des objets de la scène
            Game.scene.gameObjects.splice(i, 1);
            i--;

            // Si l'objet a le tag "ennemy"
            if (object.tag === "ennemy") {
              // On recherche l'ennemi correspondant dans le tableau Game.ennemies
              const enemyIndex = Game.ennemies.findIndex(enemy => enemy.getEnnemyObject() === object);
              if (enemyIndex !== -1) {
                // Afin de le supprimer
                Game.ennemies.splice(enemyIndex, 1);
              }
            }

            // On demande à l'objet de se détruire 
            object.askToKill();
          }
        }
        }
     
      };
  }

  init(){ Game.scene.add(this.mapManagerObj);}
}

export default MapManager;
  