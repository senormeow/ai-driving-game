import * as d3 from "d3";
import * as cola from "webcola";

var NODE_RADIUS = 7;
var GATE_RADIUS = 2;
var REPEL_FORCE = 0;
var LINK_DISTANCE = 80;

function drawGraph(graph, panel) {
  var svg = d3.select(panel);

  // Read the actual rendered size of the SVG element.
  var svgNode = svg.node();
  var WIDTH  = svgNode.clientWidth  || 280;
  var HEIGHT = svgNode.clientHeight || 300;

  // Clear previous content.
  svg.selectAll("*").remove();

  // ── Zoom / pan setup ──────────────────────────────────────────────
  // All drawn content lives inside a <g> that the zoom transform is
  // applied to. The zoom behaviour is attached to the SVG itself.
  var zoomLayer = svg.append("g").attr("class", "zoom-layer");

  var zoom = d3.zoom()
    .scaleExtent([0.2, 4])
    .on("zoom", function (event) {
      zoomLayer.attr("transform", event.transform);
    });

  svg.call(zoom);

  // Start zoomed-out a little so a dense network is immediately visible.
  var initialScale = 0.85;
  var initialTransform = d3.zoomIdentity
    .translate(WIDTH * (1 - initialScale) / 2, HEIGHT * (1 - initialScale) / 2)
    .scale(initialScale);
  svg.call(zoom.transform, initialTransform);

  // ── Arrow marker ──────────────────────────────────────────────────
  svg
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "end-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 6)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

  // ── Cola layout ───────────────────────────────────────────────────
  var d3cola = cola
    .d3adaptor(d3)
    .avoidOverlaps(true)
    .size([WIDTH, HEIGHT]);

  graph.nodes.forEach(function (v) {
    v.height = v.width = 2 * (v.name === "GATE" ? GATE_RADIUS : NODE_RADIUS);
  });

  d3cola
    .nodes(graph.nodes)
    .links(graph.links)
    .constraints(graph.constraints)
    .symmetricDiffLinkLengths(REPEL_FORCE)
    .linkDistance(LINK_DISTANCE)
    .start(10, 15, 20);

  // ── Links ─────────────────────────────────────────────────────────
  var path = zoomLayer
    .selectAll(".link")
    .data(graph.links)
    .enter()
    .append("svg:path")
    .attr("class", "link");

  path.append("title").text(function (d) {
    return [
      "Weight: "  + Math.round(d.weight * 1000) / 1000,
      "Source: "  + d.source.id,
      "Target: "  + d.target.id,
    ].join("\n");
  });

  // ── Nodes ─────────────────────────────────────────────────────────
  var node = zoomLayer
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("class", function (d) { return "node " + d.name; })
    .attr("r", function (d) { return d.name === "GATE" ? GATE_RADIUS : NODE_RADIUS; })
    .call(d3cola.drag);

  node.append("title").text(function (d) {
    return [
      "Activation: " + Math.round(d.activation * 1000) / 1000,
      "Bias: "       + Math.round(d.bias       * 1000) / 1000,
      "Position: "   + d.id,
    ].join("\n");
  });

  // ── Labels ────────────────────────────────────────────────────────
  var label = zoomLayer
    .selectAll(".label")
    .data(graph.nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .text(function (d) { return "(" + d.index + ") " + d.name; })
    .call(d3cola.drag);

  // ── Tick ─────────────────────────────────────────────────────────
  d3cola.on("tick", function () {
    path.attr("d", function (d) {
      var deltaX = d.target.x - d.source.x;
      var deltaY = d.target.y - d.source.y;
      var dist   = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      var normX  = dist ? deltaX / dist : 0;
      var normY  = dist ? deltaY / dist : 0;

      var sourcePadding = d.source.width / 2;
      var targetPadding = d.target.width / 2 + 2;
      var sourceX = d.source.x + sourcePadding * normX;
      var sourceY = d.source.y + sourcePadding * normY;
      var targetX = d.target.x - targetPadding * normX;
      var targetY = d.target.y - targetPadding * normY;

      // Self-edge
      var drx = 0, dry = 0, xRotation = 0, largeArc = 0, sweep = 1;
      if (d.source.x === d.target.x && d.source.y === d.target.y) {
        xRotation = -45; largeArc = 1; drx = dry = 20;
        targetX += 1; targetY += 1;
      }

      return `M${sourceX},${sourceY}A${drx},${dry} ${xRotation},${largeArc},${sweep} ${targetX},${targetY}`;
    });

    node
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; });

    label
      .attr("x", function (d) { return d.x + 10; })
      .attr("y", function (d) { return d.y - 10; });
  });
}

export default drawGraph;
