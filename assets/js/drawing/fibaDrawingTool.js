/// <reference path="libs/snapsvg.d.ts" />
/// <reference path="fibaGraphic.ts" />
/// <reference path="fibaDrawingCurvedPath.ts" />
/// <reference path="fibaDrawingSvg.ts" />
/// <reference path="fibaDrawingController.ts" /> 
var FibaEurope;
/// <reference path="libs/snapsvg.d.ts" />
/// <reference path="fibaGraphic.ts" />
/// <reference path="fibaDrawingCurvedPath.ts" />
/// <reference path="fibaDrawingSvg.ts" />
/// <reference path="fibaDrawingController.ts" /> 
(function (FibaEurope) {
    var Drawing;
    (function (Drawing) {
        "use strict";
        var DrawingTool = (function () {
            function DrawingTool(opt) {
                var _this = this;
                this.isWheelchair = false;
                this.uiButtons = new Array();
                this.currentAreaColor = FibaEurope.Data.elementColor.yellow;
                this.defaultOptions = {
                    idDrawingHost: "drawingHost",
                    buttons: {
                        idSelectButton: "btnSelect",
                        idDeleteButton: "btnDelete",
                        idOffenseButton: "btnOffense",
                        idDefenseButton: "btnDefense",
                        idCoachButton: "btnCoach",
                        idConeButton: "btnCone",
                        idBallButton: "btnBall",
                        idTextButton: "btnText",
                        idAreaButton: "btnArea",
                        idToggleInterpolationButton: "btnToggleInterpolation",
                        idLineMovementButton: "btnLineMovement",
                        idLinePassingButton: "btnLinePassing",
                        idLineDribblingButton: "btnLineDribbling",
                        idLineScreenButton: "btnLineScreen",
                        idShootingButton: "btnShooting",
                        idLineButton: "btnLine",
                        idHandoffButton: "btnHandoff",
                        idChangeColorButton: "btnChangeColor",
                        idImgDownloadButton: "btnImgDownload",
                        idToggleHalfCourtButton: "btnToggleHalfCourt",
                        idUndoButton: "btnUndo",
                        idRedoButton: "btnRedo",
                        idFastBreakButton: "btnFastBreak",
                        idChangeOffenseColorButton: "btnChangeOffenseColor",
                        idChangeDefenseColorButton: "btnChangeDefenseColor",
                        idClearButton: "btnClear",
                        idMenuButton: "btnMenu",
                        idSaveAndNewButton: "btnSaveAndNew",
                        idSaveAndCloseButton: "btnSaveAndClose"
                    },
                    wheelchair: false,
                    fullCourt: true,
                    touchMode: false
                };
                this.options = {};
                // merge options
                for (var property in this.defaultOptions)
                    this.options[property] = this.defaultOptions[property];
                if (opt) {
                    for (var property in opt) {
                        if (property === "buttons") {
                            for (var btnproperty in opt[property])
                                this.options[property][btnproperty] = opt[property][btnproperty];
                        }
                        else {
                            this.options[property] = opt[property];
                        }
                    }
                }
                // init drawing
                this.isWheelchair = this.options.wheelchair;
                // init host
                var host = document.getElementById(this.options.idDrawingHost);
                if (!host)
                    throw new SyntaxError("No drawing host found! (id = '" + this.options.idDrawingHost + "')");
                // input area for drawing
                var isEdge = /Edge\/\d./i.test(navigator.userAgent); // don't use svg-defs in edge because there is a very anoying bug that is still not fixed: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/6478882/
                var isIE = /Trident\/\d./i.test(navigator.userAgent); // don't use svg-defs in IE because there is a very anoying bug that is still not fixed: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/6478882/
                this.drawingController = new Drawing.DrawingController(host, this.isWheelchair, this.options.touchMode, null, true, isEdge || isIE);
                this.drawingController.onSetMode = function (nm, om) { return _this.setMode(nm, om); };
                this.drawingController.onSetAreaForm = function (form) { if (_this.uiAreaDrawing)
                    _this.uiAreaDrawing.setForm(form); };
                this.drawingController.onSetOffenseNr = function (nr) { if (_this.uiOffenseDrawing)
                    _this.uiOffenseDrawing.setNr(nr); };
                this.drawingController.onSetDefenseNr = function (nr) { if (_this.uiDefenseDrawing)
                    _this.uiDefenseDrawing.setNr(nr); };
                this.drawingController.onSetHalfCourt = function (isHalfCourt) {
                    var btn = _this.getButtonForToggle("halfCourt");
                    if (btn) {
                        if (isHalfCourt) {
                            btn.setAttribute("data-checked", "true");
                        }
                        else {
                            btn.removeAttribute("data-checked");
                        }
                    }
                };
                this.drawingController.onCanChangeLineInterpolation = function (canChange) { return _this.showInterpolatedButton(canChange); };
                this.drawingController.onCanChangeColor = function (canChange) { return _this.showChanceColorButton(canChange); };
                this.drawingController.onStartEdit = function () { return console.log("start edit"); };
                this.drawingController.onEndEdit = function () { return console.log("end edit"); };
                this.drawingController.onDrawingChanged = function (el, change) { return console.log("drawing changed => " + change); };
                // init Buttons
                if (this.options.buttons) {
                    var btns = this.options.buttons;
                    if (btns.idSelectButton)
                        this.initModeButton(btns.idSelectButton, Drawing.DrawingToolMode.Select);
                    if (btns.idOffenseButton)
                        this.initModeButton(btns.idOffenseButton, Drawing.DrawingToolMode.Offense);
                    if (btns.idDefenseButton)
                        this.initModeButton(btns.idDefenseButton, Drawing.DrawingToolMode.Defense);
                    if (btns.idBallButton)
                        this.initModeButton(btns.idBallButton, Drawing.DrawingToolMode.Ball);
                    if (btns.idConeButton)
                        this.initModeButton(btns.idConeButton, Drawing.DrawingToolMode.Cone);
                    if (btns.idCoachButton)
                        this.initModeButton(btns.idCoachButton, Drawing.DrawingToolMode.Coach);
                    if (btns.idAreaButton)
                        this.initModeButton(btns.idAreaButton, Drawing.DrawingToolMode.Area);
                    if (btns.idTextButton)
                        this.initModeButton(btns.idTextButton, Drawing.DrawingToolMode.Text);
                    if (btns.idLineMovementButton)
                        this.initModeButton(btns.idLineMovementButton, Drawing.DrawingToolMode.LineMovement);
                    if (btns.idLinePassingButton)
                        this.initModeButton(btns.idLinePassingButton, Drawing.DrawingToolMode.LinePassing);
                    if (btns.idLineDribblingButton)
                        this.initModeButton(btns.idLineDribblingButton, Drawing.DrawingToolMode.LineDribbling);
                    if (btns.idLineScreenButton)
                        this.initModeButton(btns.idLineScreenButton, Drawing.DrawingToolMode.LineScreen);
                    if (btns.idShootingButton)
                        this.initModeButton(btns.idShootingButton, Drawing.DrawingToolMode.Shooting);
                    if (btns.idLineButton)
                        this.initModeButton(btns.idLineButton, Drawing.DrawingToolMode.Line);
                    if (btns.idHandoffButton)
                        this.initModeButton(btns.idHandoffButton, Drawing.DrawingToolMode.Handoff);
                    if (btns.idToggleInterpolationButton) {
                        var el = document.getElementById(btns.idToggleInterpolationButton);
                        if (el) {
                            el.setAttribute("data-toggle", "lineInterpolated");
                            if (this.drawingController.currentLineInterpolation)
                                el.setAttribute("data-checked", "true");
                            el.addEventListener("click", function (ev) { _this.drawingController.setLineInterpolation(!_this.drawingController.currentLineInterpolation); ev.preventDefault(); }, false);
                            this.uiButtons.push(el);
                            var btnInterpolation = el;
                            this.drawingController.onSetLineInterpolation = function (interpolated) {
                                if (interpolated)
                                    btnInterpolation.setAttribute("data-checked", "true");
                                else
                                    btnInterpolation.removeAttribute("data-checked");
                            };
                            // init image
                            var svgElInterpolation = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                            while (el.firstChild) {
                                el.removeChild(el.firstChild);
                            }
                            el.appendChild(svgElInterpolation);
                            var paperInterpolation = Snap(svgElInterpolation);
                            paperInterpolation.path("m 21.766716,14.875875 c 0,0 -0.852005,-2.697052 -2.626533,-3.619575 -1.774528,-0.922524 -5.820106,0.355483 -4.116097,5.749587 1.70401,5.394103 -2.341568,6.67211 -4.176184,5.832252 -1.8346166,-0.839859 -2.5664449,-3.70224 -2.5664449,-3.70224").attr({ fill: "none", stroke: "black", strokeWidth: 1 });
                        }
                    }
                    var changeColorPath = "M 16,1 C 7.7,1 1,7.7 1,16 c 0,8.3 6.7,15 15,15 1.4,0 2.5,-1.1 2.5,-2.5 0,-0.65 -0.1,-1.05 -0.5,-1.5 -0.4,-0.4 -1,-1.4 -1,-2 0,-1.4 1.6,-2 3,-2 l 3,0 c 4.6,0 8,-4.4 8,-9 C 31,6.6 24.3,1 16,1 Z M 7,16 C 5.6,16 4.5,14.9 4.5,13.5 4.5,12.1 5.6,11 7,11 8.4,11 9.5,12.1 9.5,13.5 9.5,14.9 8.4,16 7,16 Z M 12,9.5 C 10.6,9.5 9.5,8.4 9.5,7 9.5,5.6 10.6,4.5 12,4.5 c 1.4,0 2.5,1.1 2.5,2.5 0,1.4 -1.1,2.5 -2.5,2.5 z m 8,0 c -1.4,0 -2.5,-1.1 -2.5,-2.5 0,-1.4 1.1,-2.5 2.5,-2.5 1.4,0 2.5,1.1 2.5,2.5 0,1.4 -1.1,2.5 -2.5,2.5 z m 5,6.5 c -1.4,0 -2.5,-1.1 -2.5,-2.5 0,-1.4 1.1,-2.5 2.5,-2.5 1.4,0 2.5,1.1 2.5,2.5 0,1.4 -1.1,2.5 -2.5,2.5 z";
                    if (btns.idChangeColorButton) {
                        var el = document.getElementById(btns.idChangeColorButton);
                        if (el) {
                            el.setAttribute("data-toggle", "color");
                            var ctrl = this.drawingController;
                            el.addEventListener("click", function (ev) {
                                var dialogEl = FibaEurope.Drawing.DrawingElementHelper.createColorSelectDialog(ctrl.getColor(), function (color) {
                                    dialogEl.parentElement.removeChild(dialogEl);
                                    ctrl.setColor(color);
                                });
                                host.appendChild(dialogEl);
                                ev.preventDefault();
                            }, false);
                            this.uiButtons.push(el);
                            // init image
                            var svgElColor = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                            svgElColor.setAttribute("viewBox", "0 -2 32 34");
                            while (el.firstChild) {
                                el.removeChild(el.firstChild);
                            }
                            el.appendChild(svgElColor);
                            var paperColor = Snap(svgElColor);
                            var pathColor = paperColor.path(changeColorPath);
                            pathColor.attr({ stroke: "#009FE3", strokeWidth: 1, fill: "none" });
                            this.drawingController.onColorChanged = function (color) {
                                var colorAttr = { fill: Drawing.DrawingElementHelper.getColorString(color), strokeWidth: null, stroke: null };
                                switch (color) {
                                    case FibaEurope.Data.elementColor.green:
                                    case FibaEurope.Data.elementColor.red:
                                    case FibaEurope.Data.elementColor.grey:
                                    case FibaEurope.Data.elementColor.black:
                                    case FibaEurope.Data.elementColor.blue:
                                    case FibaEurope.Data.elementColor.offence:
                                    case FibaEurope.Data.elementColor.defence:
                                        break;
                                    case FibaEurope.Data.elementColor.yellow:
                                        colorAttr.stroke = "#999900";
                                        colorAttr.strokeWidth = 1;
                                        break;
                                    default:
                                        colorAttr.fill = "none";
                                        colorAttr.stroke = "#009FE3";
                                        colorAttr.strokeWidth = 1;
                                        break;
                                }
                                pathColor.attr(colorAttr);
                                // update color of the area
                                if (_this.drawingController.currentMode === Drawing.DrawingToolMode.Area) {
                                    _this.currentAreaColor = (!color || color < 0) ? FibaEurope.Data.elementColor.yellow : color;
                                    if (_this.uiAreaDrawing)
                                        _this.uiAreaDrawing.setColor(_this.currentAreaColor);
                                }
                            };
                        }
                    }
                    else {
                        // update color of the area
                        this.drawingController.onColorChanged = function (color) {
                            if (_this.drawingController.currentMode === Drawing.DrawingToolMode.Area) {
                                _this.currentAreaColor = (!color || color < 0) ? FibaEurope.Data.elementColor.yellow : color;
                                if (_this.uiAreaDrawing)
                                    _this.uiAreaDrawing.setColor(_this.currentAreaColor);
                            }
                        };
                    }
                    if (btns.idToggleHalfCourtButton) {
                        var el = document.getElementById(btns.idToggleHalfCourtButton);
                        if (el) {
                            el.setAttribute("data-toggle", "halfCourt");
                            el.addEventListener("click", function (ev) { _this.toggleHalfCourt(); ev.preventDefault(); }, false);
                            this.uiButtons.push(el);
                            // init image
                            var svgElHalfCourt = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 50);
                            while (el.firstChild) {
                                el.removeChild(el.firstChild);
                            }
                            el.appendChild(svgElHalfCourt);
                            var paperHalfCourt = Snap(svgElHalfCourt);
                            paperHalfCourt.rect(0, 0, 30, 25).attr({ fill: "#0089cf" });
                            paperHalfCourt.rect(0, 25, 30, 25).attr({ fill: "#cccccc" });
                            var g = paperHalfCourt.group().attr({ fill: "none", stroke: "white", strokeWidth: 2 });
                            g.append(paperHalfCourt.line(4, 4, 26, 4));
                            g.append(paperHalfCourt.line(15, 4, 15, 8.5));
                            g.append(paperHalfCourt.circle(15, 12, 4));
                            g.append(paperHalfCourt.line(4, 46, 26, 46));
                            g.append(paperHalfCourt.line(15, 41.5, 15, 46));
                            g.append(paperHalfCourt.circle(15, 38, 4));
                        }
                    }
                    if (btns.idDeleteButton) {
                        var el = document.getElementById(btns.idDeleteButton);
                        if (el) {
                            el.addEventListener("click", function (ev) { _this.deleteSelectedElement(); ev.preventDefault(); }, false);
                            this.uiButtons.push(el);
                        }
                    }
                    if (btns.idImgDownloadButton) {
                        var el = document.getElementById(btns.idImgDownloadButton);
                        if (el) {
                            el.addEventListener("click", function (ev) { _this.downloadImg(); ev.preventDefault(); }, false);
                            // init image
                            var elIco = el.getElementsByClassName("toolMenuItemIcon");
                            if (elIco.length > 0)
                                elIco = elIco[0];
                            else
                                elIco = el;
                            var svgElImg = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                            svgElImg.setAttribute("viewBox", "0 -2 30 32");
                            while (elIco.firstChild) {
                                elIco.removeChild(elIco.firstChild);
                            }
                            elIco.appendChild(svgElImg);
                            var paperImage = Snap(svgElImg);
                            paperImage.path("M 30,26.6406 30,3.2813 Q 30,1.9531 28.98437,1.0156 28.04687,0 26.64062,0 L 3.35937,0 Q 1.95312,0 0.9375,1.0156 0,1.9531 0,3.2813 L 0,26.6406 Q 0,28.0469 0.9375,29.0625 1.95312,30 3.35937,30 l 23.28125,0 q 1.40625,0 2.34375,-0.9375 Q 30,28.0469 30,26.6406 l 0,0 z M 9.14062,17.5 l 4.21875,5 5.78125,-7.5 7.5,10 -23.28125,0 5.78125,-7.5 0,0 z").attr({ fill: "#000000" });
                        }
                    }
                    if (btns.idUndoButton) {
                        var el = document.getElementById(btns.idUndoButton);
                        if (el) {
                            el.addEventListener("click", function (ev) { _this.drawingController.undo(); ev.preventDefault(); }, false);
                            // init image
                            var elIco = el.getElementsByClassName("toolMenuItemIcon");
                            if (elIco.length > 0)
                                elIco = elIco[0];
                            else
                                elIco = el;
                            var svgElImg = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                            svgElImg.setAttribute("viewBox", "0 0 32 32");
                            while (elIco.firstChild) {
                                elIco.removeChild(elIco.firstChild);
                            }
                            elIco.appendChild(svgElImg);
                            var paperImage = Snap(svgElImg);
                            paperImage.path("M 9.32,12 6,8 2,22 16,20 13,16.4 C 19.807988,10.567528 27.269307,15.992795 30,22 28.362626,10.321451 18.060691,5.8007801 9.32,12 Z").attr({ fill: "#000000" });
                        }
                    }
                    if (btns.idRedoButton) {
                        var el = document.getElementById(btns.idRedoButton);
                        if (el) {
                            el.addEventListener("click", function (ev) { _this.drawingController.redo(); ev.preventDefault(); }, false);
                            // init image
                            var elIco = el.getElementsByClassName("toolMenuItemIcon");
                            if (elIco.length > 0)
                                elIco = elIco[0];
                            else
                                elIco = el;
                            var svgElImg = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                            svgElImg.setAttribute("viewBox", "0 0 32 32");
                            while (elIco.firstChild) {
                                elIco.removeChild(elIco.firstChild);
                            }
                            elIco.appendChild(svgElImg);
                            var paperImage = Snap(svgElImg);
                            paperImage.path("M 22.68,12 26,8 30,22 16,20 19,16.4 C 12.192012,10.567528 4.730693,15.992795 2,22 3.637374,10.321451 13.939309,5.8007801 22.68,12 Z").attr({ fill: "#000000" });
                        }
                    }
                    if (btns.idFastBreakButton) {
                        var el = document.getElementById(btns.idFastBreakButton);
                        if (el) {
                            el.addEventListener("click", function (ev) { _this.drawingController.fastBreak(); ev.preventDefault(); }, false);
                            // init image
                            var elIco = el.getElementsByClassName("toolMenuItemIcon");
                            if (elIco.length > 0)
                                elIco = elIco[0];
                            else
                                elIco = el;
                            var svgElImg = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                            svgElImg.setAttribute("viewBox", "0 0 32 32");
                            while (elIco.firstChild) {
                                elIco.removeChild(elIco.firstChild);
                            }
                            elIco.appendChild(svgElImg);
                            var paperImage = Snap(svgElImg);
                            paperImage.path("m 0.84375,16 c 0,5.668379 5.1077256,10.373086 11.84375,11.5625 L 10.03125,30.125 11.875,32 18,26.03125 11.875,20 l -1.84375,1.84375 3.03125,3 C 7.9131386,23.836441 4.15625,20.250906 4.15625,16 4.15625,12.339451 6.9406294,9.170633 11,7.71875 L 11,4.8125 C 5.1219966,6.437579 0.84375,10.816992 0.84375,16 z M 14.03125,5.96875 20.15625,12 22,10.15625 19,7.21875 c 5.116082,1.018653 8.84375,4.548409 8.84375,8.78125 0,3.657618 -2.792147,6.824043 -6.84375,8.28125 l 0,2.90625 C 26.889618,25.569859 31.15625,21.18834 31.15625,16 c 0,-5.660068 -5.091498,-10.363943 -11.8125,-11.5625 L 22,1.875 20.15625,0 l -6.125,5.96875 z").attr({ fill: "#000000" });
                        }
                    }
                    if (btns.idChangeOffenseColorButton) {
                        var el = document.getElementById(btns.idChangeOffenseColorButton);
                        if (el) {
                            el.addEventListener("click", function (ev) {
                                var dialogEl = FibaEurope.Drawing.DrawingElementHelper.createColorSelectDialog(FibaEurope.Data.elementColor.offence, function (color) {
                                    dialogEl.parentElement.removeChild(dialogEl);
                                    ctrl.changeOffenseColor(color);
                                });
                                host.appendChild(dialogEl);
                                ev.preventDefault();
                            }, false);
                            // init image
                            var elIco = el.getElementsByClassName("toolMenuItemIcon");
                            if (elIco.length > 0)
                                elIco = elIco[0];
                            else
                                elIco = el;
                            var svgElImg = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                            svgElImg.setAttribute("viewBox", "0 -2 32 34");
                            while (elIco.firstChild) {
                                elIco.removeChild(elIco.firstChild);
                            }
                            elIco.appendChild(svgElImg);
                            var paperImage = Snap(svgElImg);
                            paperImage.path(changeColorPath).attr({ fill: Drawing.DrawingElementHelper.getColorString(FibaEurope.Data.elementColor.offence) });
                        }
                    }
                    if (btns.idChangeDefenseColorButton) {
                        var el = document.getElementById(btns.idChangeDefenseColorButton);
                        if (el) {
                            el.addEventListener("click", function (ev) {
                                var dialogEl = FibaEurope.Drawing.DrawingElementHelper.createColorSelectDialog(FibaEurope.Data.elementColor.defence, function (color) {
                                    dialogEl.parentElement.removeChild(dialogEl);
                                    ctrl.changeDefenseColor(color);
                                });
                                host.appendChild(dialogEl);
                                ev.preventDefault();
                            }, false);
                            // init image
                            var elIco = el.getElementsByClassName("toolMenuItemIcon");
                            if (elIco.length > 0)
                                elIco = elIco[0];
                            else
                                elIco = el;
                            var svgElImg = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                            svgElImg.setAttribute("viewBox", "0 -2 32 34");
                            while (elIco.firstChild) {
                                elIco.removeChild(elIco.firstChild);
                            }
                            elIco.appendChild(svgElImg);
                            var paperImage = Snap(svgElImg);
                            paperImage.path(changeColorPath).attr({ fill: Drawing.DrawingElementHelper.getColorString(FibaEurope.Data.elementColor.defence) });
                        }
                    }
                    if (btns.idClearButton) {
                        var el = document.getElementById(btns.idClearButton);
                        if (el) {
                            el.addEventListener("click", function (ev) { _this.drawingController.clear(true); ev.preventDefault(); }, false);
                            // init image
                            var elIco = el.getElementsByClassName("toolMenuItemIcon");
                            if (elIco.length > 0)
                                elIco = elIco[0];
                            else
                                elIco = el;
                            var svgElImg = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                            svgElImg.setAttribute("viewBox", "0 0 32 32");
                            while (elIco.firstChild) {
                                elIco.removeChild(elIco.firstChild);
                            }
                            elIco.appendChild(svgElImg);
                            var paperImage = Snap(svgElImg);
                            paperImage.path("m 30,3.5312495 v 3.13542 H 2.0000005 v -3.13542 h 6.95302 l 2.0671105,-1.53125 h 9.95973 l 2.06712,1.53125 z M 3.9731605,26.864579 V 8.1979095 H 28.02685 V 26.864579 c 0,1.67709 -1.8792,3.13542 -4.040269,3.13542 H 8.0134205 c -2.16107,0 -4.04026,-1.45833 -4.04026,-3.13542 z").attr({ fill: "#000000" });
                        }
                    }
                    if (btns.idMenuButton) {
                        var btn = document.getElementById(btns.idMenuButton);
                        if (btn) {
                            var idMenu = btn.getAttribute("data-menu");
                            var menu = document.getElementById(idMenu);
                            if (menu) {
                                var closeMenu = function () {
                                    if (menu.classList.contains("open")) {
                                        menu.classList.remove("open");
                                        menu.style.position = "fixed";
                                        menu.style.left = "-9999px";
                                        btn.removeAttribute("data-checked");
                                        document.body.removeEventListener("click", closeMenu);
                                    }
                                };
                                btn.addEventListener("click", function (ev) {
                                    if (!menu.classList.contains("open")) {
                                        menu.style.position = "fixed";
                                        menu.style.left = Math.round(btn.getBoundingClientRect().left - menu.getBoundingClientRect().width) + "px";
                                        menu.style.top = Math.round(btn.getBoundingClientRect().bottom - menu.getBoundingClientRect().height) + "px";
                                        menu.classList.add("open");
                                        btn.setAttribute("data-checked", "true");
                                        document.body.addEventListener("click", closeMenu);
                                        ev.stopPropagation();
                                        ev.preventDefault();
                                    }
                                }, false);
                            }
                            // init image
                            var svgElImg = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                            svgElImg.setAttribute("viewBox", "0 0 32 32");
                            while (btn.firstChild) {
                                btn.removeChild(btn.firstChild);
                            }
                            btn.appendChild(svgElImg);
                            var paperImage = Snap(svgElImg);
                            paperImage.path("M 2,26 H 30 V 22 H 2 Z M 2,14 v 4 H 30 V 14 Z M 2,6 v 4 H 30 V 6 Z").attr({ fill: "#000000" });
                        }
                    }
                    if (btns.idSaveAndNewButton) {
                        var el = document.getElementById(btns.idSaveAndNewButton);
                        if (el) {
                            el.addEventListener("click", function (ev) { _this.saveAndNew(); ev.preventDefault(); }, false);
                        }
                    }
                    if (btns.idSaveAndCloseButton) {
                        var el = document.getElementById(btns.idSaveAndCloseButton);
                        if (el) {
                            el.addEventListener("click", function (ev) { _this.saveAndClose(); ev.preventDefault(); }, false);
                        }
                    }
                }
                // register keypress
                this.drawingController.enableKeyEvents(true);
                // init mode
                this.drawingController.setMode(Drawing.DrawingToolMode.Select);
                this.drawingController.setHalfCourt(!this.options.fullCourt);
                // load Graphic
                if (this.options.graphicId) {
                    if (!this.options.loadAction || (!this.options.loadAction.url && !this.options.loadAction.action)) {
                        alert("No action or url for load set!");
                        return;
                    }
                    if (this.options.loadAction.url) {
                        var url = this.replaceMagicStrings(this.options.loadAction.url + "");
                        FibaEurope.Data.Graphic.loadFromUrl(url, function (graphic) {
                            if (graphic)
                                this.drawingController.loadGraphic(graphic);
                            if (this.options.loadAction.doneCallback)
                                this.options.loadAction.doneCallback(graphic);
                        }, this);
                    }
                    else if (this.options.loadAction.action) {
                        this.options.loadAction.action(this.options.graphicId, function (graphic) {
                            if (graphic)
                                _this.drawingController.loadGraphic(graphic);
                            if (_this.options.loadAction.doneCallback)
                                _this.options.loadAction.doneCallback(graphic);
                        });
                    }
                }
            }
            DrawingTool.prototype.initModeButton = function (idBtn, mode) {
                var _this = this;
                var el = document.getElementById(idBtn);
                if (!el)
                    return;
                el.setAttribute("data-mode", Drawing.DrawingToolMode[mode]);
                el.addEventListener("click", function (ev) { _this.modeButtonClick(ev, el); }, false);
                this.uiButtons.push(el);
                // init button content
                if (el.hasAttribute("data-noinit") || mode === Drawing.DrawingToolMode.Text)
                    return;
                var svgEl = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
                el.appendChild(svgEl);
                var drawing = new FibaEurope.Drawing.SvgDrawing(Snap(svgEl), null, true, true);
                var dynEl = new FibaEurope.Data.DynamicElement();
                dynEl.x = 15;
                dynEl.y = 16;
                switch (mode) {
                    case Drawing.DrawingToolMode.Select:
                        var select = drawing.paper.path("m 11,10 0,11.5 c 0.6,-1 1.2,-2 2,-2.5 l 2,5.5 2,-0.5 -2,-5.5 c 1,0 2.5,0 4,0.5 z").toDefs();
                        var selectShadow = select.use().attr({ fill: "#cccccc" }).transform("translate(1,0.5)");
                        var selectMain = select.use().attr({ fill: "black" });
                        drawing.paper.g(selectShadow, selectMain);
                        break;
                    case Drawing.DrawingToolMode.Offense:
                        drawing.disableTextSelection();
                        dynEl.nr = this.drawingController.currentOffenseNr;
                        dynEl.type = FibaEurope.Data.dynamicElementType.offence;
                        dynEl.color = FibaEurope.Data.elementColor.offence;
                        this.uiOffenseDrawing = drawing.drawOffense(dynEl, this.isWheelchair);
                        this.appendSelectionButtons(svgEl, drawing.paper, function () { if (_this.drawingController.currentOffenseNr > 1)
                            _this.drawingController.setOffenseNr(_this.drawingController.currentOffenseNr - 1); _this.drawingController.setMode(mode); }, function () { if (_this.drawingController.currentOffenseNr < 9)
                            _this.drawingController.setOffenseNr(_this.drawingController.currentOffenseNr + 1); _this.drawingController.setMode(mode); });
                        this.onLongPress(el, function (e) { return _this.selectPlayerNrAndFixed(false); });
                        break;
                    case Drawing.DrawingToolMode.Defense:
                        drawing.disableTextSelection();
                        dynEl.nr = this.drawingController.currentDefenseNr;
                        dynEl.type = FibaEurope.Data.dynamicElementType.defence;
                        dynEl.color = FibaEurope.Data.elementColor.defence;
                        this.uiDefenseDrawing = drawing.drawDefense(dynEl, this.isWheelchair);
                        this.uiDefenseDrawing.displayElement.transform("translate(15,16) scale(0.8)");
                        this.appendSelectionButtons(svgEl, drawing.paper, function () { if (_this.drawingController.currentDefenseNr > 1)
                            _this.drawingController.setDefenseNr(_this.drawingController.currentDefenseNr - 1); _this.drawingController.setMode(mode); }, function () { if (_this.drawingController.currentDefenseNr < 9)
                            _this.drawingController.setDefenseNr(_this.drawingController.currentDefenseNr + 1); _this.drawingController.setMode(mode); });
                        this.onLongPress(el, function (e) { return _this.selectPlayerNrAndFixed(true); });
                        break;
                    case Drawing.DrawingToolMode.Ball:
                        dynEl.type = FibaEurope.Data.dynamicElementType.ball;
                        dynEl.x = 8;
                        dynEl.y = 9;
                        svgEl.setAttribute("viewBox", "0 0 16 16");
                        drawing.drawBall(dynEl);
                        break;
                    case Drawing.DrawingToolMode.Cone:
                        dynEl.type = FibaEurope.Data.dynamicElementType.cone;
                        drawing.drawCone(dynEl);
                        break;
                    case Drawing.DrawingToolMode.Coach:
                        drawing.disableTextSelection();
                        dynEl.type = FibaEurope.Data.dynamicElementType.coach;
                        drawing.drawCoach(dynEl);
                        break;
                    case Drawing.DrawingToolMode.Area:
                        var statEl = new FibaEurope.Data.StaticElement();
                        statEl.type = FibaEurope.Data.staticElementType.area;
                        statEl.form = this.drawingController.currentAreaForm;
                        statEl.color = this.currentAreaColor;
                        statEl.x = 1;
                        statEl.y = 3;
                        statEl.width = statEl.height = 26;
                        this.uiAreaDrawing = drawing.drawArea(statEl, true);
                        this.appendSelectionButtons(svgEl, drawing.paper, function () { _this.decreaseAreaFormAndColor(); _this.drawingController.setMode(mode); }, function () { _this.increaseAreaFormAndColor(); _this.drawingController.setMode(mode); });
                        break;
                    case Drawing.DrawingToolMode.LineMovementFreehand:
                    case Drawing.DrawingToolMode.LineMovement:
                        Drawing.LineDrawingElement.drawLineTypeIcon(drawing.paper, FibaEurope.Data.lineElementType.movement);
                        break;
                    case Drawing.DrawingToolMode.LinePassingFreehand:
                    case Drawing.DrawingToolMode.LinePassing:
                        Drawing.LineDrawingElement.drawLineTypeIcon(drawing.paper, FibaEurope.Data.lineElementType.passing);
                        break;
                    case Drawing.DrawingToolMode.LineDribblingFreehand:
                    case Drawing.DrawingToolMode.LineDribbling:
                        Drawing.LineDrawingElement.drawLineTypeIcon(drawing.paper, FibaEurope.Data.lineElementType.dribbling);
                        break;
                    case Drawing.DrawingToolMode.LineScreenFreehand:
                    case Drawing.DrawingToolMode.LineScreen:
                        Drawing.LineDrawingElement.drawLineTypeIcon(drawing.paper, FibaEurope.Data.lineElementType.screen);
                        break;
                    case Drawing.DrawingToolMode.Shooting:
                        dynEl.type = FibaEurope.Data.dynamicElementType.shooting;
                        dynEl.x = -8;
                        dynEl.y = 20;
                        dynEl.rotation = 90;
                        dynEl.color = FibaEurope.Data.elementColor.black;
                        svgEl.setAttribute("viewBox", "0 0 34 34");
                        drawing.drawShooting(dynEl);
                        break;
                    case Drawing.DrawingToolMode.Handoff:
                        dynEl.type = FibaEurope.Data.dynamicElementType.handoff;
                        dynEl.color = FibaEurope.Data.elementColor.black;
                        drawing.drawHandoff(dynEl);
                        break;
                    case Drawing.DrawingToolMode.LineFreehand:
                    case Drawing.DrawingToolMode.Line:
                        Drawing.LineDrawingElement.drawLineTypeIcon(drawing.paper, FibaEurope.Data.lineElementType.line);
                        break;
                }
            };
            DrawingTool.prototype.selectPlayerNrAndFixed = function (isDefense) {
                var _this = this;
                var nr = isDefense ? this.drawingController.currentDefenseNr : this.drawingController.currentOffenseNr;
                var isFixed = isDefense ? this.drawingController.currentMode === Drawing.DrawingToolMode.DefenseLocked : this.drawingController.currentMode === Drawing.DrawingToolMode.OffenseLocked;
                var dialogEl = FibaEurope.Drawing.DynamicDrawingElement.createNrSelectDialog(nr, FibaEurope.Data.elementColor.unknown, isDefense, this.drawingController.wheelchair, function (nr, fixed) {
                    dialogEl.parentElement.removeChild(dialogEl);
                    var mode;
                    if (isDefense) {
                        mode = fixed ? Drawing.DrawingToolMode.DefenseLocked : Drawing.DrawingToolMode.Defense;
                        _this.drawingController.setDefenseNr(nr);
                    }
                    else {
                        mode = fixed ? Drawing.DrawingToolMode.OffenseLocked : Drawing.DrawingToolMode.Offense;
                        _this.drawingController.setOffenseNr(nr);
                    }
                    _this.drawingController.setMode(mode);
                }, isFixed);
                var host = document.getElementById(this.options.idDrawingHost);
                host.appendChild(dialogEl);
            };
            DrawingTool.prototype.onLongPress = function (el, onlongpress) {
                if (!onlongpress)
                    return;
                el.longPressStart = null;
                // how many milliseconds is a long press?
                var longpressTime = 1200;
                el.addEventListener('mousedown', function (e) {
                    el.longPressStart = new Date().getTime();
                }, false);
                el.addEventListener('mouseleave', function (e) {
                    el.longPressStart = null;
                }, false);
                el.addEventListener('mouseup', function (e) {
                    var start = el.longPressStart;
                    if (start > 0 && new Date().getTime() >= (start + longpressTime)) {
                        onlongpress(e);
                        e.preventDefault();
                    }
                }, false);
            };
            DrawingTool.prototype.appendSelectionButtons = function (svgEl, paper, ondecrease, onincrease) {
                var width = 30;
                var height = 30 + 12;
                svgEl.setAttribute("width", (width + 4) + "");
                svgEl.setAttribute("height", height + "");
                svgEl.setAttribute("viewBox", "-2 0 " + (width + 2) + " " + height);
                svgEl.parentNode.style.height = height + "px";
                var rectDecr = paper.rect(-3, 31, 17, 11).attr({ fill: "transparent", stroke: "#DFDFDF", strokeWidth: 1 });
                var rectIncr = paper.rect(14, 31, 17, 11).attr({ fill: "transparent", stroke: "#DFDFDF", strokeWidth: 1 });
                var arrowDecr = paper.path("m 8,34 -4,2 4,2").attr({ fill: "transparent", stroke: "black", strokeWidth: 1 });
                var arrowIncr = paper.path("m 21,34 4,2 -4,2").attr({ fill: "transparent", stroke: "black", strokeWidth: 1 });
                var btnDecr = paper.group(rectDecr, arrowDecr);
                var btnIncr = paper.group(rectIncr, arrowIncr);
                btnDecr.hover(function () { rectDecr.attr({ fill: "black" }); arrowDecr.attr({ stroke: "white" }); }, function () { rectDecr.attr({ fill: "transparent" }); arrowDecr.attr({ stroke: "black" }); });
                btnIncr.hover(function () { rectIncr.attr({ fill: "black" }); arrowIncr.attr({ stroke: "white" }); }, function () { rectIncr.attr({ fill: "transparent" }); arrowIncr.attr({ stroke: "black" }); });
                btnDecr.click(function (ev) { ondecrease(); ev.preventDefault(); ev.stopPropagation(); });
                btnIncr.click(function (ev) { onincrease(); ev.preventDefault(); ev.stopPropagation(); });
            };
            DrawingTool.prototype.modeButtonClick = function (event, btn) {
                var mode = Drawing.DrawingToolMode[btn.getAttribute("data-mode")];
                if (event.ctrlKey) {
                    if (mode === Drawing.DrawingToolMode.Offense)
                        mode = Drawing.DrawingToolMode.OffenseLocked;
                    else if (mode === Drawing.DrawingToolMode.Defense)
                        mode = Drawing.DrawingToolMode.DefenseLocked;
                    else if (Drawing.DrawingToolMode[mode].search(/Line/) !== -1) {
                        if (Drawing.DrawingToolMode[mode].search(/Freehand/) !== -1) {
                            var modeStr = Drawing.DrawingToolMode[mode].replace(/Freehand/, "");
                            mode = Drawing.DrawingToolMode[modeStr];
                        }
                        else {
                            var modeStr = Drawing.DrawingToolMode[mode] + "Freehand";
                            mode = Drawing.DrawingToolMode[modeStr];
                        }
                    }
                }
                // setMode(Area) resets the color to yellow, so remember the current selected color
                var areaColor = this.currentAreaColor;
                // set the new drawing mode
                this.drawingController.setMode(mode);
                // reset the area color
                if (mode === Drawing.DrawingToolMode.Area)
                    this.drawingController.setColor(areaColor);
                event.preventDefault();
            };
            DrawingTool.prototype.setMode = function (newMode, oldMode) {
                var btnOldMode = this.getButtonForMode(oldMode);
                if (btnOldMode) {
                    btnOldMode.removeAttribute("data-checked");
                    btnOldMode.removeAttribute("data-locked");
                    btnOldMode.removeAttribute("data-freehand");
                }
                var btnNewMode = this.getButtonForMode(newMode);
                if (btnNewMode) {
                    btnNewMode.setAttribute("data-checked", "true");
                    if (Drawing.DrawingToolMode[newMode].search(/Locked/) !== -1)
                        btnNewMode.setAttribute("data-locked", "true");
                    if (Drawing.DrawingToolMode[newMode].search(/Freehand/) !== -1)
                        btnNewMode.setAttribute("data-freehand", "true");
                }
            };
            DrawingTool.prototype.showInterpolatedButton = function (show) {
                var btnInterpolated = this.getButtonForToggle("lineInterpolated");
                if (btnInterpolated) {
                    if (show > 0) {
                        btnInterpolated.style.visibility = "visible";
                    }
                    else {
                        btnInterpolated.style.visibility = "hidden";
                    }
                }
            };
            DrawingTool.prototype.showChanceColorButton = function (show) {
                var btnChanceColor = this.getButtonForToggle("color");
                if (btnChanceColor) {
                    if (show > 0) {
                        btnChanceColor.style.visibility = "visible";
                    }
                    else {
                        btnChanceColor.style.visibility = "hidden";
                    }
                }
            };
            DrawingTool.prototype.getButtonForMode = function (mode) {
                if (typeof mode === "undefined")
                    return null;
                var modeStr = Drawing.DrawingToolMode[mode];
                modeStr = modeStr.replace(/Locked/, "");
                var altModeStr = modeStr.replace(/Freehand/, "");
                for (var i = 0; i < this.uiButtons.length; i++) {
                    var btnMode = this.uiButtons[i].getAttribute("data-mode");
                    if (btnMode === modeStr || btnMode === altModeStr)
                        return this.uiButtons[i];
                }
                return null;
            };
            DrawingTool.prototype.getButtonForToggle = function (mode) {
                for (var i = 0; i < this.uiButtons.length; i++) {
                    if (this.uiButtons[i].getAttribute("data-toggle") === mode)
                        return this.uiButtons[i];
                }
                return null;
            };
            DrawingTool.prototype.deleteSelectedElement = function () {
                this.drawingController.deleteSelected();
            };
            DrawingTool.prototype.increaseAreaFormAndColor = function () {
                if (this.drawingController.currentAreaForm === FibaEurope.Data.staticElementForm.triangle) {
                    if (this.currentAreaColor < FibaEurope.Data.elementColor.defence) {
                        var form = FibaEurope.Data.staticElementForm.ellipse;
                        var color = this.currentAreaColor + 1;
                        this.drawingController.setAreaForm(form);
                        this.drawingController.setColor(color);
                    }
                }
                else if (this.drawingController.currentAreaForm === FibaEurope.Data.staticElementForm.ellipse) {
                    this.drawingController.setAreaForm(FibaEurope.Data.staticElementForm.rectangle);
                }
                else if (this.drawingController.currentAreaForm === FibaEurope.Data.staticElementForm.rectangle) {
                    this.drawingController.setAreaForm(FibaEurope.Data.staticElementForm.triangle);
                }
            };
            DrawingTool.prototype.decreaseAreaFormAndColor = function () {
                if (this.drawingController.currentAreaForm === FibaEurope.Data.staticElementForm.ellipse) {
                    if (this.currentAreaColor > FibaEurope.Data.elementColor.yellow) {
                        var form = FibaEurope.Data.staticElementForm.triangle;
                        var color = this.currentAreaColor - 1;
                        this.drawingController.setAreaForm(form);
                        this.drawingController.setColor(color);
                    }
                }
                else if (this.drawingController.currentAreaForm === FibaEurope.Data.staticElementForm.rectangle) {
                    this.drawingController.setAreaForm(FibaEurope.Data.staticElementForm.ellipse);
                }
                else if (this.drawingController.currentAreaForm === FibaEurope.Data.staticElementForm.triangle) {
                    this.drawingController.setAreaForm(FibaEurope.Data.staticElementForm.rectangle);
                }
            };
            DrawingTool.prototype.toggleHalfCourt = function () {
                this.drawingController.setHalfCourt(!this.drawingController.isHalfCourt);
            };
            DrawingTool.prototype.downloadImg = function () {
                var _this = this;
                this.drawingController.selectElement(null);
                if (this.options.imgDownloadAction && this.options.imgDownloadAction.action) {
                    var canvasHost = document.createElement("div");
                    Drawing.CanvasDrawing.drawGraphic(this.drawingController.drawing.paper.node, {
                        host: canvasHost,
                        renderCallback: function (canvas) {
                            _this.options.imgDownloadAction.action(canvas, _this.options.imgDownloadAction.doneCallback);
                        }
                    });
                }
                else {
                    var opt = {};
                    if (this.options.imgDownloadAction) {
                        if (this.options.imgDownloadAction.filename)
                            opt.name = this.options.imgDownloadAction.filename;
                        if (this.options.imgDownloadAction.doneCallback)
                            opt.doneCallback = this.options.imgDownloadAction.doneCallback;
                    }
                    Drawing.CanvasDrawing.exportGraphic(this.drawingController.drawing.paper.node, opt);
                }
            };
            DrawingTool.prototype.getFilledParams = function (orgParams) {
                var params;
                if (orgParams) {
                    params = {};
                    for (var property in orgParams)
                        params[property] = this.replaceMagicStrings(orgParams[property]);
                }
                return params;
            };
            DrawingTool.prototype.save = function (onOk, onError) {
                var _this = this;
                if (!this.options.saveAction || (!this.options.saveAction.url && !this.options.saveAction.action)) {
                    alert("No action or url for save set!");
                    return;
                }
                var params = this.getFilledParams(this.options.saveAction.params);
                if (this.options.saveAction.url) {
                    var url = this.replaceMagicStrings(this.options.saveAction.url);
                    var req = Snap.ajax(url, params, function (req) {
                        if (req.status < 400 && onOk)
                            onOk(req.responseText);
                        else if (onError && req.status >= 400)
                            onError(req.status, req.statusText);
                        if (_this.options.saveAction.doneCallback)
                            _this.options.saveAction.doneCallback();
                    }, this);
                    return req;
                }
                else if (this.options.saveAction.action) {
                    this.options.saveAction.action(params, function () {
                        if (onOk)
                            onOk();
                        if (_this.options.saveAction.doneCallback)
                            _this.options.saveAction.doneCallback();
                    });
                }
            };
            DrawingTool.prototype.doNew = function (onOk, onError) {
                var _this = this;
                if (!this.options.newAction) {
                    if (onOk)
                        onOk();
                    return;
                }
                var params = this.getFilledParams(this.options.newAction.params);
                if (this.options.newAction.url) {
                    var url = this.replaceMagicStrings(this.options.newAction.url);
                    var req = Snap.ajax(url, params, function (req) {
                        if (req.status < 400 && onOk)
                            onOk(req.responseText);
                        else if (onError && req.status >= 400)
                            onError(req.status, req.statusText);
                        if (_this.options.newAction.doneCallback)
                            _this.options.newAction.doneCallback(req.responseText);
                    }, this);
                    return req;
                }
                else if (this.options.newAction.action) {
                    this.options.newAction.action(params, function (newGraphicId) {
                        if (onOk)
                            onOk(newGraphicId);
                        if (_this.options.newAction.doneCallback)
                            _this.options.newAction.doneCallback(newGraphicId);
                    });
                }
            };
            DrawingTool.prototype.saveAndNew = function () {
                var _this = this;
                this.save(function () {
                    _this.doNew(function (newGraphicId) {
                        _this.drawingController.initNewGraphicFromCurrent();
                        if (newGraphicId && newGraphicId !== "") {
                            _this.options.graphicId = newGraphicId;
                        }
                    });
                });
            };
            DrawingTool.prototype.saveAndClose = function () {
                var _this = this;
                this.save(function () {
                    _this.drawingController.clear(false);
                    if (_this.options.onClose)
                        _this.options.onClose();
                });
            };
            DrawingTool.prototype.replaceMagicStrings = function (val) {
                val = (val + "").replace(/{graphicId}/, this.options.graphicId);
                val = val.replace(/{fullCourt}/, this.drawingController.isHalfCourt ? "0" : "1");
                val = val.replace(/{wheelchair}/, this.drawingController.wheelchair ? "1" : "0");
                if (this.options.sessionId)
                    val = val.replace(/{sessionId}/, this.options.sessionId);
                if (val.match(/{data}/)) {
                    var data = this.drawingController.getGraphic().toJson();
                    val = val.replace(/{data}/, data);
                }
                val = val.replace(/{timestamp}/, Date.now() + "");
                return val;
            };
            return DrawingTool;
        }());
        Drawing.DrawingTool = DrawingTool;
    })(Drawing = FibaEurope.Drawing || (FibaEurope.Drawing = {}));
})(FibaEurope || (FibaEurope = {}));
//# sourceMappingURL=fibaDrawingTool.js.map