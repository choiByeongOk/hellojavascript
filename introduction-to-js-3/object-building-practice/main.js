// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// for ball score
var para = document.querySelector('p');
let count = 0;

// function to generate random number

function random(min,max) {
    const num = Math.floor(Math.random()*(max-min)) + min;
    return num;
}

/*function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}*/

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}

Ball.prototype = Object.create(Ball.prototype);
Ball.prototype.constructor = Ball;

function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, 20, 20, exists);
    this.color = 'white';
    this.size = 10;
}

EvilCircle.prototype = Object.create(EvilCircle);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
    ctx.beginPath(); // to state that we want to draw a shape on the paper.
    ctx.strokeStyle = this.color; // what color we want the shape to be
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // trace an arc shape on the paper
    ctx.stroke(); // finish drawing the path we started with beginPath(), and fill the area it takes up with the color we specified earlier in fillStyle
}

EvilCircle.prototype.checkBounds = function() {
    if ((this.x + this.size) >= width) {
        this.x -= this.size;
    }

    if ((this.x - this.size) <= 0) {
        this.x += this.size;
    }

    if ((this.y + this.size) >= height) {
        this.y -= this.size;
    }

    if ((this.y - this.size) <= 0) {
        this.y += this.size;
    }
}

EvilCircle.prototype.setControls = function() {
    let _this = this;
    window.onkeydown = function(e) {
        if (e.key === 'a') {
            _this.x -= _this.velX;
        } else if (e.key === 'd') {
            _this.x += _this.velX;
        } else if (e.key === 'w') {
            _this.y -= _this.velY;
        } else if (e.key === 's') {
            _this.y += _this.velY;
        }
    }
}

EvilCircle.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) { // if the ball being checked exists
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                console.log("collision detected");
                balls[j].exists = false;
                count--;
                para.textContent = 'Ball count: ' + count;
            }
        }
    }
}


Ball.prototype.draw = function() {
    ctx.beginPath(); // to state that we want to draw a shape on the paper.
    ctx.fillStyle = this.color; // what color we want the shape to be
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // trace an arc shape on the paper
    ctx.fill(); // finish drawing the path we started with beginPath(), and fill the area it takes up with the color we specified earlier in fillStyle
}

Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size && balls[j].exists) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
            }
        }
    }
};

let balls = [];

while (balls.length < 25) {
    let size = random(10,20);
    let ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size,width - size),
        random(0 + size,height - size),
        random(-7,7),
        random(-7,7),
        true,
        'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
        size
    );
    balls.push(ball);
    count++;
}

var evilCircle = new EvilCircle(random(0, width), random(0, height), true);
evilCircle.setControls();

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height); // draws a rectangle of the color across the whole width and height of the canvas

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists){
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }


    // At the point where you loop through every ball and call the draw(), update(), and collisionDetect()
    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();

    //this method is repeatedly run and passed the same function name,
    // it runs that function a set number of times per second to create a smooth animation.
    requestAnimationFrame(loop);
}

loop();

