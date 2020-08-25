function chart(csv) {
  var keys = d3.keys(csv[0]).slice(1);
  var xTitle = d3.keys(csv[0]).slice(0, 1);
  var rowIds = csv.map(function (d) {
    return d[xTitle[0]];
  });

  var margin = { top: 80, right: 35, bottom: 35, left: 35 },
    innerWidth = 1220 - margin.left - margin.right,
    innerHeight = 600 - margin.top - margin.bottom;

  var svg = d3
    .select("#savings-chart")
    .append("svg")
    .attr("width", innerWidth + margin.left + margin.right)
    .attr("height", innerHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("text")
    .attr("x", innerWidth / 2)
    .attr("y", -margin.top / 2.8)
    .attr("class", "chart-title")
    .style("font-size", "1.5em")
    .text("Actuals & Expected Trends vs. OP2");

  var tip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function (data, keys) {
      return '<div class="tooltip">' + keys + ": " + data + "</div>";
    });

  svg.call(tip);

  var x = d3.scale.ordinal().rangeRoundBands([0, innerWidth], 0.3);
  var y = d3.scale.linear().rangeRound([innerHeight, 0]);
  var z = d3.scale
    .ordinal()
    .range(["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4"]);

  var xAxis = d3.svg
    .axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-innerHeight, 0, 0)
    .tickPadding(10);

  var yAxis = d3.svg
    .axis()
    .scale(y)
    .orient("left")
    .tickSize(-innerWidth, 0, 0)
    .tickPadding(10);

  x.domain(keys);

  y.domain([
    0,
    d3.max(
      (function (array, names) {
        var res = [];
        array.forEach(function (item) {
          names.forEach(function (name) {
            res = res.concat(item[name]);
          });
        });
        return res;
      })(csv, keys)
    ),
  ]);

  svg
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + innerHeight + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "axis axis--y")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .attr("class", "axis-lable")
    .text(xTitle[0]);

  var bars = [];
  keys.forEach(function (k) {
    bars.push({
      x: k,
      y: csv[0][k],
      z: csv[0][xTitle[0]],
    });
  });

  var bar = svg
    .selectAll(".bars")
    .data(bars)
    .enter()
    .append("g")
    .attr("class", "bars")
    .style("fill", z(0));

  bar
    .append("rect")
    .attr("x", function (d) {
      return x(d.x);
    })
    .attr("y", function (d) {
      return y(d.y);
    })
    .attr("width", x.rangeBand())
    .attr("height", function (d) {
      return innerHeight - y(d.y);
    })
    .on("mouseover", function (d) {
      tip.show(d.y, d.z);
    })
    .on("mouseout", tip.hide);

  var lines = [];
  keys.forEach(function (k) {
    lines.push({
      x: k,
      y: csv[2][k],
      z: csv[2][xTitle[0]],
    });
  });

  var line = d3.svg
    .line()
    .x(function (d, i) {
      return x(d.x) + x.rangeBand() / 2;
    })
    .y(function (d) {
      return y(d.y);
    })
    .interpolate("cardinal");

  var lineGraph = svg
    .selectAll(".lines")
    .data(lines)
    .enter()
    .append("g")
    .attr("class", "lines");

  lineGraph
    .append("path")
    .attr("d", line(lines))
    .attr("stroke", z(2))
    .attr("stroke-width", 2)
    .attr("fill", "none");

  lineGraph
    .append("circle")
    .style("stroke", "white")
    .style("fill", "white")
    .style("opacity", ".5")
    .attr("r", 10)
    .attr("cx", function (d) {
      return x(d.x) + x.rangeBand() / 2;
    })
    .attr("cy", function (d) {
      return y(d.y);
    })
    .on("mouseover", function (d) {
      tip.show(d.y, d.z);
    })
    .on("mouseout", tip.hide);

  var circles = [];
  keys.forEach(function (k) {
    circles.push({
      x: k,
      y: csv[3][k],
      z: csv[3][xTitle[0]],
    });
  });

  var circle = svg
    .selectAll(".circle")
    .data(circles)
    .enter()
    .append("g")
    .attr("class", "circle");

  circle
    .append("circle")
    .style("stroke", z(3))
    .style("fill", z(3))
    .attr("r", 6)
    .attr("cx", function (d) {
      return x(d.x) + x.rangeBand() / 2;
    })
    .attr("cy", function (d) {
      return y(d.y);
    })
    .on("mouseover", function (d) {
      tip.show(d.y, d.z);
    })
    .on("mouseout", tip.hide);

  var dashes = [];
  keys.forEach(function (k) {
    dashes.push({
      x: k,
      y: csv[1][k],
      z: csv[1][xTitle[0]],
    });
  });

  var dash = svg
    .selectAll(".dash")
    .data(dashes)
    .enter()
    .append("g")
    .attr("class", "dash");

  dash
    .append("rect")
    .attr("x", function (d) {
      return x(d.x) + x.rangeBand() / 2 - 10;
    })
    .attr("y", function (d) {
      return y(d.y) - 8;
    })
    .attr("width", 20)
    .attr("height", 8)
    .style("fill", z(1))
    .on("mouseover", function (d) {
      tip.show(d.y, d.z);
    })
    .on("mouseout", tip.hide);

  var legend = svg
    .append("g")
    .attr("transform", `translate(0,100)`)
    .selectAll(".legend")
    .data(rowIds)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend
    .append("rect")
    .attr("x", innerWidth - 15)
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", function (d, i) {
      return z(i);
    });

  legend
    .append("text")
    .attr("x", innerWidth - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function (d) {
      d = d[0].toUpperCase() + d.substr(1).replace("_", " ");
      return d;
    });
}

function type(d) {
  var keys = d3.keys(d).slice(1);
  keys.forEach(function (i) {
    d[i] = +d[i];
  });
  return d;
}

var weeks = [
  { display: "Week 1", value: 1 },
  { display: "Week 2", value: 2 },
  { display: "Week 3", value: 3 },
];

// d3.select("#week-selector")
//   .selectAll("myOptions")
//   .data(weeks)
//   .enter()
//   .append("option")
//   .text(function (d) {
//     console.log(d);
//     return d.display;
//   })
//   .attr("value", function (d) {
//     return d.value;
//   });

var dropDownChange = function () {
  var newWeek = d3.select(this).property("value");
  console.log(newWeek);
  run(newWeek);
};

var dropDown = d3
  .select("#week-selector")
  .insert("select", "svg")
  .on("change", dropDownChange);

dropDown
  .selectAll("option")
  .data(weeks)
  .enter()
  .append("option")
  .text(function (d) {
    return d.display;
  })
  .attr("value", function (d) {
    return d.value;
  });

var initialWeek = 1;
run(initialWeek);

