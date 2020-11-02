<?php require_once("html/base_top.php"); ?>

    <!-- CLOCK JS PROCESS -->
    <script type="text/javascript" src="../assets/js/clock.js"></script>
    <main>
        <section class="jumbotron text-center">
            <div class="container">
                <div class="title">RELOJ DE POSESIÓN</div>

                <div class="row">
                    <div class="col clock-container">
                        <input type="text" id="clock-timer" class="clock-timer" value="" readonly/>
                    </div>
                </div>
                <div class="row no-gutters buttons-container">
                    <div class="col-4 col-md-4">
                        <button type="button" class="w-100 btn btn-outline-success btn-lg" onclick="BEL.clock.start()">
                            START
                        </button>
                    </div>
                    <div class="col-4 col-md-4">
                        <button type="button" class="w-100 btn btn-outline-danger btn-lg" onclick="BEL.clock.stop()">
                            STOP
                        </button>
                    </div>
                    <div class="col-4 col-md-4">
                        <button type="button" class="w-100 btn btn-outline-info btn-lg" onclick="BEL.clock.reset()">
                            RESET
                        </button>
                    </div>
                </div>
                <div class="row no-gutters buttons-container">
                    <div class="col-4 col-md-4">
                        <input type="password" id="key-down-events" placeholder="atajos de teclado"/>
                    </div>
                    <div class="col-4 col-md-4">
                        <button type="button" class="w-100 btn btn-outline-info btn-lg" onclick="BEL.clock.openPopup()">
                            ABRIR POPUP
                        </button>
                    </div>
                    <div class="col-4 col-md-4">
                        <button type="button" class="w-100 btn btn-outline-info btn-lg" onclick="">
                            NADA
                        </button>
                    </div>
                </div>

            </div>
        </section>
    </main>

    <script type="text/javascript">
        BEL.clock.init();
    </script>

<?php require_once("html/base_bottom.php"); ?>