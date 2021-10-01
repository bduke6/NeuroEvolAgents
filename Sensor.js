class Sensor{

    constructor(x,y,sensorRange, vehicleName){

        this.sensorRange = sensorRange;//radius of sensor circle 
        this.position = createVector(500,500);
        this.currentInfoCue = [];
        this.vehicleName = vehicleName;
        
    }
    

    update(regions){
        
        for(let r of regions){
            let j = 0;
            
            
            //get the infocues from each region
        
            for(let ic of r.infoCues){
                let dist = this.position.dist(ic)
                
                if(dist < this.sensorRange){
                    r.infoCuesColors[j] = color(255,0,0)
                    this.currentInfoCue.push(ic); 
                    if(r.apprehendor < 0){
                        r.apprehendor = this.vehicleName;
                    }
                    
                }
                j++   
            }
        } 
        if(this.currentInfoCue.length > 0)
            this.positHypothesis();
            this.currentInfoCue = []
    }

    positHypothesis(){
        //go through all the regions and see if the guess is correct
        let totx = 0;
        let toty = 0;
        for(let i = 0;i < this.currentInfoCue.length;i++){
            totx = totx + this.currentInfoCue[i].x;
            toty = toty + this.currentInfoCue[i].y;
        }
        
        let avgx = totx/this.currentInfoCue.length;
        let avgy = toty/this.currentInfoCue.length;

        let hypovec = createVector(avgx,avgy)
       
        for(let r of regions){
            if(r.centroid.dist(hypovec) < r.hypothError)
            {
                // region is apprehended
                r.setApprehended();
                //region color change happens when calling the region's apprehended method
                
            }
        }
    }

    show(){

        noFill()
        strokeWeight(1)
        stroke(color('black'))
        ellipse(this.position.x,this.position.y,this.sensorRange *2 ,this.sensorRange*2);

    }


}  //Sensor class