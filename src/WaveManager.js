import DE from '@dreamirl/dreamengine';
import EnnemySeaker from './ennemiesData/EnnemySeaker';
import EnemyCircle from './ennemiesData/EnnemyCircle';
import EnnemySimple from './ennemiesData/EnnemySimple';
import EnnemyRotate from './ennemiesData/EnnemyRotate';
import EnnemyShotgun from './ennemiesData/EnnemyShotgun';
import Boss from './ennemiesData/Boss.js';
import Utils from './Utils';

/**
 * WaveManager.js permet de gerer la suite des vagues d'ennemies qui arrive
 * 
 * Une fois inités, les ennemies arrive en boucle en suivant la logique des differentes vagues
 */

class VagueManager {
    vagues = [this.vague1(), this.vague2, this.vague3, ]
    utils = new Utils();
    numberVague = 0; 
    ennemiesOnMap = false;

    // Objet vide qui sert a ecouter 
    vagueObj = new DE.GameObject({
        x: 0,
        y: 0,
        tag: "vague_manager"
    });

    //Utiliser dans un certains cas precis pour une vague d'ennemie
    spawnWithTime = new DE.GameObject({
    });
    spawnTimer = 0; 
    spawnDelay = 0;

    // On initie le debut des vagues d'ennemies
    vagueInit() {
        Game.scene.add(this.vagueObj);
        Game.scene.add(this.spawnWithTime);
        //En commencant pour la vague 1
        this.numberVague = 1;
        this.vagueManager();
    }

    // Mettre à jour la fonction vagueManager
    vagueManager() {
        // Mettre à jour la fonction vagueObj.update
        this.vagueObj.update = () => {
        // Utiliser une instruction switch pour exécuter la fonction correspondante à chaque vague
        switch(this.numberVague){
            case 1: 
                this.vague3();
                break;
            case 2: 
                this.vague1();
                break;
            case 3: 
                this.vague2();
                break;
            case 4: 
                this.vague4();
                break;
            case 5:
                this.vague5();
                break;
            case 6:
                this.vague6();
                break;
            case 7: 
                this.vague7();
                break;
            case 8: 
                this.vague8();
                break;
            case 9:
                this.vague9();
                break;
            case 10:
                this.vague10();
                break;
            case 11:
                this.boss();
                break;
            default: 
            break;
        }
        // Vérifier si tous les ennemis ont été vaincus et donc plus dans la scene
        if (Game.ennemies == 0) {
            // Réinitialiser l'état "ennemiesOnMap" pour indiquer qu'il n'y a plus d'ennemis sur la carte
            this.ennemiesOnMap = false;
            // Passer à la vague suivante
            this.numberVague++;
        }
        }
    }
  
//--------------------------------------------------------------------------------------------------------------//

    // Chaque vague est coder pour faire spawn les ennemies pour avoir plusieurs vague d'ennemies qui viennent 
    // se battre contre les joueurs
    vague1() {
        if(this.ennemiesOnMap == false) {
            this.ennemiesOnMap = true;
            for(let i = 0; i < 3; i++){
                new EnnemySeaker(-10,Game.mapHeight/2,5);
            }
        }
    }

    vague2(){
        if(this.ennemiesOnMap == false) {
            this.ennemiesOnMap = true;
            this.spawnDelay = 100;
            //Seaker
            for(let i = 0; i < 3; i++){
                new EnnemySeaker(Game.mapWidth + 10,Game.mapHeight/2,5);
            }
            //Simple
            var numberspawned = 0;
            this.spawnWithTime.update = () => {
                if (this.spawnTimer >= this.spawnDelay) {
                    new EnnemySimple(Game.mapWidth+50,0,2,100,new DE.Vector2(-1,0),new DE.Vector2(0,1));
                    new EnnemySimple(-50,1030,2,100,new DE.Vector2(1,0),new DE.Vector2(0,-1));
                    numberspawned++;

                    if(numberspawned == 8 || numberspawned == 14){
                        for(let i = 0; i < 5; i++){
                            new EnnemySeaker(-10,Game.mapHeight/2,5);
                        }
                    }

                    if(numberspawned == 11){
                        for(let i = 0; i < 5; i++){
                            new EnnemySeaker(Game.mapWidth + 10,Game.mapHeight/2,5);
                        }
                    }

                    this.spawnTimer = 0;  // Réinitialiser le compteur de délai de spawn
                } else if(numberspawned == 15){
                    this.spawnWithTime.update = () => {};
                 } 
                else {
                    this.spawnTimer += DE.Time.deltaTime;  // Mettre à jour le compteur de délai de spawn
                }
            }
        }
    }

