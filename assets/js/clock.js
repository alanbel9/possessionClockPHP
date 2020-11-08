if (typeof BEL !== 'object') {
    var BEL = {}
}

BEL.clock = {
    running: null,
    full_possession: 24,
    current_second: null,
    clock_id: 'clock-timer',
    crono: null,
    popup: null,

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
    startStop: function () {
        if (BEL.clock.running == null) {
            BEL.clock.running = true;
        } else {
            BEL.clock.running = !BEL.clock.running;
        }

        if (BEL.clock.running) {
            BEL.clock.crono = setInterval(function () {
                var clockItem = document.getElementById(BEL.clock.clock_id);
                if (BEL.clock.current_second > 0) {
                    BEL.clock.current_second--;
                    clockItem.value = BEL.clock.current_second;
                } else {
                    // STOP
                    BEL.clock.current_second = BEL.clock.full_possession;
                    clockItem.value = BEL.clock.current_second;
                    clearInterval(BEL.clock.crono);
                }
            }, 1000);
        } else {
            if (BEL.clock.crono)
                clearInterval(BEL.clock.crono);
        }
    },

    /**
     *  Reset Timer
     */
    reset: function ( seconds = BEL.clock.full_possession) {
        BEL.clock.current_second = seconds;

        var clockItem = document.getElementById(BEL.clock.clock_id);
        if (clockItem) {
            clockItem.value = seconds;
        }
    },

    /**
     * Key Down Events - Keyboard
     */
    keyDownEvents: function () {
        document.addEventListener('keypress',function (event) {
            switch (event.key) {
                case 'q':
                case ' ':
                    BEL.clock.startStop();
                    break;
                case 'w':
                    BEL.clock.reset();
                    break;
                case 'e':
                    BEL.clock.reset(14);
                    break;
                case 'd':
                    BEL.clock.reset(18);
                    break;
            }
        });
    },
    /**
     * Open Popup with Possession Clock & Add Events JS
     */
    openPopup : function () {

        BEL.clock.popup = window.open("possessionClock.php","popup","width=700,height=700");

        BEL.clock.popup.onload = function() {
            var clockPopupItem = BEL.clock.popup.document.getElementById("clock-timer-popup");

            setInterval(function () {
                var clockItem = document.getElementById(BEL.clock.clock_id);
                clockPopupItem.value = clockItem.value;
            }, 100);

            /*
            clockItem.addEventListener('change', (event) => {
            });
            */
        };
    }
};