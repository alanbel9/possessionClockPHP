<?php require_once("html/base_top.php"); ?>

    <!-- CLOCK JS PROCESS -->
    <script type="text/javascript" src="../assets/js/scoreboard.js"></script>
    <main>
        <section class="jumbotron text-center">
            <div class="container score-board">
                <div class="title">MARCADOR</div>
                <div class="row no-gutters buttons-container">
                    <div class="score-board-1 col-6 col-md-6">
                        <div class="row no-gutters">
                            <div class="score-container col-12 col-md-12 col-item">
                                <input type="text" id="score-team-1" class="clock-timer" value="0" readonly/>
                            </div>
                        </div>
                        <div class="row no-gutters buttons-container">
                            <div class="col-12 col-md-6 col-item">
                                <button type="button" class="w-100 btn btn-outline-success btn-lg" onclick="BEL.scoreBoard.updateScore(+1 , 1)">
                                    +1
                                </button>
                            </div>
                            <div class="col-12 col-md-6 col-item">
                                <button type="button" class="w-100 btn btn-outline-success btn-lg" onclick="BEL.scoreBoard.updateScore(+2 , 1)">
                                    +2
                                </button>
                            </div>
                            <div class="col-12 col-md-6 col-item">
                                <button type="button" class="w-100 btn btn-outline-success btn-lg" onclick="BEL.scoreBoard.updateScore(+3 , 1)">
                                    +3
                                </button>
                            </div>
                            <div class="col-12 col-md-6 col-item">
                                <button type="button" class="w-100 btn btn-outline-danger btn-lg" onclick="BEL.scoreBoard.updateScore(-1 , 1)">
                                    - 1
                                </button>
                            </div>
                            <div id="open-popup" class="col-12 col-md-12 col-item">
                                <button type="button" class="w-100 btn btn-outline-info btn-lg" onclick="BEL.scoreBoard.updateScore(0 , 1)">
                                    RESET
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="score-board-2 col-6 col-md-6">
                        <div class="row no-gutters">
                            <div class="score-container col-12 col-md-12 col-item">
                                <input type="text" id="score-team-2" class="clock-timer" value="0" readonly/>
                            </div>
                        </div>
                        <div class="row no-gutters buttons-container">
                            <div class="col-12 col-md-6 col-item">
                                <button type="button" class="w-100 btn btn-outline-success btn-lg" onclick="BEL.scoreBoard.updateScore(+1 , 2)">
                                    +1
                                </button>
                            </div>
                            <div class="col-12 col-md-6 col-item">
                                <button type="button" class="w-100 btn btn-outline-success btn-lg" onclick="BEL.scoreBoard.updateScore(+2 , 2)">
                                    +2
                                </button>
                            </div>
                            <div class="col-12 col-md-6 col-item">
                                <button type="button" class="w-100 btn btn-outline-success btn-lg" onclick="BEL.scoreBoard.updateScore(+3 , 2)">
                                    +3
                                </button>
                            </div>
                            <div class="col-12 col-md-6 col-item">
                                <button type="button" class="w-100 btn btn-outline-danger btn-lg" onclick="BEL.scoreBoard.updateScore(-1 , 2)">
                                    - 1
                                </button>
                            </div>
                            <div class="col-12 col-md-12 col-item">
                                <button type="button" class="w-100 btn btn-outline-info btn-lg" onclick="BEL.scoreBoard.updateScore(0 , 2)">
                                    RESET
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script type="text/javascript">
        BEL.clock.init();
    </script>

<?php require_once("html/base_bottom.php"); ?>