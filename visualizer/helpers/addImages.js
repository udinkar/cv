function addImages(d){
  $("#aptCarousel").carousel('pause');

  d3.select("#aptCarousel div.carousel-inner")
    .selectAll(".item")
    .remove();
  d3.select("#aptCarousel ol.carousel-indicators")
    .selectAll("li")
    .remove();

  d3.select("#aptCarousel div.carousel-inner")
    .selectAll(".item")
      .data(d.imgs)
    .enter()
      .append("div")
      .attr("class", "item")
      .classed("active", function(d, i){ return i==0 })
    .append("img")
      .attr("src", function(d){ return d })
      .attr("alt", "Not availible");

  d3.select("#aptCarousel ol.carousel-indicators")
    .selectAll("li")
      .data(d.imgs)
    .enter()
      .append("li")
      .attr("data-target", "#aptCarousel")
      .attr("data-slide-to", function(d, i){ return i })
      .classed("active", function(d, i){ return i==0 });

  $("#aptCarousel").carousel('cycle');

}