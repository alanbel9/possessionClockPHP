<?php
/**
 * @author Alan Bel
 */
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="../assets/css/style.css">
    <script type="text/javascript" src="../assets/js/clock.js"></script>
    <title>MVC PHP Example</title>
</head>
<body>
<div class="wrapper">
    <div class="title">RELOJ DE POSESIÓN</div>

    <div class="clock-container">
        <input type="text" id="clock-timer" class="clock-timer" value="" readonly />
    </div>

    <div class="buttons-container">
        <button onclick="BEL.clock.start()">START</button>
        <button>STOP</button>
        <button>RESET</button>
    </div>


</div>
</body>
</html>

<script>
    if (typeof BEL !== 'object') {
        var BEL = {}
    }
    BEL.clock.init();
</script>