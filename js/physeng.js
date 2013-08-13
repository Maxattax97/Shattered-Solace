// Global Constants

// If an object's velocity is nearing this number, then its
// velocity will be set to 0.
var SETTLE_POINT = 0.05;

// The world's X and Y gravity values.
// Measured in seconds, i.e., 10 pixels per second.
// Positive values will move right or down.
// Negative values will move left or up.
var GRAVITY_X = 0;
var GRAVITY_Y = 0; // 9.8 m/s^2 is Earth gravity

var WORKSPACE = [];

// Engine Output

var VIEWPORT = document.getElementById("viewport");
var VIEWPORT_CONTEXT = VIEWPORT.getContext("2d");
var BUFFER = document.createElement("canvas");
var BUFFER_CONTEXT = BUFFER.getContext("2d");

// Set the view size, detect resizes, and orientation changes
var PIXEL_RATIO = window.devicePixelRatio || 1;
function setViewSize() {
    VIEWPORT.width  = window.innerWidth * PIXEL_RATIO;
    VIEWPORT.height = window.innerHeight * PIXEL_RATIO;
    BUFFER.width = window.innerWidth * PIXEL_RATIO;
    BUFFER.height = window.innerHeight * PIXEL_RATIO;

    VIEWPORT.style.width = (window.innerWidth) + 'px';
    VIEWPORT.style.height = (window.innerHeight) + 'px';
    BUFFER.style.width = (window.innerWidth) + 'px';
    BUFFER.style.height = (window.innerHeight) + 'px';
}
setViewSize();
window.addEventListener('resize', setViewSize);
window.addEventListener('orientationchange', setViewSize);

var CAMERA = {
    focusX : VIEWPORT.width / 2,
    focusY : VIEWPORT.height / 2,
    scrollX: 0,
    scrollY: 0,
    target : null,
    scrollTarget : {
        focusX : 0,
        focusY : 0,
        startX : 0,
        startY : 0,
        increment : 0,
        step : 0,
        target : null,
        state : false
    },
    scrollTo : function(focusX, focusY, increment, target) {
        this.scrollTarget.focusX = focusX;
        this.scrollTarget.focusY = focusY;
        if (target != null) {
            this.scrollTarget.focusX = target.x + (target.width / 2);
            this.scrollTarget.focusY = target.y + (target.height / 2);
        }
        this.scrollTarget.startX = CAMERA.focusX;
        this.scrollTarget.startY = CAMERA.focusY;
        this.scrollTarget.increment = increment;
        this.scrollTarget.target = target || null;
        this.scrollTarget.step = 0;
        this.scrollTarget.state = true;
    },
    scrollReady : function() {
        return !this.scrollTarget.state;
    },
    scrollCheck : function() {
        if (this.scrollTarget.state == true) {
            this.scrollTarget.step++;

            var main = this.scrollTarget;

            if (CAMERA.target != null) {
                CAMERA.target = null;
            }

            if (main.target != null) {
                main.focusX = main.target.x + (main.target.width / 2);
                main.focusY = main.target.y + (main.target.height / 2);

                if (main.startX >= main.focusX) {
                    CAMERA.focusX = (((main.focusX - main.startX) / main.increment) * main.step) + main.startX;
                }
                else if (main.startX < main.focusX) {
                    CAMERA.focusX = (((main.focusX - main.startX) / main.increment) * main.step) + main.startX;
                }
                if (main.startY >= main.focusY) {
                    CAMERA.focusY = (((main.focusY - main.startY) / main.increment) * main.step) + main.startY;
                }
                else if (main.startY < main.focusY) {
                    CAMERA.focusY = (((main.focusY - main.startY) / main.increment) * main.step) + main.startY;
                }

                if (main.step >= main.increment) {
                    CAMERA.target = main.target;
                }
            }
            else {
                if (main.startX >= main.focusX) {
                    CAMERA.focusX = (main.startX - main.focusX) / main.increment * main.step;
                }
                else if (main.startX < main.focusX) {
                    CAMERA.focusX = (main.focusX - main.startX) / main.increment * main.step;
                }
                if (main.startY >= main.focusY) {
                    CAMERA.focusY = (main.startY - main.focusY) / main.increment * main.step;
                }
                else if (main.startY < main.focusY) {
                    CAMERA.focusY = (main.focusY - main.startX) / main.increment * main.step;
                }

                if (main.step >= main.increment) {
                    CAMERA.focusX = main.focusX;
                    CAMERA.focusY = main.focusY;
                }
            }

            if (this.scrollTarget.step >= this.scrollTarget.increment) {
                this.scrollTarget.state = false;
            }
        }
    }
};

