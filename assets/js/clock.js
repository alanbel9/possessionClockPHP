if (typeof BEL !== 'object') {
    var BEL = {}
}

BEL.clock = {
    running: false,
    full_possession: 24,
    current_second: null,
    crono: null,

    init: function () {

    },


    /**
     * CLOCK  BUTTONS PROCESSES
     */
    start: function () {
        this.running = true;
        this.crono = setInterval(this.tiempo(), this.full_possession);
    },
    stop: function () {
        this.running = false;
        clearInterval(elcrono);
    },
    reset: function () {
        
    },
    tiempo: function () {
        debugger;
        var clock = document.getElementById('clock-timer');

        debugger;
        //llevar resultado al visor.
        clock.value= '1';
    }
};