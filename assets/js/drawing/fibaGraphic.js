var FibaEurope;
/// <reference path="fibaDrawingCurvedPath.ts" />
(function (FibaEurope) {
    var Data;
    (function (Data) {
        "use strict";
        // represents a graphic
        var Graphic = /** @class */ (function () {
            function Graphic() {
                this.id = null;
                this.fullCourt = true;
                this.wheelchair = false;
                this.dynamicElements = [];
                this.lineElements = [];
                this.staticElements = [];
            }
            Graphic.loadFromUrl = function (url, callback, scope) {
                return Snap.ajax(url, function (req) {
                    var graphic;
                    if (req.responseType === "application/json" || req.responseText.substr(0, 1) === "{") {
                        graphic = Graphic.loadFromJson(req.responseText);
                    }
                    else {
                        if (req.responseXML)
                            graphic = Graphic.loadFromXml(req.responseXML);
                        else
                            graphic = Graphic.loadFromXmlString(req.responseText);
                        if (graphic && req.getResponseHeader("FibaCoach-FullCourt") === "0")
                            graphic.fullCourt = false;
                    }
                    scope ? callback.call(scope, graphic) : callback(graphic);
                });
            };
            Graphic.loadFromScriptElement = function (elementId) {
                var elXml = document.getElementById("xmlGraphic");
                return Graphic.loadFromXmlString(elXml.innerText ? elXml.innerText : elXml.text); // ff has no innerText
            };
            // load the graphic from a xml-string
            Graphic.loadFromXmlString = function (xmlString) {
                if (xmlString === "")
                    return null;
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xmlString, "text/xml");
                return Graphic.loadFromXml(xmlDoc);
            };
            // load the graphic from a xml-document
            Graphic.loadFromXml = function (xml) {
                var graphic = new Graphic();
                var xmlVersion = +xml.getElementsByTagName("playbook")[0].getAttribute("version");
                // load dynamic objects
                var entries = xml.getElementsByTagName("object");
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    var dyn = new DynamicElement();
                    dyn.nr = +entry.getAttribute("number") * 1;
                    dyn.rotation = +entry.getAttribute("rotation");
                    dyn.type = dynamicElementType[entry.getAttribute("type").toLowerCase()];
                    dyn.x = +entry.getAttribute("x");
                    dyn.y = +entry.getAttribute("y");
                    if (dyn.type === dynamicElementType.offence)
                        dyn.color = elementColor.offence;
                    else if (dyn.type === dynamicElementType.defence)
                        dyn.color = elementColor.defence;
                    else if (dyn.type === dynamicElementType.shooting || dyn.type === dynamicElementType.handoff)
                        dyn.color = elementColor.black;
                    if (xmlVersion === 0.1) {
                        dyn.x += 8;
                        dyn.y += 14;
                    }
                    graphic.dynamicElements.push(dyn);
                }
                // load lines
                entries = xml.getElementsByTagName("line");
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    var x = +entry.getAttribute("x");
                    var y = +entry.getAttribute("y");
                    if (xmlVersion === 0.1) {
                        x += 8;
                        y += 14;
                    }
                    var lineType = entry.getAttribute("type").toLocaleLowerCase();
                    if (lineType === "shooting") {
                        // shoting is not realy a line, it is more a dynamic object
                        var dyn = new DynamicElement();
                        dyn.nr = 0;
                        dyn.rotation = +entry.getAttribute("rotation");
                        dyn.type = dynamicElementType[lineType];
                        dyn.color = elementColor.black;
                        dyn.x = x;
                        dyn.y = y;
                        graphic.dynamicElements.push(dyn);
                        continue;
                    }
                    var line = new LineElement();
                    line.type = lineElementType[lineType];
                    line.color = elementColor.black;
                    line.addCoordinate(x, y);
                    if (!entry.hasAttribute("ex") && entry.hasAttribute("length")) {
                        // xml version 0.1 and 0.2
                        var length = 81.3 * +entry.getAttribute("length") / 100;
                        var rotation = +entry.getAttribute("rotation");
                        var endpoint = FibaEurope.Drawing.CurvedPathMaths.move(line.coords[0], FibaEurope.Drawing.CurvedPathMaths.rotate({ x: length, y: 0 }, rotation));
                        line.addCoordinate(endpoint.x, endpoint.y);
                        // swap points
                        var tmp = line.coords[0];
                        line.coords[0] = line.coords[1];
                        line.coords[1] = tmp;
                    }
                    else {
                        line.addCoordinate(+entry.getAttribute("ex"), +entry.getAttribute("ey"));
                    }
                    if (line.coords.length > 1)
                        graphic.lineElements.push(line);
                }
                // load polylines
                entries = xml.getElementsByTagName("polygon");
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    var line = new LineElement();
                    line.color = elementColor.black;
                    line.type = lineElementType[entry.getAttribute("type").toLowerCase()];
                    line.curved = entry.getAttribute("curved") === "curved";
                    var coords = entry.getElementsByTagName("p");
                    for (var j = 0; j < coords.length; j++) {
                        var coord = coords[j];
                        var cx = +coord.getAttribute("x");
                        var cy = +coord.getAttribute("y");
                        if (xmlVersion === 0.1) {
                            cx += 8;
                            cy += 14;
                        }
                        line.addCoordinate(cx, cy);
                    }
                    if (line.coords.length > 2 && xmlVersion < 0.3) {
                        // xml version 0.1 and 0.2
                        line.curved = true;
                    }
                    if (line.coords.length > 1)
                        graphic.lineElements.push(line);
                }
                // load areas
                entries = xml.getElementsByTagName("area");
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    var stat = new StaticElement();
                    stat.type = staticElementType.area;
                    stat.x = +entry.getAttribute("x");
                    stat.y = +entry.getAttribute("y");
                    stat.color = +entry.getAttribute("color");
                    stat.form = +entry.getAttribute("form");
                    stat.width = +entry.getAttribute("width");
                    stat.height = +entry.getAttribute("height");
                    if (xmlVersion < 0.3) {
                        if (xmlVersion === 0.2) {
                            stat.width *= 0.82;
                            stat.height *= 0.82;
                            stat.x = stat.width > 0 ? stat.x - stat.width : stat.x;
                            stat.y = stat.height > 0 ? stat.y - stat.height : stat.y;
                        }
                    }
                    stat.width = Math.abs(stat.width);
                    stat.height = Math.abs(stat.height);
                    graphic.staticElements.push(stat);
                }
                // load texts
                entries = xml.getElementsByTagName("text");
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    var stat = new StaticElement();
                    stat.type = staticElementType.text;
                    stat.color = elementColor.black;
                    stat.x = +entry.getAttribute("x");
                    stat.y = +entry.getAttribute("y");
                    stat.text = entry.textContent;
                    graphic.staticElements.push(stat);
                }
                // return graphic
                return graphic;
            };
            // load the graphic from a json string
            Graphic.loadFromJson = function (jsonStr) {
                if (!jsonStr)
                    return null;
                var graphicData = JSON.parse(jsonStr);
                if (!graphicData)
                    return null;
                return Graphic.createFromObject(graphicData);
            };
            Graphic.createFromObject = function (copy) {
                var graphic = new Graphic();
                graphic.id = copy.id;
                graphic.fullCourt = (typeof copy.fullCourt === "undefined") ? true : copy.fullCourt;
                graphic.wheelchair = (typeof copy.wheelchair === "undefined") ? false : copy.wheelchair;
                var i = 0;
                for (; i < copy.dynamicElements.length; i++)
                    graphic.dynamicElements.push(DynamicElement.createFromObject(copy.dynamicElements[i]));
                for (i = 0; i < copy.lineElements.length; i++)
                    graphic.lineElements.push(LineElement.createFromObject(copy.lineElements[i]));
                for (i = 0; i < copy.staticElements.length; i++)
                    graphic.staticElements.push(StaticElement.createFromObject(copy.staticElements[i]));
                return graphic;
            };
            // create a json string from the graphic
            Graphic.prototype.toJson = function () {
                return JSON.stringify(this);
            };
            return Graphic;
        }());
        Data.Graphic = Graphic;
        var elementColor;
        (function (elementColor) {
            elementColor[elementColor["unknown"] = -1] = "unknown";
            elementColor[elementColor["yellow"] = 0] = "yellow";
            elementColor[elementColor["green"] = 1] = "green";
            elementColor[elementColor["red"] = 2] = "red";
            elementColor[elementColor["grey"] = 3] = "grey";
            elementColor[elementColor["black"] = 4] = "black";
            elementColor[elementColor["blue"] = 5] = "blue";
            elementColor[elementColor["offence"] = 6] = "offence";
            elementColor[elementColor["defence"] = 7] = "defence";
        })(elementColor = Data.elementColor || (Data.elementColor = {}));
        var dynamicElementType;
        (function (dynamicElementType) {
            dynamicElementType[dynamicElementType["offence"] = 0] = "offence";
            dynamicElementType[dynamicElementType["defence"] = 1] = "defence";
            dynamicElementType[dynamicElementType["ball"] = 2] = "ball";
            dynamicElementType[dynamicElementType["coach"] = 3] = "coach";
            dynamicElementType[dynamicElementType["cone"] = 4] = "cone";
            dynamicElementType[dynamicElementType["shooting"] = 5] = "shooting";
            dynamicElementType[dynamicElementType["handoff"] = 6] = "handoff";
        })(dynamicElementType = Data.dynamicElementType || (Data.dynamicElementType = {}));
        // Model for a dynamic tag (object)
        var DynamicElement = /** @class */ (function () {
            function DynamicElement() {
                this.nr = 0;
                this.type = null;
                this.rotation = 0;
                this.color = elementColor.unknown;
                this.x = 0;
                this.y = 0;
            }
            DynamicElement.createFromObject = function (copy) {
                var dyn = new DynamicElement();
                dyn.nr = copy.nr;
                dyn.type = copy.type;
                dyn.rotation = copy.rotation;
                dyn.color = copy.color;
                dyn.x = copy.x;
                dyn.y = copy.y;
                if (typeof dyn.color === "undefined") {
                    switch (dyn.type) {
                        case dynamicElementType.offence:
                            dyn.color = elementColor.offence;
                            break;
                        case dynamicElementType.defence:
                            dyn.color = elementColor.defence;
                            break;
                        case dynamicElementType.shooting:
                        case dynamicElementType.handoff:
                            dyn.color = elementColor.black;
                            break;
                        default:
                            dyn.color = elementColor.unknown;
                    }
                }
                return dyn;
            };
            DynamicElement.prototype.clone = function () {
                return DynamicElement.createFromObject(this);
            };
            DynamicElement.prototype.toString = function () {
                return "[" + dynamicElementType[this.type] + " " + this.nr + " (" + this.x + " " + this.y + ") " + this.rotation + "Â°]";
            };
            DynamicElement.isInsideShootingScaleArea = function (x, y) {
                return (x >= 135 && x <= 250) &&
                    ((y >= 30 && y <= 165) || (y >= 375 && y <= 510));
            };
            return DynamicElement;
        }());
        Data.DynamicElement = DynamicElement;
        var staticElementType;
        (function (staticElementType) {
            staticElementType[staticElementType["area"] = 0] = "area";
            staticElementType[staticElementType["text"] = 1] = "text";
        })(staticElementType = Data.staticElementType || (Data.staticElementType = {}));
        var staticElementForm;
        (function (staticElementForm) {
            staticElementForm[staticElementForm["ellipse"] = 1] = "ellipse";
            staticElementForm[staticElementForm["rectangle"] = 2] = "rectangle";
            staticElementForm[staticElementForm["triangle"] = 3] = "triangle";
        })(staticElementForm = Data.staticElementForm || (Data.staticElementForm = {}));
        // Model for a static tag (area,text)
        var StaticElement = /** @class */ (function () {
            function StaticElement() {
                this.type = null;
                this.rotation = 0;
                this.x = 0;
                this.y = 0;
                this.color = elementColor.unknown;
                this.form = 0;
                this.width = null;
                this.height = null;
                this.text = null;
                this.coords = null;
            }
            StaticElement.createFromObject = function (copy) {
                var stat = new StaticElement();
                stat.type = copy.type;
                stat.rotation = copy.rotation;
                stat.x = copy.x;
                stat.y = copy.y;
                stat.color = copy.color;
                stat.form = copy.form;
                stat.width = copy.width;
                stat.height = copy.height;
                stat.text = copy.text;
                if (copy.coords && copy.form === staticElementForm.triangle) {
                    stat.coords = [];
                    for (var i = 0; i < copy.coords.length; i++)
                        stat.coords.push(new Coordinate(copy.coords[i].x, copy.coords[i].y));
                }
                return stat;
            };
            StaticElement.prototype.clone = function () {
                return StaticElement.createFromObject(this);
            };
            StaticElement.prototype.toString = function () {
                if (this.type === staticElementType.text)
                    return "[text (" + this.x + " " + this.y + ")]";
                return "[" + staticElementForm[this.form] + " " + elementColor[this.color] + " (" + this.x + " " + this.y + ") " + this.width + "x" + this.height + "]";
            };
            return StaticElement;
        }());
        Data.StaticElement = StaticElement;
        var lineElementType;
        (function (lineElementType) {
            lineElementType[lineElementType["movement"] = 0] = "movement";
            lineElementType[lineElementType["passing"] = 1] = "passing";
            lineElementType[lineElementType["dribbling"] = 2] = "dribbling";
            lineElementType[lineElementType["screen"] = 3] = "screen";
            lineElementType[lineElementType["line"] = 4] = "line";
            lineElementType[lineElementType["free"] = 5] = "free";
        })(lineElementType = Data.lineElementType || (Data.lineElementType = {}));
        // Model for a line tag (line,polygon)
        var LineElement = /** @class */ (function () {
            function LineElement() {
                this.type = null;
                this.curved = true;
                this.color = elementColor.black;
                this.coords = [];
            }
            LineElement.createFromObject = function (copy) {
                var line = new LineElement();
                line.type = copy.type;
                line.color = copy.color;
                line.curved = copy.curved;
                if (typeof line.color === "undefined") {
                    line.color = elementColor.black;
                }
                for (var i = 0; i < copy.coords.length; i++)
                    line.addCoordinate(copy.coords[i].x, copy.coords[i].y);
                return line;
            };
            LineElement.prototype.clone = function () {
                return LineElement.createFromObject(this);
            };
            // add a coordinate to the "polygonCoords" array
            LineElement.prototype.addCoordinate = function (x, y) {
                var coord = new Coordinate(x, y);
                this.coords.push(coord);
            };
            // insert a coordinate to the "polygonCoords" array
            LineElement.prototype.insertCoordinate = function (idx, x, y) {
                var coord = new Coordinate(x, y);
                this.coords.splice(idx, 0, coord);
            };
            // remove a coordinate to the "polygonCoords" array
            LineElement.prototype.removeCoordinate = function (idx) {
                this.coords.splice(idx, 1);
            };
            LineElement.prototype.toString = function () {
                return "[" + lineElementType[this.type] + " " + this.coords.length + " Points" + (this.curved ? " curved" : "") + "]";
            };
            return LineElement;
        }());
        Data.LineElement = LineElement;
        // Model for a single coordinate (x,y)
        var Coordinate = /** @class */ (function () {
            function Coordinate(x, y) {
                this.x = x;
                this.y = y;
            }
            Coordinate.prototype.toString = function () {
                return "(" + this.x + " " + this.y + ")";
            };
            return Coordinate;
        }());
        Data.Coordinate = Coordinate;
    })(Data = FibaEurope.Data || (FibaEurope.Data = {}));
})(FibaEurope || (FibaEurope = {}));
//# sourceMappingURL=fibaGraphic.js.map