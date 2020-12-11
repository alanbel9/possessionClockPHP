<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <meta name="author" content="abell">
    <link rel="icon" href="../assets/images/abel.ico">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
    <title>&#127936; Basketball Tools &#127936;</title>

    <link rel="stylesheet" href="../assets/css/blackboard/styles.css">
    <script type="text/javascript" src="../assets/js/jquery.js"></script>
    <script type="text/javascript" src="../assets/js/graphics.js"></script>
    <script type="text/javascript" src="../assets/js/drawing/libs/pathseg.js"></script>
    <script type="text/javascript" src="../assets/js/drawing/libs/snap.svg.js"></script>
    <script type="text/javascript" src="../assets/js/drawing/libs/canvg/rgbcolor.js"></script>
    <script type="text/javascript" src="../assets/js/drawing/libs/canvg/StackBlur.js"></script>
    <script type="text/javascript" src="../assets/js/drawing/libs/canvg/canvg.js"></script>
    <script type="text/javascript" src="../assets/js/drawing/libs/jszip.js"></script>
    <script type="text/javascript" src="../assets/js/drawing/libs/FileSaver.js"></script>
    <script type="text/javascript" src="../assets/js/drawing/fibaGraphic.js"></script>
    <script type="text/javascript" src="../assets/js/drawing/fibaDrawingCurvedPath.js"></script>
    <script type="text/javascript" src="../assets/js/drawing/fibaDrawingSvg.js"></script>
    <script type="text/javascript" src="../assets/js/drawing/fibaDrawingCanvas.js"></script>
    <script type="text/javascript" src="../assets/js/drawing/fibaDrawingController.js"></script>
    <script type="text/javascript" src="../assets/js/drawing/fibaDrawingTool.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            var applyGraphicToHost = function (host, graphic) {
                if (!graphic) graphic = new FibaEurope.Data.Graphic();
                graphic.fullCourt = host.data("fullcourt") == true;
                graphic.wheelchair = host.data("wheelchair") == true;

                var svg = new FibaEurope.Drawing.SvgDrawing(null, graphic).drawGraphic(host[0], host.data("print") == true);
                svg.setAttribute("width", host.data("width"));
                svg.setAttribute("height", host.data("height"));

                var name = 'Graphic';
                if (window.currentPlayOrDrill && window.currentPlayOrDrill.title && window.currentPlayOrDrill.title !== "")
                    name = window.currentPlayOrDrill.title;

                var nr = host.data("nr");
                if (nr > 0) name += " [" + nr + "]";

                if (!host.data("print")) FibaEurope.Drawing.CanvasDrawing.addExportButton(svg, { name: name });
            }

            $(".graphicHost").each(function () {
                var host = $(this);
                var paramId = host.data("graphic");
                if (paramId != '' && paramId != '0') {
                    FibaEurope.Data.Graphic.loadFromUrl("graphics.asp?do=get&param_id=" + paramId, function (graphic) {
                        applyGraphicToHost(host, graphic);
                    }, this);
                } else {
                    applyGraphicToHost(host);
                }
            });
        });

        function downloadAllGraphics() {
            var graphics = [];
            $(".graphicHost svg").each(function() {
                graphics.push({ svg: this });
            });

            var name = 'Graphic';
            if (window.currentPlayOrDrill && window.currentPlayOrDrill.title && window.currentPlayOrDrill.title !== "")
                name = window.currentPlayOrDrill.title;

            console.log("exporting " + graphics.length + " graphics as zip");
            if (!name || name == "") name = 'Graphic';
            FibaEurope.Drawing.CanvasDrawing.exportGraphics(graphics, { name: name });
        }
    </script>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>

    <script language="Javascript">
        function open_animations_tool(qs, width, height)
        {
            window.open(qs, 'animation', 'width=' + width + ', height=' + height + ',status=no,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0');
        }
        function open_animations_viewer(qs, width, height)
        {
            window.open(qs, 'animationviewer', 'width=' + width + ', height=' + height + ',status=no,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0');
        }
    </script>

    <script type="text/javascript">
        var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
        document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
    </script>
    <script src="http://www.google-analytics.com/ga.js" type="text/javascript"></script>
    <script type="text/javascript">
        try {
            var pageTracker = _gat._getTracker("UA-1287223-13");
            pageTracker._trackPageview();
        } catch(err) {}
    </script>

    <style>
        html { height:100%; }
        body { position:absolute; top:0; bottom:0; right:0; left:0; margin:0; padding:0; background-color:#999999; overflow:hidden; }
        #drawingHost { position:absolute; top:0; bottom:0; right:80px; left:0; }
        #toolbar { z-index: 1; position:absolute; top:65px; bottom:0; right:0; margin:0; padding:0; width:84px; background-color:#EDEDED; border-left:1px solid white; }
        .toolBtn { width:34px; min-height: 34px; float: left; margin:4px 0 0 4px; border:1px solid #DFDFDF; background:white; cursor: pointer; font-size:7pt; font-family: Arial, sans-serif; text-align: center; }
        .toolBtn:hover { border-color: #999999; }
        .toolBtn[data-checked] { border-color: black; }
        .toolBtn[data-locked] { border-style: dashed; }
        .toolSep { clear:left; padding-top:2px; }
        hr { margin:1px 5px; border: 0; border-top: 1px solid #DFDFDF; border-bottom: 1px solid #DFDFDF; color: transparent; background-color: transparent; height: 2px; }
        ::selection { background: transparent; }
        .toolMenu { display: block; visibility:hidden; position:fixed; margin: 0; padding:0; list-style: none; background: #FCFCFC; border: solid 1px #cccccc; width:200px; z-index: 100; }
        .toolMenu.open { visibility: visible; }
        .toolMenuItem { display: block; margin:0; padding: 4px; font-family: Arial, sans-serif; font-size: 11pt; text-align: left; }
        .toolMenuItem.sep { border-top: 2px solid #cccccc; }
        .toolMenuItem:hover { background-color: #EEEEEE; }
        .toolMenuItemIcon { display: inline-block; width:32px; margin: 2px; margin-right: 6px; vertical-align: middle; }
        .toolMenuItemText { font-family: inherit; font-size: inherit; }
    </style>

</head>
<body style="text-align: center;">

<?php require_once("html/menu.php"); ?>

<div id="drawingHost">
    <svg version="1.1" width="100%" height="100%" viewBox="0 0 384 270" style="overflow: hidden; user-select: none;">
        <desc>Created with Snap</desc>
        <defs>
            <pattern x="0" y="0" width="284" height="454" patternUnits="userSpaceOnUse" id="patternSk09vck2b5" viewBox="0 0 284 454">
                <image src="../assets/images/playground.jpg" preserveAspectRatio="none" x="0" y="0" width="284" height="454"></image>
            </pattern>
            <g stroke="#ffffff" fill="none" id="halfDef_0_1567880131489" style="stroke-width: 2;">
                <line x1="141" x2="242" y1="75" y2="75"></line>
                <line x1="143" x2="240" y1="95" y2="95" style="stroke-width: 6;"></line>
                <line x1="141" x2="242" y1="114" y2="114"></line>
                <line x1="141" x2="242" y1="129" y2="129"></line>
                <rect x="147" y="45" width="90" height="110" fill="#0089cf"></rect>
                <path d="m 160,156 c 0, 41 64, 41 64, 0"></path>
                <path d="m 166,65 0,13 c 2,32 50,32 52,0 l 0,-13"></path>
                <line x1="174" x2="210" y1="66" y2="66" style="stroke-width: 3;"></line>
                <line x1="192" x2="192" y1="66" y2="72" style="stroke-width: 4;"></line>
                <circle cx="192" cy="78" r="6"></circle>
                <path d="m 75,46 0,35 c 8,150 226,150 234,0 l 0,-35"></path>
            </g>
            <clipPath id="clipHalfCourt_1567880131563">
                <rect x="0" y="0" width="384" height="270"></rect>
            </clipPath>
            <circle cx="0" cy="0" r="10" fill="#ffffff" id="offenceDef_3_1567880131489" style="stroke-width: 2;"></circle>
            <radialGradient cx="0.6" cy="0.4" r="0.5" id="ballGradient_4_1567880131489">
                <stop offset="0%" stop-color="#ffcaa6"></stop>
                <stop offset="75%" stop-color="#d54800"></stop>
                <stop offset="100%" stop-color="#8d3d17"></stop>
            </radialGradient>
            <g id="ballDef_5_1567880131489">
                <ellipse cx="0" cy="0" rx="7.25" ry="7" fill="url('#ballGradient_4_1567880131489')"></ellipse>
                <path d="m -3.4,-6.1 c 2.3,-0.9 5.3,2 8.5,1 M -5.6,4.5 C -4.3,0.6 5.6,-8.1 5.9,4 M -0.4,7 C 2.7,3.5 3.1,-3.5 2.1,-6.6 M -7,-1.2 C -6.6,-3.3 3.2,-6.3 7,-1" stroke="#000000" fill="none" style="stroke-width: 0.2;"></path>
            </g>
            <marker viewBox="0 0 2 10" markerWidth="2" markerHeight="10" orient="auto" refX="0" refY="5" id="markerLine_4_6_1567880131489">
                <path d="M 0,10 L 0,-10 z" fill="#000000" stroke="#000000" style="stroke-width: 2;"></path>
            </marker>
            <marker viewBox="0 0 8 6" markerWidth="8" markerHeight="6" orient="auto" refX="4" refY="3" id="markerArrow_4_7_1567880131489">
                <path d="m 8,3 -8,3 0,-6 8,3 z" fill="#000000" style="stroke-width: 0;"></path>
            </marker>
        </defs>
        <g style="clip-path: url(&quot;#clipHalfCourt_1567880131563&quot;);" class="backgroundGroup">
            <rect x="0" y="0" width="384" height="540" fill="#70bfe9"></rect>
            <rect x="50" y="44" width="284" height="453" style="stroke-width: 4;" stroke="#ffffff" fill="url('#patternSk09vck2b5')"></rect>
            <circle cx="191" cy="270" r="32" stroke="#ffffff" fill="none" style="stroke-width: 4;"></circle>
            <line x1="50" x2="334" y1="270" y2="270" stroke="#ffffff" style="stroke-width: 4;"></line>
            <use xlink:href="#halfDef_0_1567880131489"></use>
            <use xlink:href="#halfDef_0_1567880131489" transform="matrix(1,0,0,-1,0,541)"></use>
        </g>
        <g style="clip-path: url(&quot;#clipHalfCourt_1567880131563&quot;);" class="groupDrawing">
            <g class="groupArea"></g>
            <g class="groupShoot"></g>
            <g class="groupLine"></g>
            <g class="groupCone"></g>
            <g class="groupHandoff"></g>
            <g class="groupPerson"></g>
            <g class="groupBall"></g>
            <g class="groupText"></g>
        </g>
        <rect x="0" y="270" width="384" height="270" fill="#333333" style="opacity: 0.6; visibility: hidden;" class="lowerHalfCourt"></rect>
        <g style="clip-path: url(&quot;#clipHalfCourt_1567880131563&quot;);" class="overlayGroup"></g>
        <g style="cursor: move; clip-path: url(&quot;#clipHalfCourt_1567880131563&quot;);" class="groupHover">
            <g class="groupArea"></g>
            <g class="groupShoot"></g>
            <g class="groupLine"></g>
            <g class="groupCone"></g>
            <g class="groupHandoff"></g>
            <g class="groupPerson"></g>
            <g class="groupBall"></g>
            <g class="groupText"></g>
        </g>
        <rect x="0" y="0" width="384" height="540" class="drawingCanvas" fill="none"></rect>
        <rect x="0" y="0" width="384" height="540" fill="none" class="lockEditing"></rect>
    </svg>
</div>

<!--   ---------------------------------------------------------------------------------------    -->


<div id="toolbar">
    <div id="btnSelect" class="toolBtn" title="Pointer" data-mode="Select" data-checked="true">
        <svg version="1.1" width="30" height="30" viewBox="0 0 30 30" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs>
                <path d="m 11,10 0,11.5 c 0.6,-1 1.2,-2 2,-2.5 l 2,5.5 2,-0.5 -2,-5.5 c 1,0 2.5,0 4,0.5 z" id="pathSk09vck2b1c"></path>
            </defs>
            <g>
                <use xlink:href="#pathSk09vck2b1c" fill="#cccccc" transform="matrix(1,0,0,1,1,0.5)"></use>
                <use xlink:href="#pathSk09vck2b1c" fill="#000000"></use>
            </g>
        </svg>
    </div>
    <div id="btnDelete" class="toolBtn" style="line-height:30px; font-size:12pt; font-weight:bold;" title="Delete (DEL / X)">
        x
    </div>
    <div id="btnOffense" class="toolBtn" title="Offensive Player (O)" data-mode="Offense" style="height: 42px;">
        <svg version="1.1" width="34" height="42" viewBox="-2 0 32 42" style="overflow: hidden; user-select: none;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <g transform="matrix(1,0,0,1,15,16)" fill="#003366" stroke="#003366" class="offence">
                <circle cx="0" cy="0" r="10" fill="#ffffff" style="stroke-width: 2;"></circle>
                <text x="-4" y="5" stroke="none" style="font-size: 14px; font-family: Arial; font-weight: bold; pointer-events: none;">
                    1
                </text>
            </g>
            <g>
                <rect x="-3" y="31" width="17" height="11" fill="rgba(0,0,0,0)" stroke="#dfdfdf" style="stroke-width: 1;"></rect>
                <path d="m 8,34 -4,2 4,2" fill="rgba(0,0,0,0)" stroke="#000000" style="stroke-width: 1;"></path>
            </g>
            <g>
                <rect x="14" y="31" width="17" height="11" fill="rgba(0,0,0,0)" stroke="#dfdfdf" style="stroke-width: 1;"></rect>
                <path d="m 21,34 4,2 -4,2" fill="rgba(0,0,0,0)" stroke="#000000" style="stroke-width: 1;"></path>
            </g>
        </svg>

    </div><div id="btnDefense" class="toolBtn" title="Defensive Player (D)" data-mode="Defense" style="height: 42px;">
        <svg version="1.1" width="34" height="42" viewBox="-2 0 32 42" style="overflow: hidden; user-select: none;">
            <desc> Created with Snap</desc>
            <defs></defs>
            <g transform="matrix(0.8,0,0,0.8,15,16)" fill="#58001d" stroke="#58001d" class="defence">
                <g>
                    <path d="m -20,10 c 10,-16 30,-16 40,0 -5,-24 -35,-24 -40,0" stroke="none" style="stroke-width: 0;"></path>
                    <circle cx="0" cy="0" r="7" fill="#ffffff" style="stroke-width: 2;"></circle>
                </g>
                <text x="-3" y="4" stroke="none" style="font-size: 11px; font-family: Arial; font-weight: bold; pointer-events: none;">
                    1
                </text>
            </g>
            <g>
                <rect x="-3" y="31" width="17" height="11" fill="rgba(0,0,0,0)" stroke="#dfdfdf" style="stroke-width: 1;"></rect>
                <path d="m 8,34 -4,2 4,2" fill="rgba(0,0,0,0)" stroke="#000000" style="stroke-width: 1;"></path>
            </g>
            <g>
                <rect x="14" y="31" width="17" height="11" fill="rgba(0,0,0,0)" stroke="#dfdfdf" style="stroke-width: 1;"></rect>
                <path d="m 21,34 4,2 -4,2" fill="rgba(0,0,0,0)" stroke="#000000" style="stroke-width: 1;"></path>
            </g>
        </svg>
    </div>

    <div id="btnBall" class="toolBtn" title="Ball (B)" data-mode="Ball">
        <svg version="1.1" width="30" height="30" viewBox="0 0 16 16" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs>
                <radialGradient cx="0.6" cy="0.4" r="0.5" id="ballGradient_1_1567880131489">
                    <stop offset="0%" stop-color="#ffcaa6"></stop>
                    <stop offset="75%" stop-color="#d54800"></stop>
                    <stop offset="100%" stop-color="#8d3d17"></stop>
                </radialGradient>
            </defs>
            <g transform="matrix(1,0,0,1,8,9)" class="ball">
                <g>
                    <ellipse cx="0" cy="0" rx="7.25" ry="7" fill="url('#ballGradient_1_1567880131489')"></ellipse>
                    <path d="m -3.4,-6.1 c 2.3,-0.9 5.3,2 8.5,1 M -5.6,4.5 C -4.3,0.6 5.6,-8.1 5.9,4 M -0.4,7 C 2.7,3.5 3.1,-3.5 2.1,-6.6 M -7,-1.2 C -6.6,-3.3 3.2,-6.3 7,-1" stroke="#000000" fill="none" style="stroke-width: 0.2;"></path>
                </g>
            </g>
        </svg>
    </div>

    <div id="btnCone" class="toolBtn" title="Cone (N)" data-mode="Cone">
        <svg version="1.1" width="30" height="30" viewBox="0 0 30 30" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs>
                <linearGradient x1="0" y1="0.5" x2="1" y2="0.5" id="coneGradient_2_1567880131489">
                    <stop offset="0%" stop-color="#ffffff"></stop><stop offset="25%" stop-color="#ff7f7f"></stop>
                    <stop offset="100%" stop-color="#f00000"></stop>
                </linearGradient>
            </defs>
            <g transform="matrix(1,0,0,1,15,16)" class="cone">
                <g>
                    <path d="m -5,8 4.5,-17 1,0 4.5,17 z" fill="url('#coneGradient_2_1567880131489')"></path>
                    <line x1="-10" x2="10" y1="8" y2="8" stroke="#000000" style="stroke-width: 1;"></line>
                    <line x1="-10" x2="10" y1="9" y2="9" stroke="#f00000" style="stroke-width: 1;"></line>
                </g>
            </g>
        </svg>
    </div>

    <div id="btnCoach" class="toolBtn" title="Coach (C)" data-mode="Coach">
        <svg version="1.1" width="30" height="30" viewBox="0 0 30 30" style="overflow: hidden; user-select: none;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <g transform="matrix(1,0,0,1,15,16)" class="coach">
                <g>
                    <circle cx="0" cy="0" r="10" fill="#ffffff" stroke="#de4814" style="stroke-width: 2;"></circle>
                    <text x="-5.5" y="4.5" fill="#de4814" style="font-size: 18px; font-family: Arial; font-weight: bold; pointer-events: none;">
                        c
                    </text>
                </g>
            </g>
        </svg>
    </div>

    <div id="btnText" class="toolBtn" style="line-height:30px; font-size:16pt; font-family:'Times New Roman', Times, serif" title="Text Box (W)" data-mode="Text">
        T
    </div>

    <div class="toolSep"><hr></div>
    <div id="btnArea" class="toolBtn" title="Highlight area (A)" data-mode="Area" style="height: 42px;">
        <svg version="1.1" width="34" height="42" viewBox="-2 0 32 42" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <g fill="#ffff00" style="opacity: 0.6; stroke-width: 1;" class="area" transform="matrix(1,0,0,1,1,3)" stroke="#333333">
                <ellipse cx="13" cy="13" rx="13" ry="13"></ellipse>
            </g>
            <g>
                <rect x="-3" y="31" width="17" height="11" fill="rgba(0,0,0,0)" stroke="#dfdfdf" style="stroke-width: 1;"></rect>
                <path d="m 8,34 -4,2 4,2" fill="rgba(0,0,0,0)" stroke="#000000" style="stroke-width: 1;"></path>
            </g>
            <g>
                <rect x="14" y="31" width="17" height="11" fill="rgba(0,0,0,0)" stroke="#dfdfdf" style="stroke-width: 1;"></rect>
                <path d="m 21,34 4,2 -4,2" fill="rgba(0,0,0,0)" stroke="#000000" style="stroke-width: 1;"></path>
            </g>
        </svg>
    </div>

    <div id="btnChangeColor" class="toolBtn" title="Change Color" data-toggle="color" style="visibility: hidden;">
        <svg version="1.1" width="30" height="30" viewBox="0 -2 32 34" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <path d="M 16,1 C 7.7,1 1,7.7 1,16 c 0,8.3 6.7,15 15,15 1.4,0 2.5,-1.1 2.5,-2.5 0,-0.65 -0.1,-1.05 -0.5,-1.5 -0.4,-0.4 -1,-1.4 -1,-2 0,-1.4 1.6,-2 3,-2 l 3,0 c 4.6,0 8,-4.4 8,-9 C 31,6.6 24.3,1 16,1 Z M 7,16 C 5.6,16 4.5,14.9 4.5,13.5 4.5,12.1 5.6,11 7,11 8.4,11 9.5,12.1 9.5,13.5 9.5,14.9 8.4,16 7,16 Z M 12,9.5 C 10.6,9.5 9.5,8.4 9.5,7 9.5,5.6 10.6,4.5 12,4.5 c 1.4,0 2.5,1.1 2.5,2.5 0,1.4 -1.1,2.5 -2.5,2.5 z m 8,0 c -1.4,0 -2.5,-1.1 -2.5,-2.5 0,-1.4 1.1,-2.5 2.5,-2.5 1.4,0 2.5,1.1 2.5,2.5 0,1.4 -1.1,2.5 -2.5,2.5 z m 5,6.5 c -1.4,0 -2.5,-1.1 -2.5,-2.5 0,-1.4 1.1,-2.5 2.5,-2.5 1.4,0 2.5,1.1 2.5,2.5 0,1.4 -1.1,2.5 -2.5,2.5 z" stroke="#009fe3" fill="none" style="stroke-width: 1;"></path>
        </svg>
    </div>

    <div class="toolSep"><hr></div>
    <div id="btnLineMovement" class="toolBtn" title="Movement Line (M)" data-mode="LineMovement">
        <svg version="1.1" width="30" height="30" viewBox="0 0 30 30" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <line x1="5" x2="25" y1="17" y2="17" stroke="#000000" style="stroke-width: 2;"></line>
            <path d="m 26,17 -5,-5 0,10 z" fill="#000000" style="stroke-width: 0;"></path>
        </svg>
    </div>
    <div id="btnLinePassing" class="toolBtn" title="Passing Line (P)" data-mode="LinePassing">
        <svg version="1.1" width="30" height="30" viewBox="0 0 30 30" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <line x1="5" x2="25" y1="17" y2="17" stroke="#000000" style="stroke-width: 2; stroke-dasharray: 3, 3;"></line>
            <path d="m 26,17 -5,-5 0,10 z" fill="#000000" style="stroke-width: 0;"></path>
        </svg>
    </div>

    <div id="btnLineDribbling" class="toolBtn" title="Dribbling Line (R)" data-mode="LineDribbling">
        <svg version="1.1" width="30" height="30" viewBox="0 0 30 30" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <path d="m 3,16.5 1,0 c 2,0 2,2 4,2 2,0 2,-2 4,-2 2,0 2,2 4,2 2,0 2,-2 4,-2 l 1,0" fill="none" stroke="#000000" style="stroke-width: 2;"></path>
            <path d="m 26,17 -5,-5 0,10 z" fill="#000000" style="stroke-width: 0;"></path>
        </svg>
    </div>

    <div id="btnLineScreen" class="toolBtn" title="Screen Line (S)" data-mode="LineScreen">
        <svg version="1.1" width="30" height="30" viewBox="0 0 30 30" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <line x1="5" x2="25" y1="17" y2="17" stroke="#000000" style="stroke-width: 2;"></line>
            <line x1="25" x2="25" y1="12" y2="22" stroke="#000000" style="stroke-width: 2;"></line>
        </svg>
    </div>

    <div id="btnShooting" class="toolBtn" title="Shooting Line (T)" data-mode="Shooting">
        <svg version="1.1" width="30" height="30" viewBox="0 0 34 34" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <g transform="matrix(1,0,0,1,-8,20)" stroke="#000000" class="shoot">
                <path d="m -9,-25 8,-14 8,14 -4,0 0,13 -7.5,0 0,-13 z" fill="#ffffff" transform="matrix(0,1,-1,0,0,0)" style="stroke-width: 1;"></path>
            </g>
        </svg>
    </div>

    <div id="btnLine" class="toolBtn" title="Line (L)" data-mode="Line">
        <svg version="1.1" width="30" height="30" viewBox="0 0 30 30" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <line x1="5" x2="25" y1="17" y2="17" stroke="#000000" style="stroke-width: 2;"></line>
        </svg>
    </div>

    <div id="btnHandoff" class="toolBtn" title="Handoff (H)" data-mode="Handoff">
        <svg version="1.1" width="30" height="30" viewBox="0 0 30 30" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <g transform="matrix(1,0,0,1,15,16)" stroke="#000000" class="handoff">
                <path d="M -8,0 H 8 M 4,-8 V 8 M -4,-8 V 8" fill="none" style="stroke-width: 2;"></path>
            </g>
        </svg>
    </div>

    <div id="btnToggleInterpolation" class="toolBtn" title="Line type" data-toggle="lineInterpolated" data-checked="true" style="visibility: hidden;">
        <svg version="1.1" width="30" height="30" viewBox="0 0 30 30" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <path d="m 21.766716,14.875875 c 0,0 -0.852005,-2.697052 -2.626533,-3.619575 -1.774528,-0.922524 -5.820106,0.355483 -4.116097,5.749587 1.70401,5.394103 -2.341568,6.67211 -4.176184,5.832252 -1.8346166,-0.839859 -2.5664449,-3.70224 -2.5664449,-3.70224" fill="none" stroke="#000000" style="stroke-width: 1;"></path>
        </svg>
    </div>

    <div class="toolSep"><hr></div>

    <div id="btnUndo" class="toolBtn" title="Undo">
        <svg version="1.1" width="30" height="30" viewBox="0 0 32 32" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <path d="M 9.32,12 6,8 2,22 16,20 13,16.4 C 19.807988,10.567528 27.269307,15.992795 30,22 28.362626,10.321451 18.060691,5.8007801 9.32,12 Z" fill="#000000" ></path>
        </svg>
    </div>

    <div id="btnClear" class="toolBtn" title="Clear">
        <svg version="1.1" width="30" height="30" viewBox="0 0 32 32" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <path d="m 30,3.5312495 v 3.13542 H 2.0000005 v -3.13542 h 6.95302 l 2.0671105,-1.53125 h 9.95973 l 2.06712,1.53125 z M 3.9731605,26.864579 V 8.1979095 H 28.02685 V 26.864579 c 0,1.67709 -1.8792,3.13542 -4.040269,3.13542 H 8.0134205 c -2.16107,0 -4.04026,-1.45833 -4.04026,-3.13542 z" fill="#000000" ></path>
        </svg>
    </div>

    <div id="btnToggleHalfCourt" class="toolBtn" title="Half Court" data-toggle="halfCourt" data-checked="true">
        <svg version="1.1" width="30" height="50" viewBox="0 0 30 50" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <rect x="0" y="0" width="30" height="25" fill="#0089cf" ></rect>
            <rect x="0" y="25" width="30" height="25" fill="#cccccc"></rect>
            <g fill="none" stroke="#ffffff" style="stroke-width: 2;">
                <line x1="4" x2="26" y1="4" y2="4"></line>
                <line x1="15" x2="15" y1="4" y2="8.5"></line>
                <circle cx="15" cy="12" r="4"></circle>
                <line x1="4" x2="26" y1="46" y2="46"></line>
                <line x1="15" x2="15" y1="41.5" y2="46"></line>
                <circle cx="15" cy="38" r="4"></circle>
            </g>
        </svg>
    </div>

    <div id="btnMenu" class="toolBtn" title="Menu" data-menu="menu">
        <svg version="1.1" width="30" height="30" viewBox="0 0 32 32" style="overflow: hidden;">
            <desc>Created with Snap</desc>
            <defs></defs>
            <path d="M 2,26 H 30 V 22 H 2 Z M 2,14 v 4 H 30 V 14 Z M 2,6 v 4 H 30 V 6 Z" fill="#000000"></path>
        </svg>
    </div>

    <ul id="menu" class="toolMenu">
        <li id="btnRedo" class="toolMenuItem">
            <span class="toolMenuItemIcon">
                <svg version="1.1" width="30" height="30" viewBox="0 0 32 32" style="overflow: hidden;">
                    <desc>Created with Snap</desc>
                    <defs></defs>
                    <path d="M 22.68,12 26,8 30,22 16,20 19,16.4 C 12.192012,10.567528 4.730693,15.992795 2,22 3.637374,10.321451 13.939309,5.8007801 22.68,12 Z" fill="#000000" ></path>
                </svg>
            </span>
            <span class="toolMenuItemText">Redo</span>
        </li>
        <li id="btnFastBreak" class="toolMenuItem sep">
            <span class="toolMenuItemIcon">
                <svg version="1.1" width="30" height="30" viewBox="0 0 32 32" style="overflow: hidden;">
                    <desc>Created with Snap</desc>
                    <defs></defs>
                    <path d="m 0.84375,16 c 0,5.668379 5.1077256,10.373086 11.84375,11.5625 L 10.03125,30.125 11.875,32 18,26.03125 11.875,20 l -1.84375,1.84375 3.03125,3 C 7.9131386,23.836441 4.15625,20.250906 4.15625,16 4.15625,12.339451 6.9406294,9.170633 11,7.71875 L 11,4.8125 C 5.1219966,6.437579 0.84375,10.816992 0.84375,16 z M 14.03125,5.96875 20.15625,12 22,10.15625 19,7.21875 c 5.116082,1.018653 8.84375,4.548409 8.84375,8.78125 0,3.657618 -2.792147,6.824043 -6.84375,8.28125 l 0,2.90625 C 26.889618,25.569859 31.15625,21.18834 31.15625,16 c 0,-5.660068 -5.091498,-10.363943 -11.8125,-11.5625 L 22,1.875 20.15625,0 l -6.125,5.96875 z" fill="#000000"></path>
                </svg>
            </span>
            <span class="toolMenuItemText">FastBreak</span>
        </li>
        <li id="btnChangeOffenseColor" class="toolMenuItem">
            <span class="toolMenuItemIcon">
                <svg version="1.1" width="30" height="30" viewBox="0 -2 32 34" style="overflow: hidden;">
                    <desc>Created with Snap</desc>
                    <defs></defs>
                    <path d="M 16,1 C 7.7,1 1,7.7 1,16 c 0,8.3 6.7,15 15,15 1.4,0 2.5,-1.1 2.5,-2.5 0,-0.65 -0.1,-1.05 -0.5,-1.5 -0.4,-0.4 -1,-1.4 -1,-2 0,-1.4 1.6,-2 3,-2 l 3,0 c 4.6,0 8,-4.4 8,-9 C 31,6.6 24.3,1 16,1 Z M 7,16 C 5.6,16 4.5,14.9 4.5,13.5 4.5,12.1 5.6,11 7,11 8.4,11 9.5,12.1 9.5,13.5 9.5,14.9 8.4,16 7,16 Z M 12,9.5 C 10.6,9.5 9.5,8.4 9.5,7 9.5,5.6 10.6,4.5 12,4.5 c 1.4,0 2.5,1.1 2.5,2.5 0,1.4 -1.1,2.5 -2.5,2.5 z m 8,0 c -1.4,0 -2.5,-1.1 -2.5,-2.5 0,-1.4 1.1,-2.5 2.5,-2.5 1.4,0 2.5,1.1 2.5,2.5 0,1.4 -1.1,2.5 -2.5,2.5 z m 5,6.5 c -1.4,0 -2.5,-1.1 -2.5,-2.5 0,-1.4 1.1,-2.5 2.5,-2.5 1.4,0 2.5,1.1 2.5,2.5 0,1.4 -1.1,2.5 -2.5,2.5 z" fill="#003366"></path>
                </svg>
            </span>
            <span class="toolMenuItemText">Change Offense Color</span>
        </li>
        <li id="btnChangeDefenseColor" class="toolMenuItem">
            <span class="toolMenuItemIcon">
                <svg version="1.1" width="30" height="30" viewBox="0 -2 32 34" style="overflow: hidden;">
                    <desc>Created with Snap</desc>
                    <defs></defs>
                    <path d="M 16,1 C 7.7,1 1,7.7 1,16 c 0,8.3 6.7,15 15,15 1.4,0 2.5,-1.1 2.5,-2.5 0,-0.65 -0.1,-1.05 -0.5,-1.5 -0.4,-0.4 -1,-1.4 -1,-2 0,-1.4 1.6,-2 3,-2 l 3,0 c 4.6,0 8,-4.4 8,-9 C 31,6.6 24.3,1 16,1 Z M 7,16 C 5.6,16 4.5,14.9 4.5,13.5 4.5,12.1 5.6,11 7,11 8.4,11 9.5,12.1 9.5,13.5 9.5,14.9 8.4,16 7,16 Z M 12,9.5 C 10.6,9.5 9.5,8.4 9.5,7 9.5,5.6 10.6,4.5 12,4.5 c 1.4,0 2.5,1.1 2.5,2.5 0,1.4 -1.1,2.5 -2.5,2.5 z m 8,0 c -1.4,0 -2.5,-1.1 -2.5,-2.5 0,-1.4 1.1,-2.5 2.5,-2.5 1.4,0 2.5,1.1 2.5,2.5 0,1.4 -1.1,2.5 -2.5,2.5 z m 5,6.5 c -1.4,0 -2.5,-1.1 -2.5,-2.5 0,-1.4 1.1,-2.5 2.5,-2.5 1.4,0 2.5,1.1 2.5,2.5 0,1.4 -1.1,2.5 -2.5,2.5 z" fill="#58001d" ></path>
                </svg>
            </span>
            <span class="toolMenuItemText">Change Defense Color</span>
        </li>
        <li id="btnImgDownload" class="toolMenuItem sep">
            <span class="toolMenuItemIcon">
                <svg version="1.1" width="30" height="30" viewBox="0 -2 30 32" style="overflow: hidden;">
                    <desc>Created with Snap</desc>
                    <defs></defs>
                    <path d="M 30,26.6406 30,3.2813 Q 30,1.9531 28.98437,1.0156 28.04687,0 26.64062,0 L 3.35937,0 Q 1.95312,0 0.9375,1.0156 0,1.9531 0,3.2813 L 0,26.6406 Q 0,28.0469 0.9375,29.0625 1.95312,30 3.35937,30 l 23.28125,0 q 1.40625,0 2.34375,-0.9375 Q 30,28.0469 30,26.6406 l 0,0 z M 9.14062,17.5 l 4.21875,5 5.78125,-7.5 7.5,10 -23.28125,0 5.78125,-7.5 0,0 z" fill="#000000"></path>
                </svg>
            </span>
            <span class="toolMenuItemText">Download Image</span>
        </li>
    </ul>
<!--
    <div style="position:absolute; bottom:5px;">
        <div class="toolSep"><hr></div>
        <div id="btnSaveAndNew" class="toolBtn" style="width:73px; font-size:11pt; padding-top:5px; padding-bottom:5px" title="Save changes and create new graphic">
            Save &amp; New
        </div>
        <div id="btnSaveAndClose" class="toolBtn" style="width:73px; font-size:11pt; padding-top:5px; padding-bottom:5px" title="Save changes and close window">
            Save &amp; Close
        </div>
    </div>
-->
</div>






<!--   ---------------------------------------------------------------------------------------    -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script>

<script type="text/javascript">
    var tool;
    $(document).ready(function () {

        var loc = window.location.href.split("?"); loc = loc.concat(loc.pop().split("&"));

        var data = new Object();
        for (var i=1,a; i<loc.length; i++) {
            a = loc[i].split("=");
            data[a[0]] = a[1];
        }

        var newGraphicUrl = loc[0] + "?cid=" + data['cid'] + "&itemID=" + data['itemID'] + "&do=newGraphics&of=txt&ts={timestamp}"

        var toolOptions = {
            graphicId: "{095E626C-21E3-433F-81F1-0A84B09EBC65}",
            sessionId: "482441589",
            wheelchair: false,
            fullCourt: false,
            touchMode: true,
            loadAction: { url: "graphics.asp?do=get&param_id={graphicId}" },
            saveAction: { url: "graphics.asp?do=post", params: { param_id: "{graphicId}", json: "{data}", param_fullCourt: "{fullCourt}", param_sessionID: "{sessionId}" } },
            newAction: { url: newGraphicUrl, doneCallback: function() { newGraphics(); } },
            onClose: function () { closeGraphics() }
        };
        tool = new FibaEurope.Drawing.DrawingTool(toolOptions);
    });
</script>


</body>
</html>