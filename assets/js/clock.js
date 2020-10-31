if (typeof BEL !== 'object') {
    var BEL = {}
}

BEL.clock = {
    running: false,
    full_possession: 24,
    current_second: null,
    clock_id: 'clock-timer',
    clockItem: null,
    crono: null,

    /**
     * Initialize clock
     */
    init: function () {
        BEL.clock.current_second = BEL.clock.full_possession;
        BEL.clock.clockItem = document.getElementById(BEL.clock.clock_id);
        BEL.clock.clockItem.value = BEL.clock.current_second;
    },

    /**
     * CLOCK  BUTTONS PROCESSES
     */
    start: function () {
        BEL.clock.running = true;

        BEL.clock.crono = setInterval(function () {
            if (BEL.clock.running) {
                if (BEL.clock.current_second > 0) {
                    BEL.clock.current_second --;
                    BEL.clock.clockItem.value = BEL.clock.current_second;
                } else {
                    // STOP
                    BEL.clock.current_second = BEL.clock.full_possession;
                    BEL.clock.clockItem.value = BEL.clock.current_second;
                    clearInterval(BEL.clock.crono);
                }
            }
        }, 1000);
    },
    stop: function () {
        BEL.clock.running = false;
        clearInterval(BEL.clock.crono);
    },
    reset: function () {
        
    }
};