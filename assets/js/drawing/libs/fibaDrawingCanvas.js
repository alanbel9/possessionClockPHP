/// <reference path="libs/canvg.d.ts" />
/// <reference path="libs/snapsvg.d.ts" />
/// <reference path="libs/jszip.d.ts" />
/// <reference path="libs/filesaver.d.ts" />
/// <reference path="fibaGraphic.ts" />
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var FibaEurope;
/// <reference path="libs/canvg.d.ts" />
/// <reference path="libs/snapsvg.d.ts" />
/// <reference path="libs/jszip.d.ts" />
/// <reference path="libs/filesaver.d.ts" />
/// <reference path="fibaGraphic.ts" />
(function (FibaEurope) {
    var Drawing;
    (function (Drawing) {
        "use strict";
        // draw a graphic in a canvas
        var CanvasDrawing = (function () {
            function CanvasDrawing() {
            }
            CanvasDrawing.downloadData = function (data, options, type) {
                var filename = options.name;
                if (!filename)
                    filename = "Graphic";
                if (!type)
                    type = "png";
                filename += "." + type;
                saveAs(data, filename);
                if (options.doneCallback)
                    options.doneCallback();
            };
            CanvasDrawing.canvasToBlob = function (canvas, callback) {
                if (!callback)
                    return;
                if (canvas.toBlob) {
                    canvas.toBlob(function (blob) {
                        // call the callback
                        callback(blob);
                    }, "image/png", 0.9);
                }
                else {
                    // IE!!!!!
                    var base64 = canvas.toDataURL("image/png", 0.9).substring("data:image/png;base64,".length);
                    // Convert from base64 to an ArrayBuffer
                    var byteString = atob(base64);
                    var buffer = new ArrayBuffer(byteString.length);
                    var intArray = new Uint8Array(buffer);
                    for (var i = 0; i < byteString.length; i++) {
                        intArray[i] = byteString.charCodeAt(i);
                    }
                    // Use the native blob constructor
                    var blob = new Blob([buffer], { type: "image/png" });
                    // call the callback
                    callback(blob);
                }
            };
            CanvasDrawing.exportGraphic = function (svg, options) {
                var drawingOptions = {};
                if (options.drawing)
                    drawingOptions = __assign({}, options.drawing);
                if (!drawingOptions.host)
                    drawingOptions.host = document.createElement("div");
                drawingOptions.renderCallback = function (canvas) {
                    if (options.drawing && options.drawing.renderCallback)
                        options.drawing.renderCallback(canvas);
                    CanvasDrawing.canvasToBlob(canvas, function (blob) {
                        CanvasDrawing.downloadData(blob, options);
                    });
                };
                CanvasDrawing.drawGraphic(svg, drawingOptions);
            };
            CanvasDrawing.exportGraphics = function (graphics, options) {
                var zip = new JSZip();
                var exportCount = 0;
                var _loop_1 = function (i) {
                    graphic = graphics[i];
                    var filename = options.name;
                    if (!filename)
                        filename = "Graphic";
                    filename += " [" + (i + 1) + "].png";
                    drawingOptions = {};
                    if (graphic.drawing)
                        drawingOptions = __assign({}, graphic.drawing);
                    if (options.drawing && options.drawing.scale)
                        drawingOptions.scale = options.drawing.scale;
                    if (!drawingOptions.host)
                        drawingOptions.host = document.createElement("div");
                    drawingOptions.renderCallback = function (canvas) {
                        if (graphic.drawing && graphic.drawing.renderCallback)
                            graphic.drawing.renderCallback(canvas);
                        if (options.drawing && options.drawing.renderCallback)
                            options.drawing.renderCallback(canvas);
                        CanvasDrawing.canvasToBlob(canvas, function (blob) {
                            exportCount++;
                            zip.file(filename, blob);
                            console.log(exportCount + "/" + graphics.length + " image for zip created with " + (blob.size / 1024).toFixed(2) + " kilobytes");
                            if (exportCount == graphics.length) {
                                zip.generateAsync({ compression: "DEFLATE", compressionOptions: { level: 9 }, type: "blob" })
                                    .then(function (zipblob) {
                                    console.log("zip file created with " + (zipblob.size / 1024).toFixed(2) + " kilobytes; starting download");
                                    CanvasDrawing.downloadData(zipblob, options, "zip");
                                }, function (err) {
                                    console.error("error creating zip file", err);
                                });
                            }
                        });
                    };
                    CanvasDrawing.drawGraphic(graphic.svg, drawingOptions);
                };
                var graphic, drawingOptions;
                for (var i = 0; i < graphics.length; i++) {
                    _loop_1(i);
                }
            };
            CanvasDrawing.drawGraphic = function (svg, options) {
                var canvasEl = document.createElement("canvas");
                var oldSvgWidth = svg.attributes["width"].value;
                var oldSvgHeight = svg.attributes["height"].value;
                var width = options.width;
                if (!width) {
                    width = svg.viewBox.baseVal.width - svg.viewBox.baseVal.x;
                }
                if (options.scale > 0)
                    width *= options.scale;
                var height = options.height;
                if (!height) {
                    height = svg.viewBox.baseVal.height - svg.viewBox.baseVal.y;
                }
                if (options.scale > 0)
                    height *= options.scale;
                svg.setAttribute("width", "" + width);
                svg.setAttribute("height", "" + height);
                canvasEl.width = width;
                canvasEl.height = height;
                if (options.host) {
                    while (options.host.firstChild) {
                        options.host.removeChild(options.host.firstChild);
                    }
                    options.host.appendChild(canvasEl);
                }
                var svgPaper = Snap(svg);
                var hideElementsOnExport = svgPaper.selectAll(".hide-on-export");
                var hiddenElements = [];
                hideElementsOnExport.forEach(function (el) {
                    if (el.node.style.visibility !== 'hidden') {
                        hiddenElements.push({ element: el, oldVisibility: el.node.style.visibility });
                        el.node.style.visibility = 'hidden';
                    }
                });
                var svgData = svgPaper.outerSVG();
                for (var _i = 0, hiddenElements_1 = hiddenElements; _i < hiddenElements_1.length; _i++) {
                    var el = hiddenElements_1[_i];
                    el.element.node.style.visibility = el.oldVisibility;
                }
                svg.setAttribute("width", oldSvgWidth);
                svg.setAttribute("height", oldSvgHeight);
                canvg(canvasEl, svgData, {
                    ignoreMouse: true,
                    ignoreAnimation: true,
                    ignoreDimensions: true,
                    scaleWidth: width,
                    scaleHeight: height,
                    renderCallback: function (svgDom) {
                        if (options.renderCallback)
                            options.renderCallback(canvasEl);
                    }
                });
                return canvasEl;
            };
            CanvasDrawing.addExportButton = function (svg, options) {
                var paper = Snap(svg);
                var bbPage = paper.getBBox();
                var r = 18;
                var circle = paper.circle(r + 2, r + 2, r);
                circle.attr({ fill: "white", stroke: "black", strokeWidth: 2 });
                var arrow = paper.path("m 14,5 0,3 12,0 0,-3 z m 0,5 0,4 12,0 0,-4 z m 0,7 0,5 -8,0 14,14 14,-14 -8,0 0,-5 z");
                arrow.attr({ fill: "black" });
                var bbCircle = circle.getBBox();
                var g = paper.group(circle, arrow).transform("translate(" + (bbPage.width - bbCircle.width - 6) + ",3)");
                g.addClass("hide-on-export");
                g.attr({ cursor: "pointer" });
                g.hover(function () { return circle.attr({ fill: "#E9E9E9" }); }, function () { return circle.attr({ fill: "white" }); });
                g.click(function () {
                    CanvasDrawing.exportGraphic(svg, options);
                });
            };
            return CanvasDrawing;
        }());
        Drawing.CanvasDrawing = CanvasDrawing;
    })(Drawing = FibaEurope.Drawing || (FibaEurope.Drawing = {}));
})(FibaEurope || (FibaEurope = {}));
//# sourceMappingURL=fibaDrawingCanvas.js.map