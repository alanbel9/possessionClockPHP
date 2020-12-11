var FibaEurope;
(function (FibaEurope) {
    var Drawing;
    (function (Drawing) {
        "use strict";
        var CurvedPathMaths = (function () {
            function CurvedPathMaths() {
            }
            // Berechnung und RÃ¼ckgabe der Kurve als Array
            // givenPoints: Die im Polygon gegebenen x,y Koordinaten
            CurvedPathMaths.getPathPoints = function (givenPoints) {
                // more then 2 Points?
                if (givenPoints.length < 3)
                    return givenPoints;
                // construct controls Points
                var controls = new Array([]);
                for (var i = 1; i < givenPoints.length - 1; i++) {
                    var v = this.vector(givenPoints[i], givenPoints[i + 1]);
                    var a = this.angle(this.vector(givenPoints[i], givenPoints[i - 1]), v) / 2;
                    v = this.rotate(v, a);
                    var l = this.vLine(givenPoints[i], this.rotate(v, 90));
                    var vl = this.vLine(givenPoints[i - 1], v);
                    var cl = this.crossLine(l, vl);
                    var seg = this.segment(givenPoints[i], cl, 0.5);
                    controls[i - 1].push(seg);
                    vl = this.vLine(givenPoints[i + 1], v);
                    cl = this.crossLine(l, vl);
                    seg = this.segment(givenPoints[i], cl, 0.5);
                    controls[i] = new Array();
                    controls[i].push(seg);
                }
                // construct path
                var path = new Array();
                path.push(givenPoints[0], controls[0][0], givenPoints[1]);
                for (var i = 1; i < controls.length - 1; i++) {
                    var cp = this.crossLine(this.pLine(givenPoints[i], controls[i][0]), this.pLine(givenPoints[i + 1], controls[i][1]));
                    var at = this.segmentOf(givenPoints[i], controls[i][0], cp);
                    var bt = this.segmentOf(givenPoints[i + 1], controls[i][1], cp);
                    if ((at > 0.5 && at < 1.5) || (bt > 0.5 && bt < 1.5)) {
                        path.push(cp);
                        path.push(givenPoints[i + 1]);
                    }
                    else {
                        var P0 = givenPoints[i], P1 = controls[i][0], P2 = controls[i][1], P3 = givenPoints[i + 1];
                        if (at > 0 && at < 0.5)
                            P1 = this.segment(givenPoints[i], P1, 1 - 0.5 * at / 0.5);
                        if (bt > 0 && bt < 0.5)
                            P2 = this.segment(givenPoints[i + 1], P2, 1 - 0.5 * bt / 0.5);
                        var PA = this.segment(P0, P1, 3 / 4);
                        var PB = this.segment(P3, P2, 3 / 4);
                        var dx = (P3.x - P0.x) / 16;
                        var dy = (P3.y - P0.y) / 16;
                        var Pc_1 = this.segment(P0, P1, 3 / 8);
                        var Pc_2 = this.segment(PA, PB, 3 / 8);
                        var Pc_3 = this.segment(PB, PA, 3 / 8);
                        var Pc_4 = this.segment(P3, P2, 3 / 8);
                        Pc_2.x -= dx;
                        Pc_2.y -= dy;
                        Pc_3.x += dx;
                        Pc_3.y += dy;
                        var Pa_1 = this.segment(Pc_1, Pc_2, 0.5);
                        var Pa_2 = this.segment(PA, PB, 0.5);
                        var Pa_3 = this.segment(Pc_3, Pc_4, 0.5);
                        path.push(Pc_1, Pa_1);
                        path.push(Pc_2, Pa_2);
                        path.push(Pc_3, Pa_3);
                        path.push(Pc_4, P3);
                    }
                }
                path.push(controls[controls.length - 1][0], givenPoints[controls.length]);
                return path;
            };
            // get vetor from fristPoint to secondPoint
            CurvedPathMaths.vector = function (firstPoint, secondPoint) {
                return new Point(secondPoint.x - firstPoint.x, secondPoint.y - firstPoint.y);
            };
            // get point from point+vector
            CurvedPathMaths.move = function (firstPoint, vector) {
                return new Point(firstPoint.x + vector.x, firstPoint.y + vector.y);
            };
            // get angle between the two points
            CurvedPathMaths.angle = function (firstPoint, secondPoint) {
                if (!secondPoint)
                    return this.round(Math.atan2(firstPoint.x, firstPoint.y) / this.DPI, 4);
                else
                    return this.round((Math.atan2(secondPoint.x, secondPoint.y) - Math.atan2(firstPoint.x, firstPoint.y)) / this.DPI, 4);
            };
            CurvedPathMaths.vLine = function (firstPoint, secondPoint) {
                if (secondPoint.x === 0)
                    return { c: firstPoint.x };
                var a = secondPoint.y / secondPoint.x;
                return { a: a, b: firstPoint.y - firstPoint.x * a };
            };
            CurvedPathMaths.pLine = function (firstPoint, secondPoint) {
                if (firstPoint.x === secondPoint.x && firstPoint.y === secondPoint.y)
                    return null;
                return this.vLine(firstPoint, this.vector(firstPoint, secondPoint));
            };
            CurvedPathMaths.crossLine = function (firstPoint, secondPoint) {
                if ((firstPoint === null) || (secondPoint === null) || (firstPoint.c !== undefined && secondPoint.c !== undefined))
                    return null;
                var u;
                if ((firstPoint.c === undefined) && (secondPoint.c === undefined)) {
                    if (firstPoint.a === secondPoint.a)
                        return null;
                    u = (secondPoint.b - firstPoint.b) / (firstPoint.a - secondPoint.a);
                    return new Point(u, firstPoint.a * u + firstPoint.b);
                }
                if (firstPoint.c !== undefined)
                    return new Point(firstPoint.c, secondPoint.a * firstPoint.c + secondPoint.b);
                if (secondPoint.c !== undefined)
                    return new Point(secondPoint.c, firstPoint.a * secondPoint.c + firstPoint.b);
            };
            CurvedPathMaths.segment = function (firstPoint, secondPoint, num) {
                var zwx = (firstPoint.x + (secondPoint.x - firstPoint.x) * num);
                var zwy = (firstPoint.y + (secondPoint.y - firstPoint.y) * num);
                return new Point(zwx, zwy);
            };
            CurvedPathMaths.rotate = function (point, num) {
                var r = this.distance(point, null);
                num = Math.atan2(point.y, point.x) + num * this.DPI;
                return new Point(r * Math.cos(num), r * Math.sin(num));
            };
            CurvedPathMaths.distance = function (firstPoint, secondPoint) {
                if (secondPoint) {
                    var dx = firstPoint.x - secondPoint.x;
                    var dy = firstPoint.y - secondPoint.y;
                    return Math.sqrt(dx * dx + dy * dy);
                }
                return Math.sqrt(firstPoint.x * firstPoint.x + firstPoint.y * firstPoint.y);
            };
            CurvedPathMaths.segmentOf = function (firstPoint, secondPoint, thirdpoint) {
                if (!firstPoint || !secondPoint || !thirdpoint)
                    return null;
                var tx = this.round((thirdpoint.x - firstPoint.x) / (secondPoint.x - firstPoint.x), 4);
                var ty = this.round((thirdpoint.y - firstPoint.y) / (secondPoint.y - firstPoint.y), 4);
                return tx === ty ? tx : null;
            };
            CurvedPathMaths.round = function (num, precision) {
                if (precision == 0)
                    return Math.round(num);
                if (precision < 0)
                    precision = Math.abs(precision);
                var f;
                if (precision == 1)
                    f = 10;
                else if (precision == 2)
                    f = 100;
                else if (precision == 3)
                    f = 1000;
                else if (precision == 4)
                    f = 10000;
                else
                    f = Math.pow(10, precision);
                return Math.round(num * f) / f;
            };
            return CurvedPathMaths;
        }());
        CurvedPathMaths.DPI = Math.PI / 180;
        Drawing.CurvedPathMaths = CurvedPathMaths;
        var Point = (function () {
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            Point.prototype.toString = function () {
                return "(" + this.x + " " + this.y + ")";
            };
            Point.prototype.vectorTo = function (x, y) {
                if (typeof x === "number")
                    return new Point(x - this.x, y - this.y);
                return new Point(x - x.x, y - x.y);
            };
            Point.prototype.length = function () {
                return CurvedPathMaths.distance(this);
            };
            Point.prototype.setLength = function (newLength) {
                var curLength = this.length();
                if (curLength == 0)
                    return;
                this.scale(newLength / curLength);
            };
            Point.prototype.scale = function (scale) {
                this.x *= scale;
                this.y *= scale;
            };
            Point.prototype.invert = function () {
                this.x = -this.x;
                this.y = -this.y;
            };
            Point.prototype.distanceToPoint = function (x, y) {
                var v = this.vectorTo(x, y);
                return v.length();
            };
            Point.prototype.distanceToLine = function (pt1, pt2) {
                var line = CurvedPathMaths.vector(pt1, pt2);
                var lineLength = line.length();
                if (lineLength === 0)
                    return this.distanceToPoint(pt1);
                return Math.abs(line.x * this.x - line.y * this.y - pt1.x * pt2.y + pt2.x * pt1.y) / lineLength;
            };
            return Point;
        }());
        Drawing.Point = Point;
        var Polyline = (function () {
            function Polyline(points) {
                this.points = points;
            }
            Polyline.prototype.length = function () {
                var length = 0;
                for (var i = 1; i < this.points.length; i++)
                    length += CurvedPathMaths.distance(this.points[i - 1], this.points[i]);
                return length;
            };
            return Polyline;
        }());
        Drawing.Polyline = Polyline;
        var Rect = (function () {
            function Rect(x, y, width, height) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
            Rect.fromPoints = function () {
                var points = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    points[_i] = arguments[_i];
                }
                if (!points || points.length === 0)
                    return null;
                var minX = points[0].x;
                var minY = points[0].y;
                var maxX = minX;
                var maxY = minY;
                for (var i = 1; i < points.length; i++) {
                    var p = points[i];
                    if (p.x < minX)
                        minX = p.x;
                    else if (p.x > maxX)
                        maxX = p.x;
                    if (p.y < minY)
                        minY = p.y;
                    else if (p.y > maxY)
                        maxY = p.y;
                }
                return new Rect(minX, minY, maxX - minX, maxY - minY);
            };
            Rect.prototype.contains = function (xobj, y, width, height) {
                var x;
                if (typeof xobj === "object" && typeof xobj.x !== "undefined") {
                    y = xobj.y;
                    x = xobj.x;
                }
                else {
                    x = +xobj;
                }
                // check topleft point
                var contains = x > this.left() && x < this.right() && y > this.top() && y < this.bottom();
                // if it is an rect, then check bottomright point
                if (contains) {
                    if (typeof xobj === "object" && typeof xobj.width !== "undefined") {
                        width = xobj.width;
                        height = xobj.height;
                    }
                    if (width || height) {
                        x += width;
                        y += height;
                        contains = x > this.left() && x < this.right() && y > this.top() && y < this.bottom();
                    }
                }
                return contains;
            };
            Rect.prototype.left = function () { return this.x; };
            Rect.prototype.top = function () { return this.y; };
            Rect.prototype.right = function () { return this.x + this.width; };
            Rect.prototype.bottom = function () { return this.y + this.height; };
            Rect.prototype.cornerPoints = function () {
                var corners = new Array();
                corners.push(new Point(this.left(), this.top()));
                corners.push(new Point(this.right(), this.top()));
                corners.push(new Point(this.right(), this.bottom()));
                corners.push(new Point(this.left(), this.bottom()));
                return corners;
            };
            return Rect;
        }());
        Drawing.Rect = Rect;
        // compute the Dribbeling Curve
        var CurvePath = (function () {
            function CurvePath(points) {
                this.path_length = 0;
                this.segments = 0;
                this.ln_array = new Array([]);
                this.path_length = 0;
                var k = 0, i;
                var p0 = points[0];
                var p1, p2, ln, o, a1, a2, a3, a4, a, b, c, d, e, a2t, sa;
                for (i = 1; i < points.length; i += 2) {
                    p1 = points[i];
                    if (i === (points.length - 1)) {
                        p2 = points[i + 1] ? points[i + 1] : points[0];
                    }
                    else {
                        p2 = points[i + 1];
                    }
                    ln = this.ln_array[k++] = [p0, p1, p2];
                    o = ln[3] = {};
                    a1 = o.a1 = p0.x - 2 * p1.x + p2.x;
                    a2 = o.a2 = p0.y - 2 * p1.y + p2.y;
                    a3 = o.a3 = p0.x - p1.x;
                    a4 = o.a4 = p0.y - p1.y;
                    a = o.a = 4 * (a1 * a1 + a2 * a2);
                    b = o.b = -8 * (a1 * a3 + a2 * a4);
                    c = o.c = 4 * (a3 * a3 + a4 * a4);
                    e = o.e = Math.sqrt(c);
                    d = Math.sqrt(c + b + a);
                    sa = Math.sqrt(a);
                    a2t = a * 2;
                    ln[4] = (2 * sa * (d * (b + a2t) - e * b) + (b * b - 4 * a * c) * (Math.log(2 * e + b / sa) - Math.log(2 * d + (b + a2t) / sa))) / (8 * Math.pow(a, (3 / 2)));
                    if (isNaN(ln[4])) {
                        var del = 100000;
                        points[i].x += Math.random() / del;
                        points[i].y += Math.random() / del;
                        points[i + 1].x += Math.random() / del;
                        points[i + 1].y += Math.random() / del;
                        points[i + 2].x += Math.random() / del;
                        points[i + 2].y += Math.random() / del;
                        i -= 2;
                        k--;
                    }
                    else {
                        this.path_length += ln[4];
                        p0 = p2;
                    }
                }
                this.segments = k--;
            }
            CurvePath.prototype.getPoint = function (poz, omit_rotation) {
                // added
                if (poz > this.path_length) {
                    poz = this.path_length;
                }
                else if (poz < 0) {
                    poz = 0;
                }
                // end added
                poz = poz % this.path_length;
                // poz<0 ? poz += this.path_length : "";
                // if(poz<0)poz += this.path_length;
                if (!poz)
                    poz += .00001;
                if (this.segments < 1) {
                    return null;
                }
                var i = 0, ln, len = 0, ff = 0;
                for (i; i <= this.segments; i++) {
                    ln = this.ln_array[i], len += ln[4];
                    if (len > poz) {
                        ff = (poz - (len - ln[4])) / ln[4];
                        break;
                    }
                }
                var fn = function (ff) {
                    var o = ln[3], a1 = o.a1, a2 = o.a2, a3 = o.a3, a4 = o.a4, a = o.a, b = o.b, c = o.c, e = o.e, i = 1, st = 1, f_l = ln[4], t_l = ff * f_l, max_i = 100, d, sa, a2i;
                    while (max_i--) {
                        d = Math.sqrt(c + i * (b + a * i)), sa = Math.sqrt(a), a2i = a * 2 * i, f_l = (2 * sa * (d * (b + a2i) - e * b) + (b * b - 4 * a * c) * (Math.log(2 * e + b / sa) - Math.log(2 * d + (b + a2i) / sa))) / (8 * Math.pow(a, (3 / 2)));
                        if (Math.abs(f_l - t_l) < .000001) {
                            return i;
                        }
                        st /= 2, i += f_l < t_l ? st : f_l > t_l ? -st : 0;
                    }
                    return i;
                };
                var f = fn(ff), p0 = ln[0], p1 = ln[1], p2 = ln[2], e = 1 - f, ee = e * e, ff = f * f, b = 2 * f * e;
                var pt = {
                    x: p2.x * ff + p1.x * b + p0.x * ee,
                    y: p2.y * ff + p1.y * b + p0.y * ee
                };
                if (!omit_rotation) {
                    pt._rotation = Math.atan2(p0.y - p1.y + (2 * p1.y - p0.y - p2.y) * f, p0.x - p1.x + (2 * p1.x - p0.x - p2.x) * f) / (Math.PI / 180);
                }
                return pt;
            };
            return CurvePath;
        }());
        Drawing.CurvePath = CurvePath;
        // simpliefy the free hand line
        // original C# Code: http://www.codeproject.com/KB/cs/Douglas-Peucker_Algorithm.aspx
        var SimplifyPolyline = (function () {
            function SimplifyPolyline() {
            }
            // uses the Douglas Peucker algorithim to reduce the number of points.
            SimplifyPolyline.douglasPeuckerReduction = function (points, tolerance) {
                if (!points || points.length < 3)
                    return points;
                var firstPointIdx = 0;
                var lastPointIdx = points.length - 1;
                var pointIndexsToKeep = new Array();
                // add the first and last index to the keepers
                pointIndexsToKeep.push(firstPointIdx);
                pointIndexsToKeep.push(lastPointIdx);
                // the first and the last point can not be the same
                while (points[firstPointIdx].x === points[lastPointIdx].x && points[firstPointIdx].y === points[lastPointIdx].y) {
                    lastPointIdx--;
                }
                SimplifyPolyline.douglasPeuckerReductionInternal(points, firstPointIdx, lastPointIdx, tolerance, pointIndexsToKeep);
                pointIndexsToKeep.sort(function (a, b) { return a - b; });
                var returnPoints = new Array();
                for (var i = 0; i < pointIndexsToKeep.length; i++) {
                    returnPoints.push(points[pointIndexsToKeep[i]]);
                }
                return returnPoints;
            };
            SimplifyPolyline.douglasPeuckerReductionInternal = function (points, firstPointIdx, lastPointIdx, tolerance, pointIndexsToKeep) {
                var maxDistance = 0;
                var indexFarthest = 0;
                var distance = 0;
                for (var index = firstPointIdx; index < lastPointIdx; index++) {
                    distance = SimplifyPolyline.perpendicularDistance(points[firstPointIdx], points[lastPointIdx], points[index]);
                    if (distance > maxDistance) {
                        maxDistance = distance;
                        indexFarthest = index;
                    }
                }
                if (maxDistance > tolerance && indexFarthest != 0) {
                    // add the largest point that exceeds the tolerance
                    pointIndexsToKeep.push(indexFarthest);
                    SimplifyPolyline.douglasPeuckerReductionInternal(points, firstPointIdx, indexFarthest, tolerance, pointIndexsToKeep);
                    SimplifyPolyline.douglasPeuckerReductionInternal(points, indexFarthest, lastPointIdx, tolerance, pointIndexsToKeep);
                }
            };
            // the distance of a point from a line made from point1 and point2.
            SimplifyPolyline.perpendicularDistance = function (pt1, pt2, pt) {
                // Area = |(1/2)(x1y2 + x2y3 + x3y1 - x2y1 - x3y2 - x1y3)|   *Area of triangle
                // Base = âˆš((x1-x2)Â²+(x1-x2)Â²)                               *Base of Triangle*
                // Area = .5*Base*H                                          *Solve for height
                // Height = Area/.5/Base
                var area = Math.abs(.5 * (pt1.x * pt2.y + pt2.x * pt.y + pt.x * pt1.y - pt2.x * pt1.y - pt.x * pt2.y - pt1.x * pt.y));
                var bottom = Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
                var height = area / bottom * 2;
                return height;
                // another option
                // var A = Point.X - pt1.X;
                // var B = Point.Y - pt1.Y;
                // var C = pt2.X - pt1.X;
                // var D = pt2.Y - pt1.Y;
                // var dot = A * C + B * D;
                // var len_sq = C * C + D * D;
                // var param = dot / len_sq;
                // Double xx, yy;
                // if (param < 0)
                // {
                //     xx = pt1.X;
                //     yy = pt1.Y;
                // }
                // else if (param > 1)
                // {
                //     xx = pt2.X;
                //     yy = pt2.Y;
                // }
                // else
                // {
                //     xx = pt1.X + param * C;
                //     yy = pt1.Y + param * D;
                // }
                // var d = DistanceBetweenOn2DPlane(Point, new Point(xx, yy));
            };
            return SimplifyPolyline;
        }());
        Drawing.SimplifyPolyline = SimplifyPolyline;
    })(Drawing = FibaEurope.Drawing || (FibaEurope.Drawing = {}));
})(FibaEurope || (FibaEurope = {}));
//# sourceMappingURL=fibaDrawingCurvedPath.js.map