var BACKGROUND_COLOR = "#ffffff";

// A shortcut for drawing methods
var view = BUFFER_CONTEXT;

var Entity = function(name, width, height, x, y, type, fillColor, outlineColor, elasticity, friction, texture, vx, vy, ax, ay) {

    // Object functions
    this.destroy = function() {
        var location = WORKSPACE.indexOf(this);

        WORKSPACE.splice(location, 1);
    };

    this.freeze = function(time, toggleColor) {
        this.frozen = true;
        this.freezeTime = time || 5;

        if (toggleColor == true) {
            if (this.fillColor != "#00bbff" && this.outlineColor != "#005577") {
                this.lastOutlineColor = this.outlineColor;
                this.lastFillColor = this.fillColor;

                this.fillColor = "#00bbff";
                this.outlineColor = "#005577";
            }
        }
    };

    this.thaw = function() {
        this.frozen = false;
        this.freezeTime = 0;
        this.fillColor = this.lastFillColor;
        this.outlineColor = this.lastOutlineColor;
    };

    // Object properties
    this.name = name || "Object";
    this.width = width || 50;
    this.height = height || 50;
    this.x = x || 0;
    this.y = y || 0;
    this.vx = vx || 0;
    this.vy = vy || 0;
    this.ax = ax || 0;
    this.ay = ay || 0;

    this.elasticity = Math.abs(elasticity) || 0.5; // We don't want the elasticity to be negative, because then objects will move through each other.
    this.friction = friction || 0.5;
    this.fillColor = fillColor || "#000000";
    this.outlineColor = outlineColor || "#000000";
    this.texture = texture || null;
    this.type = type || Entity.DYNAMIC;
    if (this.type == Entity.KINEMATIC) {
        this.mass = 9007199254740992; // JavaScript's largest value that is not Infinity.
    }
    else {
        this.mass = (this.width * this.height);
    }
    this.touching = {
        top: null,
        left: null,
        right: null,
        bottom: null
    };

    // Some state values for functions and such
    this.frozen = false;
    this.freezeTime = 0;
    this.lastOutlineColor = this.outlineColor;
    this.lastFillColor = this.fillColor;

    WORKSPACE.push(this);
};

// Dynamic entities are affected by all aspects of
// the physics engine.
Entity.DYNAMIC = "dynamic";

// Kinematic entities collide but are not affected by
// collisions or gravity.
Entity.KINEMATIC = "kinematic";

// Phantom entities do not collide nor are affected
// by collisions.
Entity.PHANTOM = "phantom";

// Track FPS
var framesSinceLastTick = 0;
var framesPerSecond = '?';
setInterval(function(){
    framesPerSecond = framesSinceLastTick;
    framesSinceLastTick = 0;
}, 1000);

