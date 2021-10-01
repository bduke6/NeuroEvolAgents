// This Region class holds the data and oeprations needed to function in the CISCR model

class Region {
    
    constructor(name, index){
        this.name = name;
        this.index = index;
        this.apprehended = false;
        this.infoCues = [];
        this.infoCuesColors = [];
        this.polyVertexVec = [];
        this.centroid;
        this.hypothError;
        this.apprehenddor = -1;
        
        this.vcolors = [
            color(197,27,125), color(222,119,174), color(241,182,218), 
            color(253,224,239), color(247,247,247), color(230,245,208),
            color(184,225,134), color(127,188,65), color(77,146,33)
           ];

        this.regionColor = color(random(this.vcolors));
    }

    addRegionPolygon(coorArray){
        //
        for(let i = 0; i < coorArray.length; i++){
            this.polyVertexVec.push(createVector(coorArray[i][0],coorArray[i][1]))
        } 
        let croid = this.calculateCentroid(coorArray)
        this.centroid = createVector(croid[0],croid[1])
        
    }

    calculateCenterMass(arr){
        //algorithm for calculating center mass of a poly
       
        var minX, maxX, minY, maxY;
        for (var i = 0; i < arr.length; i++)
        {
            minX = (arr[i].x < minX || minX == null) ? arr[i].x : minX;
            maxX = (arr[i].x > maxX || maxX == null) ? arr[i].x : maxX;
            minY = (arr[i].y < minY || minY == null) ? arr[i].y: minY;
            maxY = (arr[i].y > maxY || maxY == null) ? arr[i].y: maxY;
        }
        
        this.centermass = createVector((minX + maxX) / 2, (minY + maxY) / 2);
            
    }

    calculateInfoCuePosition(maxInfoCue){
        //Random assignment of positions within the Region
        let maxR = 0
       
        for(let v of this.polyVertexVec){
            dist = this.centroid.dist(v)
            if(dist > maxR){
                maxR = dist
            }
        }
        while(this.infoCues.length < maxInfoCue){
            // make infoCues
            // random angle
            let a = random(0, 2*PI);

            // https://programming.guide/random-point-within-circle.html
            // we use square root of random for equal distribution of pointsfrom the center
            let r = 20 * sqrt(random(0, maxR));
            
            let x = this.centroid.x + r * cos(a);
            let y = this.centroid.y + r * sin(a);
            var tempvec = createVector(x,y)
            //check to see if point is inside polygon
            if(this.inside(tempvec.x,tempvec.y)){
                this.infoCues.push(tempvec);
                this.infoCuesColors.push(color('orange'))
            }
        }
    }//calculateInfoCuePosition

    setApprehended(){
        // check the T agents guess re: centermass
        this.apprehended = true
        this.regionColor = color(28,47,47)

    }

    inside(x,y) {

        // ray-casting algorithm based on
        // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
        
        let vs = this.polyVertexVec
        
        let inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i].x, yi = vs[i].y;
            var xj = vs[j].x, yj = vs[j].y;
            
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
    }

    calculateCentroid(v) 
    { 
        let ans = new Array(2); 
        ans.fill(0);
            
        let n = v.length; 
        let signedArea = 0; 
            
        // For all vertices 
        for (let i = 0; i < n; i++)
        { 
                
            let x0 = v[i][0], y0 = v[i][1]; 
            let x1 = v[(i + 1) % n][0], y1 = v[(i + 1) % n][1]; 
                                    
            // Calculate value of A 
            // using shoelace formula 
            let A = (x0 * y1) - (x1 * y0); 
            signedArea += A; 
                
            // Calculating coordinates of 
            // centroid of polygon 
            ans[0] += (x0 + x1) * A; 
            ans[1] += (y0 + y1) * A; 
        } 
        
        signedArea *= 0.5; 
        ans[0] = (ans[0]) / (6 * signedArea); 
        ans[1]= (ans[1]) / (6 * signedArea); 
        
        return ans; 
    }

    // the ic is a position vector
    showInfoCues(){ 
        //returns ic to black because the sensor turn them red 
        
        let i = 0
        for(let ic of this.infoCues){ 
            strokeWeight(5);
            stroke(this.infoCuesColors[i]);
            //stroke(color('blue'));
            point(ic.x,ic.y);
            i++
        } 
        for(let i = 0; i < this.infoCuesColors.length;i++){
            this.infoCuesColors[i] = color('black')
        }       
    }

    showRegionCentroid(){

        fill(0);
        strokeWeight(0)
        text(r.name,r.centroid.x,r.centroid.y);
    }

    showRegionPoly(){

        stroke(120);
        fill(this.regionColor)
        beginShape(LINE_LOOP)
     
            
            for(let v of this.polyVertexVec){ 
                strokeWeight(2)
                vertex(v.x,v.y);
            }  
    
        endShape();
    } // end of showRegionPoly

    update(){
        
    }

    //how error ellipse
    showHypothError(){
    
      push();
      strokeWeight(1)
      drawingContext.setLineDash([5,5])
      stroke('red')
      translate(this.centroid.x, this.centroid.y);
      noFill()
      ellipse(0, 0, this.hypothError * 2, this.hypothError * 2);
      pop();
    }  

} // end of sketch