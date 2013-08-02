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
};

var shoot = false;

new Entity("Ceiling", 3500, 1000, -1000, -1000, Entity.KINEMATIC, "#000000", "#000000");
new Entity("Wall", 1100, 1500, -1000, -100, Entity.KINEMATIC, "#000000", "#000000");
new Entity("Platform", 350, 1000, 50, 400, Entity.KINEMATIC, "#000000", "#000000");
new Entity("Platform", 1450, 1000, 1050, 400, Entity.KINEMATIC, "#000000", "#000000");
new Entity("Wall", 1100, 200, 1400, 0, Entity.KINEMATIC, "#000000", "#000000");
new Entity("Wall", 1000, 300, 1500, 100, Entity.KINEMATIC, "#000000", "#000000");
new Entity("Door", 100, 200, 1400, 200, Entity.PHANTOM, "#222222", "#222222");

var projA = new Entity("Projectile A", 100, 100, 550, 1000, Entity.DYNAMIC, "#000000", "#000000");
var projB = new Entity("Projectile B", 100, 100, 700, 1500, Entity.DYNAMIC, "#000000", "#000000");
var projC = new Entity("Projectile C", 100, 100, 850, 2000, Entity.DYNAMIC, "#000000", "#000000");

CAMERA.target = Player;

GRAVITY_Y = 9.8;
GRAVITY_X = 0;

// Start the Engine
new Engine();