var DrawFrame = function() {

    // Set the Camera
    if (CAMERA.target != null) {
        CAMERA.focusX = CAMERA.target.x + (CAMERA.target.width / 2);
        CAMERA.focusY = CAMERA.target.y + (CAMERA.target.height / 2);
    }

    CAMERA.scrollX = (VIEWPORT.width / 2) - CAMERA.focusX;
    CAMERA.scrollY = (VIEWPORT.height / 2) - CAMERA.focusY;

    // Clear the view
    view.fillStyle = BACKGROUND_COLOR;
    view.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);

    for (var i = 0; i < WORKSPACE.length; i++) {

        if (WORKSPACE[i] &&
            WORKSPACE[i].x + CAMERA.scrollX < VIEWPORT.width &&
            WORKSPACE[i].x + CAMERA.scrollX + WORKSPACE[i].width > 0 &&
            WORKSPACE[i].y + CAMERA.scrollY < VIEWPORT.height &&
            WORKSPACE[i].y + CAMERA.scrollY + WORKSPACE[i].height > 0) {
            var item = WORKSPACE[i];

            var xPos = item.x + CAMERA.scrollX;
            var yPos = item.y + CAMERA.scrollY;

            var trail = function(item, speed, alpha, offset) {
                if (Math.abs(item.vx) + Math.abs(item.vy) > speed) {

                    view.globalAlpha = alpha;

                    var offsetx = item.vx * offset;
                    var offsety = item.vy * offset;

                    if (item.texture == null) {
                        view.beginPath();

                        view.moveTo(xPos - offsetx, yPos - offsety);
                        view.lineTo(xPos - offsetx, yPos + item.height - offsety);
                        view.lineTo(xPos + item.width - offsetx, yPos + item.height - offsety);
                        view.lineTo(xPos + item.width - offsetx, yPos - offsety);
                        view.lineTo(xPos - offsetx, yPos - offsety);
                        view.closePath();

                        view.fillStyle = item.fillColor;
                        view.fill();
                    }
                    else {
                        var texture = new Image();
                        texture.src = item.texture;

                        view.drawImage(texture, xPos - offsetx, yPos - offsety, item.width, item.height);
                    }

                    view.globalAlpha = 1.0;
                }
            };

            if (item.texture == null){

                trail(item, 128, 0.3, 0.1);
                trail(item, 256, 0.2, 0.2);
                trail(item, 512, 0.1, 0.3);


                view.beginPath();

                view.moveTo(xPos, yPos);
                view.lineTo(xPos, yPos + item.height);
                view.lineTo(xPos + item.width, yPos + item.height);
                view.lineTo(xPos + item.width, yPos);
                view.lineTo(xPos, yPos);
                view.closePath();

                view.fillStyle = item.fillColor;
                view.strokeStyle = item.outlineColor;
                view.fill();
                view.stroke();
            }
            else
            {
                if (item == Player) {
                    // Will need to be modified
                    trail(item, 128, 0.3, 0.1);
                    trail(item, 256, 0.2, 0.2);
                    trail(item, 512, 0.1, 0.3);

                    var texture = new Image();

                    texture.src = Player.sheet;
                    //alert(texture.src);
                    view.drawImage(texture, Player.frame.x, Player.frame.y, Player.width, Player.height, xPos, yPos, Player.width, Player.height);
                }
                else {
                    trail(item, 128, 0.3, 0.1);
                    trail(item, 256, 0.2, 0.2);
                    trail(item, 512, 0.1, 0.3);

                    var texture = new Image();
                    texture.src = item.texture;

                    view.drawImage(texture, xPos, yPos, item.width, item.height);

                }
            }
        }
    }

    // Draw the FPS
    framesSinceLastTick++;
    view.font = '14px Arial';
    view.fillStyle = 'blue';
    var fpsText = 'FPS: ' + framesPerSecond;
    var fpsMeasurement = view.measureText(fpsText);
    view.fillText(fpsText, VIEWPORT.width - (fpsMeasurement.width) - 5, 15);

    // Draw control grid lines (for reference, only temporary)
    /*
    view.fillStyle = "rgba(0, 0, 255, 0.25)";
    view.fillRect(VIEWPORT.width / 5, 0, 1, VIEWPORT.height);
    view.fillRect(VIEWPORT.width / 5 * 4, 0, 1, VIEWPORT.height);
    view.fillRect(0, VIEWPORT.height / 3 * 2, VIEWPORT.width, 1);
    */
};

