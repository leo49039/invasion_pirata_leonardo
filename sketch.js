const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world;
var canvas, angle, tower, ground, cannon;
var balls = [];
var boat;
var boats = [];

var boatAnimation = [];
var boatSpritedata, boatSpritesheet;

var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;

var backgroundMusic, waterSound, pirateLaughSound, cannonExplosion;

var isGameOver = false;
var isLaughing = false;

var score = 0;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");
  brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json");
  brokenBoatSpritesheet = loadImage("assets/boat/broken_boat.png");

  backgroundMusic = loadSound("./assets/background_music.mp3")
  waterSound = loadSound("./assets/cannon_water.mp3")
  pirateLaughSound = loadSound("./assets/pirate_laugh.mp3")
  cannonExplosion = loadSound("./assets/cannon_explosion.mp3")
}

function setup() {
  canvas = createCanvas(1200,600);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(150, 350, 160, 310);
  cannon = new Cannon(180, 110, 100, 50, angle);
  cannonBall = new CannonBall(cannon.x, cannon.y);

  //boat = new Boat(width, height - 100, 200, 200, -100);
  var boatFrames = boatSpritedata.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var brokenBoatFrames = brokenBoatSpritedata.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }
}

function draw() {
  background(189);
  
  if(!backgroundMusic.isPlaying()){
    backgroundMusic.play();
    backgroundMusic.setVolume(0.1);
  }
  
  image(backgroundImg, 0, 0, width, height);

  for(var i = 0; i< balls.length; i++){
    showCannonBalls(balls[i], i);
   
    for(var a = 0; a < boats.length; a++){
  
      if(balls [i] !== undefined && boats [a] !== undefined){
        var collision = Matter.SAT.collides(balls[i].body, boats[a].body)
  
        if(collision.collided){
          boats[a].remove(a);
          Matter.World.remove(world, balls[i].body);
          balls.splice(i,1);
          score = score + 1;
          i--;
        }      
  
      }
  
    }
  
  }

  Engine.update(engine);
  ground.display();
  
  
  cannon.display();
  tower.display();
  showBoats();
  
  fill("#6d4c41")
  textSize(40)
  text("Puntuación: "+score, width - 300, 50);
  
  //cannonBall.display()
  //boat.display();
  
  /*Matter.Body.setVelocity(boat.body, {
    x: -0.9,
    y: 0
  });*/
 
}

function showCannonBalls(ball, index){
  ball.display();
  if(ball.body.position.x >= width || ball.body.position.y >= height - 50){
    Matter.World.remove(world, ball.body);
    waterSound.play();
    balls.splice(index, 1);
  }
}

function keyPressed(){
  if(keyCode === DOWN_ARROW){
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    balls.push(cannonBall);
  }
}



function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    cannonExplosion.play();
    //cannonBall.shoot()
    balls[balls.length - 1].shoot();
  }
}

//función para mostrar el barco
function showBoats() {
  if (boats.length > 0) {
    if (
      boats.length < 4 &&
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(
        width,
        height - 100,
        170,
        170,
        position,
        boatAnimation
      );


      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
      boats[i].animate();
     
      var collision = Matter.SAT.collides(tower.body, boats[i].body);
      if (collision.collided && !boats[i].isBroken) {
         //Agregar la advertencia isLaughing y establecerla a true
         if(!isLaughing && !pirateLaughSound.isPlaying()){
          pirateLaughSound.play();
          isLaughing = true
        }
        isGameOver = true;
        gameOver();
      }
    }
  } else {
    var boat = new Boat(width, height - 60, 170, 170, -60, boatAnimation);
    boats.push(boat);
  }
}

function gameOver() {
  swal(
    {
      title: `¡Fin del juego!`,
      confirmButtonText: "Jugar de nuevo"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}