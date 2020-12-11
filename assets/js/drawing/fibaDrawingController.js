/// <reference path="libs/snapsvg.d.ts" />
/// <reference path="fibaGraphic.ts" />
/// <reference path="fibaDrawingCurvedPath.ts" />
/// <reference path="fibaDrawingSvg.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FibaEurope;
/// <reference path="libs/snapsvg.d.ts" />
/// <reference path="fibaGraphic.ts" />
/// <reference path="fibaDrawingCurvedPath.ts" />
/// <reference path="fibaDrawingSvg.ts" />
(function (FibaEurope) {
    var Drawing;
    (function (Drawing) {
        "use strict";
        var DrawingToolMode;
        (function (DrawingToolMode) {
            DrawingToolMode[DrawingToolMode["Select"] = 0] = "Select";
            DrawingToolMode[DrawingToolMode["Offense"] = 1] = "Offense";
            DrawingToolMode[DrawingToolMode["OffenseLocked"] = 2] = "OffenseLocked";
            DrawingToolMode[DrawingToolMode["Defense"] = 3] = "Defense";
            DrawingToolMode[DrawingToolMode["DefenseLocked"] = 4] = "DefenseLocked";
            DrawingToolMode[DrawingToolMode["Coach"] = 5] = "Coach";
            DrawingToolMode[DrawingToolMode["Cone"] = 6] = "Cone";
            DrawingToolMode[DrawingToolMode["Ball"] = 7] = "Ball";
            DrawingToolMode[DrawingToolMode["Shooting"] = 8] = "Shooting";
            DrawingToolMode[DrawingToolMode["Handoff"] = 9] = "Handoff";
            DrawingToolMode[DrawingToolMode["Text"] = 10] = "Text";
            DrawingToolMode[DrawingToolMode["Area"] = 11] = "Area";
            DrawingToolMode[DrawingToolMode["LinePassing"] = 12] = "LinePassing";
            DrawingToolMode[DrawingToolMode["LinePassingFreehand"] = 13] = "LinePassingFreehand";
            DrawingToolMode[DrawingToolMode["LineMovement"] = 14] = "LineMovement";
            DrawingToolMode[DrawingToolMode["LineMovementFreehand"] = 15] = "LineMovementFreehand";
            DrawingToolMode[DrawingToolMode["LineDribbling"] = 16] = "LineDribbling";
            DrawingToolMode[DrawingToolMode["LineDribblingFreehand"] = 17] = "LineDribblingFreehand";
            DrawingToolMode[DrawingToolMode["LineScreen"] = 18] = "LineScreen";
            DrawingToolMode[DrawingToolMode["LineScreenFreehand"] = 19] = "LineScreenFreehand";
            DrawingToolMode[DrawingToolMode["Line"] = 20] = "Line";
            DrawingToolMode[DrawingToolMode["LineFreehand"] = 21] = "LineFreehand";
            DrawingToolMode[DrawingToolMode["LineFree"] = 22] = "LineFree";
        })(DrawingToolMode = Drawing.DrawingToolMode || (Drawing.DrawingToolMode = {}));
        var DrawingController = /** @class */ (function () {
            function DrawingController(host, wheelchair, touchMode, simple, createUniqueDefs, dontUseDefs) {
                var _this = this;
                this.wheelchair = wheelchair;
                this.touchMode = touchMode;
                this.changeCourtSizeForHalfCourt = true;
                this.isHalfCourt = false;
                this.currentOffenseNr = 1;
                this.currentDefenseNr = 1;
                this.currentOffenseDrawingDone = false;
                this.currentDefenseDrawingDone = false;
                this.currentAreaForm = FibaEurope.Data.staticElementForm.ellipse;
                this.currentLineInterpolation = true;
                this.statics = [];
                this.dynamics = [];
                this.lines = [];
                this.undoRedoStack = [];
                this.lockChanged = 0;
                // to prevent multiple mousemove with the same position in IE
                this.lastMouseXY = {};
                // init host
                var svgEl = FibaEurope.Drawing.SvgDrawing.createSvgElement();
                while (host.firstChild) {
                    host.removeChild(host.firstChild);
                }
                host.appendChild(svgEl);
                var paper = Snap(svgEl);
                this.drawing = new FibaEurope.Drawing.SvgDrawing(paper, null, createUniqueDefs, dontUseDefs);
                this.drawing.disableTextSelection();
                // draw background
                this.backgroundGroup = this.drawing.drawBackground(simple);
                // groups    
                this.groups = {
                    area: paper.g().attr({ "class": "groupArea" }),
                    shoot: paper.g().attr({ "class": "groupShoot" }),
                    line: paper.g().attr({ "class": "groupLine" }),
                    cone: paper.g().attr({ "class": "groupCone" }),
                    handoff: paper.g().attr({ "class": "groupHandoff" }),
                    person: paper.g().attr({ "class": "groupPerson" }),
                    ball: paper.g().attr({ "class": "groupBall" }),
                    text: paper.g().attr({ "class": "groupText" }),
                    all: null
                };
                this.groups.all = paper.g(this.groups.area, this.groups.shoot, this.groups.line, this.groups.cone, this.groups.handoff, this.groups.person, this.groups.ball, this.groups.text).attr({ "class": "groupDrawing" });
                // draw halfCourt Blocker
                var bbox = this.backgroundGroup.select("rect").getBBox();
                this.lowerHalfCourt = paper.rect(bbox.x, bbox.y + bbox.height / 2, bbox.width, bbox.height / 2);
                this.lowerHalfCourt.attr({ "class": "lowerHalfCourt", fill: "#333333", opacity: 0.6, visibility: "hidden" });
                this.clipHalfCourt = paper.el("clipPath", { id: "clipHalfCourt_" + Date.now() });
                this.clipHalfCourt.append(paper.rect(bbox.x, bbox.y, bbox.width, bbox.height / 2));
                this.clipHalfCourt.toDefs();
                // overlay group for the overlay of the drawingRequest
                this.overlayGroup = paper.g().attr({ "class": "overlayGroup" });
                // hover group for invisible elements to select and move (e.g. a thick line)
                this.hoverGroups = {
                    area: paper.g().attr({ "class": "groupArea" }),
                    shoot: paper.g().attr({ "class": "groupShoot" }),
                    line: paper.g().attr({ "class": "groupLine" }),
                    cone: paper.g().attr({ "class": "groupCone" }),
                    handoff: paper.g().attr({ "class": "groupHandoff" }),
                    person: paper.g().attr({ "class": "groupPerson" }),
                    ball: paper.g().attr({ "class": "groupBall" }),
                    text: paper.g().attr({ "class": "groupText" }),
                    all: null
                };
                this.hoverGroups.all = paper.g(this.hoverGroups.area, this.hoverGroups.shoot, this.hoverGroups.line, this.hoverGroups.cone, this.hoverGroups.handoff, this.hoverGroups.person, this.hoverGroups.ball, this.hoverGroups.text).attr({ "class": "groupHover", cursor: "move" });
                // the canvas for the input commands
                this.drawingCanvas = paper.rect(bbox.x, bbox.y, bbox.width, bbox.height);
                this.drawingCanvas.attr({ "class": "drawingCanvas", fill: "transparent" });
                this.pt = paper.node.createSVGPoint();
                this.intersectRect = paper.node.createSVGRect();
                this.intersectRect.width = this.intersectRect.height = 1;
                this.drawingCanvas.mousedown(function (ev) { return _this.onMouseAction("onMouseDown", ev); });
                this.drawingCanvas.mouseup(function (ev) { return _this.onMouseAction("onMouseUp", ev); });
                this.drawingCanvas.mousemove(function (ev) { return _this.onMouseAction("onMouseMove", ev); });
                this.drawingCanvas.mouseover(function (ev) { return _this.onMouseAction("onMouseEnter", ev); });
                this.drawingCanvas.mouseout(function (ev) { return _this.onMouseAction("onMouseLeave", ev); });
                this.drawingCanvas.click(function (ev) { return _this.onMouseAction("onMouseClick", ev); });
                this.drawingCanvas.dblclick(function (ev) { return _this.onMouseAction("onMouseDblClick", ev); });
                this.lockEditingElement = paper.rect(bbox.x, bbox.y, bbox.width, bbox.height);
                this.lockEditingElement.attr({ "class": "lockEditing", fill: "none" });
                // targetTop and targetButtom to rotate the defense players on fastbreak
                this.basketTop = DrawRequestShoot.getShootingTarget(bbox.width, bbox.height);
                this.basketBottom = DrawRequestShoot.getShootingTarget(bbox.width, bbox.height, true);
                // fill
                svgEl.setAttribute("width", "100%");
                svgEl.setAttribute("height", "100%");
            }
            DrawingController.prototype.onMouseAction = function (action, ev) {
                if (!this.currentDrawRequest || typeof this.currentDrawRequest[action] !== "function")
                    return;
                // stop panning and zooming so we can draw
                if (ev.preventManipulation)
                    ev.preventManipulation();
                // Track lastPoint to prevent multiple mousemove with the same position in IE
                var touchPointId = ev.identifier;
                if (action === "onMouseDown") {
                    this.lastMouseXY[touchPointId] = { x: ev.pageX, y: ev.pageY };
                }
                else if (action === "onMouseMove") {
                    if (this.lastMouseXY[touchPointId] && this.lastMouseXY[touchPointId].x === ev.pageX && this.lastMouseXY[touchPointId].y === ev.pageY) {
                        return;
                    }
                    this.lastMouseXY[touchPointId] = { x: ev.pageX, y: ev.pageY };
                }
                else if (action === "onMouseUp" || action === "onMouseLeave") {
                    delete this.lastMouseXY[touchPointId];
                }
                // transform point in viewBox coordinates
                var screenTransformMatrix = this.drawingCanvas.node.getScreenCTM().inverse();
                this.pt.x = ev.clientX;
                this.pt.y = ev.clientY;
                var ptT = this.pt.matrixTransform(screenTransformMatrix);
                // check for selection
                if (action === "onMouseDown") {
                    this.intersectRect.x = ev.clientX;
                    this.intersectRect.y = ev.clientY;
                    var intersectElement = null;
                    // 1. Text
                    for (var i = 0; i < this.statics.length; i++) {
                        if (this.statics[i].data.type !== FibaEurope.Data.staticElementType.text)
                            continue;
                        // checkIntersection seams not to work
                        var bbox = this.statics[i].hoverElement.getBBox();
                        if (Snap.path.isPointInsideBBox(bbox, ptT.x, ptT.y)) {
                            intersectElement = this.statics[i];
                            break;
                        }
                    }
                    // 2. Ball
                    if (!intersectElement && this.currentMode != DrawingToolMode.Shooting) {
                        for (var i = 0; i < this.dynamics.length; i++) {
                            if (this.dynamics[i].data.type !== FibaEurope.Data.dynamicElementType.ball)
                                continue;
                            // checkIntersection seams not to work
                            var bbox = this.dynamics[i].hoverElement.getBBox();
                            if (Snap.path.isPointInsideBBox(bbox, ptT.x, ptT.y)) {
                                var dyn = this.dynamics[i];
                                // check radius
                                var dx = ptT.x - dyn.data.x;
                                var dy = ptT.y - dyn.data.y;
                                var dist = Math.sqrt(dx * dx + dy * dy);
                                var maxDist = this.touchMode ? 9 : 7;
                                if (dist <= maxDist) {
                                    intersectElement = dyn;
                                    break;
                                }
                            }
                        }
                    }
                    // 3. Person
                    if (!intersectElement && this.currentMode != DrawingToolMode.Shooting) {
                        for (var i = 0; i < this.dynamics.length; i++) {
                            if (this.dynamics[i].data.type !== FibaEurope.Data.dynamicElementType.coach &&
                                this.dynamics[i].data.type !== FibaEurope.Data.dynamicElementType.offence &&
                                this.dynamics[i].data.type !== FibaEurope.Data.dynamicElementType.defence)
                                continue;
                            // checkIntersection seams not to work
                            var bbox = this.dynamics[i].hoverElement.getBBox();
                            if (Snap.path.isPointInsideBBox(bbox, ptT.x, ptT.y)) {
                                var dyn = this.dynamics[i];
                                // check radius
                                var dx = ptT.x - dyn.data.x;
                                var dy = ptT.y - dyn.data.y;
                                var dist = Math.sqrt(dx * dx + dy * dy);
                                var maxDist = this.touchMode ? 11 : 13;
                                if (dist <= maxDist) {
                                    intersectElement = dyn;
                                    break;
                                }
                            }
                        }
                    }
                    // 4. Cone
                    if (!intersectElement) {
                        for (var i = 0; i < this.dynamics.length; i++) {
                            if (this.dynamics[i].data.type !== FibaEurope.Data.dynamicElementType.cone)
                                continue;
                            // checkIntersection seams not to work
                            var bbox = this.dynamics[i].hoverElement.getBBox();
                            if (Snap.path.isPointInsideBBox(bbox, ptT.x, ptT.y)) {
                                intersectElement = this.dynamics[i];
                                break;
                            }
                        }
                    }
                    // 5. Lines
                    if (!intersectElement) {
                        for (var i = 0; i < this.lines.length; i++) {
                            // checkIntersection seams not to work
                            var bbox = this.lines[i].hoverElement.getBBox();
                            if (Snap.path.isPointInsideBBox(bbox, ptT.x, ptT.y)) {
                                // get distance to the line (because intersect is only/also true if point is inside of the path)
                                var ptdist = this.lines[i].getPointDistance(ptT.x, ptT.y, 5);
                                if (ptdist.distance < 5) {
                                    intersectElement = this.lines[i];
                                    break;
                                }
                            }
                        }
                    }
                    // 6. shoot
                    if (!intersectElement) {
                        for (var i = 0; i < this.dynamics.length; i++) {
                            if (this.dynamics[i].data.type !== FibaEurope.Data.dynamicElementType.shooting)
                                continue;
                            // checkIntersection seams not to work
                            var bbox = this.dynamics[i].hoverElement.getBBox();
                            if (Snap.path.isPointInsideBBox(bbox, ptT.x, ptT.y)) {
                                intersectElement = this.dynamics[i];
                                break;
                            }
                        }
                    }
                    // 7. handoff
                    if (!intersectElement) {
                        for (var i = 0; i < this.dynamics.length; i++) {
                            if (this.dynamics[i].data.type !== FibaEurope.Data.dynamicElementType.handoff)
                                continue;
                            // checkIntersection seams not to work
                            var bbox = this.dynamics[i].hoverElement.getBBox();
                            if (Snap.path.isPointInsideBBox(bbox, ptT.x, ptT.y)) {
                                intersectElement = this.dynamics[i];
                                break;
                            }
                        }
                    }
                    // 8. Areas
                    // don't check
                    // found something -> cancel drawing and select element
                    if (intersectElement) {
                        ev.preventDefault();
                        this.setMode(DrawingToolMode.Select);
                        this.selectElement(intersectElement);
                        // resend event to trigger movement
                        var newEvent = document.createEvent("MouseEvent");
                        newEvent.initMouseEvent("mousedown", true, true, window, 0, ev.screenX, ev.screenY, ev.clientX, ev.clientY, ev.ctrlKey, ev.altKey, ev.shiftKey, ev.metaKey, 0, null);
                        newEvent.identifier = touchPointId;
                        intersectElement.hoverElement.node.dispatchEvent(newEvent);
                        return;
                    }
                }
                // call action
                // console.log(action + ': ' + ptT.x + ',' + ptT.y + ' [' + touchPointId + ']');
                if (this.currentDrawRequest[action](ptT.x, ptT.y, touchPointId)) {
                    ev.preventDefault();
                }
            };
            DrawingController.prototype.drawRequestDone = function (el) {
                if (el) {
                    if (el instanceof Drawing.StaticDrawingElement) {
                        this.addStaticElement(el);
                    }
                    else if (el instanceof Drawing.LineDrawingElement) {
                        this.addLineElement(el);
                    }
                    else if (el instanceof Drawing.DynamicDrawingElement) {
                        this.addDynamicElement(el);
                        switch (this.currentMode) {
                            case DrawingToolMode.Offense:
                                if (this.currentOffenseNr < 9)
                                    this.setOffenseNr(this.currentOffenseNr + 1);
                                else
                                    this.setOffenseNr(1);
                                break;
                            case DrawingToolMode.Defense:
                                if (this.currentDefenseNr < 9)
                                    this.setDefenseNr(this.currentDefenseNr + 1);
                                else
                                    this.setDefenseNr(1);
                                break;
                            case DrawingToolMode.OffenseLocked:
                                this.currentOffenseDrawingDone = true;
                                break;
                            case DrawingToolMode.DefenseLocked:
                                this.currentDefenseDrawingDone = true;
                                break;
                        }
                    }
                    this.drawingChanged(el, "added");
                }
                var lastMode = this.currentMode;
                var lastColor = this.currentDrawRequest ? this.currentDrawRequest.getColor() : FibaEurope.Data.elementColor.unknown;
                var lastInterpolation = this.currentLineInterpolation;
                if (this.currentMode !== DrawingToolMode.OffenseLocked && this.currentMode !== DrawingToolMode.DefenseLocked)
                    this.setMode(DrawingToolMode.Select); // for cleanup
                // if it is not the textmode or areamode, then stay in this mode
                if (lastMode !== DrawingToolMode.Text && lastMode !== DrawingToolMode.Area) {
                    this.setMode(lastMode);
                    if (this.currentDrawRequest) {
                        if (lastColor !== FibaEurope.Data.elementColor.unknown)
                            this.setColor(lastColor);
                        if (this.currentDrawRequest instanceof DrawRequestLine) {
                            this.setLineInterpolation(lastInterpolation);
                        }
                    }
                }
                else {
                    this.selectElement(el);
                }
            };
            DrawingController.prototype.addStaticElement = function (el) {
                if (!el)
                    return;
                this.statics.push(el);
                if (el.data.type === FibaEurope.Data.staticElementType.text)
                    this.groups.text.append(el.displayElement);
                else
                    this.groups.area.append(el.displayElement);
                this.addHoverElement(el);
            };
            DrawingController.prototype.addDynamicElement = function (el) {
                if (!el)
                    return;
                this.dynamics.push(el);
                switch (el.data.type) {
                    case FibaEurope.Data.dynamicElementType.shooting:
                        this.groups.shoot.append(el.displayElement);
                        break;
                    case FibaEurope.Data.dynamicElementType.cone:
                        this.groups.cone.append(el.displayElement);
                        break;
                    case FibaEurope.Data.dynamicElementType.ball:
                        this.groups.ball.append(el.displayElement);
                        break;
                    case FibaEurope.Data.dynamicElementType.handoff:
                        this.groups.handoff.append(el.displayElement);
                        break;
                    default:
                        this.groups.person.append(el.displayElement);
                        break;
                }
                this.addHoverElement(el);
            };
            DrawingController.prototype.addLineElement = function (el) {
                if (!el)
                    return;
                this.lines.push(el);
                this.groups.line.append(el.displayElement);
                this.addHoverElement(el);
            };
            DrawingController.prototype.addHoverElement = function (el) {
                var _this = this;
                var hoverEl = el.hoverElement;
                if (!hoverEl && el.getHoverElement)
                    hoverEl = el.getHoverElement(this.drawing.paper, this.touchMode);
                if (hoverEl) {
                    if (el instanceof Drawing.StaticDrawingElement) {
                        if (el.data.type === FibaEurope.Data.staticElementType.text)
                            this.hoverGroups.text.append(hoverEl);
                        else
                            this.hoverGroups.area.append(hoverEl);
                    }
                    else if (el instanceof Drawing.LineDrawingElement) {
                        this.hoverGroups.line.append(hoverEl);
                    }
                    else if (el instanceof Drawing.DynamicDrawingElement) {
                        switch (el.data.type) {
                            case FibaEurope.Data.dynamicElementType.shooting:
                                this.hoverGroups.shoot.append(hoverEl);
                                break;
                            case FibaEurope.Data.dynamicElementType.cone:
                                this.hoverGroups.cone.append(hoverEl);
                                break;
                            case FibaEurope.Data.dynamicElementType.ball:
                                this.hoverGroups.ball.append(hoverEl);
                                break;
                            case FibaEurope.Data.dynamicElementType.handoff:
                                this.hoverGroups.handoff.append(hoverEl);
                                break;
                            default:
                                this.hoverGroups.person.append(hoverEl);
                                break;
                        }
                    }
                    var screenTransformMatrix;
                    hoverEl.drag(function (dx, dy, x, y, ev) {
                        el.tmpMoveTo(screenTransformMatrix.x(x, y), screenTransformMatrix.y(x, y));
                    }, function (x, y, ev) {
                        if (el.setSelected)
                            _this.selectElement(el);
                        screenTransformMatrix = Snap.matrix(_this.drawingCanvas.node.getScreenCTM().inverse());
                        el.tmpMoveStart(screenTransformMatrix.x(x, y), screenTransformMatrix.y(x, y));
                    }, function (ev) { el.tmpMoveStop(true); });
                    if (el instanceof Drawing.StaticDrawingElement) {
                        if (el.data.type === FibaEurope.Data.staticElementType.text) {
                            hoverEl.dblclick(function () { return el.editText(); });
                        }
                    }
                }
            };
            DrawingController.prototype.selectElement = function (el) {
                var _this = this;
                if (el === this.selectedElement &&
                    (!el || el.isSelected()))
                    return;
                // free event handlers from the last selected
                if (this.selectedElement) {
                    this.selectedElement.setSelected(false);
                    this.selectedElement.onLongPress = null;
                    this.selectedElement.onStartEdit = null;
                    this.selectedElement.onEndEdit = null;
                    this.selectedElement.onChanged = null;
                    if (this.selectedElement instanceof Drawing.LineDrawingElement) {
                        this.selectedElement.onCoordCountChanged = null;
                    }
                }
                // set new selected element
                this.selectedElement = el;
                if (this.selectedElement) {
                    // set select state of the element and register it thumbs
                    var thumbs = el.setSelected(true, this.drawing.paper, this.touchMode);
                    if (thumbs) {
                        thumbs.forEach(function (t) {
                            _this.overlayGroup.append(t.displayElement);
                            _this.addHoverElement(t);
                        });
                    }
                    // register event handlers for longpress
                    if (this.onLongPressSelectedElement) {
                        el.onLongPress = function (lpel, x, y) {
                            var eltype = 0;
                            if (lpel instanceof Drawing.DynamicDrawingElement)
                                eltype = 1;
                            else if (lpel instanceof Drawing.StaticDrawingElement)
                                eltype = 2;
                            else if (lpel instanceof Drawing.LineDrawingElement)
                                eltype = 3;
                            return _this.onLongPressSelectedElement(lpel, x, y, eltype);
                        };
                    }
                    // register event handlers for edit and change on the selected element
                    if (this.onStartEdit)
                        el.onStartEdit = function (editel) { return _this.onStartEdit(editel); };
                    if (this.onEndEdit)
                        el.onEndEdit = function (editel) { return _this.onEndEdit(editel); };
                    el.onChanged = function (editel, changed) {
                        if (changed == "moved" || changed == "size") {
                            var removeElement = false;
                            var mainRect = new Drawing.Rect(0, 0, FibaEurope.Drawing.fullCourtWidth, (_this.isHalfCourt ? FibaEurope.Drawing.halfCourtHeight : FibaEurope.Drawing.fullCourtHeight));
                            if (editel instanceof Drawing.StaticDrawingElement) {
                                if (editel.data.type === FibaEurope.Data.staticElementType.text) {
                                    removeElement = !mainRect.contains(editel.data.x, editel.data.y);
                                }
                                else if (editel.data.type === FibaEurope.Data.staticElementType.area) {
                                    var areaRect = new Drawing.Rect(editel.data.x, editel.data.y, editel.data.width, editel.data.height);
                                    removeElement = !mainRect.contains(areaRect);
                                }
                            }
                            else if (editel instanceof Drawing.DynamicDrawingElement) {
                                removeElement = !mainRect.contains(editel.data.x, editel.data.y);
                            }
                            else if (editel instanceof Drawing.LineDrawingElement) {
                                var coords = editel.data.coords;
                                var pointsOutside = 0;
                                for (var i = 0; i < coords.length; i++) {
                                    if (!mainRect.contains(coords[i])) {
                                        pointsOutside++;
                                    }
                                }
                                removeElement = (pointsOutside / coords.length) >= 0.3;
                            }
                            if (removeElement) {
                                if (_this.onEndEdit)
                                    _this.onEndEdit(editel); // removing the elemement also disables the endEdit event
                                _this.deleteSelected();
                                return;
                            }
                        }
                        else if (changed == "text") {
                            if (editel.data.text + "" === "") {
                                if (_this.onEndEdit)
                                    _this.onEndEdit(editel); // removing the elemement also disables the endEdit event
                                _this.deleteSelected();
                                return;
                            }
                        }
                        else if (changed == "color") {
                            if (_this.onColorChanged)
                                _this.onColorChanged(editel.data.color);
                        }
                        _this.drawingChanged(editel, changed);
                    };
                    if (el instanceof Drawing.LineDrawingElement) {
                        this.currentLineInterpolation = el.data.curved;
                        el.onCoordCountChanged = function (lineel, newCount, oldCount) {
                            if (newCount > oldCount) {
                                // new coordinate => new Thumb is needed
                                _this.selectElement(null);
                                _this.selectElement(lineel);
                            }
                            else if (_this.onCanChangeLineInterpolation) {
                                _this.onCanChangeLineInterpolation(lineel.data.coords.length > 2 ? 2 : 0);
                            }
                        };
                    }
                }
                if (this.onSelectElement)
                    this.onSelectElement(el);
                if (this.onCanChangeLineInterpolation)
                    this.onCanChangeLineInterpolation(el && el instanceof Drawing.LineDrawingElement && el.data.coords.length > 2 ? 2 : 0);
                if (this.onColorChanged) {
                    if (el)
                        this.onColorChanged(el.data.color);
                    else
                        this.onColorChanged(FibaEurope.Data.elementColor.unknown);
                }
                if (this.onCanChangeColor)
                    this.onCanChangeColor(el && el.canChangeColor ? 2 : 0);
            };
            DrawingController.prototype.deleteSelected = function () {
                if (this.selectedElement) {
                    var el = this.selectedElement;
                    this.selectElement(null);
                    this.removeElementDrawing(el);
                    if (el instanceof Drawing.DynamicDrawingElement) {
                        var i = this.dynamics.indexOf(el);
                        if (i >= 0)
                            this.dynamics.splice(i, 1);
                    }
                    else if (el instanceof Drawing.StaticDrawingElement) {
                        var i = this.statics.indexOf(el);
                        if (i >= 0)
                            this.statics.splice(i, 1);
                    }
                    else if (el instanceof Drawing.LineDrawingElement) {
                        var i = this.lines.indexOf(el);
                        if (i >= 0)
                            this.lines.splice(i, 1);
                    }
                }
                this.drawingChanged(el, "removed");
            };
            DrawingController.prototype.lockEditing = function () {
                this.setMode(DrawingToolMode.Select);
                this.selectElement(null);
                this.lockEditingElement.attr({ fill: "transparent" });
            };
            DrawingController.prototype.unlockEditing = function () {
                this.lockEditingElement.attr({ fill: "none" });
            };
            DrawingController.prototype.isEditingLocked = function () {
                return this.lockEditingElement.attr("fill") == "transparent";
            };
            DrawingController.prototype.setMode = function (mode) {
                var _this = this;
                if (this.currentMode === mode)
                    return;
                var lastMode = this.currentMode;
                this.currentMode = mode;
                if (this.currentDrawRequest) {
                    this.currentDrawRequest.cancelRequest();
                    this.currentDrawRequest = null;
                }
                if (mode === DrawingToolMode.Select)
                    this.drawingCanvas.attr({ fill: "none" });
                else {
                    this.drawingCanvas.attr({ fill: "transparent" });
                    this.selectElement(null);
                }
                // increase player nr, after fixed drawing done
                if (lastMode === DrawingToolMode.OffenseLocked) {
                    if (this.currentOffenseDrawingDone) {
                        if (this.currentMode !== DrawingToolMode.Offense) {
                            if (this.currentOffenseNr < 9)
                                this.setOffenseNr(this.currentOffenseNr + 1);
                            else
                                this.setOffenseNr(1);
                        }
                        this.currentOffenseDrawingDone = false;
                    }
                }
                else if (lastMode === DrawingToolMode.DefenseLocked) {
                    if (this.currentDefenseDrawingDone) {
                        if (this.currentMode !== DrawingToolMode.Defense) {
                            if (this.currentDefenseNr < 9)
                                this.setDefenseNr(this.currentDefenseNr + 1);
                            else
                                this.setDefenseNr(1);
                        }
                        this.currentDefenseDrawingDone = false;
                    }
                }
                // always use freehand mode for touch
                if (this.touchMode && mode >= DrawingToolMode.LinePassing && mode < DrawingToolMode.LineFreehand) {
                    if ((mode - DrawingToolMode.LinePassing) % 2 == 0)
                        mode++;
                }
                switch (mode) {
                    case DrawingToolMode.Offense:
                    case DrawingToolMode.OffenseLocked:
                    case DrawingToolMode.Defense:
                    case DrawingToolMode.DefenseLocked:
                    case DrawingToolMode.Ball:
                    case DrawingToolMode.Cone:
                    case DrawingToolMode.Coach:
                    case DrawingToolMode.Handoff:
                        this.currentDrawRequest = new DrawRequestDynamic(mode, this.drawing, this.overlayGroup, this.wheelchair, function (el) { return _this.drawRequestDone(el); }, this.touchMode);
                        if (mode === DrawingToolMode.Offense || mode === DrawingToolMode.OffenseLocked)
                            this.currentDrawRequest.setNr(this.currentOffenseNr);
                        else if (mode === DrawingToolMode.Defense || mode === DrawingToolMode.DefenseLocked)
                            this.currentDrawRequest.setNr(this.currentDefenseNr);
                        break;
                    case DrawingToolMode.Shooting:
                        this.currentDrawRequest = new DrawRequestShoot(this.basketTop, this.basketBottom, this.drawing, this.overlayGroup, function (el) { return _this.drawRequestDone(el); }, this.touchMode);
                        break;
                    case DrawingToolMode.Text:
                        this.currentDrawRequest = new DrawRequestText(this.drawing, this.overlayGroup, function (el) { return _this.drawRequestDone(el); }, this.touchMode);
                        break;
                    case DrawingToolMode.Area:
                        this.currentDrawRequest = new DrawRequestArea(this.currentAreaForm, this.drawing, this.overlayGroup, function (el) { return _this.drawRequestDone(el); }, this.touchMode);
                        break;
                    case DrawingToolMode.LinePassing:
                    case DrawingToolMode.LineMovement:
                    case DrawingToolMode.LineDribbling:
                    case DrawingToolMode.LineScreen:
                    case DrawingToolMode.Line:
                    case DrawingToolMode.LinePassingFreehand:
                    case DrawingToolMode.LineMovementFreehand:
                    case DrawingToolMode.LineDribblingFreehand:
                    case DrawingToolMode.LineScreenFreehand:
                    case DrawingToolMode.LineFreehand:
                    case DrawingToolMode.LineFree:
                        this.setLineInterpolation(true);
                        this.currentDrawRequest = new DrawRequestLine(mode, this.drawing, this.overlayGroup, function (el) { return _this.drawRequestDone(el); }, this.touchMode);
                        this.currentDrawRequest.setInterpolated(this.currentLineInterpolation);
                        break;
                }
                if (this.onSetMode)
                    this.onSetMode(mode, lastMode);
                if (this.onCanChangeLineInterpolation)
                    this.onCanChangeLineInterpolation(mode >= DrawingToolMode.LinePassing && mode <= DrawingToolMode.LineFreehand ? 1 : 0);
                if (this.onColorChanged)
                    this.onColorChanged(this.currentDrawRequest ? this.currentDrawRequest.getColor() : FibaEurope.Data.elementColor.unknown);
                if (this.onCanChangeColor)
                    this.onCanChangeColor(mode !== DrawingToolMode.Select && mode !== DrawingToolMode.Coach && mode !== DrawingToolMode.Cone && mode !== DrawingToolMode.Ball ? 1 : 0);
            };
            DrawingController.prototype.isInTextEditMode = function () {
                return this.currentMode === DrawingToolMode.Text || (this.selectedElement && this.selectedElement instanceof Drawing.StaticDrawingElement && this.selectedElement.isInEditMode);
            };
            DrawingController.prototype.setHalfCourt = function (isHalfCourt) {
                var oldIsHalfCourt = this.isHalfCourt;
                this.isHalfCourt = isHalfCourt;
                if (this.lowerHalfCourt) {
                    if (isHalfCourt) {
                        this.lowerHalfCourt.attr({ visibility: "visible" });
                    }
                    else {
                        this.lowerHalfCourt.attr({ visibility: "hidden" });
                        this.backgroundGroup.attr({ clipPath: "" });
                        this.groups.all.attr({ clipPath: "" });
                        this.hoverGroups.all.attr({ clipPath: "" });
                        this.overlayGroup.attr({ clipPath: "" });
                    }
                }
                if (this.changeCourtSizeForHalfCourt) {
                    this.drawing.paper.node.setAttribute("viewBox", "0 0 " + FibaEurope.Drawing.fullCourtWidth + " " + (isHalfCourt ? FibaEurope.Drawing.halfCourtHeight : FibaEurope.Drawing.fullCourtHeight));
                    if (this.clipHalfCourt) {
                        if (isHalfCourt) {
                            this.lowerHalfCourt.attr({ visibility: "hidden" });
                            this.backgroundGroup.attr({ clipPath: "url('#" + this.clipHalfCourt.node.id + "')" });
                            this.groups.all.attr({ clipPath: "url('#" + this.clipHalfCourt.node.id + "')" });
                            this.hoverGroups.all.attr({ clipPath: "url('#" + this.clipHalfCourt.node.id + "')" });
                            this.overlayGroup.attr({ clipPath: "url('#" + this.clipHalfCourt.node.id + "')" });
                        }
                        else {
                            this.backgroundGroup.attr({ clipPath: "" });
                            this.groups.all.attr({ clipPath: "" });
                            this.hoverGroups.all.attr({ clipPath: "" });
                            this.overlayGroup.attr({ clipPath: "" });
                        }
                    }
                }
                if (this.onSetHalfCourt)
                    this.onSetHalfCourt(isHalfCourt);
                if (isHalfCourt !== oldIsHalfCourt)
                    this.drawingChanged(null, "HalfCourt");
            };
            DrawingController.prototype.setAreaForm = function (form) {
                this.currentAreaForm = form;
                if (this.currentMode === DrawingToolMode.Area) {
                    this.currentDrawRequest.setAreaForm(form);
                }
                if (this.onSetAreaForm)
                    this.onSetAreaForm(form);
            };
            DrawingController.prototype.setColor = function (color) {
                if (this.currentDrawRequest) {
                    this.currentDrawRequest.setColor(color);
                }
                else if (this.selectedElement) {
                    return this.selectedElement.setColor(color, this.drawing);
                }
                if (this.onColorChanged)
                    this.onColorChanged(color);
            };
            DrawingController.prototype.getColor = function () {
                if (this.currentDrawRequest) {
                    return this.currentDrawRequest.getColor();
                }
                else if (this.selectedElement) {
                    return this.selectedElement.data.color;
                }
                return FibaEurope.Data.elementColor.unknown;
            };
            DrawingController.prototype.setOffenseNr = function (nr) {
                this.currentOffenseNr = nr;
                if (this.currentDrawRequest && (this.currentMode === DrawingToolMode.Offense || this.currentMode === DrawingToolMode.OffenseLocked))
                    this.currentDrawRequest.setNr(nr);
                if (this.onSetOffenseNr)
                    this.onSetOffenseNr(nr);
            };
            DrawingController.prototype.setDefenseNr = function (nr) {
                this.currentDefenseNr = nr;
                if (this.currentDrawRequest && (this.currentMode === DrawingToolMode.Defense || this.currentMode === DrawingToolMode.DefenseLocked))
                    this.currentDrawRequest.setNr(nr);
                if (this.onSetDefenseNr)
                    this.onSetDefenseNr(nr);
            };
            DrawingController.prototype.setLineInterpolation = function (interpolated) {
                if (this.currentLineInterpolation === interpolated)
                    return;
                this.currentLineInterpolation = interpolated;
                if (this.currentDrawRequest && this.currentDrawRequest instanceof DrawRequestLine)
                    this.currentDrawRequest.setInterpolated(interpolated);
                if (this.selectedElement && this.selectedElement instanceof Drawing.LineDrawingElement)
                    this.selectedElement.setInterpolated(interpolated);
                if (this.onSetLineInterpolation)
                    this.onSetLineInterpolation(interpolated);
            };
            DrawingController.prototype.undo = function () {
                if (this.undoRedoStackIdx > 0 && this.undoRedoStack.length > 1) {
                    this.undoRedoStackIdx--;
                    this._loadGraphic(this.undoRedoStack[this.undoRedoStackIdx]);
                    this.drawingChanged(null, "undo");
                }
            };
            DrawingController.prototype.redo = function () {
                if (this.undoRedoStackIdx < this.undoRedoStack.length - 1) {
                    this.undoRedoStackIdx++;
                    this._loadGraphic(this.undoRedoStack[this.undoRedoStackIdx]);
                    this.drawingChanged(null, "redo");
                }
            };
            DrawingController.prototype.fastBreak = function () {
                // remove selection
                this.selectElement(null);
                // exchange
                var changedElements = [];
                for (var i = this.dynamics.length - 1; i >= 0; i--) {
                    if (this.dynamics[i].data.type != FibaEurope.Data.dynamicElementType.offence && this.dynamics[i].data.type != FibaEurope.Data.dynamicElementType.defence)
                        continue;
                    var el = this.dynamics[i];
                    // remove element
                    this.removeElementDrawing(el);
                    this.dynamics.splice(i, 1);
                    // swap element type and rotate defense to basket
                    if (el.data.type == FibaEurope.Data.dynamicElementType.offence) {
                        el.data.type = FibaEurope.Data.dynamicElementType.defence;
                        var rotation = Drawing.DynamicDrawingElement.getShootingRotation(el.data.x, el.data.y, this.basketTop, this.basketBottom);
                        //plus 180 degrees to implement change of direction
                        rotation = rotation + 180;
                        el.setRotation(rotation);
                    }
                    else {
                        el.data.type = FibaEurope.Data.dynamicElementType.offence;
                    }
                    // add new element
                    var dynEl = this.drawing.drawDynamic(el.data, this.wheelchair);
                    this.addDynamicElement(dynEl);
                    changedElements.push(dynEl);
                }
                if (changedElements.length > 0)
                    this.drawingChanged(null, "fastbreak");
            };
            DrawingController.prototype.changeOffenseColor = function (offenseColor) {
                // remove selection
                this.selectElement(null);
                // apply new color
                var offencesToChange = this.dynamics.filter(function (d) { return d.data.type == FibaEurope.Data.dynamicElementType.offence && d.data.color != offenseColor; });
                offencesToChange.forEach(function (d) {
                    d.setColor(offenseColor);
                });
                if (offencesToChange.length > 0)
                    this.drawingChanged(null, "color");
            };
            DrawingController.prototype.changeDefenseColor = function (defenseColor) {
                // remove selection
                this.selectElement(null);
                // apply new color
                var defensesToChange = this.dynamics.filter(function (d) { return d.data.type == FibaEurope.Data.dynamicElementType.defence && d.data.color != defenseColor; });
                defensesToChange.forEach(function (d) {
                    d.setColor(defenseColor);
                });
                if (defensesToChange.length > 0)
                    this.drawingChanged(null, "color");
            };
            DrawingController.prototype.clear = function (notify) {
                this.selectElement(null);
                var count = this.clearElements(this.dynamics);
                count += this.clearElements(this.statics);
                count += this.clearElements(this.lines);
                if (notify && count > 0)
                    this.drawingChanged(null, "clear");
                return count;
            };
            DrawingController.prototype.clearElements = function (elements) {
                var count = 0;
                var el;
                while (el = elements.pop()) {
                    this.removeElementDrawing(el);
                    count++;
                }
                return count;
            };
            DrawingController.prototype.removeElementDrawing = function (el) {
                if (el) {
                    if (el.hoverElement) {
                        el.hoverElement.undrag();
                        el.hoverElement.remove();
                    }
                    if (el.displayElement)
                        el.displayElement.remove();
                }
            };
            DrawingController.prototype.drawingChanged = function (el, change) {
                if (this.lockChanged > 0)
                    return;
                if (change != "undo" && change != "redo") {
                    // remove redo data
                    if (this.undoRedoStackIdx < this.undoRedoStack.length - 1) {
                        this.undoRedoStack.length = this.undoRedoStackIdx + 1;
                    }
                    // rember changes for undo
                    this.undoRedoStack.push(this.getGraphic());
                    this.undoRedoStackIdx = this.undoRedoStack.length - 1;
                }
                if (this.onDrawingChanged)
                    this.onDrawingChanged(el, change);
            };
            DrawingController.prototype.loadGraphic = function (graphic) {
                this._loadGraphic(graphic);
                // init undoRedo stack
                this.undoRedoStack = [];
                this.undoRedoStack.push(this.getGraphic());
                this.undoRedoStackIdx = 0;
            };
            DrawingController.prototype._loadGraphic = function (graphic) {
                var _this = this;
                try {
                    this.lockChanged++;
                    this.clear(false);
                    this.setHalfCourt(!graphic.fullCourt);
                    graphic.dynamicElements.forEach(function (el) {
                        var dynEl = _this.drawing.drawDynamic(el, _this.wheelchair);
                        if (dynEl.data.type === FibaEurope.Data.dynamicElementType.shooting)
                            dynEl.initShootingTargets(_this.basketTop, _this.basketBottom);
                        _this.addDynamicElement(dynEl);
                    });
                    graphic.lineElements.forEach(function (el) {
                        _this.addLineElement(_this.drawing.drawLine(el));
                    });
                    graphic.staticElements.forEach(function (el) {
                        _this.addStaticElement(_this.drawing.drawStatic(el));
                    });
                }
                finally {
                    this.lockChanged--;
                }
            };
            DrawingController.prototype.getGraphic = function () {
                var graphic = new FibaEurope.Data.Graphic();
                graphic.fullCourt = !this.isHalfCourt;
                graphic.wheelchair = this.wheelchair;
                var i = 0;
                for (; i < this.dynamics.length; i++)
                    graphic.dynamicElements.push(this.dynamics[i].data.clone());
                for (i = 0; i < this.lines.length; i++)
                    graphic.lineElements.push(this.lines[i].data.clone());
                for (i = 0; i < this.statics.length; i++)
                    graphic.staticElements.push(this.statics[i].data.clone());
                return graphic;
            };
            DrawingController.prototype.initNewGraphicFromCurrent = function () {
                // remove selection
                this.selectElement(null);
                // infos about handoffs (ball has to switch from one player to another)
                var handoffsToHandle = [];
                // collect infos about handoffs
                for (var i = this.dynamics.length - 1; i >= 0; i--) {
                    if (this.dynamics[i].data.type === FibaEurope.Data.dynamicElementType.handoff) {
                        var el = this.dynamics[i];
                        handoffsToHandle.push({ playersHandled: [], x: el.data.x, y: el.data.y });
                    }
                }
                // remove text and areas
                this.clearElements(this.statics);
                // helper to search nearest dynamic element of a type
                var getNearDynamic = function (dynamics, x, y, dyntype1, dyntype2) {
                    var pt = new Drawing.Point(x, y);
                    var dynNear;
                    var dynDistance = Number.POSITIVE_INFINITY;
                    dynamics.filter(function (dyn) { return dyn.data.type === dyntype1 || (dyntype2 && dyn.data.type === dyntype2); }).forEach(function (dyn) {
                        // get distance to target
                        var dist = pt.distanceToPoint(dyn.data.x, dyn.data.y);
                        // only near dynamics
                        if (dist > 30)
                            return;
                        // only the nearest dynamic
                        if (dist < dynDistance) {
                            dynNear = dyn;
                            dynDistance = dist;
                        }
                    });
                    return dynNear;
                };
                // helper to search ball for a player 
                // (if more than one player is "close" and at least one other player is even closer nothing will be reurned)
                // reason: during handoff players maybe pretty close together, so we have to double-check
                var getBallForPlayer = function (dynamics, player) {
                    var dynNear = getNearDynamic(dynamics, player.data.x, player.data.y, FibaEurope.Data.dynamicElementType.ball);
                    if (dynNear != null) {
                        var pt = new Drawing.Point(player.data.x, player.data.y);
                        var dist = pt.distanceToPoint(dynNear.data.x, dynNear.data.y);
                        for (var i = 0; i < dynamics.length; i++) {
                            // only people can move over the field
                            if (dynamics[i].data.type === FibaEurope.Data.dynamicElementType.offence &&
                                dynamics[i].data.nr !== player.data.nr) {
                                var ptCompare = new Drawing.Point(dynamics[i].data.x, dynamics[i].data.y);
                                var distCompare = ptCompare.distanceToPoint(dynNear.data.x, dynNear.data.y);
                                if (distCompare < dist)
                                    return undefined;
                            }
                        }
                    }
                    return dynNear;
                };
                var getNearLine = function (lines, x, y, linetypes) {
                    var pt = new Drawing.Point(x, y);
                    var lineNear;
                    var lineDistance = Number.POSITIVE_INFINITY;
                    lines.filter(function (line) { return !linetypes || linetypes.indexOf(line.data.type) >= 0; }).forEach(function (line) {
                        // get distance to target
                        var dist = pt.distanceToPoint(line.data.coords[0].x, line.data.coords[0].y);
                        // only near dynamics
                        if (dist > 25)
                            return;
                        // only the nearest dynamic
                        if (dist < lineDistance) {
                            lineNear = line;
                            lineDistance = dist;
                        }
                    });
                    return lineNear;
                };
                var handleHandoff = function (handoff, playerNr, playerPosX, playerPosY, ballPosX, ballPosY) {
                    //store infos about handoff
                    for (var j = 0; j < handoffsToHandle.length; j++) {
                        if (handoffsToHandle[j].x == handoff.data.x && handoffsToHandle[j].y == handoff.data.y) {
                            handoffsToHandle[j].playersHandled.push({ nr: playerNr, posX: playerPosX, posY: playerPosY, ballPosX: ballPosX, ballPosY: ballPosY });
                        }
                    }
                };
                var handoffRun = true;
                //run again after after switch of ball due to handoff
                while (handoffRun) {
                    handoffRun = false;
                    // do it two times
                    for (var step = 0; step < 2; step++) {
                        for (var i = 0; i < this.dynamics.length; i++) {
                            // only people can move over the field
                            if (this.dynamics[i].data.type !== FibaEurope.Data.dynamicElementType.offence &&
                                this.dynamics[i].data.type !== FibaEurope.Data.dynamicElementType.defence &&
                                this.dynamics[i].data.type !== FibaEurope.Data.dynamicElementType.coach)
                                continue;
                            var handoffHandled = false;
                            var player = this.dynamics[i];
                            // get a ball for this person (if there's is no other person even closer to the ball)
                            var ball = getBallForPlayer(this.dynamics, player);
                            //player with ball
                            if (ball) {
                                //already at handoff-position > no moving, execute handoff at this position
                                var handoff = getNearDynamic(this.dynamics, player.data.x, player.data.y, FibaEurope.Data.dynamicElementType.handoff);
                                if (handoff) {
                                    handleHandoff(handoff, player.data.nr, player.data.x, player.data.y, ball.data.x, ball.data.y);
                                    handoffHandled = true;
                                    //stop loop (player with ball becomes player without ball and vice versa)
                                    continue;
                                }
                                var playerBallVector = Drawing.CurvedPathMaths.vector(player.data, ball.data);
                                // if he has a ball, get an action line for this ball
                                var ballline = getNearLine(this.lines, player.data.x, player.data.y, [FibaEurope.Data.lineElementType.dribbling, FibaEurope.Data.lineElementType.passing]);
                                while (ballline) {
                                    // remove line
                                    if (ballline.hoverElement) {
                                        ballline.hoverElement.undrag();
                                        ballline.hoverElement.remove();
                                    }
                                    if (ballline.displayElement)
                                        ballline.displayElement.remove();
                                    this.lines.splice(this.lines.indexOf(ballline), 1);
                                    // move player/ball
                                    if (ballline.data.type === FibaEurope.Data.lineElementType.dribbling) {
                                        var targetPlayerPos = ballline.data.coords[ballline.data.coords.length - 1];
                                        var targetBallPos = new Drawing.Point(targetPlayerPos.x + playerBallVector.x, targetPlayerPos.y + playerBallVector.y);
                                        player.moveTo(targetPlayerPos.x, targetPlayerPos.y);
                                        ball.moveTo(targetBallPos.x, targetBallPos.y);
                                        //at handoff-position after moving
                                        handoff = getNearDynamic(this.dynamics, targetBallPos.x, targetBallPos.y, FibaEurope.Data.dynamicElementType.handoff);
                                        if (handoff) {
                                            handleHandoff(handoff, player.data.nr, targetPlayerPos.x, targetPlayerPos.y, targetBallPos.x, targetBallPos.y);
                                            handoffHandled = true;
                                            //stop loop (player with ball becomes player without ball and vice versa)
                                            break;
                                        }
                                        // search for another action line for the ball
                                        ballline = getNearLine(this.lines, targetPlayerPos.x, targetPlayerPos.y, [FibaEurope.Data.lineElementType.dribbling, FibaEurope.Data.lineElementType.passing]);
                                        if (!ballline)
                                            ballline = getNearLine(this.lines, targetBallPos.x, targetBallPos.y, [FibaEurope.Data.lineElementType.dribbling, FibaEurope.Data.lineElementType.passing]);
                                        // TODO search for a shooting?
                                    }
                                    else {
                                        var targetBallPos = ballline.data.coords[ballline.data.coords.length - 1];
                                        // search for a player of the same type
                                        var targetPlayer = getNearDynamic(this.dynamics, targetBallPos.x, targetBallPos.y, player.data.type);
                                        if (!targetPlayer) {
                                            // search for other player
                                            if (player.data.type === FibaEurope.Data.dynamicElementType.coach) {
                                                targetPlayer = getNearDynamic(this.dynamics, targetBallPos.x, targetBallPos.y, FibaEurope.Data.dynamicElementType.offence, FibaEurope.Data.dynamicElementType.defence);
                                            }
                                            else if (player.data.type === FibaEurope.Data.dynamicElementType.offence) {
                                                targetPlayer = getNearDynamic(this.dynamics, targetBallPos.x, targetBallPos.y, FibaEurope.Data.dynamicElementType.defence, FibaEurope.Data.dynamicElementType.coach);
                                            }
                                            else if (player.data.type === FibaEurope.Data.dynamicElementType.defence) {
                                                targetPlayer = getNearDynamic(this.dynamics, targetBallPos.x, targetBallPos.y, FibaEurope.Data.dynamicElementType.offence, FibaEurope.Data.dynamicElementType.coach);
                                            }
                                        }
                                        if (targetPlayer) {
                                            playerBallVector = Drawing.CurvedPathMaths.vector(targetPlayer.data, targetBallPos);
                                            if (playerBallVector.length() == 0) {
                                                playerBallVector = Drawing.CurvedPathMaths.vector(targetPlayer.data, ball.data);
                                            }
                                            playerBallVector.setLength(18); // offense player radius (10) + ball radius (8)
                                            targetBallPos = new Drawing.Point(targetPlayer.data.x + playerBallVector.x, targetPlayer.data.y + playerBallVector.y);
                                        }
                                        ball.moveTo(targetBallPos.x, targetBallPos.y);
                                        //at handoff-position after moving
                                        handoff = getNearDynamic(this.dynamics, targetBallPos.x, targetBallPos.y, FibaEurope.Data.dynamicElementType.handoff);
                                        if (handoff) {
                                            handleHandoff(handoff, player.data.nr, targetPlayerPos.x, targetPlayerPos.y, targetBallPos.x, targetBallPos.y);
                                            handoffHandled = true;
                                            //stop loop (palyer with ball becomes player without ball and vice versa)
                                            break;
                                        }
                                        // search for another pass line for the ball (sure? this is impossible without a player!)
                                        ballline = getNearLine(this.lines, targetBallPos.x, targetBallPos.y, [FibaEurope.Data.lineElementType.passing]);
                                    }
                                }
                                if (handoffHandled)
                                    continue;
                            }
                            if (!handoffHandled) {
                                //already at handoff-position > no moving, execute handoff at this position
                                var handoff = getNearDynamic(this.dynamics, player.data.x, player.data.y, FibaEurope.Data.dynamicElementType.handoff);
                                if (handoff) {
                                    handleHandoff(handoff, player.data.nr, player.data.x, player.data.y, null, null);
                                    handoffHandled = true;
                                    //stop loop (palyer with ball becomes player without ball and vice versa)
                                    break;
                                }
                                // done with the ball, just move the player
                                var moveline = getNearLine(this.lines, player.data.x, player.data.y, [FibaEurope.Data.lineElementType.movement, FibaEurope.Data.lineElementType.screen]);
                                while (moveline) {
                                    // remove line
                                    if (moveline.hoverElement) {
                                        moveline.hoverElement.undrag();
                                        moveline.hoverElement.remove();
                                    }
                                    if (moveline.displayElement)
                                        moveline.displayElement.remove();
                                    this.lines.splice(this.lines.indexOf(moveline), 1);
                                    // move player
                                    var targetPlayerPos = moveline.data.coords[moveline.data.coords.length - 1];
                                    player.moveTo(targetPlayerPos.x, targetPlayerPos.y);
                                    //adjust ball position if there is an "overlap" between player-icon and ball-icon
                                    var ballToAdjust = getBallForPlayer(this.dynamics, player);
                                    if (ballToAdjust) {
                                        var playerBallToAdjustVector = Drawing.CurvedPathMaths.vector(player.data, ballToAdjust.data);
                                        //if it's the same position, adjust to closest basket
                                        if (playerBallToAdjustVector.length() == 0) {
                                            playerBallToAdjustVector = Drawing.CurvedPathMaths.vector(player.data, Drawing.DynamicDrawingElement.getShootingTarget(player.data.x, player.data.y, this.basketTop, this.basketBottom));
                                        }
                                        playerBallToAdjustVector.setLength(18); // offense player radius (10) + ball radius (8)
                                        var targetBallToAdjustPos = new Drawing.Point(player.data.x + playerBallToAdjustVector.x, player.data.y + playerBallToAdjustVector.y);
                                        //ball is moved away from player along the "original" vector
                                        ballToAdjust.moveTo(targetBallToAdjustPos.x, targetBallToAdjustPos.y);
                                    }
                                    //at handoff-position after moving
                                    handoff = getNearDynamic(this.dynamics, targetPlayerPos.x, targetPlayerPos.y, FibaEurope.Data.dynamicElementType.handoff);
                                    if (handoff) {
                                        handleHandoff(handoff, player.data.nr, targetPlayerPos.x, targetPlayerPos.y, null, null);
                                        handoffHandled = true;
                                        //stop loop (palyer with ball becomes player without ball and vice versa)
                                        break;
                                    }
                                    // search for another move line
                                    moveline = getNearLine(this.lines, player.data.x, player.data.y, [FibaEurope.Data.lineElementType.movement, FibaEurope.Data.lineElementType.screen]);
                                }
                                if (handoffHandled)
                                    continue;
                            }
                        }
                        if (handoffHandled)
                            break;
                    }
                    //execute handoff: switch ball to another player
                    for (var i = handoffsToHandle.length - 1; i >= 0; i--) {
                        if (handoffsToHandle[i].playersHandled.length == 2) {
                            var idxMoveFrom;
                            var idxMoveTo;
                            if (handoffsToHandle[i].playersHandled[0].ballPosX === null) {
                                idxMoveTo = 0;
                                idxMoveFrom = 1;
                            }
                            else {
                                idxMoveTo = 1;
                                idxMoveFrom = 0;
                            }
                            var targetBallPos = { x: 0, y: 0 };
                            targetBallPos.x = handoffsToHandle[i].playersHandled[idxMoveFrom].ballPosX - handoffsToHandle[i].playersHandled[idxMoveFrom].posX + handoffsToHandle[i].playersHandled[idxMoveTo].posX;
                            targetBallPos.y = handoffsToHandle[i].playersHandled[idxMoveFrom].ballPosY - handoffsToHandle[i].playersHandled[idxMoveFrom].posY + handoffsToHandle[i].playersHandled[idxMoveTo].posY;
                            var ball = getNearDynamic(this.dynamics, handoffsToHandle[i].playersHandled[idxMoveFrom].ballPosX, handoffsToHandle[i].playersHandled[idxMoveFrom].ballPosY, FibaEurope.Data.dynamicElementType.ball);
                            //switch ball (= move ball to) another player
                            ball.moveTo(targetBallPos.x, targetBallPos.y);
                            //remove handoff
                            for (var j = this.dynamics.length - 1; j >= 0; j--) {
                                if (this.dynamics[j].data.type === FibaEurope.Data.dynamicElementType.handoff
                                    && this.dynamics[j].data.x === handoffsToHandle[i].x
                                    && this.dynamics[j].data.y === handoffsToHandle[i].y) {
                                    var el = this.dynamics[j];
                                    this.removeElementDrawing(el);
                                    this.dynamics.splice(j, 1);
                                }
                            }
                            handoffsToHandle.splice(i, 1);
                            //run main loop (at least) one more time
                            handoffRun = true;
                        }
                    }
                }
                // remove remaining lines
                this.clearElements(this.lines);
                // shootings
                for (var i = this.dynamics.length - 1; i >= 0; i--) {
                    if (this.dynamics[i].data.type === FibaEurope.Data.dynamicElementType.handoff) {
                        var el = this.dynamics[i];
                        this.removeElementDrawing(el);
                        this.dynamics.splice(i, 1);
                    }
                }
                for (var i = this.dynamics.length - 1; i >= 0; i--) {
                    if (this.dynamics[i].data.type !== FibaEurope.Data.dynamicElementType.shooting)
                        continue;
                    var shooting = this.dynamics[i];
                    // get a ball for this shooting
                    var ball = getNearDynamic(this.dynamics, shooting.data.x, shooting.data.y, FibaEurope.Data.dynamicElementType.ball);
                    // ball found, search target
                    if (ball) {
                        var target = Drawing.DynamicDrawingElement.getShootingTarget(shooting.data.x, shooting.data.y, this.basketTop, this.basketBottom);
                        // move ball to target
                        ball.moveTo(target.x, target.y);
                    }
                    // remote shooting
                    this.removeElementDrawing(shooting);
                    this.dynamics.splice(i, 1);
                }
                // init undoRedo stack
                this.undoRedoStack = [];
                this.undoRedoStack.push(this.getGraphic());
                this.undoRedoStackIdx = 0;
            };
            DrawingController.prototype.enableKeyEvents = function (enable) {
                if (enable) {
                    document.addEventListener('keydown', this);
                    document.addEventListener('keypress', this);
                }
                else {
                    document.removeEventListener('keydown', this);
                    document.removeEventListener('keypress', this);
                }
            };
            DrawingController.prototype.handleEvent = function (evt) {
                if (evt.type == 'keydown' || event.type == 'keypress') {
                    var ev = evt;
                    if (this.isInTextEditMode() || ev.altKey || ev.ctrlKey)
                        return;
                    // DEL has no keypress in IE? ESC has no keypress in Chrome
                    if (ev.which === 27) {
                        this.setMode(DrawingToolMode.Select);
                        this.selectElement(null);
                        ev.preventDefault();
                        return;
                    }
                    else if (ev.which === 46) {
                        this.deleteSelected();
                        ev.preventDefault();
                        return;
                    }
                    if (event.type == 'keypress') {
                        switch (String.fromCharCode(ev.which)) {
                            case "x":
                                this.deleteSelected();
                                ev.preventDefault();
                                break;
                            case "o":
                                this.setMode(DrawingToolMode.Offense);
                                ev.preventDefault();
                                break;
                            case "O":
                                this.setMode(DrawingToolMode.OffenseLocked);
                                ev.preventDefault();
                                break;
                            case "d":
                                this.setMode(DrawingToolMode.Defense);
                                ev.preventDefault();
                                break;
                            case "D":
                                this.setMode(DrawingToolMode.DefenseLocked);
                                ev.preventDefault();
                                break;
                            case "b":
                                this.setMode(DrawingToolMode.Ball);
                                ev.preventDefault();
                                break;
                            case "n":
                                this.setMode(DrawingToolMode.Cone);
                                ev.preventDefault();
                                break;
                            case "c":
                                this.setMode(DrawingToolMode.Coach);
                                ev.preventDefault();
                                break;
                            case "w":
                                this.setMode(DrawingToolMode.Text);
                                ev.preventDefault();
                                break;
                            case "a":
                                this.setMode(DrawingToolMode.Area);
                                ev.preventDefault();
                                break;
                            case "t":
                                this.setMode(DrawingToolMode.Shooting);
                                ev.preventDefault();
                                break;
                            case "h":
                                this.setMode(DrawingToolMode.Handoff);
                                ev.preventDefault();
                                break;
                            case "m":
                                this.setMode(DrawingToolMode.LineMovement);
                                ev.preventDefault();
                                break;
                            case "M":
                                this.setMode(DrawingToolMode.LineMovementFreehand);
                                ev.preventDefault();
                                break;
                            case "p":
                                this.setMode(DrawingToolMode.LinePassing);
                                ev.preventDefault();
                                break;
                            case "P":
                                this.setMode(DrawingToolMode.LinePassingFreehand);
                                ev.preventDefault();
                                break;
                            case "r":
                                this.setMode(DrawingToolMode.LineDribbling);
                                ev.preventDefault();
                                break;
                            case "R":
                                this.setMode(DrawingToolMode.LineDribblingFreehand);
                                ev.preventDefault();
                                break;
                            case "s":
                                this.setMode(DrawingToolMode.LineScreen);
                                ev.preventDefault();
                                break;
                            case "S":
                                this.setMode(DrawingToolMode.LineScreenFreehand);
                                ev.preventDefault();
                                break;
                            case "l":
                                this.setMode(DrawingToolMode.Line);
                                ev.preventDefault();
                                break;
                            case "L":
                                this.setMode(DrawingToolMode.LineFreehand);
                                ev.preventDefault();
                                break;
                            case "f":
                            case "F":
                                this.setMode(DrawingToolMode.LineFree);
                                ev.preventDefault();
                                break;
                        }
                    }
                }
            };
            return DrawingController;
        }());
        Drawing.DrawingController = DrawingController;
        var DrawRequest = /** @class */ (function () {
            function DrawRequest(drawing, overlayHost, doneCallback, touchMode) {
                this.drawing = drawing;
                this.overlayHost = overlayHost;
                this.doneCallback = doneCallback;
                this.touchMode = touchMode;
            }
            DrawRequest.prototype.onMouseClick = function (x, y, touchPointId) { return false; };
            DrawRequest.prototype.onMouseDblClick = function (x, y, touchPointId) { return false; };
            DrawRequest.prototype.onMouseDown = function (x, y, touchPointId) { return false; };
            DrawRequest.prototype.onMouseUp = function (x, y, touchPointId) { return false; };
            DrawRequest.prototype.onMouseMove = function (x, y, touchPointId) { return false; };
            DrawRequest.prototype.onMouseEnter = function (x, y, touchPointId) { return false; };
            DrawRequest.prototype.onMouseLeave = function (x, y, touchPointId) { return false; };
            DrawRequest.prototype.cancelRequest = function () { };
            DrawRequest.prototype.setColor = function (color) { };
            DrawRequest.prototype.getColor = function () { return FibaEurope.Data.elementColor.unknown; };
            return DrawRequest;
        }());
        var DrawRequestDynamic = /** @class */ (function (_super) {
            __extends(DrawRequestDynamic, _super);
            function DrawRequestDynamic(mode, drawing, overlayHost, wheelchair, doneCallback, touchMode) {
                var _this = _super.call(this, drawing, overlayHost, doneCallback, touchMode) || this;
                _this.mode = mode;
                _this.wheelchair = wheelchair;
                _this.dynEl = new FibaEurope.Data.DynamicElement();
                _this.touchPointId = -1;
                // init data
                switch (_this.mode) {
                    case DrawingToolMode.OffenseLocked:
                    case DrawingToolMode.Offense:
                        _this.dynEl.type = FibaEurope.Data.dynamicElementType.offence;
                        _this.dynEl.color = FibaEurope.Data.elementColor.offence;
                        break;
                    case DrawingToolMode.DefenseLocked:
                    case DrawingToolMode.Defense:
                        _this.dynEl.type = FibaEurope.Data.dynamicElementType.defence;
                        _this.dynEl.color = FibaEurope.Data.elementColor.defence;
                        break;
                    case DrawingToolMode.Ball:
                        _this.dynEl.type = FibaEurope.Data.dynamicElementType.ball;
                        break;
                    case DrawingToolMode.Cone:
                        _this.dynEl.type = FibaEurope.Data.dynamicElementType.cone;
                        break;
                    case DrawingToolMode.Coach:
                        _this.dynEl.type = FibaEurope.Data.dynamicElementType.coach;
                        break;
                    case DrawingToolMode.Handoff:
                        _this.dynEl.type = FibaEurope.Data.dynamicElementType.handoff;
                        _this.dynEl.color = FibaEurope.Data.elementColor.black;
                        break;
                }
                // init preview Element
                _this.previewElement = Drawing.DynamicDrawingElement.getPreviewElement(_this.drawing.paper, _this.dynEl.type);
                if (_this.previewElement) {
                    _this.previewElement.attr({ visibility: "hidden" });
                    _this.overlayHost.append(_this.previewElement);
                }
                return _this;
            }
            DrawRequestDynamic.prototype.setColor = function (color) {
                this.dynEl.color = color;
            };
            DrawRequestDynamic.prototype.getColor = function () {
                return this.dynEl.color;
            };
            DrawRequestDynamic.prototype.setNr = function (nr) {
                this.dynEl.nr = nr;
            };
            DrawRequestDynamic.prototype.onMouseDown = function (x, y, touchPointId) {
                if (this.touchMode && this.previewElement) {
                    this.onMouseMove(x, y, touchPointId);
                    this.previewElement.attr({ visibility: "visible" });
                }
                if (this.touchPointId < 0)
                    this.touchPointId = touchPointId;
                return true;
            };
            DrawRequestDynamic.prototype.onMouseUp = function (x, y, touchPointId) {
                if (this.touchPointId !== touchPointId)
                    return;
                if (this.touchMode && this.previewElement) {
                    this.previewElement.attr({ visibility: "hidden" });
                }
                this.dynEl.x = Drawing.CurvedPathMaths.round(x, 2);
                this.dynEl.y = Drawing.CurvedPathMaths.round(y, 2);
                var el = this.drawing.drawDynamic(this.dynEl.clone(), this.wheelchair);
                if (this.doneCallback)
                    this.doneCallback(el);
                else
                    this.cancelRequest();
                this.touchPointId = -1;
                return true;
            };
            DrawRequestDynamic.prototype.onMouseMove = function (x, y, touchPointId) {
                if (this.previewElement && (this.touchPointId === touchPointId || this.touchPointId === -1)) {
                    this.previewElement.transform("translate(" + x + "," + y + ")");
                    this.previewElement.attr({ visibility: "visible" });
                }
                return true;
            };
            DrawRequestDynamic.prototype.onMouseEnter = function (x, y, touchPointId) {
                if (this.previewElement)
                    this.previewElement.attr({ visibility: "visible" });
                return false;
            };
            DrawRequestDynamic.prototype.onMouseLeave = function (x, y, touchPointId) {
                if (this.previewElement)
                    this.previewElement.attr({ visibility: "hidden" });
                return false;
            };
            DrawRequestDynamic.prototype.cancelRequest = function () {
                if (this.previewElement) {
                    this.previewElement.remove();
                    this.previewElement = null;
                }
            };
            return DrawRequestDynamic;
        }(DrawRequest));
        var DrawRequestText = /** @class */ (function (_super) {
            __extends(DrawRequestText, _super);
            function DrawRequestText(drawing, overlayHost, doneCallback, touchMode) {
                var _this = _super.call(this, drawing, overlayHost, doneCallback, touchMode) || this;
                _this.color = FibaEurope.Data.elementColor.black;
                _this.dialogEl = Drawing.StaticDrawingElement.createTextInputDialog(null, function (text) { return _this.onOk(text); });
                document.body.appendChild(_this.dialogEl);
                var textEl = _this.dialogEl.getElementsByTagName("textarea")[0];
                textEl.focus();
                return _this;
            }
            DrawRequestText.prototype.setColor = function (color) {
                this.color = color;
            };
            DrawRequestText.prototype.getColor = function () {
                return this.color;
            };
            DrawRequestText.prototype.onOk = function (text) {
                text = (text + "").trim();
                var el;
                if (text.length > 0) {
                    var statEl = new FibaEurope.Data.StaticElement();
                    statEl.x = 10;
                    statEl.y = 10;
                    statEl.type = FibaEurope.Data.staticElementType.text;
                    statEl.color = this.color;
                    statEl.text = text;
                    el = this.drawing.drawText(statEl);
                }
                if (this.doneCallback)
                    this.doneCallback(el);
                else
                    this.cancelRequest();
            };
            DrawRequestText.prototype.cancelRequest = function () {
                if (this.dialogEl) {
                    this.dialogEl.parentElement.removeChild(this.dialogEl);
                    this.dialogEl = null;
                }
            };
            return DrawRequestText;
        }(DrawRequest));
        var DrawRequestArea = /** @class */ (function (_super) {
            __extends(DrawRequestArea, _super);
            function DrawRequestArea(form, drawing, overlayHost, doneCallback, touchMode) {
                var _this = _super.call(this, drawing, overlayHost, doneCallback, touchMode) || this;
                _this.statEl = new FibaEurope.Data.StaticElement();
                _this.drawPoint1 = null;
                _this.drawPoint2 = null;
                // init data
                _this.statEl.type = FibaEurope.Data.staticElementType.area;
                _this.statEl.form = form;
                _this.statEl.color = FibaEurope.Data.elementColor.yellow;
                return _this;
            }
            DrawRequestArea.prototype.setAreaForm = function (form) {
                this.statEl.form = form;
            };
            DrawRequestArea.prototype.setColor = function (color) {
                this.statEl.color = color;
            };
            DrawRequestArea.prototype.getColor = function () {
                return this.statEl.color;
            };
            DrawRequestArea.prototype.onMouseDown = function (x, y, touchPointId) {
                if (!this.drawPoint1) {
                    this.statEl.x = Drawing.CurvedPathMaths.round(x, 2);
                    this.statEl.y = Drawing.CurvedPathMaths.round(y, 2);
                    this.drawPoint1 = {
                        x: this.statEl.x,
                        y: this.statEl.y,
                        id: touchPointId
                    };
                    if (this.statEl.form === FibaEurope.Data.staticElementForm.ellipse) {
                        this.previewElement = this.drawing.paper.ellipse(0.5, 0.5, 0.5, 0.5);
                        this.previewElement.transform("translate(" + this.statEl.x + "," + this.statEl.y + ")");
                    }
                    else if (this.statEl.form === FibaEurope.Data.staticElementForm.rectangle) {
                        this.previewElement = this.drawing.paper.rect(0, 0, 1, 1);
                        this.previewElement.transform("translate(" + this.statEl.x + "," + this.statEl.y + ")");
                    }
                    else if (this.statEl.form === FibaEurope.Data.staticElementForm.triangle) {
                        this.statEl.coords = Drawing.StaticDrawingElement.getTriangleCoordsForBox(this.statEl.x - 0.5, this.statEl.y, 1, 1);
                        this.previewElement = this.drawing.paper.path(Drawing.LineDrawingElement.getPathString(this.statEl.coords, false) + " z");
                    }
                    if (this.previewElement) {
                        this.previewElement.attr({ stroke: "green", strokeWidth: 1, fill: "transparent" });
                        this.overlayHost.append(this.previewElement);
                    }
                }
                else if (!this.drawPoint2) {
                    this.drawPoint2 = {
                        x: x,
                        y: y,
                        id: touchPointId
                    };
                    this.onMouseMove(x, y, touchPointId);
                }
                return true;
            };
            DrawRequestArea.prototype.onMouseMove = function (x, y, touchPointId) {
                var movePoint = false;
                if (this.drawPoint1 && this.drawPoint1.id === touchPointId) {
                    this.drawPoint1.x = x;
                    this.drawPoint1.y = y;
                    movePoint = true;
                }
                else if (this.drawPoint2 && this.drawPoint2.id === touchPointId) {
                    this.drawPoint2.x = x;
                    this.drawPoint2.y = y;
                    movePoint = true;
                }
                if (!this.previewElement || !movePoint)
                    return false;
                var pt2 = this.drawPoint2 ? this.drawPoint2 : new Drawing.Point(this.statEl.x, this.statEl.y);
                var rect = Drawing.Rect.fromPoints(pt2, this.drawPoint1);
                if (this.statEl.form === FibaEurope.Data.staticElementForm.ellipse) {
                    var w2 = rect.width / 2;
                    var h2 = rect.height / 2;
                    this.previewElement.transform("translate(" + rect.x + "," + rect.y + ")");
                    this.previewElement.attr({ cx: w2, cy: h2, rx: w2, ry: h2 });
                }
                else if (this.statEl.form === FibaEurope.Data.staticElementForm.rectangle) {
                    this.previewElement.transform("translate(" + rect.x + "," + rect.y + ")");
                    this.previewElement.attr({ width: rect.width, height: rect.height });
                }
                else if (this.statEl.form === FibaEurope.Data.staticElementForm.triangle) {
                    this.statEl.coords = Drawing.StaticDrawingElement.getTriangleCoordsForVector(pt2, this.drawPoint1);
                    this.previewElement.attr({ d: Drawing.LineDrawingElement.getPathString(this.statEl.coords, false) + " z" });
                }
                return true;
            };
            DrawRequestArea.prototype.onMouseUp = function (x, y, touchPointId) {
                var createElement = false;
                if (this.drawPoint1 && this.drawPoint1.id === touchPointId) {
                    this.drawPoint1.x = Drawing.CurvedPathMaths.round(x, 2);
                    this.drawPoint1.y = Drawing.CurvedPathMaths.round(y, 2);
                    if (this.drawPoint2) {
                        this.drawPoint2.x = Drawing.CurvedPathMaths.round(this.drawPoint2.x, 2);
                        this.drawPoint2.y = Drawing.CurvedPathMaths.round(this.drawPoint2.y, 2);
                    }
                    createElement = true;
                }
                else if (this.drawPoint2 && this.drawPoint2.id === touchPointId) {
                    this.drawPoint2.x = Drawing.CurvedPathMaths.round(x, 2);
                    this.drawPoint2.y = Drawing.CurvedPathMaths.round(y, 2);
                    if (this.drawPoint1) {
                        this.drawPoint1.x = Drawing.CurvedPathMaths.round(this.drawPoint1.x, 2);
                        this.drawPoint1.y = Drawing.CurvedPathMaths.round(this.drawPoint1.y, 2);
                    }
                    createElement = true;
                }
                if (!createElement)
                    return;
                var pt2 = this.drawPoint2 ? this.drawPoint2 : new Drawing.Point(this.statEl.x, this.statEl.y);
                var rect = Drawing.Rect.fromPoints(pt2, this.drawPoint1);
                // min height 90px
                var elementSize = 90;
                if (this.statEl.form === FibaEurope.Data.staticElementForm.triangle) {
                    var pt1 = this.drawPoint1;
                    var h = Drawing.CurvedPathMaths.vector(pt2, this.drawPoint1);
                    var hLength = h.length();
                    if (hLength < elementSize) {
                        if (hLength < 1) {
                            pt1 = new Drawing.Point(pt2.x, pt2.y + elementSize);
                        }
                        else {
                            h.setLength(elementSize);
                            pt1 = new Drawing.Point(pt2.x + h.x, pt2.y + h.y);
                        }
                    }
                    // get triangle for the two points
                    this.statEl.coords = Drawing.StaticDrawingElement.getTriangleCoordsForVector(pt2, pt1);
                    var bbox = Drawing.Rect.fromPoints.apply(Drawing.Rect, this.statEl.coords);
                    this.statEl.x = bbox.x;
                    this.statEl.y = bbox.y;
                    this.statEl.width = bbox.width;
                    this.statEl.height = bbox.height;
                }
                else {
                    this.statEl.x = rect.x;
                    this.statEl.y = rect.y;
                    this.statEl.width = Math.max(rect.width, elementSize);
                    this.statEl.height = Math.max(rect.height, elementSize);
                }
                var el = this.drawing.drawArea(this.statEl.clone());
                if (this.doneCallback)
                    this.doneCallback(el);
                else
                    this.cancelRequest();
                return true;
            };
            DrawRequestArea.prototype.onMouseLeave = function (x, y, touchPointId) {
                if (this.previewElement) {
                    this.previewElement.remove();
                    this.previewElement = null;
                }
                return true;
            };
            DrawRequestArea.prototype.cancelRequest = function () {
                if (this.previewElement) {
                    this.previewElement.remove();
                    this.previewElement = null;
                }
            };
            return DrawRequestArea;
        }(DrawRequest));
        var DrawRequestLine = /** @class */ (function (_super) {
            __extends(DrawRequestLine, _super);
            function DrawRequestLine(mode, drawing, overlayHost, doneCallback, touchMode) {
                var _this = _super.call(this, drawing, overlayHost, doneCallback, touchMode) || this;
                _this.mode = mode;
                _this.freehandMode = false;
                _this.lineEl = new FibaEurope.Data.LineElement();
                _this.previewCoords = new Array();
                _this.touchPointId = -1;
                _this.lastDrawingPoint = null;
                _this.drawingPoints = [];
                _this.drawingPointsRaw = [];
                // init data
                switch (_this.mode) {
                    case DrawingToolMode.LineMovementFreehand: _this.freehandMode = true;
                    case DrawingToolMode.LineMovement:
                        _this.lineEl.type = FibaEurope.Data.lineElementType.movement;
                        break;
                    case DrawingToolMode.LinePassingFreehand: _this.freehandMode = true;
                    case DrawingToolMode.LinePassing:
                        _this.lineEl.type = FibaEurope.Data.lineElementType.passing;
                        break;
                    case DrawingToolMode.LineDribblingFreehand: _this.freehandMode = true;
                    case DrawingToolMode.LineDribbling:
                        _this.lineEl.type = FibaEurope.Data.lineElementType.dribbling;
                        break;
                    case DrawingToolMode.LineScreenFreehand: _this.freehandMode = true;
                    case DrawingToolMode.LineScreen:
                        _this.lineEl.type = FibaEurope.Data.lineElementType.screen;
                        break;
                    case DrawingToolMode.LineFreehand: _this.freehandMode = true;
                    case DrawingToolMode.Line:
                        _this.lineEl.type = FibaEurope.Data.lineElementType.line;
                        break;
                    case DrawingToolMode.LineFree:
                        _this.freehandMode = true;
                        _this.lineEl.type = FibaEurope.Data.lineElementType.free;
                        break;
                }
                return _this;
            }
            DrawRequestLine.prototype.setColor = function (color) {
                this.lineEl.color = color;
            };
            DrawRequestLine.prototype.getColor = function () {
                return this.lineEl.color;
            };
            DrawRequestLine.prototype.setInterpolated = function (interpolated) {
                if (this.lineEl.curved !== interpolated) {
                    this.lineEl.curved = interpolated;
                }
            };
            DrawRequestLine.prototype.addCoord = function (x, y) {
                // only if not the same as the last point
                if (this.lineEl.coords.length > 0) {
                    var lastPoint = this.lineEl.coords[this.lineEl.coords.length - 1];
                    var div = Math.abs(lastPoint.x - x) + Math.abs(lastPoint.y - y);
                    if (div < 0.5)
                        return false;
                }
                x = Drawing.CurvedPathMaths.round(x, 2);
                y = Drawing.CurvedPathMaths.round(y, 2);
                this.lineEl.addCoordinate(x, y);
                // init preview
                if (!this.previewElement) {
                    if (this.freehandMode)
                        this.previewElement = this.drawing.paper.polyline(x, y).attr({ stroke: "green", strokeWidth: 1, fill: "transparent" });
                    else
                        this.previewElement = this.drawing.paper.path("M " + x + "," + y).attr({ stroke: "green", strokeWidth: 1, fill: "transparent" });
                    this.overlayHost.append(this.previewElement);
                }
                // add coord point
                var coordThumb = new Drawing.Thumb(Drawing.thumbType.move, x, y, this.drawing.paper, this.touchMode);
                if (coordThumb.hoverElement) {
                    coordThumb.hoverElement.undrag();
                    coordThumb.hoverElement.remove();
                    coordThumb.hoverElement = null;
                }
                this.overlayHost.append(coordThumb.displayElement);
                this.previewCoords.push(coordThumb);
                return true;
            };
            DrawRequestLine.prototype.endLine = function () {
                var el;
                if (this.lineEl.coords.length > 1) {
                    var length = new Drawing.Polyline(this.lineEl.coords).length();
                    if (!this.freehandMode || length >= 10.0)
                        el = this.drawing.drawLine(this.lineEl.clone());
                }
                if (this.doneCallback)
                    this.doneCallback(el);
                else
                    this.cancelRequest();
            };
            DrawRequestLine.prototype.onMouseClick = function (x, y, touchPointId) {
                if (this.freehandMode)
                    return false;
                this.addCoord(x, y);
                if (this.lineEl.type === FibaEurope.Data.lineElementType.passing && this.lineEl.coords.length >= 2) {
                    this.endLine();
                }
                return true;
            };
            DrawRequestLine.prototype.onMouseDblClick = function (x, y, touchPointId) {
                if (this.freehandMode)
                    return false;
                this.endLine();
                return true;
            };
            DrawRequestLine.prototype.onMouseDown = function (x, y, touchPointId) {
                if (!this.freehandMode || (this.touchPointId !== -1 && this.touchPointId !== touchPointId))
                    return false;
                this.touchPointId = touchPointId;
                this.lastDrawingPoint = new Drawing.Point(x, y);
                this.drawingPoints.push(this.lastDrawingPoint);
                this.drawingPointsRaw.push(this.lastDrawingPoint.x);
                this.drawingPointsRaw.push(this.lastDrawingPoint.y);
                this.addCoord(x, y);
                return true;
            };
            DrawRequestLine.prototype.onMouseMove = function (x, y, touchPointId) {
                if (this.freehandMode) {
                    if (this.touchPointId !== touchPointId)
                        return false;
                    var dx = x - this.lastDrawingPoint.x;
                    var dy = y - this.lastDrawingPoint.y;
                    var minD = 2;
                    if (dx < -minD || dx > minD || dy < -minD || dy > minD) {
                        if (this.lineEl.type === FibaEurope.Data.lineElementType.passing) {
                            if (this.drawingPointsRaw.length < 4) {
                                this.drawingPointsRaw.push(x);
                                this.drawingPointsRaw.push(y);
                            }
                            else if (this.drawingPointsRaw.length > 3) {
                                this.drawingPointsRaw[2] = x;
                                this.drawingPointsRaw[3] = y;
                            }
                        }
                        else {
                            this.lastDrawingPoint = new Drawing.Point(x, y);
                            this.drawingPoints.push(this.lastDrawingPoint);
                            this.drawingPointsRaw.push(this.lastDrawingPoint.x);
                            this.drawingPointsRaw.push(this.lastDrawingPoint.y);
                        }
                        if (this.previewElement) {
                            this.previewElement.attr({ points: this.drawingPointsRaw });
                        }
                    }
                }
                else {
                    if (this.previewElement) {
                        var coords = this.lineEl.coords.slice();
                        if (coords[coords.length - 1].x !== x || coords[coords.length - 1].y !== y)
                            coords.push(new Drawing.Point(x, y));
                        var pathString = Drawing.LineDrawingElement.getPathString(coords, this.lineEl.curved);
                        this.previewElement.attr({ d: pathString });
                    }
                }
                return true;
            };
            DrawRequestLine.prototype.onMouseUp = function (x, y, touchPointId) {
                var _this = this;
                if (!this.freehandMode)
                    return false;
                if (this.touchPointId !== touchPointId)
                    return false;
                if (this.lineEl.type === FibaEurope.Data.lineElementType.passing) {
                    this.addCoord(x, y);
                    this.endLine();
                    return true;
                }
                var dx = x - this.lastDrawingPoint.x;
                var dy = y - this.lastDrawingPoint.y;
                var minD = 2;
                if (dx < -minD || dx > minD || dy < -minD || dy > minD) {
                    this.lastDrawingPoint = new Drawing.Point(x, y);
                    this.drawingPoints.push(this.lastDrawingPoint);
                    this.drawingPointsRaw.push(this.lastDrawingPoint.x);
                    this.drawingPointsRaw.push(this.lastDrawingPoint.y);
                }
                if (this.drawingPoints.length < 2) {
                    if (this.doneCallback)
                        this.doneCallback(null);
                    else
                        this.cancelRequest();
                    return true;
                }
                // get coords for line from drawing
                console.log("drawingPoints.length: " + this.drawingPoints.length);
                var tolerance = this.drawingPoints.length < 20 ? 2 : 7;
                if (this.lineEl.type === FibaEurope.Data.lineElementType.free)
                    tolerance = 2;
                var points = FibaEurope.Drawing.SimplifyPolyline.douglasPeuckerReduction(this.drawingPoints, tolerance);
                points.forEach(function (pt) { return _this.addCoord(pt.x, pt.y); });
                this.endLine();
                return true;
            };
            DrawRequestLine.prototype.onMouseLeave = function (x, y, touchPointId) {
                if (!this.freehandMode)
                    return false;
                if (this.touchPointId !== touchPointId)
                    return false;
                return this.onMouseUp(x, y, touchPointId);
            };
            DrawRequestLine.prototype.cancelRequest = function () {
                if (this.previewElement) {
                    this.previewElement.remove();
                    this.previewElement = null;
                }
                var pc;
                while (pc = this.previewCoords.pop()) {
                    pc.remove();
                }
            };
            return DrawRequestLine;
        }(DrawRequest));
        var DrawRequestShoot = /** @class */ (function (_super) {
            __extends(DrawRequestShoot, _super);
            function DrawRequestShoot(basketTop, basketBottom, drawing, overlayHost, doneCallback, touchMode) {
                var _this = _super.call(this, drawing, overlayHost, doneCallback, touchMode) || this;
                _this.basketTop = basketTop;
                _this.basketBottom = basketBottom;
                _this.touchPointId = -1;
                // init preview Element
                _this.previewArrow = Drawing.DynamicDrawingElement.getPreviewElement(_this.drawing.paper, FibaEurope.Data.dynamicElementType.shooting);
                if (_this.previewArrow) {
                    _this.previewElement = _this.drawing.paper.group(_this.previewArrow);
                    _this.previewElement.attr({ visibility: "hidden" });
                    _this.overlayHost.append(_this.previewElement);
                }
                _this.previewBasketTop = new Drawing.Thumb(Drawing.thumbType.target, _this.basketTop.x, _this.basketTop.y, _this.drawing.paper, _this.touchMode);
                _this.overlayHost.append(_this.previewBasketTop.displayElement);
                _this.previewBasketBottom = new Drawing.Thumb(Drawing.thumbType.target, _this.basketBottom.x, _this.basketBottom.y, _this.drawing.paper, _this.touchMode);
                _this.overlayHost.append(_this.previewBasketBottom.displayElement);
                _this.color = FibaEurope.Data.elementColor.black;
                return _this;
            }
            DrawRequestShoot.prototype.setColor = function (color) {
                this.color = color;
            };
            DrawRequestShoot.prototype.getColor = function () {
                return this.color;
            };
            DrawRequestShoot.prototype.onMouseDown = function (x, y, touchPointId) {
                if (this.touchMode && this.previewElement) {
                    this.onMouseMove(x, y, touchPointId);
                    this.previewElement.attr({ visibility: "visible" });
                }
                if (this.touchPointId < 0)
                    this.touchPointId = touchPointId;
                return true;
            };
            DrawRequestShoot.prototype.onMouseUp = function (x, y, touchPointId) {
                if (this.touchPointId !== touchPointId)
                    return;
                var dynEl = new FibaEurope.Data.DynamicElement();
                dynEl.type = FibaEurope.Data.dynamicElementType.shooting;
                dynEl.x = Drawing.CurvedPathMaths.round(x, 2);
                dynEl.y = Drawing.CurvedPathMaths.round(y, 2);
                dynEl.color = this.color;
                dynEl.rotation = Math.round(this.getRotation(dynEl.x, dynEl.y));
                var el = this.drawing.drawShooting(dynEl);
                el.initShootingTargets(this.basketTop, this.basketBottom);
                if (this.doneCallback)
                    this.doneCallback(el);
                else
                    this.cancelRequest();
                this.touchPointId = -1;
                return true;
            };
            DrawRequestShoot.prototype.onMouseMove = function (x, y, touchPointId) {
                if (this.previewElement && (this.touchPointId === touchPointId || this.touchPointId === -1)) {
                    this.previewElement.transform("translate(" + x + "," + y + ")");
                    this.previewElement.attr({ visibility: "visible" });
                    if (this.previewArrow) {
                        var rotation = this.getRotation(x, y);
                        var transformation = Snap.matrix();
                        transformation.rotate(rotation, 0, 0);
                        if (FibaEurope.Data.DynamicElement.isInsideShootingScaleArea(x, y))
                            transformation.scale(0.7, 0.7, 0, 0);
                        this.previewArrow.transform(transformation);
                    }
                }
                return true;
            };
            DrawRequestShoot.prototype.getRotation = function (x, y) {
                return Drawing.DynamicDrawingElement.getShootingRotation(x, y, this.basketTop, this.basketBottom);
            };
            DrawRequestShoot.prototype.onMouseEnter = function (x, y, touchPointId) {
                if (this.previewElement)
                    this.previewElement.attr({ visibility: "visible" });
                return false;
            };
            DrawRequestShoot.prototype.onMouseLeave = function (x, y, touchPointId) {
                if (this.previewElement)
                    this.previewElement.attr({ visibility: "hidden" });
                return false;
            };
            DrawRequestShoot.prototype.cancelRequest = function () {
                if (this.previewElement) {
                    this.previewElement.remove();
                    this.previewElement = null;
                    this.previewArrow = null;
                }
                if (this.previewBasketTop) {
                    this.previewBasketTop.remove();
                    this.previewBasketTop = null;
                }
                if (this.previewBasketBottom) {
                    this.previewBasketBottom.remove();
                    this.previewBasketBottom = null;
                }
            };
            DrawRequestShoot.getShootingTarget = function (width, height, bottom) {
                if (bottom)
                    return new Drawing.Point((width / 2), height - 77);
                return new Drawing.Point((width / 2), 78);
            };
            return DrawRequestShoot;
        }(DrawRequest));
    })(Drawing = FibaEurope.Drawing || (FibaEurope.Drawing = {}));
})(FibaEurope || (FibaEurope = {}));
//# sourceMappingURL=fibaDrawingController.js.map