var Physics = function(delta) {
    for (var i = 0; i < WORKSPACE.length; i++) {

        if (WORKSPACE[i] != null) {
            var item = WORKSPACE[i];
            item.touching.top = null;
            item.touching.left = null;
            item.touching.right = null;
            item.touching.bottom = null;

        // Calculate positioning

            // Motion Equation of Position: x = x + v * t + 1/2 * a * t^2
            item.x = item.x + (item.vx * delta) + ((0.5 * item.ax) * (delta * delta));
            item.y = item.y + (item.vy * delta) + ((0.5 * item.ay) * (delta * delta));

        // Detect and resolve collisions
            if (item.type != Entity.PHANTOM) {
            for (var i2 = 0; i2 < WORKSPACE.length; i2 ++) {
                if (WORKSPACE[i2] != null && WORKSPACE[i2] != item) {
                    var collider = WORKSPACE[i2];

                    if (collider.type != Entity.PHANTOM) {
                        if ((item.x + item.width > collider.x && item.x < collider.x + collider.width)
                            && (item.y + item.height > collider.y && item.y < collider.y + collider.height)) {

                            // Calculate the distances between the faces of the objects
                            var itemLeft = item.x;
                            var itemRight = item.x + item.width;
                            var itemTop = item.y;
                            var itemBottom = item.y + item.height;
                            var colliderLeft = collider.x;
                            var colliderRight = collider.x + collider.width;
                            var colliderTop = collider.y;
                            var colliderBottom = collider.y + collider.height;

                            var leftDistance = Math.abs(itemLeft - colliderRight);
                            var rightDistance = Math.abs(itemRight - colliderLeft);
                            var topDistance = Math.abs(itemTop - colliderBottom);
                            var bottomDistance = Math.abs(itemBottom - colliderTop);

                            // Coefficients of restitution
                            var crx;
                            var cry;

                            // Initial velocities
                            var iivx = item.vx;
                            var civx = collider.vx;

                            var iivy = item.vy;
                            var civy = collider.vy;

                            if (leftDistance < rightDistance && leftDistance < topDistance && leftDistance < bottomDistance) {
                                // WEST or LEFT collision from ITEM
                                item.touching.left = collider;

                                // Equation of the coefficient of restitution: cr = (vb - va) / (ua - ub)
                                crx = (collider.vx - item.vx) / (item.vx - collider.vx) || 0;
                                if (item.type != Entity.KINEMATIC) {

                                    // Collision Equation: va = (cr * mb * (vb - va) + ma * va + mb * vb) / ma + mb
                                    item.vx = (((item.mass * iivx) + (collider.mass * civx) + (collider.mass * (item.elasticity * crx) * (iivx - civx)))) / (item.mass + collider.mass);

                                    // This positional skip keeps parts from detecting an additional collision
                                    // from the collider due to a missing change in position.
                                    // It also helps to stop the shakiness from gravity.
                                    item.x = collider.x + collider.width;
                                    if (item.vx < 0 && GRAVITY_X < 0) {
                                        item.vx = 0;
                                    }
                                }
                                if (collider.type != Entity.KINEMATIC) {
                                    collider.vx = (((collider.mass * civx) + (item.mass * iivx) + (item.mass * (collider.elasticity * crx) * (civx - iivx)))) / (collider.mass + item.mass);
                                    collider.x = item.x - collider.width;
                                    if (collider.vx > 0 && GRAVITY_X > 0) {
                                        collider.vx = 0;
                                    }
                                }
                            }
                            else if (rightDistance < leftDistance && rightDistance < topDistance && rightDistance < bottomDistance) {
                                // EAST or RIGHT collision from ITEM
                                item.touching.right = collider;
                                crx = (collider.vx - item.vx) / (item.vx - collider.vx) || 0;
                                if (item.type != Entity.KINEMATIC) {
                                    item.vx = (((item.mass * iivx) + (collider.mass * civx) + (collider.mass * (item.elasticity * crx) * (iivx - civx)))) / (item.mass + collider.mass);
                                    item.x = collider.x - item.width;
                                    if (item.vx > 0 && GRAVITY_X > 0) {
                                        item.vx = 0;
                                    }
                                }
                                if (collider.type != Entity.KINEMATIC) {
                                    collider.vx = (((collider.mass * civx) + (item.mass * iivx) + (item.mass * (collider.elasticity * crx) * (civx - iivx)))) / (collider.mass + item.mass);
                                    collider.x = item.x + item.width;
                                    if (collider.vx < 0 && GRAVITY_X < 0) {
                                        collider.vx = 0;
                                    }
                                }
                            }
                            else if (topDistance < bottomDistance && topDistance < leftDistance && topDistance < rightDistance) {
                                // NORTH or TOP collision from ITEM
                                item.touching.top = collider;
                                cry = (collider.vy - item.vy) / (item.vy - collider.vy) || 0;
                                if (item.type != Entity.KINEMATIC) {
                                    item.vy = (((item.mass * iivy) + (collider.mass * civy) + (collider.mass * (item.elasticity * cry) * (iivy - civy)))) / (item.mass + collider.mass);
                                    item.y = collider.y + collider.height;
                                    if (item.vy < 0 && GRAVITY_Y < 0) {
                                        item.vy = 0;
                                    }
                                }
                                if (collider.type != Entity.KINEMATIC) {
                                    collider.vy = (((collider.mass * civy) + (item.mass * iivy) + (item.mass * (collider.elasticity * cry) * (civy - iivy)))) / (collider.mass + item.mass);
                                    collider.y = item.y - collider.height;
                                    if (collider.vy > 0 && GRAVITY_Y > 0) {
                                        collider.vy = 0;
                                    }
                                }
                            }
                            else if (bottomDistance < topDistance && bottomDistance < leftDistance && bottomDistance < rightDistance) {
                                // SOUTH or BOTTOM collision from ITEM
                                item.touching.bottom = collider;
                                cry = (collider.vy - item.vy) / (item.vy - collider.vy) || 0;
                                if (item.type != Entity.KINEMATIC) {
                                    item.vy = (((item.mass * iivy) + (collider.mass * civy) + (collider.mass * (item.elasticity * cry) * (iivy - civy)))) / (item.mass + collider.mass);
                                    item.y = collider.y - item.height;
                                    if (item.vy > 0 && GRAVITY_Y > 0) {
                                        item.vy = 0;
                                    }
                                }
                                if (collider.type != Entity.KINEMATIC) {
                                    collider.vy = (((collider.mass * civy) + (item.mass * iivy) + (item.mass * (collider.elasticity * cry) * (civy - iivy)))) / (collider.mass + item.mass);
                                    collider.y = item.y + item.height;
                                    if (collider.vy < 0 && GRAVITY_Y < 0) {
                                        collider.vy = 0;
                                    }
                                }
                            }
                        }
        // Calculate Frictional Data
                        // Coulomb Friction Equation: f <= u * n
                        // Where f = force of friction (Force slowing the object),
                        // u = coefficient of friction,
                        // n = normal force (Force that is exerted by each surface on the other)

                        var cf = (item.friction + collider.friction) / 2; // Mean of the two friction (approximate coefficient of friction)
                        var friction;
                        var itemDirectionX;
                        var itemDirectionY;
                        var colliderDirectionX;
                        var colliderDirectionY;
                        var seed;

                        if (item.vx > 0) {
                            itemDirectionX = -1;
                            if (collider.vx > item.vx) {
                                colliderDirectionX = -1;
                            }
                            else if (collider.vx < item.vx) {
                                colliderDirectionX = 1;
                            }
                            else {
                                colliderDirectionX = 0;
                            }
                        }
                        else if (item.vx < 0) {
                            itemDirectionX = 1;
                            if (collider.vx > item.vx) {
                                colliderDirectionX = -1;
                            }
                            else if (collider.vx < item.vx) {
                                colliderDirectionX = 1;
                            }
                            else {
                                colliderDirectionX = 0;
                            }
                        }
                        else {
                            itemDirectionX = 0;
                            if (collider.vx > 0) {
                                colliderDirectionX = -1;
                            }
                            else if (collider.vx < 0) {
                                colliderDirectionX = 1;
                            }
                            else {
                                colliderDirectionX = 0;
                            }
                        }

                        if (item.vy > 0) {
                            itemDirectionY = -1;
                            if (collider.vy > item.vy) {
                                colliderDirectionY = -1;
                            }
                            else if (collider.vy < item.vy) {
                                colliderDirectionY = 1;
                            }
                            else {
                                colliderDirectionY = 0;
                            }
                        }
                        else if (item.vy < 0) {
                            itemDirectionY = 1;
                            if (collider.vy > item.vy) {
                                colliderDirectionY = -1;
                            }
                            else if (collider.vy < item.vy) {
                                colliderDirectionY = 1;
                            }
                            else {
                                colliderDirectionY = 0;
                            }
                        }
                        else {
                            itemDirectionY = 0;
                            if (collider.vy > 0) {
                                colliderDirectionY = -1;
                            }
                            else if (collider.vy < 0) {
                                colliderDirectionY = 1;
                            }
                            else {
                                colliderDirectionY = 0;
                            }
                        }

                        if (item.x + item.width == collider.x && item.y > collider.y - item.height && item.y < collider.y + collider.height && (item.vy != 0 || collider.vy != 0)) {
                            // EAST or RIGHT friction from ITEM
                            item.touching.right = collider;
                            seed = Math.random();
                            if (item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (item.vx * item.mass) * seed) / item.mass);
                                item.vy = item.vy + (friction * itemDirectionY);
                            }
                            if (collider.type != Entity.KINEMATIC && item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (collider.vx * collider.mass) * seed) / collider.mass);
                                collider.vy = collider.vy + (friction * colliderDirectionY);
                            }
                        }
                        else if (item.x == collider.x + collider.width && item.y > collider.y - item.height && item.y < collider.y + collider.height && (item.vy != 0 || collider.vy != 0)) {
                            // WEST or LEFT friction from ITEM
                            item.touching.left = collider;
                            seed = Math.random();
                            if (item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (item.vx * item.mass) * seed) / item.mass);
                                item.vy = item.vy + (friction * itemDirectionY);
                            }
                            if (collider.type != Entity.KINEMATIC && item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (collider.vx * collider.mass) * seed) / collider.mass);
                                collider.vy = collider.vy + (friction * colliderDirectionY);
                            }
                        }
                        if (item.y + item.height == collider.y && item.x > collider.x - item.width && item.x < collider.x + collider.width && (item.vx != 0 || collider.vx != 0)) {
                            // SOUTH or BOTTOM friction from ITEM
                            item.touching.bottom = collider;
                            seed = Math.random();
                            if (item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (item.vy * item.mass) * seed) / item.mass);
                                item.vx = item.vx + (friction * itemDirectionX);
                            }
                            if (collider.type != Entity.KINEMATIC && item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (collider.vy * collider.mass) * seed) / collider.mass);
                                collider.vx = collider.vx + (friction * colliderDirectionX);
                            }
                        }
                        else if (item.y == collider.y + collider.height && item.x > collider.x - item.width && item.x < collider.x + collider.width && (item.vx != 0 || collider.vx != 0)) {
                            // NORTH or TOP friction from ITEM
                            item.touching.top = collider;
                            seed = Math.random();
                            if (item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (item.vy * item.mass) * seed) / item.mass);
                                item.vx = item.vx + (friction * itemDirectionX);
                            }
                            if (collider.type != Entity.KINEMATIC && item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (collider.vy * collider.mass) * seed) / collider.mass);
                                collider.vx = collider.vx + (friction * colliderDirectionX);
                            }
                        }

                        if ((item == Player || collider == Player) && Player.waitingToJump == true && Player.touching.bottom != null) {
                            Player.waitingToJump = false;
                            Player.jump()
                        }
                    }
                }
            }
        }

        // Complete motion data

            // Velocity
            if (item.type == Entity.KINEMATIC || item.type == Entity.PHANTOM) {
                item.vx = item.vx + item.ax * delta;
            }
            else if (item.frozen == true) {
                item.vx = (item.ax * delta + item.vx) / 1.1;
                item.vy = (item.ay * delta + item.vy) / 1.1;
                item.freezeTime = item.freezeTime - delta;
                if (item.freezeTime <= 0) {
                    item.thaw();
                }
            }
            else {
                // Motion Equation of Velocity: v = v + a * t
                item.vx = item.vx + (item.ax + GRAVITY_X) * delta;
                item.vy = item.vy + (item.ay + GRAVITY_Y) * delta;
            }

            // Settle
            if (Math.abs(item.ax) <= SETTLE_POINT) {
                item.ax = 0;
            }
            if (Math.abs(item.ay) <= SETTLE_POINT) {
                item.ay = 0;
            }
            if (Math.abs(item.vx) <= SETTLE_POINT) {
                item.vx = 0;
            }
            if (Math.abs(item.vy) <= SETTLE_POINT) {
                item.vy = 0;
            }
        }
     }
};

