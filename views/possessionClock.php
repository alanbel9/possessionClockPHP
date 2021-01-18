<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="abell">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="../assets/css/general.css">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
    <title>Basketball Utils</title>
</head>
<body class="text-center">
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
<div class="clock-window d-flex w-100 h-100 mx-auto flex-column">

    <!-- CLOCK JS PROCESS -->
    <script type="text/javascript" src="../assets/js/clock.js"></script>
    <main>
        <section class="text-center">
            <div class="container">
                <div class="row">
                    <div class="col clock-container">
                        <input type="text" id="clock-timer-popup" value="" readonly/>
                    </div>
                </div>
            </div>
        </section>
    </main>

<?php require_once("html/base_bottom.php"); ?>