var FibaEurope;
/// <reference path="libs/snapsvg.d.ts" />
/// <reference path="fibaGraphic.ts" />
/// <reference path="fibaDrawingCurvedPath.ts" />
(function (FibaEurope) {
    var Drawing;
    (function (Drawing) {
        "use strict";
        Drawing.fullCourtWidth = 384;
        Drawing.fullCourtHeight = 540;
        Drawing.halfCourtHeight = 270;
        // draw a graphic as svg
        var SvgDrawing = (function () {
            function SvgDrawing(paper, graphic, createUniqueDefs, dontUseDefs) {
                this.paper = paper;
                this.graphic = graphic;
                this.createUniqueDefs = createUniqueDefs;
                this.dontUseDefs = dontUseDefs;
                this.ballDef = null;
                this.coneDef = null;
                this.coachDef = null;
                this.shootingDef = null;
                this.handoffDef = null;
                this.markerArrow = null;
                this.markerLine = null;
                this.offenceDef = null;
                this.defenceDef = null;
            }
            SvgDrawing.prototype.drawGraphic = function (host, simple, addTouchLayer) {
                this.ballDef = null;
                this.coneDef = null;
                this.coachDef = null;
                this.shootingDef = null;
                this.handoffDef = null;
                this.markerArrow = null;
                this.markerLine = null;
                this.offenceDef = null;
                this.defenceDef = null;
                var svgEl = SvgDrawing.createSvgElement(!this.isFullCourt());
                while (host.firstChild) {
                    host.removeChild(host.firstChild);
                }
                host.appendChild(svgEl);
                this.paper = Snap(svgEl);
                this.disableTextSelection();
                // background
                var elBgr = this.drawBackground(simple);
                // the content
                if (this.graphic) {
                    var i = 0;
                    // 1. area
                    for (i = 0; i < this.graphic.staticElements.length; i++)
                        if (this.graphic.staticElements[i].type === FibaEurope.Data.staticElementType.area)
                            this.drawStatic(this.graphic.staticElements[i]);
                    // 2. shoot
                    for (i = 0; i < this.graphic.dynamicElements.length; i++)
                        if (this.graphic.dynamicElements[i].type === FibaEurope.Data.dynamicElementType.shooting ||
                            this.graphic.dynamicElements[i].type === FibaEurope.Data.dynamicElementType.handoff)
                            this.drawDynamic(this.graphic.dynamicElements[i], this.graphic.wheelchair);
                    // 3. line
                    for (i = 0; i < this.graphic.lineElements.length; i++)
                        this.drawLine(this.graphic.lineElements[i]);
                    // 4. cone
                    for (i = 0; i < this.graphic.dynamicElements.length; i++)
                        if (this.graphic.dynamicElements[i].type === FibaEurope.Data.dynamicElementType.cone)
                            this.drawDynamic(this.graphic.dynamicElements[i], this.graphic.wheelchair);
                    // 5. person
                    for (i = 0; i < this.graphic.dynamicElements.length; i++)
                        if (this.graphic.dynamicElements[i].type === FibaEurope.Data.dynamicElementType.offence ||
                            this.graphic.dynamicElements[i].type === FibaEurope.Data.dynamicElementType.defence ||
                            this.graphic.dynamicElements[i].type === FibaEurope.Data.dynamicElementType.coach)
                            this.drawDynamic(this.graphic.dynamicElements[i], this.graphic.wheelchair);
                    // 6. ball
                    for (i = 0; i < this.graphic.dynamicElements.length; i++)
                        if (this.graphic.dynamicElements[i].type === FibaEurope.Data.dynamicElementType.ball)
                            this.drawDynamic(this.graphic.dynamicElements[i], this.graphic.wheelchair);
                    // 7. text
                    for (i = 0; i < this.graphic.staticElements.length; i++)
                        if (this.graphic.staticElements[i].type === FibaEurope.Data.staticElementType.text)
                            this.drawStatic(this.graphic.staticElements[i]);
                }
                // layer on top to capture all inputs
                if (addTouchLayer) {
                    var bb = elBgr.select("rect").getBBox();
                    this.paper.rect(bb.x, bb.y, bb.w, bb.h).attr({ fill: "transparent", "class": "touchLayer" });
                }
                return svgEl;
            };
            SvgDrawing.prototype.isFullCourt = function () {
                return !this.graphic || this.graphic.fullCourt;
            };
            SvgDrawing.createSvgElement = function (isHalfCourt, width, height) {
                var svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgEl.setAttribute("version", "1.1");
                if (!width)
                    width = Drawing.fullCourtWidth;
                if (!height) {
                    height = Drawing.fullCourtHeight;
                    if (isHalfCourt)
                        height = Drawing.halfCourtHeight;
                }
                svgEl.setAttribute("width", width + "");
                svgEl.setAttribute("height", height + "");
                svgEl.setAttribute("viewBox", "0 0 " + width + " " + height);
                svgEl.style.overflow = "hidden"; // for clipping in the IE
                // for IE
                if (typeof svgEl.style.msTouchAction !== "undefined")
                    svgEl.style.msTouchAction = "none";
                return svgEl;
            };
            SvgDrawing.prototype.disableTextSelection = function () {
                if (typeof this.paper.node.style.webkitUserSelect !== "undefined")
                    this.paper.node.style.webkitUserSelect = "none";
                if (typeof this.paper.node.style.MozUserSelect !== "undefined")
                    this.paper.node.style.MozUserSelect = "none";
                if (typeof this.paper.node.style.userSelect !== "undefined")
                    this.paper.node.style.userSelect = "none";
            };
            SvgDrawing.prototype.drawBackground = function (simple) {
                var svgEl = this.paper.node;
                var width = svgEl.clientWidth > 0 ? svgEl.clientWidth : +svgEl.attributes["width"].value; // ff has no clientWidth
                var height = svgEl.clientHeight > 0 ? svgEl.clientHeight : +svgEl.attributes["height"].value; // ff has no clientHeight
                // thick blue border
                var groupBg = this.paper.group().attr({ "class": 'backgroundGroup' });
                groupBg.append(this.paper.rect(0, 0, width, height).attr({ fill: simple ? "#BFE4F7" : "#70BFE9" }));
                var strokeLineColor = simple ? "#0099CC" : "white";
                if (simple) {
                    groupBg.append(this.paper.rect(50, 44, 284, (this.isFullCourt() ? 453 : 226)).attr({ stroke: strokeLineColor, strokeWidth: 4, fill: "white" }));
                }
                else {
                    // background Image
                    var bgImg = this.paper.image("../assets/images/playground.jpg", 0, 0, 284, 454);
                    var bgImgPattern = bgImg.pattern(0, 0, 284, 454);
                    groupBg.append(this.paper.rect(50, 44, 284, (this.isFullCourt() ? 453 : 226)).attr({ stroke: strokeLineColor, strokeWidth: 4, fill: bgImgPattern }));
                }
                // middle
                if (this.isFullCourt()) {
                    groupBg.append(this.paper.circle(191, 270, 32).attr({ stroke: strokeLineColor, strokeWidth: 4, fill: "none" })); // circle
                    groupBg.append(this.paper.line(50, 270, 334, 270).attr({ stroke: strokeLineColor, strokeWidth: 4 })); // middle line
                }
                else {
                    groupBg.append(this.paper.path("m 160,270 c -1,-42 65,-42 65,0").attr({ stroke: strokeLineColor, strokeWidth: 4, fill: "none" })); // half-circle
                }
                // top half group
                var groupHalf = this.paper.group().attr({ stroke: strokeLineColor, strokeWidth: 2, fill: "none" });
                groupHalf.append(this.paper.line(141, 75, 242, 75));
                groupHalf.append(this.paper.line(143, 95, 240, 95).attr({ strokeWidth: 6 }));
                groupHalf.append(this.paper.line(141, 114, 242, 114));
                groupHalf.append(this.paper.line(141, 129, 242, 129));
                groupHalf.append(this.paper.rect(147, 45, 90, 110).attr({ fill: simple ? "#BFE4F7" : "#0089CF" }));
                groupHalf.append(this.paper.path("m 160,156 c 0, 41 64, 41 64, 0"));
                // basket outer
                groupHalf.append(this.paper.path("m 166,65 0,13 c 2,32 50,32 52,0 l 0,-13"));
                // basket
                groupHalf.append(this.paper.line(174, 66, 210, 66).attr({ strokeWidth: 3 }));
                groupHalf.append(this.paper.line(192, 66, 192, 72).attr({ strokeWidth: 4 }));
                groupHalf.append(this.paper.circle(192, 78, 6));
                // 3pointLine
                groupHalf.append(this.paper.path("m 75,46 0,35 c 8,150 226,150 234,0 l 0,-35"));
                // move to def, because we can reuse this for the other half
                if (this.isFullCourt()) {
                    if (this.dontUseDefs) {
                        groupBg.append(groupHalf);
                        groupHalf.clone().transform("s 1 -1 0 270.5");
                    }
                    else {
                        var defHalf = groupHalf.toDefs().attr({ id: this.getId("halfDef" + (simple ? "Simple" : "")) });
                        groupBg.append(defHalf.use());
                        groupBg.append(defHalf.use().transform("s 1 -1 0 270.5"));
                    }
                }
                else {
                    // just use the group and move it to the background
                    groupBg.append(groupHalf);
                }
                return groupBg;
            };
            SvgDrawing.prototype.drawDynamic = function (dyn, wheelchair) {
                if (!this.isFullCourt() && dyn.y >= Drawing.halfCourtHeight)
                    return null;
                switch (dyn.type) {
                    case FibaEurope.Data.dynamicElementType.offence:
                        return this.drawOffense(dyn, wheelchair);
                    case FibaEurope.Data.dynamicElementType.defence:
                        return this.drawDefense(dyn, wheelchair);
                    case FibaEurope.Data.dynamicElementType.ball:
                        return this.drawBall(dyn);
                    case FibaEurope.Data.dynamicElementType.coach:
                        return this.drawCoach(dyn);
                    case FibaEurope.Data.dynamicElementType.cone:
                        return this.drawCone(dyn);
                    case FibaEurope.Data.dynamicElementType.shooting:
                        return this.drawShooting(dyn);
                    case FibaEurope.Data.dynamicElementType.handoff:
                        return this.drawHandoff(dyn);
                }
                return null;
            };
            SvgDrawing.prototype.drawOffense = function (dyn, wheelchair) {
                var player;
                if (this.offenceDef) {
                    player = this.offenceDef.use();
                }
                else {
                    var playerGroup;
                    var offenceDefId = "offenceDef";
                    if (wheelchair) {
                        offenceDefId = offenceDefId + "Wheel";
                        // white wheelchair
                        var left = this.paper.rect(-11, -6, 2, 18, 1);
                        var right = this.paper.rect(9, -6, 2, 18, 1);
                        var chair = this.paper.rect(-8, -12, 16, 20).attr({ fill: "white" });
                        playerGroup = this.paper.group(left, right, chair);
                        playerGroup.attr({ strokeWidth: 2 });
                    }
                    else {
                        // white circle
                        playerGroup = this.paper.circle(0, 0, 10);
                        playerGroup.attr({ fill: "#ffffff", strokeWidth: 2 });
                    }
                    if (this.dontUseDefs) {
                        player = playerGroup;
                    }
                    else {
                        this.offenceDef = playerGroup.toDefs().attr({ id: this.getId(offenceDefId) });
                        player = this.offenceDef.use();
                    }
                }
                if (dyn.rotation !== 0)
                    player.transform("rotate(" + dyn.rotation + ")");
                // player nr
                var nr = this.paper.text(-4, 5, dyn.nr + "");
                nr.attr({ fontSize: "14px", fontFamily: "Arial", fontWeight: "bold", pointerEvents: "none", stroke: "none" });
                // group
                var color = DrawingElementHelper.getColorString(dyn.color);
                var group = this.paper.group(player, nr);
                group.transform("translate(" + dyn.x + "," + dyn.y + ")");
                group.attr({ "class": "offence", fill: color, stroke: color });
                var el = new DynamicDrawingElement(dyn, group, nr, player);
                el.wheelchair = wheelchair;
                return el;
            };
            SvgDrawing.prototype.drawDefense = function (dyn, wheelchair) {
                var player;
                if (this.defenceDef) {
                    player = this.defenceDef.use();
                }
                else {
                    var playerGroup;
                    var defenceDefId = "defenceDef";
                    if (wheelchair) {
                        defenceDefId = defenceDefId + "Wheel";
                        var left = this.paper.rect(-10, -5, 1, 16, 1.7, 1.2);
                        var right = this.paper.rect(9, -5, 1, 16, 1.7, 1.2);
                        var chair = this.paper.path("m 0,-10 -8,9 0,8 16,0 0,-8 z").attr({ fill: "white" });
                        var charBack = this.paper.line(-5, -8, 5, -8);
                        playerGroup = this.paper.group(left, right, charBack, chair);
                        playerGroup.attr({ strokeWidth: 2 });
                    }
                    else {
                        // defense Player Outline
                        var outline = this.paper.path("m -20,10 c 10,-16 30,-16 40,0 -5,-24 -35,-24 -40,0");
                        outline.attr({ strokeWidth: 0, stroke: "none" });
                        // white circle for the number
                        var circle = this.paper.circle(0, 0, 7);
                        circle.attr({ fill: "#ffffff", strokeWidth: 2 });
                        playerGroup = this.paper.group(outline, circle);
                    }
                    if (this.dontUseDefs) {
                        player = playerGroup;
                    }
                    else {
                        this.defenceDef = playerGroup.toDefs().attr({ id: this.getId(defenceDefId) });
                        player = this.defenceDef.use();
                    }
                }
                if (dyn.rotation !== 0)
                    player.transform("rotate(" + dyn.rotation + ")");
                // player nr
                var nr = this.paper.text(-3, 4, dyn.nr + "");
                nr.attr({ fontSize: "11px", fontFamily: "Arial", fontWeight: "bold", pointerEvents: "none", stroke: "none" });
                // group
                var color = DrawingElementHelper.getColorString(dyn.color);
                var group = this.paper.group(player, nr);
                group.transform("translate(" + dyn.x + "," + dyn.y + ")");
                group.attr({ "class": "defence", fill: color, stroke: color });
                var el = new DynamicDrawingElement(dyn, group, nr, player);
                el.wheelchair = wheelchair;
                return el;
            };
            SvgDrawing.prototype.drawBall = function (dyn) {
                var ballUse;
                if (this.ballDef) {
                    ballUse = this.ballDef.use();
                }
                else {
                    // background
                    var ball = this.paper.ellipse(0, 0, 7.25, 7);
                    ball.attr({ fill: this.paper.gradient("r(0.6, 0.4, 0.5)#ffcaa6-#d54800:75-#8d3d17").attr({ id: this.getId("ballGradient") }) });
                    // lines
                    var lines = this.paper.path("m -3.4,-6.1 c 2.3,-0.9 5.3,2 8.5,1 M -5.6,4.5 C -4.3,0.6 5.6,-8.1 5.9,4 M -0.4,7 C 2.7,3.5 3.1,-3.5 2.1,-6.6 M -7,-1.2 C -6.6,-3.3 3.2,-6.3 7,-1");
                    lines.attr({ stroke: "#000000", strokeWidth: 0.2, fill: "none" });
                    var ballGroup = this.paper.group(ball, lines);
                    if (this.dontUseDefs) {
                        ballUse = ballGroup;
                    }
                    else {
                        this.ballDef = ballGroup.toDefs().attr({ id: this.getId("ballDef") });
                        ballUse = this.ballDef.use();
                    }
                }
                // group
                var group = this.paper.group(ballUse);
                group.transform("translate(" + dyn.x + "," + dyn.y + ")");
                group.attr({ "class": "ball" });
                return new DynamicDrawingElement(dyn, group);
            };
            SvgDrawing.prototype.drawCoach = function (dyn) {
                var coachUse;
                if (this.coachDef) {
                    coachUse = this.coachDef.use();
                }
                else {
                    // white circle
                    var circle = this.paper.circle(0, 0, 10);
                    circle.attr({ fill: "#ffffff", stroke: "#de4814", strokeWidth: 2 });
                    // text
                    var nr = this.paper.text(-5.5, 4.5, "c");
                    nr.attr({ fill: "#de4814", fontSize: "18px", fontFamily: "Arial", fontWeight: "bold", pointerEvents: "none" });
                    var coachGroup = this.paper.group(circle, nr);
                    if (this.dontUseDefs) {
                        coachUse = coachGroup;
                    }
                    else {
                        this.coachDef = coachGroup.toDefs().attr({ id: this.getId("coachDef") });
                        coachUse = this.coachDef.use();
                    }
                }
                // group
                var group = this.paper.group(coachUse);
                group.transform("translate(" + dyn.x + "," + dyn.y + ")");
                group.attr({ "class": "coach" });
                return new DynamicDrawingElement(dyn, group);
            };
            SvgDrawing.prototype.drawCone = function (dyn) {
                var coneUse;
                if (this.coneDef) {
                    coneUse = this.coneDef.use();
                }
                else {
                    // cone
                    var cone = this.paper.path("m -5,8 4.5,-17 1,0 4.5,17 z");
                    cone.attr({ fill: this.paper.gradient("l(0, 0.5, 1, 0.5)#ffffff-#ff7f7f:25-#f00000").attr({ id: this.getId("coneGradient") }) });
                    // foot
                    var foot1 = this.paper.line(-10, 8, 10, 8).attr({ stroke: "#000000", strokeWidth: 1 });
                    var foot2 = this.paper.line(-10, 9, 10, 9).attr({ stroke: "#f00000", strokeWidth: 1 });
                    var coneGroup = this.paper.group(cone, foot1, foot2);
                    if (this.dontUseDefs) {
                        coneUse = coneGroup;
                    }
                    else {
                        this.coneDef = coneGroup.toDefs().attr({ id: this.getId("coneDef") });
                        coneUse = this.coneDef.use();
                    }
                }
                // group
                var group = this.paper.group(coneUse);
                group.transform("translate(" + dyn.x + "," + dyn.y + ")");
                group.attr({ "class": "cone" });
                return new DynamicDrawingElement(dyn, group);
            };
            SvgDrawing.prototype.drawShooting = function (dyn) {
                var shootingUse;
                if (this.shootingDef) {
                    shootingUse = this.shootingDef.use();
                }
                else {
                    var shooting = this.paper.path("m -9,-25 8,-14 8,14 -4,0 0,13 -7.5,0 0,-13 z").attr({ fill: "#ffffff", strokeWidth: 1 });
                    if (this.dontUseDefs) {
                        shootingUse = shooting;
                    }
                    else {
                        this.shootingDef = shooting.toDefs().attr({ id: this.getId("shootingArrow") });
                        shootingUse = this.shootingDef.use();
                    }
                }
                var transformation = Snap.matrix();
                transformation.rotate(dyn.rotation, 0, 0);
                if (FibaEurope.Data.DynamicElement.isInsideShootingScaleArea(dyn.x, dyn.y))
                    transformation.scale(0.7, 0.7, 0, 0);
                shootingUse.transform(transformation);
                // group
                var color = DrawingElementHelper.getColorString(dyn.color);
                var group = this.paper.group(shootingUse);
                group.transform("translate(" + dyn.x + "," + dyn.y + ")");
                group.attr({ "class": "shoot", stroke: color });
                return new DynamicDrawingElement(dyn, group, null, shootingUse);
            };
            SvgDrawing.prototype.drawHandoff = function (dyn) {
                var handoffUse;
                if (this.handoffDef) {
                    handoffUse = this.handoffDef.use();
                }
                else {
                    // Handoff
                    var handoff = this.paper.path("M -8,0 H 8 M 4,-8 V 8 M -4,-8 V 8");
                    handoff.attr({ fill: "none", strokeWidth: 2 });
                    if (this.dontUseDefs) {
                        handoffUse = handoff;
                    }
                    else {
                        this.handoffDef = handoff.toDefs().attr({ id: this.getId("handoffDef") });
                        handoffUse = this.handoffDef.use();
                    }
                }
                // group
                var color = DrawingElementHelper.getColorString(dyn.color);
                var group = this.paper.group(handoffUse);
                group.transform("translate(" + dyn.x + "," + dyn.y + ")");
                group.attr({ "class": "handoff", stroke: color });
                return new DynamicDrawingElement(dyn, group);
            };
            SvgDrawing.prototype.drawStatic = function (stat) {
                if (!this.isFullCourt() && stat.y >= Drawing.halfCourtHeight)
                    return null;
                switch (stat.type) {
                    case FibaEurope.Data.staticElementType.area:
                        return this.drawArea(stat);
                    case FibaEurope.Data.staticElementType.text:
                        return this.drawText(stat);
                }
                return null;
            };
            SvgDrawing.prototype.drawText = function (stat) {
                // text
                var text = this.paper.text(0, 0, stat.text.split("\n"));
                for (var i = 0; i < text.node.childNodes.length; i++) {
                    var node = text.node.childNodes[i];
                    if (node.nodeType === node.ELEMENT_NODE) {
                        node.setAttribute("x", "0");
                        node.setAttribute("dy", "15");
                    }
                }
                text.attr({ fill: "#000000", fontSize: "12px", fontFamily: "Arial", pointerEvents: "none" });
                text.attr({ "class": "text" });
                text.transform("translate(" + stat.x + "," + stat.y + ")");
                return new StaticDrawingElement(stat, text);
            };
            SvgDrawing.prototype.drawArea = function (stat, border) {
                var area;
                var w = Math.abs(stat.width);
                var h = Math.abs(stat.height);
                if (stat.form === FibaEurope.Data.staticElementForm.ellipse) {
                    stat.coords = null;
                    area = this.paper.ellipse(w / 2, h / 2, w / 2, h / 2);
                }
                else if (stat.form === FibaEurope.Data.staticElementForm.rectangle) {
                    stat.coords = null;
                    area = this.paper.rect(0, 0, w, h);
                }
                else if (stat.form === FibaEurope.Data.staticElementForm.triangle) {
                    if (!stat.coords || stat.coords.length < 3) {
                        stat.coords = StaticDrawingElement.getTriangleCoordsForBox(stat.x, stat.y, stat.width, stat.height);
                    }
                    area = this.paper.path(LineDrawingElement.getPathString(stat.coords, false) + " z");
                }
                else {
                    return null;
                }
                var group = this.paper.group(area);
                var color = DrawingElementHelper.getColorString(stat.color);
                group.attr({ fill: color, opacity: 0.6 });
                group.attr({ "class": "area" });
                if (!stat.coords)
                    group.transform("translate(" + stat.x + "," + stat.y + ")");
                if (border)
                    group.attr({ stroke: "#333333", strokeWidth: 1 });
                return new StaticDrawingElement(stat, group, area);
            };
            SvgDrawing.prototype.drawLine = function (line) {
                var pathString;
                if (line.type === FibaEurope.Data.lineElementType.dribbling) {
                    pathString = LineDrawingElement.getPathStringWithWaves(line.coords, line.curved);
                }
                else {
                    pathString = LineDrawingElement.getPathString(line.coords, line.curved);
                }
                var el = this.styleLine(line, this.paper.path(pathString));
                return new LineDrawingElement(line, el);
            };
            SvgDrawing.prototype.styleLine = function (line, polyline) {
                var colorStr = DrawingElementHelper.getColorString(line.color);
                polyline.attr({ "class": "line", stroke: colorStr, strokeWidth: 1, fill: "none" });
                if (line.type === FibaEurope.Data.lineElementType.movement || line.type === FibaEurope.Data.lineElementType.dribbling) {
                    polyline.attr({ markerEnd: this.getMarkerArrow(line.color) });
                }
                else if (line.type === FibaEurope.Data.lineElementType.passing) {
                    polyline.attr({ markerEnd: this.getMarkerArrow(line.color), strokeDasharray: "6,4" });
                }
                else if (line.type === FibaEurope.Data.lineElementType.screen) {
                    polyline.attr({ markerEnd: this.getMarkerLine(line.color) });
                }
                return polyline;
            };
            SvgDrawing.prototype.getMarkerArrow = function (color) {
                if (color === FibaEurope.Data.elementColor.unknown)
                    color = FibaEurope.Data.elementColor.black;
                if (!this.markerArrow)
                    this.markerArrow = [null, null, null, null, null, null, null, null];
                if (!this.markerArrow[color]) {
                    var colorStr = DrawingElementHelper.getColorString(color);
                    var path = this.paper.path("m 8,3 -8,3 0,-6 8,3 z").attr({ fill: colorStr, strokeWidth: 0 });
                    this.markerArrow[color] = path.marker(0, 0, 8, 6, 4, 3).attr({ id: this.getId("markerArrow_" + color) });
                }
                if (this.dontUseDefs)
                    return null;
                return this.markerArrow[color];
            };
            SvgDrawing.prototype.getMarkerLine = function (color) {
                if (color === FibaEurope.Data.elementColor.unknown)
                    color = FibaEurope.Data.elementColor.black;
                if (!this.markerLine)
                    this.markerLine = [null, null, null, null, null, null, null, null];
                if (!this.markerLine[color]) {
                    var colorStr = DrawingElementHelper.getColorString(color);
                    var path = this.paper.path("M 0,10 L 0,-10 z").attr({ fill: colorStr, stroke: colorStr, strokeWidth: 2 });
                    this.markerLine[color] = path.marker(0, 0, 2, 10, 0, 5).attr({ id: this.getId("markerLine_" + color) });
                }
                if (this.dontUseDefs)
                    return null;
                return this.markerLine[color];
            };
            SvgDrawing.prototype.getId = function (prefix) {
                var id = prefix;
                if (this.createUniqueDefs) {
                    //id += '_' + Date.now() + 'x' + SvgDrawing.idGen++;
                    id += '_' + SvgDrawing.idGen++ + '_' + SvgDrawing.idGenDate;
                }
                return id;
            };
            return SvgDrawing;
        }());
        SvgDrawing.idGen = 0;
        SvgDrawing.idGenDate = Date.now();
        Drawing.SvgDrawing = SvgDrawing;
        var SvgDrawingCheckedOverlay = (function () {
            function SvgDrawingCheckedOverlay(svg, handleClick, onCheckedChanged) {
                var _this = this;
                this.handleClick = handleClick;
                this.onCheckedChanged = onCheckedChanged;
                var paper = Snap(svg);
                var bbPage = paper.select(".backgroundGroup").select("rect").getBBox();
                // search for existing elements in SVG
                this.circleEl = paper.select(".checkCircle");
                this.checkEl = paper.select(".checkMarker");
                this.groupEl = paper.select(".checkGroup");
                this.overlay = paper.select(".checkOverlay");
                if (!this.circleEl || !this.checkEl || !this.groupEl) {
                    var r = 20;
                    this.circleEl = paper.circle(r + 2, r + 2, r);
                    this.circleEl.attr({ "class": 'checkCircle', fill: "white", stroke: "black", strokeWidth: 2 });
                    this.checkEl = paper.path("M 10,22 20,34 30,10");
                    this.checkEl.attr({ "class": 'checkMarker', fill: "none", stroke: 'black', strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round', visibility: 'hidden' });
                    var bbCircle = this.circleEl.getBBox();
                    this.groupEl = paper.group(this.circleEl, this.checkEl).transform("translate(" + (bbPage.width - bbCircle.width - 6) + ",3)");
                    this.groupEl.attr({ "class": 'checkGroup hide-on-export', visibility: 'visible' });
                    //this.groupEl.hover(() => this.circleEl.attr({ fill: "#E9E9E9" }), () => this.circleEl.attr({ fill: "white" }));
                }
                if (!this.overlay) {
                    this.overlay = paper.rect(bbPage.x, bbPage.y, bbPage.w, bbPage.h);
                    this.overlay.attr({ "class": 'checkOverlay', fill: 'transparent' });
                }
                if (handleClick)
                    this.overlay.click(function () { _this.check(!_this.isChecked(), true); });
            }
            SvgDrawingCheckedOverlay.prototype.enable = function (enable) {
                if (this.groupEl) {
                    this.groupEl.attr({ visibility: enable ? "visible" : "hidden" });
                }
                if (this.overlay) {
                    this.overlay.attr({ fill: enable ? 'transparent' : 'none' });
                }
            };
            SvgDrawingCheckedOverlay.prototype.check = function (check, fromClick) {
                if (this.isChecked() != check) {
                    if (this.circleEl) {
                        this.circleEl.attr({ fill: check ? '#006195' : 'white', stroke: check ? 'white' : 'black' });
                    }
                    if (this.checkEl) {
                        this.checkEl.attr({ visibility: check ? 'visible' : 'hidden', stroke: check ? 'white' : 'black' });
                    }
                    if (this.onCheckedChanged)
                        this.onCheckedChanged(check, fromClick);
                }
            };
            SvgDrawingCheckedOverlay.prototype.isChecked = function () {
                return this.checkEl && this.checkEl.attr('visibility') === 'visible';
            };
            SvgDrawingCheckedOverlay.prototype.remove = function () {
                if (this.overlay) {
                    this.overlay.remove();
                    this.overlay = null;
                }
                if (this.groupEl) {
                    this.groupEl.remove();
                    this.groupEl = null;
                    this.checkEl = null;
                }
            };
            return SvgDrawingCheckedOverlay;
        }());
        Drawing.SvgDrawingCheckedOverlay = SvgDrawingCheckedOverlay;
        var DrawingElementDialogHelper = (function () {
            function DrawingElementDialogHelper() {
            }
            DrawingElementDialogHelper.flex = function (nr) {
                return "-webkit-box-flex: " + nr + "; -webkit-flex: " + nr + "; -ms-flex: " + nr + "; flex: " + nr + ";";
            };
            DrawingElementDialogHelper.getBaseStyle = function (width, elPadding) {
                if (elPadding === void 0) { elPadding = "0.5em"; }
                return [
                    ".selectionBox {",
                    "display: -webkit-box; display: -moz-box; display: -ms-flexbox; display: -webkit-flex; display: flex;",
                    "-webkit-flex-wrap: wrap; flex-wrap: wrap;",
                    "width: " + width + "; background-color: white; border:2px solid #EDEDED; border-radius: 5px; padding:0.5em; text-align:center; } ",
                    ".selectionItem,.selectionItemSelected {",
                    "-webkit-justify-content: space-around; justify-content: space-around;",
                    "border:1px dashed white; border-radius: 3px; padding:" + elPadding + "; margin: auto; cursor: pointer; } ",
                    ".selectionItem:hover { border-color: #cccccc; }",
                    ".selectionItemSelected { border-color: black; }",
                ].join("");
            };
            return DrawingElementDialogHelper;
        }());
        DrawingElementDialogHelper.bufferTimeCancelClick = 500;
        DrawingElementDialogHelper.bufferTimeOkClick = 200;
        DrawingElementDialogHelper.displayFlex = "display: -webkit-box; display: -moz-box; display: -ms-flexbox; display: -webkit-flex; display: flex;";
        DrawingElementDialogHelper.baseDialogBackgroundStyle = [
            DrawingElementDialogHelper.displayFlex,
            "-webkit-box-pack: center; -moz-box-pack: center; -ms-flex-pack: center; -webkit-justify-content: center; justify-content: center;",
            "-webkit-box-align: center; -moz-box-align: center; -ms-flex-align: center; -webkit-align-items: center; align-items: center;",
            "position:absolute;top:0;bottom:0;right:0;left:0;",
            "margin:0; padding:0;",
            "background-color:rgba(112, 191, 233, 0.5);",
            "overflow:hidden;",
            "text-align:center;",
            "z-index: 1000;"
        ].join("");
        var DynamicDrawingElement = (function () {
            function DynamicDrawingElement(data, displayElement, txtEl, rotateEl) {
                this.data = data;
                this.displayElement = displayElement;
                this.txtEl = txtEl;
                this.rotateEl = rotateEl;
                this.isInEditMode = false;
                this.canChangeColor = true;
                this.data = data.clone();
                this.canChangeColor = data.type === FibaEurope.Data.dynamicElementType.offence || data.type === FibaEurope.Data.dynamicElementType.defence || data.type === FibaEurope.Data.dynamicElementType.shooting || data.type === FibaEurope.Data.dynamicElementType.handoff;
            }
            DynamicDrawingElement.prototype.canRotate = function () {
                return this.data.type === FibaEurope.Data.dynamicElementType.defence ||
                    this.data.type === FibaEurope.Data.dynamicElementType.shooting ||
                    (this.data.type === FibaEurope.Data.dynamicElementType.offence && this.wheelchair);
            };
            DynamicDrawingElement.prototype.initShootingTargets = function (top, bottom) {
                this.shootingTargetTop = new Drawing.Point(top.x, top.y);
                this.shootingTargetBottom = new Drawing.Point(bottom.x, bottom.y);
            };
            DynamicDrawingElement.prototype.editNr = function () {
                var _this = this;
                if (this.isInEditMode)
                    return;
                this.isInEditMode = true;
                if (this.onStartEdit)
                    this.onStartEdit(this);
                var isDefence = this.data.type === FibaEurope.Data.dynamicElementType.defence;
                var dialogEl = DynamicDrawingElement.createNrSelectDialog(this.data.nr, this.data.color, isDefence, this.wheelchair, function (nr, fixed) {
                    _this.setNr(nr);
                    dialogEl.parentElement.removeChild(dialogEl);
                    _this.isInEditMode = false;
                    if (_this.onEndEdit)
                        _this.onEndEdit(_this);
                });
                document.body.appendChild(dialogEl);
            };
            DynamicDrawingElement.prototype.setNr = function (nr) {
                var oldNr = this.data.nr;
                this.data.nr = nr;
                if (this.txtEl)
                    this.txtEl.node.textContent = nr + "";
                if (this.onChanged && nr !== oldNr)
                    this.onChanged(this, "nr");
            };
            DynamicDrawingElement.prototype.setColor = function (color, drawing) {
                var oldColor = this.data.color;
                this.data.color = color;
                if (this.displayElement) {
                    var colorStr = DrawingElementHelper.getColorString(color);
                    this.displayElement.attr({ fill: colorStr, stroke: colorStr });
                }
                if (this.onChanged && color !== oldColor)
                    this.onChanged(this, "color");
            };
            DynamicDrawingElement.prototype.setRotation = function (rotation) {
                if (!this.canRotate())
                    return;
                this.data.rotation = rotation;
                if (this.rotateEl || this.hoverArrowElement) {
                    var transformation = Snap.matrix();
                    transformation.rotate(rotation, 0, 0);
                    if (this.data.type === FibaEurope.Data.dynamicElementType.shooting) {
                        if (FibaEurope.Data.DynamicElement.isInsideShootingScaleArea(this.data.x, this.data.y))
                            transformation.scale(0.7, 0.7, 0, 0);
                    }
                    if (this.rotateEl)
                        this.rotateEl.transform(transformation);
                    if (this.hoverArrowElement)
                        this.hoverArrowElement.transform(transformation);
                }
                if (this.thumbs && this.thumbs.length >= 2) {
                    this.thumbs[1].setRotation(rotation);
                }
            };
            DynamicDrawingElement.prototype.getHoverElement = function (paper, touchMode) {
                if (!this.hoverElement) {
                    if (this.data.type === FibaEurope.Data.dynamicElementType.handoff) {
                        this.hoverElement = paper.rect(-8, -8, 16, 16);
                    }
                    else {
                        this.hoverElement = DynamicDrawingElement.getPreviewElement(paper, this.data.type);
                    }
                    if (this.hoverElement) {
                        this.hoverElement.attr({ fill: "transparent", stroke: "transparent", strokeWidth: touchMode ? 4 : 2 });
                        if (this.data.type === FibaEurope.Data.dynamicElementType.shooting) {
                            this.hoverArrowElement = this.hoverElement;
                            var transformation = Snap.matrix();
                            transformation.rotate(this.data.rotation, 0, 0);
                            if (FibaEurope.Data.DynamicElement.isInsideShootingScaleArea(this.data.x, this.data.y))
                                transformation.scale(0.7, 0.7, 0, 0);
                            this.hoverArrowElement.transform(transformation);
                            this.hoverElement = paper.group(this.hoverArrowElement);
                        }
                        this.hoverElement.transform("translate(" + this.data.x + "," + this.data.y + ")");
                    }
                }
                return this.hoverElement;
            };
            DynamicDrawingElement.prototype.move = function (dx, dy) {
                var _this = this;
                this.data.x = Drawing.CurvedPathMaths.round(this.data.x + dx, 2);
                this.data.y = Drawing.CurvedPathMaths.round(this.data.y + dy, 2);
                if (this.displayElement)
                    this.displayElement.transform("translate(" + this.data.x + "," + this.data.y + ")");
                if (this.hoverElement)
                    this.hoverElement.transform("translate(" + this.data.x + "," + this.data.y + ")");
                if (this.thumbs) {
                    this.thumbs.filter(function (t) { return t.type !== thumbType.target; }).forEach(function (t) {
                        t.setPos(_this.data.x, _this.data.y);
                    });
                }
                if (this.onChanged && (dx !== 0 || dy !== 0))
                    this.onChanged(this, "moved");
            };
            DynamicDrawingElement.prototype.moveTo = function (x, y) {
                this.move(x - this.data.x, y - this.data.y);
            };
            DynamicDrawingElement.prototype.tmpMoveStart = function (x, y) {
                var _this = this;
                this.tmpMovePt = new Drawing.Point(x, y);
                if (this.data.type === FibaEurope.Data.dynamicElementType.offence || this.data.type === FibaEurope.Data.dynamicElementType.defence) {
                    this.longPressTimer = setTimeout(function () {
                        _this.longPressTimer = null;
                        if (_this.onLongPress) {
                            if (_this.onLongPress(_this, x, y))
                                return;
                        }
                        if (_this.data.type === FibaEurope.Data.dynamicElementType.offence ||
                            _this.data.type === FibaEurope.Data.dynamicElementType.defence) {
                            _this.editNr();
                        }
                    }, Thumb.longPressTimeout);
                }
                if (this.onStartEdit)
                    this.onStartEdit(this);
            };
            DynamicDrawingElement.prototype.tmpMoveTo = function (x, y) {
                this.tmpMoveVt = this.tmpMovePt.vectorTo(x, y);
                var nX = this.data.x + this.tmpMoveVt.x;
                var nY = this.data.y + this.tmpMoveVt.y;
                if (this.longPressTimer && this.tmpMoveVt.length() > 1.5) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
                if (this.displayElement)
                    this.displayElement.transform("translate(" + nX + "," + nY + ")");
                if (this.thumbs) {
                    this.thumbs.filter(function (t) { return t.type !== thumbType.target; }).forEach(function (t) {
                        t.setPos(nX, nY);
                    });
                }
                if (this.data.type === FibaEurope.Data.dynamicElementType.shooting) {
                    var rotation = DynamicDrawingElement.getShootingRotation(nX, nY, this.shootingTargetTop, this.shootingTargetBottom);
                    if (this.rotateEl) {
                        var transformation = Snap.matrix();
                        transformation.rotate(rotation, 0, 0);
                        if (FibaEurope.Data.DynamicElement.isInsideShootingScaleArea(nX, nY))
                            transformation.scale(0.7, 0.7, 0, 0);
                        this.rotateEl.transform(transformation);
                    }
                }
            };
            DynamicDrawingElement.prototype.tmpMoveStop = function (apply) {
                if (this.longPressTimer) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
                if (apply && this.tmpMoveVt && (this.tmpMoveVt.x !== 0 || this.tmpMoveVt.y !== 0)) {
                    this.move(this.tmpMoveVt.x, this.tmpMoveVt.y);
                    if (this.data.type === FibaEurope.Data.dynamicElementType.shooting) {
                        var rotation = DynamicDrawingElement.getShootingRotation(this.data.x, this.data.y, this.shootingTargetTop, this.shootingTargetBottom);
                        this.setRotation(Math.round(rotation));
                    }
                }
                else {
                    this.move(0, 0);
                    if (this.data.type === FibaEurope.Data.dynamicElementType.shooting) {
                        this.setRotation(this.data.rotation);
                    }
                }
                this.tmpMoveVt = null;
                if (this.onEndEdit)
                    this.onEndEdit(this);
            };
            DynamicDrawingElement.prototype.setSelected = function (selected, paper, touchMode) {
                var _this = this;
                if (this.selected === selected)
                    return;
                this.selected = selected;
                if (!selected) {
                    if (this.thumbs) {
                        this.thumbs.forEach(function (t) { return t.remove(); });
                        this.thumbs = null;
                    }
                }
                else if (paper) {
                    this.thumbs = new Array();
                    var moveThumb = new Thumb(thumbType.move, this.data.x, this.data.y, paper, touchMode);
                    moveThumb.onMoveStart = function (x, y) { return _this.tmpMoveStart(x, y); };
                    moveThumb.onMoveTo = function (x, y) { return _this.tmpMoveTo(x, y); };
                    moveThumb.onMoveStop = function (apply) { return _this.tmpMoveStop(apply); };
                    this.thumbs.push(moveThumb);
                    if (this.canRotate() && this.data.type !== FibaEurope.Data.dynamicElementType.shooting) {
                        var rotationRadius = touchMode ? 20 : 15;
                        var rotationThumb = new Thumb(thumbType.rotation, this.data.x, this.data.y, paper, touchMode, rotationRadius).setRotation(this.data.rotation);
                        rotationThumb.onMoveStart = function (x, y) {
                            if (_this.onStartEdit)
                                _this.onStartEdit(_this);
                        };
                        rotationThumb.onMoveStop = function (apply) {
                            if (_this.onEndEdit)
                                _this.onEndEdit(_this);
                            if (_this.onChanged)
                                _this.onChanged(_this, "rotated");
                        };
                        rotationThumb.onMoveTo = function (x, y) {
                            _this.setRotation(-Drawing.CurvedPathMaths.angle(Drawing.CurvedPathMaths.vector(new Drawing.Point(x, y), new Drawing.Point(_this.data.x, _this.data.y))));
                        };
                        this.thumbs.push(rotationThumb);
                    }
                    if (this.shootingTargetTop)
                        this.thumbs.push(new Thumb(thumbType.target, this.shootingTargetTop.x, this.shootingTargetTop.y, paper, touchMode));
                    if (this.shootingTargetBottom)
                        this.thumbs.push(new Thumb(thumbType.target, this.shootingTargetBottom.x, this.shootingTargetBottom.y, paper, touchMode));
                }
                return this.thumbs;
            };
            DynamicDrawingElement.prototype.isSelected = function () {
                return this.selected;
            };
            DynamicDrawingElement.getPreviewElement = function (paper, type) {
                var el;
                switch (type) {
                    case FibaEurope.Data.dynamicElementType.offence:
                    case FibaEurope.Data.dynamicElementType.defence:
                    case FibaEurope.Data.dynamicElementType.coach:
                        el = paper.circle(0, 0, 10);
                        break;
                    case FibaEurope.Data.dynamicElementType.ball:
                        el = paper.circle(0, 0, 7);
                        break;
                    case FibaEurope.Data.dynamicElementType.cone:
                        el = paper.path("m -5,8 4.5,-17 1,0 4.5,17 5,0 0,1 -20,0 0,-1 z");
                        break;
                    case FibaEurope.Data.dynamicElementType.shooting:
                        el = paper.path("m -9,-25 8,-14 8,14 -4,0 0,13 -7.5,0 0,-13 z");
                        break;
                    case FibaEurope.Data.dynamicElementType.handoff:
                        el = paper.path("M -8,0 H 8 M 4,-8 V 8 M -4,-8 V 8");
                        break;
                }
                if (el) {
                    el.attr({ stroke: "green", strokeWidth: 1, fill: "none" });
                }
                return el;
            };
            DynamicDrawingElement.getShootingTarget = function (x, y, targetTop, targetBottom) {
                var target = targetTop;
                if (y > targetTop.y + (targetBottom.y - targetTop.y) / 2)
                    target = targetBottom;
                return target;
            };
            DynamicDrawingElement.getShootingRotation = function (x, y, targetTop, targetBottom) {
                var target = DynamicDrawingElement.getShootingTarget(x, y, targetTop, targetBottom);
                return -Drawing.CurvedPathMaths.angle(Drawing.CurvedPathMaths.vector(target, { x: x, y: y }));
            };
            /**
             * Create a Dialog to select the Nr for the player
             * @param {Number} nr the current nr of the player
             * @param {Boolean} defence is it defence or offence
             * @param {Boolean} wheelchair use the wheelchair icons
             * @param {Function} onOk callback(nr,fixed?) with the new nr and if it is fixed (the fixed parameter is only set if <tt>fixed</tt> was set)
             * @param {Boolean} [fixed] if true or false, then the dialog also asks if it is fixed or automatic numbering
             */
            DynamicDrawingElement.createNrSelectDialog = function (nr, color, defence, wheelchair, onOk, fixed) {
                var playerCount = 9;
                var includeFixed = fixed === true || fixed === false;
                var lastClick = Date.now();
                // create a dialog
                var dialogEl = document.createElement("div");
                dialogEl.setAttribute("style", DrawingElementDialogHelper.baseDialogBackgroundStyle);
                dialogEl.addEventListener("click", function (e) {
                    e.preventDefault();
                    if (Date.now() - lastClick > DrawingElementDialogHelper.bufferTimeCancelClick)
                        onOk(nr);
                });
                var styleEl = document.createElement("style");
                styleEl.innerText = [
                    DrawingElementDialogHelper.getBaseStyle((includeFixed ? "40em" : "14em"), (includeFixed ? "0.3em" : "0.5em")),
                    ".selectionGroupTitle { justify-content: space-around; font-weight: bold; font-size: 1.1em; padding:0.3em; margin: auto; }",
                    "@media screen and (max-width: 710px) { ",
                    ".selectionBox { width: 23em; }",
                    ".selectionItem,.selectionItemSelected { padding: 0; }",
                    ".selectionItem svg,.selectionItemSelected svg { width: 2em !important; height: 2em !important; }",
                    ".selectionGroupTitle { font-size: 0.9em; padding:0; }",
                    "}"
                ].join("");
                dialogEl.appendChild(styleEl);
                var innerDiv = document.createElement("div");
                innerDiv.classList.add("selectionBox");
                dialogEl.appendChild(innerDiv);
                var count = includeFixed ? playerCount * 2 : playerCount;
                for (var i = 0; i < count; i++) {
                    if (includeFixed && i % playerCount == 0) {
                        var groupTitleDiv = document.createElement("div");
                        groupTitleDiv.classList.add("selectionGroupTitle");
                        groupTitleDiv.innerHTML = (i < playerCount) ? "12345" : "11111";
                        innerDiv.appendChild(groupTitleDiv);
                    }
                    var curNr = (i >= playerCount ? (i - playerCount) : i) + 1;
                    var playerDiv = document.createElement("div");
                    if (curNr == nr && (!includeFixed || fixed === false && i < playerCount || fixed === true && i >= playerCount))
                        playerDiv.classList.add("selectionItemSelected");
                    else
                        playerDiv.classList.add("selectionItem");
                    var svgEl = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                    svgEl.setAttribute("width", "3em");
                    svgEl.setAttribute("height", "3em");
                    playerDiv.appendChild(svgEl);
                    var drawing = new FibaEurope.Drawing.SvgDrawing(Snap(svgEl));
                    drawing.disableTextSelection();
                    var dynEl = new FibaEurope.Data.DynamicElement();
                    dynEl.x = 15;
                    dynEl.y = 16;
                    dynEl.nr = curNr;
                    dynEl.color = color;
                    dynEl.type = defence ? FibaEurope.Data.dynamicElementType.defence : FibaEurope.Data.dynamicElementType.offence;
                    if (defence) {
                        if (color === FibaEurope.Data.elementColor.unknown)
                            dynEl.color = FibaEurope.Data.elementColor.defence;
                        var defenseDrawing = drawing.drawDefense(dynEl, wheelchair);
                        if (!wheelchair)
                            defenseDrawing.displayElement.transform("translate(15,16) scale(0.8)");
                    }
                    else {
                        if (color === FibaEurope.Data.elementColor.unknown)
                            dynEl.color = FibaEurope.Data.elementColor.offence;
                        drawing.drawOffense(dynEl, wheelchair);
                    }
                    playerDiv.playerNr = curNr;
                    if (includeFixed)
                        playerDiv.playerNrFixed = i >= playerCount;
                    playerDiv.addEventListener("click", function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        if (Date.now() - lastClick > DrawingElementDialogHelper.bufferTimeOkClick)
                            onOk(e.currentTarget.playerNr, e.currentTarget.playerNrFixed);
                    });
                    innerDiv.appendChild(playerDiv);
                }
                return dialogEl;
            };
            DynamicDrawingElement.createObjectTypeSelectDialog = function (objectType, onOk) {
                var data = [
                    FibaEurope.Data.dynamicElementType.ball,
                    FibaEurope.Data.dynamicElementType.cone,
                    FibaEurope.Data.dynamicElementType.coach,
                ];
                var lastClick = Date.now();
                // create a dialog
                var dialogEl = document.createElement("div");
                dialogEl.setAttribute("style", DrawingElementDialogHelper.baseDialogBackgroundStyle);
                dialogEl.addEventListener("click", function (e) {
                    e.preventDefault();
                    if (Date.now() - lastClick > DrawingElementDialogHelper.bufferTimeCancelClick)
                        onOk(objectType);
                });
                var styleEl = document.createElement("style");
                styleEl.innerText = DrawingElementDialogHelper.getBaseStyle("14em");
                dialogEl.appendChild(styleEl);
                var innerDiv = document.createElement("div");
                innerDiv.classList.add("selectionBox");
                dialogEl.appendChild(innerDiv);
                for (var i = 0; i < data.length; i++) {
                    var curType = data[i];
                    var objectDiv = document.createElement("div");
                    if (curType === objectType)
                        objectDiv.classList.add("selectionItemSelected");
                    else
                        objectDiv.classList.add("selectionItem");
                    var svgEl = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                    svgEl.setAttribute("width", "3em");
                    svgEl.setAttribute("height", "3em");
                    objectDiv.appendChild(svgEl);
                    var drawing = new FibaEurope.Drawing.SvgDrawing(Snap(svgEl));
                    var dynEl = new FibaEurope.Data.DynamicElement();
                    dynEl.x = 15;
                    dynEl.y = 16;
                    dynEl.type = curType;
                    if (curType === FibaEurope.Data.dynamicElementType.ball) {
                        dynEl.x = 8;
                        dynEl.y = 9;
                        svgEl.setAttribute("viewBox", "0 0 16 16");
                    }
                    drawing.drawDynamic(dynEl, false);
                    objectDiv.objectType = curType;
                    objectDiv.addEventListener("click", function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        if (Date.now() - lastClick > DrawingElementDialogHelper.bufferTimeOkClick)
                            onOk(e.currentTarget.objectType);
                    });
                    innerDiv.appendChild(objectDiv);
                }
                return dialogEl;
            };
            return DynamicDrawingElement;
        }());
        Drawing.DynamicDrawingElement = DynamicDrawingElement;
        var StaticDrawingElement = (function () {
            function StaticDrawingElement(data, displayElement, area) {
                this.data = data;
                this.displayElement = displayElement;
                this.area = area;
                this.isInEditMode = false;
                this.canChangeColor = true;
                this.data = data.clone();
            }
            StaticDrawingElement.prototype.setText = function (text) {
                if (this.data.type !== FibaEurope.Data.staticElementType.text)
                    return;
                var oldText = this.data.text;
                this.data.text = text;
                this.displayElement.attr({ text: this.data.text.split("\n") });
                for (var i = 0; i < this.displayElement.node.childNodes.length; i++) {
                    var node = this.displayElement.node.childNodes[i];
                    if (node.nodeType === node.ELEMENT_NODE) {
                        node.setAttribute("x", "0");
                        node.setAttribute("dy", "15");
                    }
                }
                if (this.hoverElement) {
                    var bb = this.displayElement.getBBox();
                    this.hoverElement.attr({ width: bb.width, height: bb.height });
                }
                if (this.onChanged && text !== oldText)
                    this.onChanged(this, "text");
            };
            StaticDrawingElement.prototype.editText = function () {
                var _this = this;
                if (this.isInEditMode)
                    return;
                this.isInEditMode = true;
                if (this.onStartEdit)
                    this.onStartEdit(this);
                var dialogEl = StaticDrawingElement.createTextInputDialog(this.data.text, function (text) {
                    _this.setText(text);
                    dialogEl.parentElement.removeChild(dialogEl);
                    _this.isInEditMode = false;
                    if (_this.onEndEdit)
                        _this.onEndEdit(_this);
                });
                document.body.appendChild(dialogEl);
                var textEl = dialogEl.getElementsByTagName("textarea")[0];
                textEl.focus();
                // set cursor to the end
                if (typeof textEl.selectionStart === "number") {
                    textEl.selectionStart = textEl.selectionEnd = textEl.value.length;
                }
                else if (typeof textEl.createTextRange != "undefined") {
                    var range = textEl.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            };
            StaticDrawingElement.prototype.editForm = function () {
                var _this = this;
                if (this.isInEditMode)
                    return;
                this.isInEditMode = true;
                if (this.onStartEdit)
                    this.onStartEdit(this);
                var dialogEl = StaticDrawingElement.createAreaFormSelectDialog(this.data.form, this.data.color, function (form) {
                    _this.setForm(form);
                    dialogEl.parentElement.removeChild(dialogEl);
                    _this.isInEditMode = false;
                    if (_this.onEndEdit)
                        _this.onEndEdit(_this);
                });
                document.body.appendChild(dialogEl);
            };
            StaticDrawingElement.prototype.setForm = function (form) {
                if (this.data.type !== FibaEurope.Data.staticElementType.area || !this.displayElement)
                    return;
                var oldForm = this.data.form;
                if (this.data.form !== form && this.area) {
                    this.data.form = form;
                    this.area.remove();
                    this.area = null;
                    if (this.hoverArea) {
                        this.hoverArea.remove();
                        this.hoverArea = null;
                    }
                    var paper = Snap(this.displayElement.node.ownerSVGElement);
                    if (form === FibaEurope.Data.staticElementForm.ellipse) {
                        this.data.coords = null;
                        this.area = paper.ellipse(this.data.width / 2, this.data.height / 2, this.data.width / 2, this.data.height / 2);
                        this.displayElement.transform("translate(" + this.data.x + "," + this.data.y + ")");
                        this.displayElement.append(this.area);
                        if (this.hoverElement) {
                            this.hoverArea = paper.ellipse(this.data.width / 2, this.data.height / 2, this.data.width / 2, this.data.height / 2);
                            this.hoverElement.transform("translate(" + this.data.x + "," + this.data.y + ")");
                            this.hoverElement.append(this.hoverArea);
                        }
                    }
                    else if (form === FibaEurope.Data.staticElementForm.rectangle) {
                        this.data.coords = null;
                        this.area = paper.rect(0, 0, this.data.width, this.data.height);
                        this.displayElement.transform("translate(" + this.data.x + "," + this.data.y + ")");
                        this.displayElement.append(this.area);
                        if (this.hoverElement) {
                            this.hoverArea = paper.rect(0, 0, this.data.width, this.data.height);
                            this.hoverElement.transform("translate(" + this.data.x + "," + this.data.y + ")");
                            this.hoverElement.append(this.hoverArea);
                        }
                    }
                    else if (form === FibaEurope.Data.staticElementForm.triangle) {
                        this.data.coords = StaticDrawingElement.getTriangleCoordsForBox(this.data.x, this.data.y, this.data.width, this.data.height);
                        var pathString = LineDrawingElement.getPathString(this.data.coords, false) + " z";
                        this.area = paper.path(pathString);
                        this.displayElement.transform("");
                        this.displayElement.append(this.area);
                        if (this.hoverElement) {
                            this.hoverArea = paper.path(LineDrawingElement.getPathString(this.data.coords, false) + " z");
                            this.hoverElement.transform("");
                            this.hoverElement.append(this.hoverArea);
                        }
                    }
                    // undo selection because we need new thumbs
                    if (this.selected && oldForm === FibaEurope.Data.staticElementForm.triangle || form === FibaEurope.Data.staticElementForm.triangle) {
                        this.setSelected(false);
                    }
                }
                if (this.onChanged && (form !== oldForm))
                    this.onChanged(this, "form");
            };
            StaticDrawingElement.getTriangleCoordsForBox = function (x, y, width, height) {
                var coords = [];
                coords.push(new FibaEurope.Data.Coordinate(x + width / 2, y));
                coords.push(new FibaEurope.Data.Coordinate(x, y + height));
                coords.push(new FibaEurope.Data.Coordinate(x + width, y + height));
                return coords;
            };
            StaticDrawingElement.getTriangleCoordsForVector = function (pt1, pt2) {
                var coords = [];
                coords.push(new FibaEurope.Data.Coordinate(pt1.x, pt1.y));
                var h = Drawing.CurvedPathMaths.vector(pt1, pt2);
                var sqrt3 = Math.sqrt(3);
                var b = new Drawing.Point((-h.y) / sqrt3, h.x / sqrt3);
                coords.push(new FibaEurope.Data.Coordinate(pt2.x + b.x, pt2.y + b.y));
                b.invert();
                coords.push(new FibaEurope.Data.Coordinate(pt2.x + b.x, pt2.y + b.y));
                return coords;
            };
            StaticDrawingElement.prototype.setColor = function (color, drawing) {
                var oldColor = this.data.color;
                this.data.color = color;
                var colorStr = DrawingElementHelper.getColorString(color);
                this.displayElement.attr({ fill: colorStr });
                if (this.onChanged && color !== oldColor)
                    this.onChanged(this, "color");
            };
            StaticDrawingElement.prototype.setSize = function (width, height) {
                if (this.data.type !== FibaEurope.Data.staticElementType.area || !this.area)
                    return;
                width = Drawing.CurvedPathMaths.round(width, 2);
                height = Drawing.CurvedPathMaths.round(height, 2);
                var oldWidth = this.data.width;
                this.data.width = width;
                var oldHeight = this.data.height;
                this.data.height = height;
                if (this.data.form === FibaEurope.Data.staticElementForm.ellipse) {
                    var w2 = width / 2;
                    var h2 = height / 2;
                    this.area.attr({ cx: w2, cy: h2, rx: w2, ry: h2 });
                    if (this.hoverArea)
                        this.hoverArea.attr({ cx: w2, cy: h2, rx: w2, ry: h2 });
                    this.updateSizeThumbs(this.data.x, this.data.y, this.data.width, this.data.height);
                }
                else if (this.data.form === FibaEurope.Data.staticElementForm.rectangle) {
                    this.area.attr({ width: width, height: height });
                    if (this.hoverArea)
                        this.hoverArea.attr({ width: width, height: height });
                    this.updateSizeThumbs(this.data.x, this.data.y, this.data.width, this.data.height);
                }
                else if (this.data.coords && oldWidth != 0 && oldHeight != 0) {
                    // scale factors
                    var sw = width / oldWidth;
                    var sh = height / oldHeight;
                    // scale origin (left/top)
                    var sox = this.data.x;
                    var soy = this.data.y;
                    // scale coordinates
                    for (var i = 0; i < this.data.coords.length; i++) {
                        var x = (this.data.coords[i].x - sox) * sw + sox;
                        var y = (this.data.coords[i].y - soy) * sh + soy;
                        this.data.coords[i].x = Drawing.CurvedPathMaths.round(x, 2);
                        this.data.coords[i].y = Drawing.CurvedPathMaths.round(y, 2);
                    }
                    this.updatePath();
                    this.updateCoordThumbs(this.data.coords, 0, 0);
                }
                if (this.onChanged && (width !== oldWidth || height !== oldHeight))
                    this.onChanged(this, "size");
            };
            StaticDrawingElement.prototype.getHoverElement = function (paper, touchMode) {
                if (!this.hoverElement) {
                    if (this.data.type === FibaEurope.Data.staticElementType.text) {
                        var bb = this.displayElement.getBBox();
                        this.hoverElement = paper.rect(0, 0, bb.width, bb.height + 15);
                        // if the element is not rendered onscreen the bbox is sometimes empty
                        // then try again in 0,5 sek.
                        if (bb.width < 1 || bb.height < 1) {
                            var elDisp = this.displayElement;
                            var elHover = this.hoverElement;
                            setTimeout(function () {
                                var bb = elDisp.getBBox();
                                elHover.attr({ width: bb.width, height: bb.height + 15 });
                            }, 500);
                        }
                    }
                    else if (this.data.type === FibaEurope.Data.staticElementType.area) {
                        if (this.data.form === FibaEurope.Data.staticElementForm.ellipse) {
                            this.hoverArea = paper.ellipse(this.data.width / 2, this.data.height / 2, this.data.width / 2, this.data.height / 2);
                            this.hoverElement = paper.group(this.hoverArea);
                        }
                        else if (this.data.form === FibaEurope.Data.staticElementForm.rectangle) {
                            this.hoverArea = paper.rect(0, 0, this.data.width, this.data.height);
                            this.hoverElement = paper.group(this.hoverArea);
                        }
                        else if (this.data.coords && this.data.coords.length >= 3) {
                            this.hoverArea = paper.path(LineDrawingElement.getPathString(this.data.coords, false) + " z");
                            this.hoverElement = paper.group(this.hoverArea);
                        }
                    }
                    if (this.hoverElement) {
                        if (!this.data.coords)
                            this.hoverElement.transform("translate(" + this.data.x + "," + this.data.y + ")");
                        this.hoverElement.attr({ fill: "transparent" });
                    }
                }
                return this.hoverElement;
            };
            StaticDrawingElement.prototype.move = function (dx, dy) {
                this.data.x = Drawing.CurvedPathMaths.round(this.data.x + dx, 2);
                this.data.y = Drawing.CurvedPathMaths.round(this.data.y + dy, 2);
                if (this.data.coords) {
                    // update coords
                    for (var i = 0; i < this.data.coords.length; i++) {
                        this.data.coords[i].x = Drawing.CurvedPathMaths.round(this.data.coords[i].x + dx, 2);
                        this.data.coords[i].y = Drawing.CurvedPathMaths.round(this.data.coords[i].y + dy, 2);
                    }
                    this.updatePath();
                    this.updateCoordThumbs(this.data.coords, 0, 0);
                }
                else {
                    if (this.displayElement)
                        this.displayElement.transform("translate(" + this.data.x + "," + this.data.y + ")");
                    if (this.hoverElement)
                        this.hoverElement.transform("translate(" + this.data.x + "," + this.data.y + ")");
                    this.updateSizeThumbs(this.data.x, this.data.y, this.data.width, this.data.height);
                }
                if (this.onChanged && (dx !== 0 || dy !== 0))
                    this.onChanged(this, "moved");
            };
            StaticDrawingElement.prototype.updateSizeThumbs = function (x, y, width, height) {
                if (this.thumbs) {
                    for (var i = 0; i < this.thumbs.length; i++) {
                        var tx = x;
                        var ty = y;
                        if (i === 1 || i === 2)
                            tx += width;
                        if (i === 2 || i === 3)
                            ty += height;
                        this.thumbs[i].setPos(tx, ty);
                    }
                }
            };
            StaticDrawingElement.prototype.updateCoordThumbs = function (coords, dx, dy) {
                if (this.thumbs) {
                    for (var i = 0; i < coords.length && i < this.thumbs.length; i++)
                        this.thumbs[i].setPos(coords[i].x + dx, coords[i].y + dy);
                }
            };
            StaticDrawingElement.prototype.updatePath = function () {
                if (this.data.coords) {
                    var pathString = LineDrawingElement.getPathString(this.data.coords, false) + " z";
                    if (this.area)
                        this.area.attr({ d: pathString });
                    if (this.hoverArea)
                        this.hoverArea.attr({ d: pathString });
                }
            };
            StaticDrawingElement.prototype.tmpMoveStart = function (x, y) {
                var _this = this;
                this.tmpMovePt = new Drawing.Point(x, y);
                this.longPressTimer = setTimeout(function () {
                    _this.longPressTimer = null;
                    if (_this.onLongPress) {
                        if (_this.onLongPress(_this, x, y))
                            return;
                    }
                    if (_this.data.type === FibaEurope.Data.staticElementType.text) {
                        _this.editText();
                    }
                    else if (_this.data.type === FibaEurope.Data.staticElementType.area) {
                        _this.editForm();
                    }
                }, Thumb.longPressTimeout);
                if (this.onStartEdit)
                    this.onStartEdit(this);
            };
            StaticDrawingElement.prototype.tmpMoveTo = function (x, y) {
                this.tmpMoveVt = this.tmpMovePt.vectorTo(x, y);
                if (this.longPressTimer && this.tmpMoveVt.length() > 1.5) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
                if (this.data.coords) {
                    if (this.displayElement)
                        this.displayElement.transform("translate(" + this.tmpMoveVt.x + "," + this.tmpMoveVt.y + ")");
                    this.updateCoordThumbs(this.data.coords, this.tmpMoveVt.x, this.tmpMoveVt.y);
                }
                else {
                    if (this.displayElement)
                        this.displayElement.transform("translate(" + (this.data.x + this.tmpMoveVt.x) + "," + (this.data.y + this.tmpMoveVt.y) + ")");
                    this.updateSizeThumbs(this.data.x + this.tmpMoveVt.x, this.data.y + this.tmpMoveVt.y, this.data.width, this.data.height);
                }
            };
            StaticDrawingElement.prototype.tmpMoveStop = function (apply) {
                if (this.longPressTimer) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
                if (apply && this.tmpMoveVt) {
                    this.move(this.tmpMoveVt.x, this.tmpMoveVt.y);
                }
                else {
                    this.move(0, 0);
                }
                if (this.data.coords) {
                    if (this.displayElement)
                        this.displayElement.transform("");
                }
                this.tmpMoveVt = null;
                if (this.onEndEdit)
                    this.onEndEdit(this);
            };
            StaticDrawingElement.prototype.tmpSize = function (x1, y1, x2, y2) {
                var rect = Drawing.Rect.fromPoints(new Drawing.Point(x1, y1), new Drawing.Point(x2, y2));
                if (this.displayElement) {
                    this.displayElement.transform("translate(" + rect.x + "," + rect.y + ")");
                    if (this.data.form === FibaEurope.Data.staticElementForm.ellipse) {
                        var w2 = rect.width / 2;
                        var h2 = rect.height / 2;
                        this.area.attr({ cx: w2, cy: h2, rx: w2, ry: h2 });
                    }
                    else if (this.data.form === FibaEurope.Data.staticElementForm.rectangle) {
                        this.area.attr({ width: rect.width, height: rect.height });
                    }
                }
            };
            StaticDrawingElement.prototype.setSelected = function (selected, paper, touchMode) {
                var _this = this;
                if (this.selected === selected)
                    return;
                this.selected = selected;
                if (!selected) {
                    if (this.thumbs) {
                        this.thumbs.forEach(function (t) { return t.remove(); });
                        this.thumbs = null;
                    }
                }
                else if (paper) {
                    this.thumbs = new Array();
                    if (this.data.type === FibaEurope.Data.staticElementType.text) {
                        var moveThumb = new Thumb(thumbType.move, this.data.x, this.data.y, paper, touchMode);
                        moveThumb.onMoveStart = function (x, y) { return _this.tmpMoveStart(x, y); };
                        moveThumb.onMoveTo = function (x, y) { return _this.tmpMoveTo(x, y); };
                        moveThumb.onMoveStop = function (apply) { return _this.tmpMoveStop(apply); };
                        this.thumbs.push(moveThumb);
                    }
                    else if (this.data.type === FibaEurope.Data.staticElementType.area) {
                        if (this.data.coords) {
                            for (var i = 0; i < this.data.coords.length; i++) {
                                var pos = this.data.coords[i];
                                var thumb = new Thumb(thumbType.movePointer, pos.x, pos.y, paper, touchMode);
                                thumb.index = i;
                                thumb.onMoveStart = function (x, y) {
                                    _this.tmpMovePt = new Drawing.Point(x, y);
                                    if (_this.hoverElement)
                                        _this.hoverElement.attr({ cursor: "pointer" });
                                    if (_this.onStartEdit)
                                        _this.onStartEdit(_this);
                                };
                                thumb.onMoveTo = function (x, y, idx) {
                                    _this.tmpMoveVt = _this.tmpMovePt.vectorTo(x, y);
                                    _this.data.coords[idx].x = x;
                                    _this.data.coords[idx].y = y;
                                    _this.updatePath();
                                };
                                thumb.onMoveStop = function (apply, x, y, idx) {
                                    _this.tmpMovePt = null;
                                    if (apply) {
                                        _this.data.coords[idx].x = Drawing.CurvedPathMaths.round(x, 2);
                                        _this.data.coords[idx].y = Drawing.CurvedPathMaths.round(y, 2);
                                    }
                                    _this.updatePath();
                                    // updata bounding
                                    if (_this.displayElement) {
                                        var bbox = Drawing.Rect.fromPoints.apply(Drawing.Rect, _this.data.coords);
                                        _this.data.x = Drawing.CurvedPathMaths.round(bbox.x, 2);
                                        _this.data.y = Drawing.CurvedPathMaths.round(bbox.y, 2);
                                        _this.data.width = Drawing.CurvedPathMaths.round(bbox.width, 2);
                                        _this.data.height = Drawing.CurvedPathMaths.round(bbox.height, 2);
                                    }
                                    if (_this.hoverElement)
                                        _this.hoverElement.attr({ cursor: null });
                                    if (_this.onEndEdit)
                                        _this.onEndEdit(_this);
                                    if (_this.onChanged && _this.tmpMoveVt && (_this.tmpMoveVt.x !== 0 || _this.tmpMoveVt.y !== 0))
                                        _this.onChanged(_this, "point moved");
                                    _this.tmpMoveVt = null;
                                };
                                this.thumbs.push(thumb);
                            }
                        }
                        else {
                            var tlThumb = new Thumb(thumbType.size, this.data.x, this.data.y, paper, touchMode).setSizeOrientation(thumbSizeOrientation.topLeft);
                            var trThumb = new Thumb(thumbType.size, this.data.x + this.data.width, this.data.y, paper, touchMode).setSizeOrientation(thumbSizeOrientation.topRight);
                            var brThumb = new Thumb(thumbType.size, this.data.x + this.data.width, this.data.y + this.data.height, paper, touchMode).setSizeOrientation(thumbSizeOrientation.bottomRight);
                            var blThumb = new Thumb(thumbType.size, this.data.x, this.data.y + this.data.height, paper, touchMode).setSizeOrientation(thumbSizeOrientation.bottomLeft);
                            tlThumb.onMoveStart = function (x, y) { if (_this.onStartEdit)
                                _this.onStartEdit(_this); };
                            trThumb.onMoveStart = function (x, y) { if (_this.onStartEdit)
                                _this.onStartEdit(_this); };
                            brThumb.onMoveStart = function (x, y) { if (_this.onStartEdit)
                                _this.onStartEdit(_this); };
                            blThumb.onMoveStart = function (x, y) { if (_this.onStartEdit)
                                _this.onStartEdit(_this); };
                            tlThumb.onMoveTo = function (x, y) { _this.tmpSize(x, y, brThumb.x, brThumb.y); blThumb.setX(x); trThumb.setY(y); };
                            trThumb.onMoveTo = function (x, y) { _this.tmpSize(x, y, blThumb.x, blThumb.y); brThumb.setX(x); tlThumb.setY(y); };
                            brThumb.onMoveTo = function (x, y) { _this.tmpSize(x, y, tlThumb.x, tlThumb.y); trThumb.setX(x); blThumb.setY(y); };
                            blThumb.onMoveTo = function (x, y) { _this.tmpSize(x, y, trThumb.x, trThumb.y); tlThumb.setX(x); brThumb.setY(y); };
                            tlThumb.onMoveStop = function (apply, x, y) { return _this.onTmpSizeStop(apply, x, y, brThumb.x, brThumb.y); };
                            trThumb.onMoveStop = function (apply, x, y) { return _this.onTmpSizeStop(apply, x, y, blThumb.x, blThumb.y); };
                            brThumb.onMoveStop = function (apply, x, y) { return _this.onTmpSizeStop(apply, x, y, tlThumb.x, tlThumb.y); };
                            blThumb.onMoveStop = function (apply, x, y) { return _this.onTmpSizeStop(apply, x, y, trThumb.x, trThumb.y); };
                            this.thumbs.push(tlThumb);
                            this.thumbs.push(trThumb);
                            this.thumbs.push(brThumb);
                            this.thumbs.push(blThumb);
                        }
                    }
                }
                return this.thumbs;
            };
            StaticDrawingElement.prototype.onTmpSizeStop = function (apply, x1, y1, x2, y2) {
                if (apply) {
                    var rect = Drawing.Rect.fromPoints(new Drawing.Point(x1, y1), new Drawing.Point(x2, y2));
                    this.move(rect.x - this.data.x, rect.y - this.data.y);
                    this.setSize(rect.width, rect.height);
                }
                else {
                    this.move(0, 0);
                    this.setSize(this.data.width, this.data.height);
                }
                if (this.onEndEdit)
                    this.onEndEdit(this);
            };
            StaticDrawingElement.prototype.isSelected = function () {
                return this.selected;
            };
            StaticDrawingElement.createTextInputDialog = function (text, onOk) {
                var lastClick = Date.now();
                // create a dialog with a textfield
                var textEl = document.createElement("textarea");
                textEl.setAttribute("style", DrawingElementDialogHelper.flex(1));
                textEl.addEventListener("blur", function () {
                    if (Date.now() - lastClick > 200)
                        onOk(textEl.value);
                    else
                        textEl.focus();
                });
                var innerDiv = document.createElement("div");
                innerDiv.setAttribute("style", DrawingElementDialogHelper.displayFlex + "width: 60%; height: 200px; background-color: white; border:2px solid #EDEDED; border-radius: 5px; padding:0.5em;");
                innerDiv.appendChild(textEl);
                var dialogEl = document.createElement("div");
                dialogEl.setAttribute("style", DrawingElementDialogHelper.baseDialogBackgroundStyle);
                dialogEl.appendChild(innerDiv);
                if (text)
                    textEl.value = text;
                return dialogEl;
            };
            StaticDrawingElement.createAreaFormSelectDialog = function (form, color, onOk) {
                var data = [
                    FibaEurope.Data.staticElementForm.ellipse,
                    FibaEurope.Data.staticElementForm.rectangle,
                    FibaEurope.Data.staticElementForm.triangle
                ];
                var lastClick = Date.now();
                // create a dialog
                var dialogEl = document.createElement("div");
                dialogEl.setAttribute("style", DrawingElementDialogHelper.baseDialogBackgroundStyle);
                dialogEl.addEventListener("click", function (e) {
                    e.preventDefault();
                    if (Date.now() - lastClick > DrawingElementDialogHelper.bufferTimeCancelClick)
                        onOk(form);
                });
                var styleEl = document.createElement("style");
                styleEl.innerText = DrawingElementDialogHelper.getBaseStyle("10em");
                dialogEl.appendChild(styleEl);
                var innerDiv = document.createElement("div");
                innerDiv.classList.add("selectionBox");
                dialogEl.appendChild(innerDiv);
                for (var i = 0; i < data.length; i++) {
                    var curForm = data[i];
                    var formDiv = document.createElement("div");
                    if (curForm === form)
                        formDiv.classList.add("selectionItemSelected");
                    else
                        formDiv.classList.add("selectionItem");
                    var svgEl = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                    svgEl.setAttribute("width", "3em");
                    svgEl.setAttribute("height", "3em");
                    formDiv.appendChild(svgEl);
                    var drawing = new FibaEurope.Drawing.SvgDrawing(Snap(svgEl));
                    var statEl = new FibaEurope.Data.StaticElement();
                    statEl.type = FibaEurope.Data.staticElementType.area;
                    statEl.form = curForm;
                    statEl.color = color;
                    statEl.x = 2;
                    statEl.y = 3;
                    statEl.width = statEl.height = 26;
                    drawing.drawArea(statEl, true);
                    formDiv.areaForm = curForm;
                    formDiv.addEventListener("click", function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        if (Date.now() - lastClick > DrawingElementDialogHelper.bufferTimeOkClick)
                            onOk(e.currentTarget.areaForm);
                    });
                    innerDiv.appendChild(formDiv);
                }
                return dialogEl;
            };
            return StaticDrawingElement;
        }());
        Drawing.StaticDrawingElement = StaticDrawingElement;
        var LineDrawingElement = (function () {
            function LineDrawingElement(data, displayElement) {
                this.data = data;
                this.displayElement = displayElement;
                this.isInEditMode = false;
                this.canChangeColor = true;
                this.data = data.clone();
            }
            LineDrawingElement.prototype.addPoint = function (x, y) {
                this.data.addCoordinate(x, y);
                // redraw
                this.hideMarker();
                this.updatePath();
                this.resetMarker();
                // callback
                if (this.onCoordCountChanged)
                    this.onCoordCountChanged(this, this.data.coords.length, this.data.coords.length - 1);
                if (this.onChanged)
                    this.onChanged(this, "point added");
            };
            LineDrawingElement.prototype.getPointDistance = function (x, y, breakOnDist) {
                if (!this.hoverElement)
                    return;
                if (typeof breakOnDist === "number")
                    breakOnDist = breakOnDist * breakOnDist;
                var targetPoint = new Drawing.Point(x, y);
                // search segment where to insert
                var totalLength = this.hoverElement.getTotalLength();
                var partLength = 5;
                var length = 0;
                var min = { length: 0, distance: Number.MAX_VALUE, x: null, y: null };
                while (length < totalLength) {
                    var pointOnPath = this.hoverElement.getPointAtLength(length);
                    var dx = pointOnPath.x - targetPoint.x;
                    var dy = pointOnPath.y - targetPoint.y;
                    var distance = dx * dx + dy * dy;
                    if (distance < min.distance) {
                        min.distance = distance;
                        min.length = length;
                        min.x = pointOnPath.x;
                        min.y = pointOnPath.y;
                        if (typeof breakOnDist === "number" && distance < breakOnDist)
                            break;
                    }
                    length += partLength;
                }
                if (min.distance !== Number.MAX_VALUE)
                    min.distance = Math.sqrt(min.distance);
                return min;
            };
            LineDrawingElement.prototype.insertPoint = function (x, y) {
                if (!this.hoverElement)
                    return;
                var min = this.getPointDistance(x, y);
                // search position where to insert
                var insertIdx = -1;

                for (var z = 0; z < this.data.coords.length; z++) {
                    var coord = this.data.coords[z];

                    //distance of existing coord is bigger than distance of new point => insert before!
                    if (this.getPointDistance(coord.x, coord.y).length > min.length) {
                        insertIdx = z;
                        break;
                    }
                }

                // console.log("segment " + segmentIdx + " => insert at " + insertIdx);
                if (insertIdx < 1)
                    return;
                // insert coordinate
                this.data.insertCoordinate(insertIdx, x, y);
                // redraw
                this.hideMarker();
                this.updatePath();
                this.resetMarker();
                // callback
                if (this.onCoordCountChanged)
                    this.onCoordCountChanged(this, this.data.coords.length, this.data.coords.length - 1);
                if (this.onChanged)
                    this.onChanged(this, "point inserted");
            };
            LineDrawingElement.prototype.removePoint = function (idx) {
                // remove in data
                this.data.removeCoordinate(idx);
                // remove thumb
                var thumb;
                if (this.thumbs) {
                    thumb = this.thumbs[idx];
                    thumb.remove();
                    this.thumbs.splice(idx, 1);
                    for (var i = idx; i < this.thumbs.length; i++)
                        this.thumbs[i].index = i;
                }
                // redraw
                this.hideMarker();
                this.updatePath();
                this.resetMarker();
                // callback
                if (this.onCoordCountChanged)
                    this.onCoordCountChanged(this, this.data.coords.length, this.data.coords.length + 1);
                if (this.onChanged)
                    this.onChanged(this, "point removed");
                return true;
            };
            LineDrawingElement.prototype.setInterpolated = function (interpolated) {
                var oldInterpolated = this.data.curved;
                this.data.curved = interpolated;
                // redraw
                this.hideMarker();
                this.move(1, 1);
                this.move(-1, -1);
                this.resetMarker();
                if (this.onChanged && interpolated !== oldInterpolated)
                    this.onChanged(this, "interpolation");
            };
            LineDrawingElement.prototype.setColor = function (color, drawing) {
                var oldColor = this.data.color;
                this.data.color = color;
                if (this.displayElement) {
                    var colorStr = DrawingElementHelper.getColorString(color);
                    this.displayElement.attr({ stroke: colorStr });
                    if (drawing) {
                        if (this.data.type === FibaEurope.Data.lineElementType.movement || this.data.type === FibaEurope.Data.lineElementType.dribbling || this.data.type === FibaEurope.Data.lineElementType.passing) {
                            this.displayElement.attr({ markerEnd: drawing.getMarkerArrow(this.data.color) });
                        }
                        else if (this.data.type === FibaEurope.Data.lineElementType.screen) {
                            this.displayElement.attr({ markerEnd: drawing.getMarkerLine(this.data.color) });
                        }
                    }
                }
                if (this.onChanged && color !== oldColor)
                    this.onChanged(this, "color");
            };
            /*
            editLineType() {
                if (this.isInEditMode) return;
                this.isInEditMode = true;
                if (this.onStartEdit) this.onStartEdit(this);
    
                var dialogEl = LineDrawingElement.createLineTypeSelectDialog(this.data.type,
                    (lineType) => {
                        this.setLineType(lineType);
                        dialogEl.parentElement.removeChild(dialogEl);
                        this.isInEditMode = false;
                        if (this.onEndEdit) this.onEndEdit(this);
                    });
    
                document.body.appendChild(dialogEl);
            }
    
            setLineType(lineType: Data.lineElementType) {
                if (this.data.type === lineType) return;
    
                this.data.type = lineType;
    
                // redraw
                this.hideMarker();
                this.move(1, 1);
                this.move(-1, -1);
                this.resetMarker();
    
                if (this.onChanged) this.onChanged(this, "type");
            }
            */
            LineDrawingElement.prototype.getHoverElement = function (paper, touchMode) {
                if (!this.hoverElement) {
                    this.hoverElement = paper.path(LineDrawingElement.getPathString(this.data.coords, this.data.curved));
                    this.hoverElement.attr({ fill: "none", stroke: "transparent", strokeWidth: touchMode ? 12 : 8 });
                }
                return this.hoverElement;
            };
            LineDrawingElement.prototype.move = function (dx, dy) {
                for (var i = 0; i < this.data.coords.length; i++) {
                    this.data.coords[i].x = Drawing.CurvedPathMaths.round(this.data.coords[i].x + dx, 2);
                    this.data.coords[i].y = Drawing.CurvedPathMaths.round(this.data.coords[i].y + dy, 2);
                    if (this.thumbs && i < this.thumbs.length)
                        this.thumbs[i].setPos(this.data.coords[i].x, this.data.coords[i].y);
                }
                this.updatePath();
                if (this.onChanged && (dx !== 0 || dy !== 0))
                    this.onChanged(this, "moved");
            };
            LineDrawingElement.prototype.tmpMoveStart = function (x, y) {
                var _this = this;
                this.tmpMovePt = new Drawing.Point(x, y);
                this.hideMarker();
                if (this.data.type !== FibaEurope.Data.lineElementType.free) {
                    this.longPressTimer = setTimeout(function () {
                        _this.longPressTimer = null;
                        if (_this.onLongPress) {
                            if (_this.onLongPress(_this, x, y))
                                return;
                        }
                        _this.insertPoint(x, y);
                    }, Thumb.longPressTimeout);
                }
                if (this.onStartEdit)
                    this.onStartEdit(this);
            };
            LineDrawingElement.prototype.tmpMoveTo = function (x, y) {
                this.tmpMoveVt = this.tmpMovePt.vectorTo(x, y);
                if (this.longPressTimer && this.tmpMoveVt.length() > 1.5) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
                if (this.displayElement)
                    this.displayElement.transform("translate(" + this.tmpMoveVt.x + "," + this.tmpMoveVt.y + ")");
                if (this.thumbs) {
                    for (var i = 0; i < this.data.coords.length && i < this.thumbs.length; i++)
                        this.thumbs[i].setPos(this.data.coords[i].x + this.tmpMoveVt.x, this.data.coords[i].y + this.tmpMoveVt.y);
                }
            };
            LineDrawingElement.prototype.tmpMoveStop = function (apply) {
                if (this.longPressTimer) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
                this.tmpMovePt = null;
                if (apply && this.tmpMoveVt) {
                    this.move(this.tmpMoveVt.x, this.tmpMoveVt.y);
                }
                console.log("CWI displayElement: " + this.displayElement);
                if (this.displayElement)
                    this.displayElement.transform("");
                this.resetMarker();
                this.tmpMoveVt = null;
                if (this.onEndEdit)
                    this.onEndEdit(this);
            };
            LineDrawingElement.prototype.hideMarker = function () {
                if (this.tmpMoveMarker && this.tmpMoveMarker !== "none")
                    return;
                // Snap.svg problem: attr("marker-end") not working correct
                this.tmpMoveMarker = this.displayElement.node.style.markerEnd;
                this.displayElement.attr({ markerEnd: null });
            };
            LineDrawingElement.prototype.resetMarker = function () {
                if (this.displayElement) {
                    if (this.tmpMoveMarker && this.tmpMoveMarker !== "none") {
                        this.displayElement.node.style.markerEnd = this.tmpMoveMarker;
                        this.tmpMoveMarker = null;
                    }
                }
            };
            LineDrawingElement.prototype.setSelected = function (selected, paper, touchMode) {
                var _this = this;
                if (this.selected === selected)
                    return;
                this.selected = selected;
                if (!selected) {
                    if (this.thumbs) {
                        this.thumbs.forEach(function (t) { return t.remove(); });
                        this.thumbs = null;
                    }
                }
                else if (paper) {
                    this.thumbs = new Array();
                    for (var i = 0; i < this.data.coords.length; i++) {
                        var pos = this.data.coords[i];
                        if (this.data.type !== FibaEurope.Data.lineElementType.free) {
                            var thumb = new Thumb(thumbType.movePointer, pos.x, pos.y, paper, touchMode);
                            thumb.index = i;
                            thumb.onMoveStart = function (x, y) {
                                _this.hideMarker();
                                _this.tmpMovePt = new Drawing.Point(x, y);
                                if (_this.hoverElement)
                                    _this.hoverElement.attr({ cursor: "pointer" });
                                if (_this.onStartEdit)
                                    _this.onStartEdit(_this);
                            };
                            thumb.onMoveTo = function (x, y, idx) {
                                _this.tmpMoveVt = _this.tmpMovePt.vectorTo(x, y);
                                _this.data.coords[idx].x = x;
                                _this.data.coords[idx].y = y;
                                _this.updatePath();
                            };
                            thumb.onMoveStop = function (apply, x, y, idx) {
                                _this.tmpMovePt = null;
                                if (apply) {
                                    _this.data.coords[idx].x = Drawing.CurvedPathMaths.round(x, 2);
                                    _this.data.coords[idx].y = Drawing.CurvedPathMaths.round(y, 2);
                                }
                                _this.updatePath();
                                _this.resetMarker();
                                if (_this.hoverElement)
                                    _this.hoverElement.attr({ cursor: null });
                                if (_this.onEndEdit)
                                    _this.onEndEdit(_this);
                                if (_this.onChanged && _this.tmpMoveVt && (_this.tmpMoveVt.x !== 0 || _this.tmpMoveVt.y !== 0))
                                    _this.onChanged(_this, "point moved");
                                _this.tmpMoveVt = null;
                            };
                            if (i > 0 && i < this.data.coords.length - 1) {
                                thumb.onLongPress = function (x, y, idx) {
                                    if (_this.onLongPress) {
                                        if (_this.onLongPress(_this, x, y))
                                            return true;
                                    }
                                    return _this.removePoint(idx);
                                };
                            }
                            this.thumbs.push(thumb);
                        }
                        else {
                            var thumb = new Thumb(thumbType.move, pos.x, pos.y, paper, touchMode);
                            thumb.index = i;
                            thumb.onMoveStart = function (x, y) { return _this.tmpMoveStart(x, y); };
                            thumb.onMoveTo = function (x, y) { return _this.tmpMoveTo(x, y); };
                            thumb.onMoveStop = function (apply) { return _this.tmpMoveStop(apply); };
                            this.thumbs.push(thumb);
                            // a free-line has only the startpoint
                            i = this.data.coords.length;
                        }
                    }
                }
                return this.thumbs;
            };
            LineDrawingElement.prototype.isSelected = function () {
                return this.selected;
            };
            LineDrawingElement.prototype.updatePath = function () {
                var pathString;
                if (this.data.type === FibaEurope.Data.lineElementType.dribbling && !this.tmpMovePt) {
                    pathString = LineDrawingElement.getPathStringWithWaves(this.data.coords, this.data.curved);
                }
                else {
                    pathString = LineDrawingElement.getPathString(this.data.coords, this.data.curved);
                }
                if (this.displayElement)
                    this.displayElement.attr({ d: pathString });
                if (this.hoverElement) {
                    if (this.data.type === FibaEurope.Data.lineElementType.dribbling)
                        pathString = LineDrawingElement.getPathString(this.data.coords, this.data.curved);
                    this.hoverElement.attr({ d: pathString });
                }
            };
            LineDrawingElement.getPathString = function (coords, interpolated) {
                if (coords.length < 1)
                    return null;
                var pathString = "M " + coords[0].x + "," + coords[0].y;
                if (interpolated && coords.length > 2) {
                    var pathPoints = Drawing.CurvedPathMaths.getPathPoints(coords);
                    for (var i = 2; i < pathPoints.length; i = i + 2) {
                        pathString += " Q " + pathPoints[i - 1].x + "," + pathPoints[i - 1].y + " " + pathPoints[i].x + "," + pathPoints[i].y;
                    }
                }
                else {
                    for (var i = 1; i < coords.length; i++) {
                        pathString += " " + coords[i].x + "," + coords[i].y;
                    }
                }
                return pathString;
            };
            LineDrawingElement.getPathStringWithWaves = function (coords, interpolated) {
                var length = 5;
                var allPathPoints = new Array();
                if (!interpolated || coords.length === 2) {
                    allPathPoints.push(coords[0]);
                    var last;
                    var next;
                    var cp;
                    for (var k = 0; k < coords.length - 1; k++) {
                        var lineLength = Drawing.CurvedPathMaths.distance(coords[k], coords[k + 1]);
                        dashCount = Math.round(lineLength / length);
                        last = Drawing.CurvedPathMaths.segment(coords[k], coords[k + 1], (lineLength - (length * (dashCount - 1))) / lineLength);
                        allPathPoints.push(last);
                        for (i = 1; i < dashCount - ((k < coords.length - 2) ? 1 : 2); i++) {
                            next = Drawing.CurvedPathMaths.segment(coords[k], coords[k + 1], (i + 1) * length / lineLength);
                            cp = Drawing.CurvedPathMaths.move(Drawing.CurvedPathMaths.segment(last, next, 0.5), Drawing.CurvedPathMaths.rotate(Drawing.CurvedPathMaths.vector(last, next), !(i % 2) ? 90 : -90));
                            allPathPoints.push(cp);
                            allPathPoints.push(next);
                            last = next;
                        }
                        allPathPoints.push(coords[k + 1]);
                    }
                }
                else {
                    var pathPoints = Drawing.CurvedPathMaths.getPathPoints(coords);
                    var curvePath = new Drawing.CurvePath(pathPoints);
                    var dashCount = Math.round(curvePath.path_length / length);
                    // Zusammensetzen der Arrays zur Kurven Berechnung und Wellenlinien Berechung
                    var allPathPoints = new Array();
                    allPathPoints.push(pathPoints[0]);
                    last = curvePath.getPoint(length, null);
                    var next;
                    var cp;
                    allPathPoints.push(last);
                    for (var i = 1; i < dashCount - 2; i++) {
                        next = curvePath.getPoint((i + 1) * length, null);
                        cp = Drawing.CurvedPathMaths.move(Drawing.CurvedPathMaths.segment(last, next, 0.5), Drawing.CurvedPathMaths.rotate(Drawing.CurvedPathMaths.vector(last, next), !(i % 2) ? 90 : -90));
                        allPathPoints.push(cp);
                        allPathPoints.push(next);
                        last = next;
                    }
                    allPathPoints.push(pathPoints[pathPoints.length - 1]);
                }
                // combine path string
                var pathString = "M " + allPathPoints[0].x + "," + allPathPoints[0].y + " " + allPathPoints[1].x + "," + allPathPoints[1].y + " ";
                for (var i = 3; i < allPathPoints.length; i = i + 2) {
                    pathString = pathString + "Q " + allPathPoints[i - 1].x + "," + allPathPoints[i - 1].y + " " + allPathPoints[i].x + "," + allPathPoints[i].y + " ";
                }
                pathString = pathString + "L " + allPathPoints[allPathPoints.length - 1].x + "," + allPathPoints[allPathPoints.length - 1].y;
                return pathString;
            };
            LineDrawingElement.drawLineTypeIcon = function (paper, lineType) {
                switch (lineType) {
                    case FibaEurope.Data.lineElementType.movement:
                        paper.line(5, 17, 25, 17).attr({ stroke: "black", strokeWidth: 2 });
                        paper.path("m 26,17 -5,-5 0,10 z").attr({ fill: "black", strokeWidth: 0 });
                        break;
                    case FibaEurope.Data.lineElementType.passing:
                        paper.line(5, 17, 25, 17).attr({ stroke: "black", strokeWidth: 2, strokeDasharray: "3,3" });
                        paper.path("m 26,17 -5,-5 0,10 z").attr({ fill: "black", strokeWidth: 0 });
                        break;
                    case FibaEurope.Data.lineElementType.dribbling:
                        paper.path("m 3,16.5 1,0 c 2,0 2,2 4,2 2,0 2,-2 4,-2 2,0 2,2 4,2 2,0 2,-2 4,-2 l 1,0").attr({ fill: "none", stroke: "black", strokeWidth: 2 });
                        paper.path("m 26,17 -5,-5 0,10 z").attr({ fill: "black", strokeWidth: 0 });
                        break;
                    case FibaEurope.Data.lineElementType.screen:
                        paper.line(5, 17, 25, 17).attr({ stroke: "black", strokeWidth: 2 });
                        paper.line(25, 12, 25, 22).attr({ stroke: "black", strokeWidth: 2 });
                        break;
                    case FibaEurope.Data.lineElementType.line:
                        paper.line(5, 17, 25, 17).attr({ stroke: "black", strokeWidth: 2 });
                }
            };
            LineDrawingElement.createLineTypeSelectDialog = function (lineType, onOk) {
                var data = [
                    FibaEurope.Data.lineElementType.movement,
                    FibaEurope.Data.lineElementType.passing,
                    FibaEurope.Data.lineElementType.dribbling,
                    FibaEurope.Data.lineElementType.screen,
                    FibaEurope.Data.lineElementType.line
                ];
                var lastClick = Date.now();
                // create a dialog
                var dialogEl = document.createElement("div");
                dialogEl.setAttribute("style", DrawingElementDialogHelper.baseDialogBackgroundStyle);
                dialogEl.addEventListener("click", function (e) {
                    e.preventDefault();
                    if (Date.now() - lastClick > DrawingElementDialogHelper.bufferTimeCancelClick)
                        onOk(lineType);
                });
                var styleEl = document.createElement("style");
                styleEl.innerText = DrawingElementDialogHelper.getBaseStyle("22em");
                dialogEl.appendChild(styleEl);
                var innerDiv = document.createElement("div");
                innerDiv.classList.add("selectionBox");
                dialogEl.appendChild(innerDiv);
                for (var i = 0; i < data.length; i++) {
                    var curLineType = data[i];
                    var lineTypeDiv = document.createElement("div");
                    if (curLineType === lineType)
                        lineTypeDiv.classList.add("selectionItemSelected");
                    else
                        lineTypeDiv.classList.add("selectionItem");
                    var svgEl = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                    svgEl.setAttribute("width", "3em");
                    svgEl.setAttribute("height", "3em");
                    lineTypeDiv.appendChild(svgEl);
                    var drawing = new FibaEurope.Drawing.SvgDrawing(Snap(svgEl));
                    this.drawLineTypeIcon(drawing.paper, curLineType);
                    lineTypeDiv.lineType = curLineType;
                    lineTypeDiv.addEventListener("click", function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        if (Date.now() - lastClick > DrawingElementDialogHelper.bufferTimeOkClick)
                            onOk(e.currentTarget.lineType);
                    });
                    innerDiv.appendChild(lineTypeDiv);
                }
                return dialogEl;
            };
            return LineDrawingElement;
        }());
        Drawing.LineDrawingElement = LineDrawingElement;
        var DrawingElementHelper = (function () {
            function DrawingElementHelper() {
            }
            DrawingElementHelper.getColorString = function (color) {
                var colorStr;
                switch (color) {
                    case FibaEurope.Data.elementColor.yellow:
                        colorStr = "#ffff00";
                        break;
                    case FibaEurope.Data.elementColor.green:
                        colorStr = "#7ce86a";
                        break;
                    case FibaEurope.Data.elementColor.red:
                        colorStr = "#ff0000";
                        break;
                    case FibaEurope.Data.elementColor.grey:
                        colorStr = "#7f7f7f";
                        break;
                    case FibaEurope.Data.elementColor.black:
                        colorStr = "#000000";
                        break;
                    case FibaEurope.Data.elementColor.blue:
                        colorStr = "#5dd5ff";
                        break;
                    case FibaEurope.Data.elementColor.offence:
                        colorStr = "#003366";
                        break;
                    case FibaEurope.Data.elementColor.defence:
                        colorStr = "#58001d";
                        break;
                }
                return colorStr;
            };
            DrawingElementHelper.createColorSelectDialog = function (color, onOk) {
                var data = [
                    FibaEurope.Data.elementColor.offence,
                    FibaEurope.Data.elementColor.defence,
                    FibaEurope.Data.elementColor.black,
                    FibaEurope.Data.elementColor.grey,
                    FibaEurope.Data.elementColor.yellow,
                    FibaEurope.Data.elementColor.red,
                    FibaEurope.Data.elementColor.green,
                    FibaEurope.Data.elementColor.blue
                ];
                var lastClick = Date.now();
                // create a dialog
                var dialogEl = document.createElement("div");
                dialogEl.setAttribute("style", DrawingElementDialogHelper.baseDialogBackgroundStyle);
                dialogEl.addEventListener("click", function (e) {
                    e.preventDefault();
                    if (Date.now() - lastClick > DrawingElementDialogHelper.bufferTimeCancelClick)
                        onOk(color);
                });
                var styleEl = document.createElement("style");
                styleEl.innerText = DrawingElementDialogHelper.getBaseStyle("10em");
                dialogEl.appendChild(styleEl);
                var innerDiv = document.createElement("div");
                innerDiv.classList.add("selectionBox");
                dialogEl.appendChild(innerDiv);
                for (var i = 0; i < data.length; i++) {
                    var curColor = data[i];
                    var colorDiv = document.createElement("div");
                    if (curColor === color)
                        colorDiv.classList.add("selectionItemSelected");
                    else
                        colorDiv.classList.add("selectionItem");
                    var svgEl = FibaEurope.Drawing.SvgDrawing.createSvgElement(false, 30, 30);
                    svgEl.setAttribute("width", "3em");
                    svgEl.setAttribute("height", "3em");
                    colorDiv.appendChild(svgEl);
                    var drawing = new FibaEurope.Drawing.SvgDrawing(Snap(svgEl));
                    var statEl = new FibaEurope.Data.StaticElement();
                    statEl.type = FibaEurope.Data.staticElementType.area;
                    statEl.form = FibaEurope.Data.staticElementForm.ellipse;
                    statEl.color = curColor;
                    statEl.x = 2;
                    statEl.y = 3;
                    statEl.width = statEl.height = 26;
                    drawing.drawArea(statEl, true);
                    colorDiv.areaColor = curColor;
                    colorDiv.addEventListener("click", function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        if (Date.now() - lastClick > DrawingElementDialogHelper.bufferTimeOkClick)
                            onOk(e.currentTarget.areaColor);
                    });
                    innerDiv.appendChild(colorDiv);
                }
                return dialogEl;
            };
            return DrawingElementHelper;
        }());
        Drawing.DrawingElementHelper = DrawingElementHelper;
        var thumbType;
        (function (thumbType) {
            thumbType[thumbType["move"] = 0] = "move";
            thumbType[thumbType["movePointer"] = 1] = "movePointer";
            thumbType[thumbType["size"] = 2] = "size";
            thumbType[thumbType["rotation"] = 3] = "rotation";
            thumbType[thumbType["target"] = 4] = "target";
        })(thumbType = Drawing.thumbType || (Drawing.thumbType = {}));
        var thumbSizeOrientation;
        (function (thumbSizeOrientation) {
            thumbSizeOrientation[thumbSizeOrientation["none"] = 0] = "none";
            thumbSizeOrientation[thumbSizeOrientation["topLeft"] = 1] = "topLeft";
            thumbSizeOrientation[thumbSizeOrientation["topRight"] = 2] = "topRight";
            thumbSizeOrientation[thumbSizeOrientation["bottomRight"] = 3] = "bottomRight";
            thumbSizeOrientation[thumbSizeOrientation["bottomLeft"] = 4] = "bottomLeft";
        })(thumbSizeOrientation = Drawing.thumbSizeOrientation || (Drawing.thumbSizeOrientation = {}));
        var Thumb = (function () {
            function Thumb(type, x, y, paper, touchMode, rotationRadius) {
                this.type = type;
                this.x = x;
                this.y = y;
                this.rotationRadius = rotationRadius;
                switch (type) {
                    case thumbType.move:
                    case thumbType.movePointer:
                        var cursor = type === thumbType.movePointer ? "pointer" : "move";
                        this.displayElement = paper.circle(0, 0, 2).attr({ cursor: cursor, fill: "white", stroke: "red", strokeWidth: 1 });
                        this.hoverElement = paper.circle(0, 0, touchMode ? 8 : 6).attr({ cursor: cursor, fill: "transparent" });
                        break;
                    case thumbType.size:
                        this.displayElement = paper.rect(-3, -3, 6, 6).attr({ fill: "white", stroke: "red", strokeWidth: 1 });
                        ;
                        this.hoverElement = paper.rect(-5, -5, touchMode ? 12 : 10, touchMode ? 12 : 10).attr({ fill: "transparent" });
                        ;
                        break;
                    case thumbType.rotation:
                        if (!rotationRadius)
                            rotationRadius = 0;
                        this.displayElement = paper.path("m 0,-" + (rotationRadius + 3) + " l 3,6 -6,0 z").attr({ cursor: "pointer", fill: "white", stroke: "red", strokeWidth: 1 });
                        this.hoverElement = paper.circle(0, -(rotationRadius + 3), touchMode ? 12 : 10).attr({ cursor: "pointer", fill: "transparent" });
                        break;
                    case thumbType.target:
                        var circle = paper.circle(0, 0, 5.5).attr({ fill: "red" });
                        var white = paper.path("m 0,-4.5 c 0,0 -4,0 -4.5,4.5 l 4.5,0 z m 0,4.5 0,4.5 c 0,0 4,0 4.5,-4.5 z").attr({ fill: "White" });
                        this.displayElement = paper.group(circle, white);
                        break;
                }
                this.displayElement.addClass("hide-on-export");
                this.updateTransform();
            }
            Thumb.prototype.remove = function () {
                if (this.displayElement)
                    this.displayElement.remove();
                if (this.hoverElement) {
                    this.hoverElement.undrag();
                    this.hoverElement.remove();
                }
            };
            Thumb.prototype.setPos = function (x, y) {
                if (this.tmpMoveVt)
                    return this;
                this.x = x;
                this.y = y;
                this.updateTransform();
                return this;
            };
            Thumb.prototype.setX = function (x) {
                if (this.tmpMoveVt)
                    return this;
                this.x = x;
                this.updateTransform();
                return this;
            };
            Thumb.prototype.setY = function (y) {
                if (this.tmpMoveVt)
                    return this;
                this.y = y;
                this.updateTransform();
                return this;
            };
            Thumb.prototype.setRotation = function (rotation) {
                this.rotation = rotation;
                this.updateTransform();
                return this;
            };
            Thumb.prototype.setSizeOrientation = function (ori) {
                this.ori = ori;
                if (this.displayElement || this.hoverElement) {
                    switch (ori) {
                        case thumbSizeOrientation.topLeft:
                            if (this.displayElement)
                                this.displayElement.attr({ cursor: "nw-resize" });
                            if (this.hoverElement)
                                this.hoverElement.attr({ cursor: "nw-resize" });
                            break;
                        case thumbSizeOrientation.topRight:
                            if (this.displayElement)
                                this.displayElement.attr({ cursor: "ne-resize" });
                            if (this.hoverElement)
                                this.hoverElement.attr({ cursor: "ne-resize" });
                            break;
                        case thumbSizeOrientation.bottomRight:
                            if (this.displayElement)
                                this.displayElement.attr({ cursor: "se-resize" });
                            if (this.hoverElement)
                                this.hoverElement.attr({ cursor: "se-resize" });
                            break;
                        case thumbSizeOrientation.bottomLeft:
                            if (this.displayElement)
                                this.displayElement.attr({ cursor: "sw-resize" });
                            if (this.hoverElement)
                                this.hoverElement.attr({ cursor: "sw-resize" });
                            break;
                        default:
                            if (this.displayElement)
                                this.displayElement.attr({ cursor: "auto" });
                            if (this.hoverElement)
                                this.hoverElement.attr({ cursor: "auto" });
                            break;
                    }
                }
                return this;
            };
            Thumb.prototype.updateTransform = function () {
                var translate = "translate(" + this.x + "," + this.y + ")";
                var rotate = "";
                if (this.type === thumbType.rotation && this.rotation !== 0)
                    rotate = " rotate(" + this.rotation + ")";
                if (this.displayElement)
                    this.displayElement.transform(translate + rotate);
                if (this.hoverElement && !this.tmpMoveVt)
                    this.hoverElement.transform(translate + rotate);
            };
            Thumb.prototype.tmpMoveStart = function (x, y) {
                var _this = this;
                this.tmpMovePt = new Drawing.Point(x, y);
                this.tmpMoveOrgPt = new Drawing.Point(this.x, this.y);
                if (this.rotationRadius && this.type === thumbType.rotation) {
                    this.tmpMoveRotationVt = Drawing.CurvedPathMaths.rotate(new Drawing.Point(0, -this.rotationRadius), this.rotation);
                }
                if (this.onMoveStart)
                    this.onMoveStart(this.x, this.y, this.index);
                if (this.onLongPress) {
                    this.longPressTimer = setTimeout(function () {
                        _this.longPressTimer = null;
                        if (_this.onLongPress(_this.x, _this.y, _this.index))
                            _this.tmpMoveStop(false);
                    }, Thumb.longPressTimeout);
                }
            };
            Thumb.prototype.tmpMoveTo = function (x, y) {
                if (!this.tmpMovePt)
                    return;
                this.tmpMoveVt = this.tmpMovePt.vectorTo(x, y);
                if (this.longPressTimer && this.tmpMoveVt.length() > 1.5) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
                var tx = this.tmpMoveOrgPt.x + this.tmpMoveVt.x;
                var ty = this.tmpMoveOrgPt.y + this.tmpMoveVt.y;
                if (this.tmpMoveRotationVt) {
                    tx += this.tmpMoveRotationVt.x;
                    ty += this.tmpMoveRotationVt.y;
                }
                if (this.displayElement && this.type !== thumbType.rotation)
                    this.displayElement.transform("translate(" + tx + "," + ty + ")");
                if (this.onMoveTo)
                    this.onMoveTo(tx, ty, this.index);
            };
            Thumb.prototype.tmpMoveStop = function (apply) {
                if (!this.tmpMovePt)
                    return;
                if (this.longPressTimer) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
                if (apply && this.tmpMoveVt && this.type !== thumbType.rotation) {
                    var tx = this.tmpMoveOrgPt.x + this.tmpMoveVt.x;
                    var ty = this.tmpMoveOrgPt.y + this.tmpMoveVt.y;
                    this.tmpMoveVt = null;
                    this.setPos(tx, ty);
                }
                else {
                    this.tmpMoveVt = null;
                    this.setPos(this.tmpMoveOrgPt.x, this.tmpMoveOrgPt.y);
                }
                this.tmpMoveOrgPt = null;
                this.tmpMovePt = null;
                this.tmpMoveRotationVt = null;
                if (this.onMoveStop)
                    this.onMoveStop(apply, this.x, this.y, this.index);
            };
            return Thumb;
        }());
        Thumb.longPressTimeout = 700;
        Drawing.Thumb = Thumb;
    })(Drawing = FibaEurope.Drawing || (FibaEurope.Drawing = {}));
})(FibaEurope || (FibaEurope = {}));
//# sourceMappingURL=fibaDrawingSvg.js.map