//requestAnimationFrame polyfill
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var drawMode = false;
var startX;
var startY;
var scrollFactor = 10;
var scrollMaxRate = 50;
var scrollMinRate = -scrollMaxRate;
var prevRightTouchY;
var prevLeftTouch = false;

function handleInput(){
    //Check draw mode
    /* Taken out temporarily for touch movements
    if(INPUT.isPointerDown(MOUSE.LEFT)){
        if(drawMode === false){
            drawMode = true;
            startX = INPUT.getPointerX();
            startY = INPUT.getPointerY();
        }
    }
    else {
        if(drawMode === true){
            var endX = INPUT.getPointerX() - CAMERA.scrollX;
            var endY = INPUT.getPointerY() - CAMERA.scrollY;

            startX = startX - CAMERA.scrollX;
            startY = startY - CAMERA.scrollY;
            var objectX;
            var objectY;
            var objectWidth;
            var objectHeight;
            if (startX < endX) {
                objectX = startX;
                objectWidth = endX - startX;
            }
            else {
                objectX = endX;
                objectWidth = startX - endX;
            }
            if (startY < endY) {
                objectY = startY;
                objectHeight = endY - startY;
            }
            else {
                objectY = endY;
                objectHeight = startY - endY;
            }

            new Entity("Drawn Object", objectWidth, objectHeight, objectX, objectY, Entity.DYNAMIC, "#0000ff", "#000000", 0.5);

            drawMode = false;
        }
    }
    */

    //Touch events
    if (INPUT.isTouchDevice) {
        var touches = INPUT._Pointer.touches;
        if (touches.length == 0) {
            leftTouch = null;
            rightTouch = null;
            prevRightTouchY = null;
            prevLeftTouch = false;
            Player.move(0)
        }
        for (var i = 0; i < touches.length; i++) {
            var leftTouch;
            var rightTouch;

            if (touches[i].pageX * INPUT._Ratio < VIEWPORT.width / 5 * 2) {
                leftTouch = touches[i];
                prevLeftTouch = true;
            }
            else if (touches[i].pageX * INPUT._Ratio < VIEWPORT.width / 5 * 3 && prevLeftTouch) {
                leftTouch = touches[i];
            }
            else {
                leftTouch = null;
                prevLeftTouch = false;
            }

            if (touches[i].pageX * INPUT._Ratio > VIEWPORT.width / 5 * 3) {
                rightTouch = touches[i];
            }
            else {
                rightTouch = null;
                prevRightTouchY = null;
            }

            var x;
            var y;
            var speed = 0;
            var tolerance = 20;

            if(leftTouch){
                x = leftTouch.pageX * INPUT._Ratio;
                speed = (x - VIEWPORT.width / 5) / (VIEWPORT.width / 5);
                if (x > VIEWPORT.width / 5 * 2) {
                    Player.move(1);
                }
                else if (x > VIEWPORT.width / 5) {
                    Player.move(speed);
                }
                else if (x < VIEWPORT.width / 5) {
                    Player.move(speed);
                }
            }
            else {
                Player.move(0);
            }

            if(rightTouch){
                y = rightTouch.pageY * INPUT._Ratio;
                if (y < VIEWPORT.height / 3) {
                    INPUT.setControlState(CONTROLS.UP, true);
                }
                else if (prevRightTouchY != null) {
                    if (y < prevRightTouchY - tolerance) {
                        INPUT.setControlState(CONTROLS.UP, true);
                    }
                }
                prevRightTouchY = y;
            }
        }
    }

        /*
        if (INPUT.isPointerDown()) {
            console.log((INPUT.getPointerX()) + " > " + (VIEWPORT.width / 5 * 2) + ", " + (VIEWPORT.width / 5 * 4));
            if ((INPUT.getPointerX()) < (VIEWPORT.width / 5 * 2)) {
                INPUT.setControlState(CONTROLS.LEFT, true);
                INPUT.setControlState(CONTROLS.RIGHT, false);
            }
            else if ((INPUT.getPointerX()) > (VIEWPORT.width / 5 * 4)) {
                INPUT.setControlState(CONTROLS.RIGHT, true);
                INPUT.setControlState(CONTROLS.LEFT, false);
            }
            else {
                INPUT.setControlState(CONTROLS.LEFT, false);
                INPUT.setControlState(CONTROLS.RIGHT, false);
            }

            if ((INPUT.getPointerY()) < (VIEWPORT.height / 5)){
                INPUT.setControlState(CONTROLS.UP, true);
            }
            else {
                INPUT.setControlState(CONTROLS.UP, false);
            }
        /*
        }
        else {
            //No input
            INPUT.setControlState(CONTROLS.LEFT, false);
            INPUT.setControlState(CONTROLS.RIGHT, false);
            INPUT.setControlState(CONTROLS.UP, false);
        }
    }

    //Camera focusing
    /*
    if(INPUT.isPointerDown(MOUSE.RIGHT)){
        if(CAMERA.scrollReady()){
            var xVal = Math.max(
                Math.min(
                    (INPUT.getPointerX() - (VIEWPORT.width / 2)) / scrollFactor,
                    scrollMaxRate
                ),
                scrollMinRate
            );
            var yVal = Math.max(
                Math.min(
                    (INPUT.getPointerY() - (VIEWPORT.height / 2)) / scrollFactor, scrollMaxRate
                ), scrollMinRate
            );

            CAMERA.focusX += Math.floor(xVal);
            CAMERA.focusY += Math.floor(yVal);

            CAMERA.target = null;
        }
    }
    */

    //Keyboard events
    if(INPUT.isKeyDown(CONTROLS.UP)){
        Player.jump();
    }
    if (INPUT.isTouchDevice == false) {
        if(INPUT.isKeyDown(CONTROLS.LEFT)){
            Player.move(-1);
        }
        else if(INPUT.isKeyDown(CONTROLS.RIGHT)){
            Player.move(1);
        }
        else {
            Player.move(0);
        }
    }
}


