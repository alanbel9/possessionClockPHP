<?php require_once("html/base_top.php"); ?>

    <!-- CLOCK JS PROCESS -->
    <script type="text/javascript" src="../assets/js/clock.js"></script>
    <main>
        <section class="jumbotron text-center">
            <div class="container">
                <h1>RELOJ DE POSESIÓN</h1>

                <div class="clock-container">
                    <input type="text" id="clock-timer" class="clock-timer" value="" readonly />
                </div>

                <div class="row">
                    <div class="col-md-4">
                        <button type="button" class="w-100 btn btn-outline-success btn-lg" onclick="BEL.clock.start()">START</button>
                    </div>
                    <div class="col-md-4">
                        <button type="button" class="w-100 btn btn-outline-danger btn-lg">STOP</button>
                    </div>
                    <div class="col-md-4">
                        <button type="button" class="w-100 btn btn-outline-info btn-lg">RESET</button>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script type="text/javascript">
        BEL.clock.init();
    </script>

<?php require_once("html/base_bottom.php"); ?>