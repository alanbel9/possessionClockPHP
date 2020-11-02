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

        this.keyDownEvents();
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
        BEL.clock.running = false;
        BEL.clock.current_second = BEL.clock.full_possession;
        clearInterval(BEL.clock.crono);

        var clockItem = document.getElementById(BEL.clock.clock_id);
        if (clockItem) {
            clockItem.value = BEL.clock.full_possession;
        }
    },
    /**
     * Key Down Events - Keyboard
     */
    keyDownEvents: function () {
        jQuery("#key-down-events").keydown(function(event) {
            switch (event.which) {
                case 81:  // Q
                    BEL.clock.start();
                    break;
                case 87:  // W
                    BEL.clock.stop();
                    break;
                case 69:  // E
                    BEL.clock.reset();
                    break;
            }
        });
    },
    /**
     * Open Popup with Possession Clock & Add Events JS
     */
    openPopup : function () {
      //  var popup = window.open("test.html","mypopup","width=500,height=300");
      //  popup.document.getElementById("player").someFunction();

        var popup = window.open("possessionClock.php","popup","width=700,height=700");
    }
};