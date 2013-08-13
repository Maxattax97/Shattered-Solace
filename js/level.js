// Insert game generation code here...
/*
var count = 0;
var count2 = 0;
var jumpCount = 0;
var frameTick = 6;
var frameX = 0;
var frameY = 0;
*/

GameConditions = function() {
    if (Player.x > 300 && shoot == false) {
        shoot = true;
        proj.y = 900;
        proj.vy = -105;
    }
    if (Player.touching.bottom == floor) {
        Player.die();
    }
};

var shoot = false;

//var deathBlock = new Entity("Death Block", 200, 50, 650, 0, Entity.KINEMATIC, "#aa0000");
var floor = new Entity("Floor", 2650, 1000, -600, 1400, Entity.KINEMATIC);

new Entity("Ceiling", 3500, 1000, -1000, -1000, Entity.KINEMATIC);
new Entity("Wall", 1100, 1500, -1000, -100, Entity.KINEMATIC);
new Entity("Platform", 350, 1000, 50, 400, Entity.KINEMATIC);
new Entity("Platform", 1450, 1000, 1050, 400, Entity.KINEMATIC);
new Entity("Wall", 1100, 200, 1400, 0, Entity.KINEMATIC);
new Entity("Wall", 1000, 300, 1500, 100, Entity.KINEMATIC);
new Entity("Door", 100, 200, 1400, 200, Entity.PHANTOM, "#222222");

var proj = new Entity("Projectile", 100, 100, 700, 3000, Entity.DYNAMIC);

CAMERA.target = Player;

GRAVITY_Y = 9.8;
GRAVITY_X = 0;

// Start the Engine
new Engine();