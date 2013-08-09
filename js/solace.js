
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
    Player.jumping = false;
    Player.walking = false;
    Player.falling = false;
    Player.facing = 1;
    Player.dead = false;
    Player.sheet = "textures/PlayerSheet.png";
    Player.frame = {
        x : 0,
        y : 0,
        frameX : 0,
        frameY : 0,
        tick : 0,
        jumpTick : 0,
        baseSpeed : 1.75,
        speed : 0,
        set : function(xFrame, yFrame) {
            Player.frame.x = xFrame * 70;
            Player.frame.frameX = xFrame;
            Player.frame.y = yFrame * 150;
            Player.frame.frameY = yFrame;
        }
    };
    Player.jump = function() {
        if (Player.touching.bottom != null) {

            Player.vy = -55;
            Player.jumping = true;
            Player.walking = false;
            if (Player.facing == -1) {
                Player.frame.set(2, 4);
            }
            else {
                Player.frame.set(0, 4);
            }
        }
    };
    Player.move = function(direction) {
        if (Player.jumping == false && Player.falling == false && Player.touching.bottom != null) {
            Player.walking = true;
            Player.frame.speed = Math.abs(direction);
            if (direction > 0 && Player.touching.right == null) {
                Player.vx = 50 * direction;
                Player.facing = 1;
                Player.frame.tick = Player.frame.tick + Player.frame.speed;
                if (Player.frame.frameY == 0) {
                    if (Player.frame.tick >= Player.frame.baseSpeed) {
                        Player.frame.tick = 0;
                        Player.frame.frameX = Player.frame.frameX + 1;
                        if (Player.frame.frameX > 3) {
                            Player.frame.frameX = 0;
                        }
                        Player.frame.set(Player.frame.frameX, 0);
                    }
                }
                else {
                    Player.frame.set(0, 0)
                }
            }
            else if (direction < 0 && Player.touching.left == null) {
                Player.vx = 50 * direction;
                Player.facing = -1;
                Player.frame.tick = Player.frame.tick + Player.frame.speed;
                if (Player.frame.frameY == 1) {
                    if (Player.frame.tick >= Player.frame.baseSpeed) {
                        Player.frame.tick = 0;
                        Player.frame.frameX = Player.frame.frameX + 1;
                        if (Player.frame.frameX > 3) {
                            Player.frame.frameX = 0;
                        }
                        Player.frame.set(Player.frame.frameX, 1);
                    }
                }
                else {
                    Player.frame.set(0, 1)
                }
            }
            if (direction == 0) {
                Player.vx = 0;
                Player.frame.set(0,6);
                Player.walking = false;
                Player.frame.tick = 0;
            }
        }
        else {
            if (direction > 0 && Player.touching.right == null) {
                Player.vx = 50 * direction;
                Player.facing = 1;
                Player.frame.set(0, 4);
            }
            if (direction < 0 && Player.touching.left == null) {
                Player.vx = 50 * direction;
                Player.facing = -1;
                Player.frame.set(2, 4);
            }
            if (direction == 0) {
                Player.vx = 0;
            }
        }
    };
    Player.manage = function() {
        /*
        if (Player.touching.bottom == null && Player.vy > 0) {
            Player.falling = true;
            if (Player.facing == -1) {
                Player.frame.set(2, 4);
            }
            else {
                Player.frame.set(0, 4);
            }
        }
        else {
            Player.falling = false;
        }
        */
        if (Player.jumping == false && Player.walking == false && Player.frame.jumpTick > 0) {
            //alert("");
            Player.frame.jumpTick++;
            if (Player.facing == -1) {
                Player.frame.set(3, 4);
            }
            else {
                Player.frame.set(1, 4);
            }
            if (Player.frame.jumpTick > 10) {
                Player.frame.jumpTick = 0;
            }
        }
        if (Player.touching.bottom != null && Player.jumping == true) {
            Player.frame.jumpTick = 1;
            if (Player.facing == -1) {
                Player.frame.set(3, 4);
            }
            else {
                Player.frame.set(1, 4);
            }
            Player.jumping = false;
        }
    };
    Player.die = function() {
        if (Player.dead != true) {
            Player.dead = true;
            // Fragment the player
            Player.head1 = new Entity("Player Head", 18.5, 18.5, Player.x + 16.5, Player.y + 4.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx - 1, Player.vy - 1);
            Player.head2 = new Entity("Player Head", 18.5, 18.5, Player.x + 35, Player.y + 4.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx + 1, Player.vy - 1);
            Player.head3 = new Entity("Player Head", 18.5, 18.5, Player.x + 16.5, Player.y + 23, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx - 1, Player.vy + 1);
            Player.head4 = new Entity("Player Head", 18.5, 18.5, Player.x + 35, Player.y + 23, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx + 1, Player.vy + 1);
            Player.torso1 = new Entity("Player Torso", 32.5, 24.5, Player.x + 2.5, Player.y + 46.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx - 1, Player.vy - 1);
            Player.torso2 = new Entity("Player Torso", 32.5, 24.5, Player.x + 35, Player.y + 46.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx + 1, Player.vy - 1);
            Player.torso3 = new Entity("Player Torso", 32.5, 24.5, Player.x + 2.5, Player.y + 71, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx - 1, Player.vy + 1);
            Player.torso4 = new Entity("Player Torso", 32.5, 24.5, Player.x + 35, Player.y + 71, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx + 1, Player.vy + 1);
            Player.legs1 = new Entity("Player Legs", 15.5, 27, Player.x + 19.5, Player.y + 95.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx - 1, Player.vy - 1);
            Player.legs2 = new Entity("Player Legs", 15.5, 27, Player.x + 35, Player.y + 95.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx + 1, Player.vy - 1);
            Player.legs3 = new Entity("Player Legs", 15.5, 27, Player.x + 19.5, Player.y + 122.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx - 1, Player.vy + 1);
            Player.legs4 = new Entity("Player Legs", 15.5, 27, Player.x + 35, Player.y + 122.5, Entity.DYNAMIC, "#000000", "#000000", Player.elasticity * 3, Player.friction * 0.5, null, Player.vx + 1, Player.vy + 1);

            Player.destroy();

            //CAMERA.target = null;
            CAMERA.scrollTo(0, 0, 100, Player.head2);
            wait(5, function() { location.reload() });
        }
    };

Player.frame.set(0, 6);
