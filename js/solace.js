
var Player = new Entity("Player", 70, 150, 150, 150, Entity.DYNAMIC, "#000000", "#000000", 0.15, 0.7, "textures/Man.png");
/*    var color = "rgba(0, 0, 0, 0)"; // Invisible
    color = "rgba(0, 0, 0, 0.5)";
    Player.head = new Entity("Player Head", 37, 37, Player.x + 16.5, Player.y + 4.5, Entity.DYNAMIC, color, color, 0.3, 0.4);
    Player.torso = new Entity("Player Torso", 65, 49, Player.x + 2.5, Player.y + 46.5, Entity.DYNAMIC, color, color, 0.3, 0.4);
    Player.legs = new Entity("Player Legs", 31, 54, Player.x + 19.5, Player.y + 95.5, Entity.DYNAMIC, color, color, 0.3, 0.4);
    Player.manage = function() {
        if (Player.head.vx != Player.vx) {

        }
        Player.head.vx, Player.torso.vx, Player.legs.vx = 0;
        Player.head.vy, Player.torso.vy, Player.legs.vy = 0;

        Player.head.x = Player.x + 16.5;
        Player.head.y = Player.y + 4.5;

        Player.torso.x = Player.x + 2.5;
        Player.torso.y = Player.y + 46.5;

        Player.legs.x = Player.x + 19.5;
        Player.legs.y = Player.y + 95.5;
    };
*/
    Player.waitingToJump = false;
    Player.dead = false;
    Player.sheet = new Image();
        Player.sheet.src = "textures/PlayerSheet.png";
    Player.frame = {
        x : 0,
        y : 0,
        set : function(xFrame, yFrame) {
            Player.frame.x = xFrame * 70;
            Player.frame.y = yFrame * 150;
        }
    };
    Player.jump = function() {
        if (Player.touching.bottom != null) {
            Player.vy = -55;
        }
        if (Player.touching.bottom == null) {
            Player.waitingToJump = true;
        }
    };
    Player.move = function(direction) {
        if (direction > 0 && Player.touching.right == null) {
            Player.vx = 50 * direction;
        }
        if (direction < 0 && Player.touching.left == null) {
            Player.vx = 50 * direction;
        }
        if (direction == 0) {
            Player.vx = 0;
        }
    };
    Player.die = function() {
        if (Player.dead != true) {
            Player.dead = true;
            // Fragment the player
            Player.head1 = new Entity("Player Head", 18.5, 18.5, Player.x + 16.5, Player.y + 4.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx, Player.vy);
            Player.head2 = new Entity("Player Head", 18.5, 18.5, Player.x + 35, Player.y + 4.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx, Player.vy);
            Player.head3 = new Entity("Player Head", 18.5, 18.5, Player.x + 16.5, Player.y + 23, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx, Player.vy);
            Player.head4 = new Entity("Player Head", 18.5, 18.5, Player.x + 35, Player.y + 23, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx, Player.vy);
            Player.torso1 = new Entity("Player Torso", 32.5, 24.5, Player.x + 2.5, Player.y + 46.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx, Player.vy);
            Player.torso2 = new Entity("Player Torso", 32.5, 24.5, Player.x + 35, Player.y + 46.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx, Player.vy);
            Player.torso3 = new Entity("Player Torso", 32.5, 24.5, Player.x + 2.5, Player.y + 71, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx, Player.vy);
            Player.torso4 = new Entity("Player Torso", 32.5, 24.5, Player.x + 35, Player.y + 71, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx, Player.vy);
            Player.legs1 = new Entity("Player Legs", 15.5, 27, Player.x + 19.5, Player.y + 95.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx, Player.vy);
            Player.legs2 = new Entity("Player Legs", 15.5, 27, Player.x + 35, Player.y + 95.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx, Player.vy);
            Player.legs3 = new Entity("Player Legs", 15.5, 27, Player.x + 19.5, Player.y + 122.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx, Player.vy);
            Player.legs4 = new Entity("Player Legs", 15.5, 27, Player.x + 35, Player.y + 122.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx, Player.vy);

            Player.destroy();

            //CAMERA.target = null;
            CAMERA.scrollTo(0, 0, 100, Player.head2);
            wait(5, function() { location.reload() });
        }
    };

Player.frame.set(0, 6);
