// Insert game generation code here...
GameConditions = function() {
    if (Player.x > 300 && shoot == false) {
        shoot = true;
        projA.y = 1000;
        projA.vy = -110;
        projB.y = 1500;
        projB.vy = -150;
        projC.y = 2000;
        projC.vy = -185;
    }
    if (Player.touching.top == deathBlock || Player.touching.right == deathBlock || Player.touching.left == deathBlock) {
        Player.die();
    }
};

var shoot = false;

var deathBlock = new Entity("Death Block", 200, 50, 650, 0, Entity.KINEMATIC, "#aa0000");

//var pushBlock = new Entity("Push Block", 80, 80, 250, 50, Entity.DYNAMIC, "#000000", "#000000", 0.3, 0.2);

new Entity("Ceiling", 3500, 1000, -1000, -1000, Entity.KINEMATIC);
new Entity("Wall", 1100, 1500, -1000, -100, Entity.KINEMATIC);
new Entity("Platform", 350, 1000, 50, 400, Entity.KINEMATIC);
new Entity("Platform", 1450, 1000, 1050, 400, Entity.KINEMATIC);
new Entity("Wall", 1100, 200, 1400, 0, Entity.KINEMATIC);
new Entity("Wall", 1000, 300, 1500, 100, Entity.KINEMATIC);
new Entity("Door", 100, 200, 1400, 200, Entity.PHANTOM, "#222222");

var projA = new Entity("Projectile A", 100, 100, 550, 1000, Entity.DYNAMIC);
var projB = new Entity("Projectile B", 100, 100, 700, 1500, Entity.DYNAMIC);
var projC = new Entity("Projectile C", 100, 100, 850, 2000, Entity.DYNAMIC);

CAMERA.target = Player;

GRAVITY_Y = 9.8;
GRAVITY_X = 0;

// Start the Engine
new Engine();