class CannonBall {
  constructor(x, y) {
    var options = {
      restitution: 0.8,
      friction: 1.0,
      density: 1.0,
      isStatic: true
    };
    this.r = 40;

    this.body = Bodies.circle(x, y, this.r, options);
    this.image = loadImage("./assets/cannonball.png");
    this.trayectory = [];
    World.add(world, this.body);
  }

  shoot() {
    var velocity = p5.Vector.fromAngle(cannon.angle);
    velocity.mult(20);
    Matter.Body.setStatic(this.body, false);
    Matter.Body.setVelocity(this.body, { x: velocity.x, y: velocity.y });
  }

  display() {
    var angle = this.body.angle;
    var pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.image, 0, 0, this.r, this.r);
    pop();

    //obtener las posisiones de la bala y colocar en la matriz de traectorias
    if(this.body.velocity.x > 0 && this.body.position.x > 300){  
     var position = [this.body.position.x, this.body.position.y];
     this.trayectory.push(position);
    }
    
    // establecer imagen a la trayectoria
    for( var i = 0; i <this.trayectory.length; i++){
     image(this.image, this.trayectory[i][0], this.trayectory[i][1], 5, 5)
    }

  }
}