var GameConditions; // This is a function that is set in the level.js file.

var thisStep;
var lastStep;

var waitStart;
var waitEnd;
var waitState;
var waitCallback;

var wait = function(seconds, callback) {
    if (waitState != true) {
        waitStart = thisStep;
        seconds = seconds * 1000;
        waitEnd = waitStart + seconds;
        waitCallback = callback;
        waitState = true;
        //alert(waitStart + " " + waitEnd);
    }
};

var Engine = function() {
    // Delta Capture
    thisStep = new Date().getTime();
    var delta = (thisStep - lastStep) / 100 || thisStep - thisStep;
    if (delta > 3) { delta = thisStep - thisStep; } // to prevent skipping and freezes.
    lastStep = thisStep;

    if (waitState == true) {
        var waitCheck = function(waitStart, waitEnd, thisStep, callback) {
            if (thisStep >= waitEnd) {
                waitState = false;
                callback();
            }
        }(waitStart, waitEnd, thisStep, waitCallback);
    }

    handleInput();

    // Calculations
    Physics(delta);
    Player.manage();
    GameConditions();

    // Draw
    CAMERA.scrollCheck();
    DrawFrame();

    // Refresh Frame
    VIEWPORT_CONTEXT.drawImage(BUFFER, 0, 0);
    requestAnimationFrame(Engine);
};