
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
    D: 68,
    SHIFT: 16
};

/*
    Define custom game controls here. Each must be an array!
*/
var CONTROLS = {
    UP: [KEYS.UP, KEYS.W, KEYS.SPACE],
    DOWN: [KEYS.DOWN, KEYS.S],
    LEFT: [KEYS.LEFT, KEYS.A],
    RIGHT: [KEYS.RIGHT, KEYS.D],
    USE: [KEYS.SHIFT]
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
        if(btn){ //Specific button down?
            if(btn in this._Pointer.buttons && this._Pointer.buttons[btn] !== false){
                return true;
            }
        }
        else{ //Any button down?
            for(var k in this._Pointer.buttons){
                if(this._Pointer.buttons[k] !== false)
                    return true;
            }
        }
        return false;
    },

    setKeyState: function(btn, down){
        if(down){
            INPUT._Keys[btn] = new InputState();
        }
        else{
            INPUT._Keys[btn] = false;
        }
    },

    setControlState: function(btns, down){
        for(var i = 0; i < btns.length; i++){
            INPUT.setKeyState(btns[i], down);
        }
    },

    setPointerState: function(btn, down){
        if(down){
            INPUT._Pointer.buttons[btn] = new InputState();
        }
        else{
            INPUT._Pointer.buttons[btn] = false;
        }
    },

    getPointerX: function(){
        return this._Pointer.x;
    },

    getPointerY: function(){
        return this._Pointer.y;
    },

    getTouches: function(){
        return this._Pointer.touches;
    },

    getPixelRatio: function(){
        return this._Ratio;
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
                if(!INPUT.isPointerDown(MOUSE.LEFT))
                    INPUT.setPointerState(MOUSE.LEFT, true);
//                    INPUT.setPointerState(MOUSE.MIDDLE, false);
//                    INPUT.setPointerState(MOUSE.RIGHT, false);
                break;
            case 2:
                if(!INPUT.isPointerDown(MOUSE.RIGHT))
                    INPUT.setPointerState(MOUSE.RIGHT, true);
//                    INPUT.setPointerState(MOUSE.LEFT, false);
//                    INPUT.setPointerState(MOUSE.MIDDLE, false);
                break;
            case 3:
                if(!INPUT.isPointerDown(MOUSE.MIDDLE))
                    INPUT.setPointerState(MOUSE.MIDDLE, true);
//                    INPUT.setPointerState(MOUSE.LEFT, false);
//                    INPUT.setPointerState(MOUSE.RIGHT, false);
                break;
            case 0:
                INPUT.setPointerState(MOUSE.LEFT, false);
                INPUT.setPointerState(MOUSE.MIDDLE, false);
                INPUT.setPointerState(MOUSE.RIGHT, false);
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
            //alert(e.which); // Use this to log key codes
            INPUT.setKeyState(e.which, true);
        }, false);

        element.addEventListener('keyup', function(e){
            INPUT.setKeyState(e.which, false);
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