    vague3() {
        if(this.ennemiesOnMap == false) {
            this.ennemiesOnMap = true;
            new EnnemySimple(-130,0,2,99999,new DE.Vector2(0,1), new DE.Vector2(0,0));
            Game.utils.eachTime(() => {
                new EnnemySimple(-100,-100,2,60,new DE.Vector2(1,1),new DE.Vector2(1,0));
                new EnnemySimple(Game.mapWidth+60,Game.mapHeight+60,2,60,new DE.Vector2(-1,-1),new DE.Vector2(-1,0));
                new EnnemySimple(Game.mapWidth+60,-100,2,60,new DE.Vector2(-1,1),new DE.Vector2(-1,0));
                new EnnemySimple(-100,Game.mapHeight+60,2,60,new DE.Vector2(1,-1),new DE.Vector2(1,0));
            },600,600,2);
        }
    }

    vague4() {
        if(this.ennemiesOnMap == false) {
            this.ennemiesOnMap = true;
                new EnemyCircle(480,-50,2,100,new DE.Vector2(0,1),1);
                new EnemyCircle(480 * 3,-50,2,100,new DE.Vector2(0,1),1);
                new EnemyCircle(960,Game.mapHeight + 50 ,2,100,new DE.Vector2(0,-1),1);

        }
    }

    vague5() {

        if(this.ennemiesOnMap == false) {
            this.ennemiesOnMap = true;
            new EnnemySimple(-130,0,1,99999,new DE.Vector2(0,1), new DE.Vector2(0,0));
            Game.utils.delay( () => {
                    new EnnemyRotate(150,150,2,new DE.Vector2(0,0),20,1);
                    new EnnemyRotate(Game.mapWidth - 200,150,2,new DE.Vector2(0,0),20,-1);
                    new EnnemyRotate(150,Game.mapHeight - 200,2,new DE.Vector2(0,0),20,-1);
                    new EnnemyRotate(Game.mapWidth - 200,Game.mapHeight - 200,2,new DE.Vector2(0,0),20,-1);
            }, 500,500);
            var alterne = 0;
            Game.utils.delay(() => {
                this.spawnWithTime.update = () => {
                    const foundEnnemy = Game.ennemies.some((ennemy) => {
                        return ennemy instanceof EnnemyRotate;
                      });
                    if (this.spawnTimer >= this.spawnDelay && foundEnnemy) {
                        switch(alterne){
                            case 0:
                                new EnnemySeaker(Game.mapWidth + 10,Game.mapHeight/2,5);
                                break;
                            case 1:
                                new EnnemySeaker(-10,Game.mapHeight/2,5);
                                break;
                            case 2:
                                new EnnemySeaker(Game.mapWidth / 2,-10,5);
                                break;
                            case 3:
                                new EnnemySeaker(Game.mapWidth / 2,Game.mapHeight + 10,5);
                                break;
                            default:
                                break;
                        }
                        alterne = (alterne + 1) % 3
                        this.spawnTimer = 0;
                        this.spawnDelay = 150;  
                      } else {
                            this.spawnTimer += DE.Time.deltaTime;  // Mettre à jour le compteur de délai de spawn
                      }
                }
            },500,0);



        }
    }

