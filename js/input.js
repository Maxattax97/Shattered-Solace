
var MOUSE = {
    LEFT: 1,
    MIDDLE: 2,
    RIGHT: 3
};

var KEYS = {
    SPACE: 32,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    W: 87,
    S: 83,
    A: 65,
    D: 68
};

/*
    Define custom game controls here. Each must be an array!
*/
var CONTROLS = {
    UP: [KEYS.UP, KEYS.W],
    DOWN: [KEYS.DOWN, KEYS.S],
    LEFT: [KEYS.LEFT, KEYS.A],
    RIGHT: [KEYS.RIGHT, KEYS.D]
};

/*
    Object for tracking when events happen and are handled
*/
function InputState(){
    this.handled = false;
    this.ts = INPUT.getTime();
}

var INPUT = {
    MOUSE_BUTTONS: {
        MOUSE_LEFT: 1,
        MOUSE_MIDDLE: 2,
        MOUSE_RIGHT: 3
    },
    _Ratio: window.devicePixelRatio || 1, /* pixel ratio */
    _Keys: {},
    _Pointer: {
        x: 0,
        y: 0,
        buttons: {},
        touches: [],
        last: 0
    },

    isTouchDevice: !!('ontouchstart' in window) // works on most browsers
                    || !!('onmsgesturechange' in window), // works on ie10

    isKeyDown: function(keys){
        for(var i = 0; i < keys.length; i++){
            var k = keys[i];
            if(k in this._Keys && this._Keys[k] !== false){
                return true;
            }
        }
        return false;
    },

    isPointerDown: function(btn){
        if(btn in this._Pointer.buttons && this._Pointer.buttons[btn] !== false){
            return true;
        }
        return false;
    },

    getPointerX: function(){
        return this._Pointer.x;
    },

    getPointerY: function(){
        return this._Pointer.y;
    },

    _setTouchesTimeout: null,
    _setTouches: function(touches){
        INPUT._Pointer.touches = touches;
        if (INPUT._Pointer.touches.length > 0) {
            INPUT._Pointer.x = INPUT._Pointer.touches[0].pageX * INPUT._Ratio;
            INPUT._Pointer.y = INPUT._Pointer.touches[0].pageY * INPUT._Ratio;
        }

        //Simulate mouse buttons
        switch(INPUT._Pointer.touches.length){
            case 1:
                if(!INPUT._Pointer.buttons[MOUSE.LEFT])
                    INPUT._Pointer.buttons[MOUSE.LEFT] = new InputState();

//                INPUT._Pointer.buttons[MOUSE.MIDDLE] = false;
//                INPUT._Pointer.buttons[MOUSE.RIGHT] = false;
                break;
            case 2:
                if(!INPUT._Pointer.buttons[MOUSE.RIGHT])
                    INPUT._Pointer.buttons[MOUSE.RIGHT] = new InputState();

//                INPUT._Pointer.buttons[MOUSE.LEFT] = false;
//                INPUT._Pointer.buttons[MOUSE.MIDDLE] = false;
                break;
            case 3:
                if(!INPUT._Pointer.buttons[MOUSE.MIDDLE])
                    INPUT._Pointer.buttons[MOUSE.MIDDLE] = new InputState();

//                INPUT._Pointer.buttons[MOUSE.LEFT] = false;
//                INPUT._Pointer.buttons[MOUSE.RIGHT] = false;
                break;
            case 0:
                INPUT._Pointer.buttons[MOUSE.LEFT] = false;
                INPUT._Pointer.buttons[MOUSE.MIDDLE] = false;
                INPUT._Pointer.buttons[MOUSE.RIGHT] = false;
                break;
        }
    },

    getTime: function(){
        return new Date().getTime();
    },

    /* Binding Functions */
    bindTouches: function(element){
        element.addEventListener('touchstart', function(e){
            INPUT._setTouches(e.changedTouches);
        }, false);

        element.addEventListener('touchmove', function(e){
            e.preventDefault(); // Stop scrolling on iOS
            INPUT._setTouches(e.changedTouches);
        }, false);

        element.addEventListener('touchend', function(e){
            INPUT._setTouches([]);
        }, false);
    },

    bindMouse: function(element){
        element.addEventListener('mousedown', function(e){
            e.preventDefault();
            INPUT._Pointer.buttons[e.which] = new InputState();
        }, false);

        element.addEventListener('mousemove', function(e){
            INPUT._Pointer.x = Math.round(e.layerX * INPUT._Ratio);
            INPUT._Pointer.y = Math.round(e.layerY * INPUT._Ratio);
        }, false);

        element.addEventListener('mouseup', function(e){
            e.preventDefault();
            INPUT._Pointer.buttons[e.which] =  false;
        }, false);
    },

    bindKeys: function(element){
        element.addEventListener('keydown', function(e){
            INPUT._Keys[e.which] = new InputState();
        }, false);

        element.addEventListener('keyup', function(e){
            INPUT._Keys[e.which] = false;
        }, false);
    },

    bindDeviceMotion: function(element){
        //TODO: This is unused. Implement here some day?
    }

};

/* Wire up your custom bindings here */
if(INPUT.isTouchDevice){
    INPUT.bindTouches(document);
}
else {
    INPUT.bindMouse(document.getElementById("viewport"));
}
INPUT.bindKeys(document);
INPUT.bindDeviceMotion(window);
