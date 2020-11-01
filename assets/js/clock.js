if (typeof BEL !== 'object') {
    var BEL = {}
}

BEL.clock = {
    running: false,
    full_possession: 24,
    current_second: null,
    clock_id: 'clock-timer',
    crono: null,

    /**
     * Initialize clock. Set initial values.
     */
    init: function () {
        BEL.clock.current_second = BEL.clock.full_possession;
        var clockItem = document.getElementById(BEL.clock.clock_id);
        if (clockItem) {
            clockItem.value = BEL.clock.full_possession;
        }
    },

    /**
     * CLOCK  BUTTONS PROCESSES
     */
    start: function () {
        BEL.clock.running = true;

        BEL.clock.crono = setInterval(function () {
            if (BEL.clock.running) {
                var clockItem = document.getElementById(BEL.clock.clock_id);

                if (BEL.clock.current_second > 0) {
                    BEL.clock.current_second --;
                    clockItem.value = BEL.clock.current_second;
                } else {
                    // STOP
                    BEL.clock.current_second = BEL.clock.full_possession;
                    clockItem.value = BEL.clock.current_second;
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