    vague6() {
        if(this.ennemiesOnMap == false) {
            this.ennemiesOnMap = true;
            for(let i = 1; i < 10; i++){
                if( i < 4 || i > 6){
                    new EnnemySimple(1970,(120 * i) - 90,2,40,new DE.Vector2(-1,0),new DE.Vector2(1,0));
                } else {
                    new EnnemySimple(-10,(120 * i) - 90,2,40,new DE.Vector2(1,0),new DE.Vector2(-1,0));
                }
            }
            var alterne = 0;
            Game.utils.eachTime( () => {
                switch(alterne){
                    case 0:
                        new EnnemySeaker(Game.mapWidth + 10,Game.mapHeight/2,5);
                        break;
                    case 1:
                        new EnnemySeaker(-10,Game.mapHeight/2,5);
                        break;
                    case 2:
                        new EnnemySeaker(Game.mapWidth / 2,-10,5);
                        break;
                    case 3:
                        new EnnemySeaker(Game.mapWidth / 2,Game.mapHeight + 10,5);
                        break;
                    default:
                        break;
                }
                alterne = (alterne + 1) % 4;
        }, 200,0,5); 
    }
    }

    vague7(){
        if(this.ennemiesOnMap == false) {
            this.ennemiesOnMap = true;
            new EnnemySimple(-130,0,1,99999,new DE.Vector2(0,1), new DE.Vector2(0,0));
            var alterne = 0;
            Game.utils.eachTime( () => {
                switch(alterne){
                    case 0:
                        new EnnemySeaker(Game.mapWidth + 10,Game.mapHeight/2,6);
                        new EnnemySeaker(Game.mapWidth + 10,Game.mapHeight/2,3);
                        break;
                    case 1:
                        new EnnemySeaker(-10,Game.mapHeight/2,6);
                        new EnnemySeaker(-10,Game.mapHeight/2,3);
                        break;
                    case 2:
                        new EnnemySeaker(Game.mapWidth / 2,-10,6);
                        new EnnemySeaker(Game.mapWidth / 2,-10,3);
                        break;
                    case 3:
                        new EnnemySeaker(Game.mapWidth / 2,Game.mapHeight + 10,6);
                        new EnnemySeaker(Game.mapWidth / 2,Game.mapHeight + 10,3);
                        break;
                    default:
                        break;
                }
                alterne = (alterne + 1) % 4;
            }, 110,0,10); 
        }
    }

    vague8(){
        if(this.ennemiesOnMap == false) {
            this.ennemiesOnMap = true;
            new EnemyCircle(-50,-50,2,80,new DE.Vector2(1,1),1)
            new EnemyCircle(Game.mapWidth + 50,Game.mapHeight + 50,2,80,new DE.Vector2(-1,-1),1)
        }
    }

    vague9(){
        if(this.ennemiesOnMap == false) {
            this.ennemiesOnMap = true;
            new EnnemySimple(-130,0,0.8,99999,new DE.Vector2(0,1), new DE.Vector2(0,0));
            Game.utils.eachTime(() => {
                new EnnemySimple(0,-80,2,50,new DE.Vector2(0,1),new DE.Vector2(1,0));
                new EnnemySimple(Game.mapWidth-50,-80,2,50,new DE.Vector2(0,1),new DE.Vector2(-1,0));
            },100,100,10);

            Game.utils.delay(() => {
                var alterne = 0;
                Game.utils.eachTime( () => {
                    switch(alterne){
                        case 0:
                            new EnnemySeaker(Game.mapWidth + 10,Math.random() * 681 + 200 ,5);
                            break;
                        case 1:
                            new EnnemySeaker(-10,Math.random() * 681 + 200,5);
                            break;
                        default:
                            break;
                    }
                    alterne = (alterne + 1) % 2;
                }, 80,0,15); 
            }, 1000,0)
        }
    } 

