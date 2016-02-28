// This plot is based on the following example
// http://bl.ocks.org/mbostock/3887118

var plot = {};

plot.margin = {
    top: 40,
    right: 30,
    bottom: 20,
    left: 40
}

plot.dimention = {};
plot.measure = function(){
    plot.dimention.height = $(window).height()*0.4 - plot.margin.top - plot.margin.bottom,
    plot.dimention.width = $("#scatter-plot").width() - plot.margin.left - plot.margin.right
}
plot.measure();

plot.x = d3.scale.linear()
    .range([0, plot.dimention.width]);

plot.y = d3.scale.linear()
    .range([plot.dimention.height, 0]);
    
plot.xAxis = d3.svg.axis()
    .scale(plot.x)
    .orient("bottom");
    
plot.yAxis = d3.svg.axis()
    .scale(plot.y)
    .orient("left");
    
plot.svg = d3.select("#scatter-plot")
    .append("svg")
        .attr("width", plot.dimention.width + plot.margin.right + plot.margin.left)
        .attr("height", plot.dimention.height + plot.margin.top + plot.margin.bottom)
    .append("g")
        .attr("transform", "translate(" + plot.margin.left + "," + plot.margin.top + ")"); 
        
d3.json("data.json", function(error, data){
  if (error) throw error;
  
  data.forEach(function(d) {
    d.price = +d.price;
    d.duration = +d.duration;
  });
  
  plot.x.domain(d3.extent(data, function(d) { return d.duration; })).nice();
  plot.y.domain(d3.extent(data, function(d) { return d.price; })).nice();
  
  plot.xAxis.tickValues(plot.x.domain());
  plot.yAxis.tickValues(plot.y.domain());
  
  plot.svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 0 + "," + plot.dimention.height + ")")
    .call(plot.xAxis);
    
  plot.svg.append("g")
    .attr("class", "y axis")
    .call(plot.yAxis);
    
  plot.svg.append("text")
    .attr("x", plot.dimention.width/2)
    .attr("y", plot.dimention.height+18)
    .text("min")
    .style("font-weight", "bolder")
    
  plot.svg.append("text")
    .attr("x", -10)
    .attr("y", plot.dimention.height/2)
    .attr('text-anchor', 'end')
    .text("$")
    .style("font-weight", "bolder")

  plot.svg.selectAll(".node")
      .data(data)
    .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .attr("cx", function(d) { return plot.x(d.duration + Math.random()*4); })
      .attr("cy", function(d) { return plot.y(d.price + Math.random()*80); })
      .style("fill", function(d) {
        if(d.duration > 60){
          return '#ff7f0e';
        }
        return '#2ca02c';
      });
  var nodes = plot.svg.selectAll(".node");
  
  Rx.Observable.create(function(observer){
    d3.selectAll('.node')
      .on('click', function(d, i){
        observer.onNext({data: d, index: i});
      });
  }).forEach(function(event){
    d3.select(nodes[0][event.index])
      .style("fill", '#17becf')
      .style("fill-opacity", 0.3);
    OpenInNewTab(event.data.uri);
  })
    
  Rx.Observable.create(function(observer){
    d3.selectAll('.node')
      .on('mouseover', function(data, i){
        observer.onNext(data);
      });
  }).forEach(function(node){
    addImages(node);
    calculateAndDisplayRoute(node.location, end);
  })
  
});
