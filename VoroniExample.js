//      A simplefied version of https://bl.ocks.org/mbostock/4060366 (wihtout mouse interactions), ported to p5.js
var regions = [];
var sensor;
var vehicles = [];
var bgcolor;

function setup() {

    var width = 1000, height = 1000;
    
    
 
    let cvs = createCanvas(width, height);
    cvs.position(25,25)
    bgcolor = color(28,47,47)
    background(bgcolor);
    resetSketch();
    // create reset button
    button = createButton('reset');
    button.position(25, 0);
    button.mousePressed(resetSketch)
   
}  

function resetSketch() {
    regions = []
    vehicles = []
    polydraw();
    for(let i = 0; i < 10;i++){

      vehicles.push(new AgentVehicle(500,500, regions,i));  
    }
}


    
function polydraw() {
    strokeWeight(5)
    stroke(100)
    rect(0,0,1000,1000)
    

  var vertices = d3.range(50).map(function(d) {
    return [floor(random(100,900)), floor(random(100,900))];
  });

  //make the delaunay
  var delaunay = d3.Delaunay.from(vertices)
  
  //make the voroni
  var voronoi = delaunay.voronoi([100, 100, 900, 900])


  i = 0
  for(let value of voronoi.cellPolygons()) {
    r = new Region(i, i);
    r.addRegionPolygon(value); // 1, then 2
    r.calculateInfoCuePosition(5)
    r.hypothError = 20;
    regions.push(r)
    i++ //just to give it its uid
  }
 
//  label
fill(0);
noStroke();
text('CISCR.js Area of Operation', 15, 15);

} //end of polyDraw 

function draw(){
    background(bgcolor)
    for(var i = 0; i < regions.length;i++){
        r = regions[i];
        
        r.showRegionPoly()
        r.showRegionCentroid()
        
        r.showInfoCues();
      
        r.showHypothError()
    }
      
    for(let v of this.vehicles){
        v.wander();
        v.update();
        v.show();
        v.edges();

    }
    

}