    vague10(){
        if(this.ennemiesOnMap == false) {
            this.ennemiesOnMap = true;
            new EnnemySimple(-130,0,1.5,99999,new DE.Vector2(0,1), new DE.Vector2(0,0));
            Game.utils.delay( () => {
            Game.utils.eachTime(() => {
                new EnnemySeaker(Game.mapWidth / 2,-10,5);
            },10,5,50);},100,0)
        }
    }

    //La logistique du boss est particuliere
    boss(){
        if(this.ennemiesOnMap == false) {
            this.ennemiesOnMap = true;

            //On remet les point de vies du joueur au maximum
            Game.player.pv = 5;
            Game.ui.resetUI(Game.playerEntity); //On reset l'afficheur pour afficher a nouveau les coeurs
            
            var theEye = new Boss(1920/2,-130,5,70,4);

            //Afficheur des PVs du boss
            var pvBoss = new DE.GameObject({
                x: 960-400,
                y: 50,
                zindex:16,
                renderer: new DE.RectRenderer(500,15,"0xFFFFF"),
            })
            pvBoss.update = () => {
                pvBoss.renderer.width = theEye.getEnnemyObject().pv / 10;
            };
            Game.scene.add(pvBoss);

            //On initialise le BOOS pour qu'il apparaisse sur l'ecran
            theEye.init();

            //Boss
            var launchWave = true; //Ce bool va nous permettre de rejouer le boss tant qu'il n'est pas mort
            var bossActualizer = new DE.GameObject({
                update: () => {
                    //Une fois que le joueur a battu le boss, il gagne et on affiche l'ecran de fin
                    if(theEye.ennemyObject.pv <= 0){
                        console.log("end");
                        const endScreen = new DE.GameObject({
                            x: 1920 / 2,
                            y: 1080 / 2, 
                            zindex:50,
                            renderer: new DE.TextRenderer('',{
                              x:0,
                              y:0,
                              text:'BRAVO!',
                              textStyle: {
                                fill: 'white',
                                fontSize: 250,
                                fontFamily: 'Snippet, Monaco, monospace',
                                strokeThickness: 1,
                                align: 'center',
                              },
                              fontSize: 1000,
                            }),
                          });
                          const score = new DE.GameObject({
                            x: 960,
                            y: 540 + 150, 
                            renderer: new DE.TextRenderer('',{
                              x:0,
                              y:0,
                              text: "Score : " + Game.playerEntity.getScore(),
                              textStyle: {
                                fill: 'white',
                                fontSize: 100,
                                fontFamily: 'Snippet, Monaco, monospace',
                                strokeThickness: 1,
                                align: 'center',
                              },
                              fontSize: 1000,
                            }),
                          });

                          Game.scene.deleteAll();
                          Game.scene.add(endScreen);
                          Game.scene.add(score);
                    }
                    //Ici on gerer les differentes attaques du boss
                    if(launchWave == true){
                        launchWave = false;
                        Game.utils.delay(() => {
                            theEye.attack_one(70);
                            theEye.attack_two();
                        },800,0);
                        Game.utils.delay(() => {
                            theEye.stop_attack();
                        },1400,0);
                        Game.utils.delay(() => {
                            theEye.attack_three();
                        },1800,0);
                        Game.utils.delay(() => {
                            theEye.delete_ennemies();
                            theEye.stop_attack();
                            theEye.attack_four();
                        },2600,0);
                        Game.utils.delay(() => {
                            theEye.delete_ennemies();
                            theEye.attack_one(70);
                            theEye.attack_five();
                        },3700,0);
                        Game.utils.delay(() => {
                            theEye.delete_ennemies();
                            theEye.attack_one(35);
                        },4900,0);

                        //FOR LOOP
                        Game.utils.delay(() => {
                            launchWave = true;
                        },4960,0);

                    }
                }
            })
            //Ce qui va permette de gerer la suite d'attaque du boss
            Game.scene.add(bossActualizer);
        }
    }

 

}

export default VagueManager;