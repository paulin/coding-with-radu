class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount=5;
    this.rayLength = 100; //pixels
    this.raySpread = Math.PI/2; //degrees

    this.rays=[];
    this.readings=[];
  }

  update(roadBorders) {
    this.#castRays();
    this.readings=[];
    // for(let i=0; i<this.rays.length; i++) {
    //   this.readings.push(
    //     this.#getReading(this.rays[i], roadBorders);
    //   );
    // }
    for(let i=0;i<this.rays.length;i++){
        this.readings.push(
            this.#getReading(
                this.rays[i],
                roadBorders
            )
        );
    }
  }

  #getReading(ray, roadBorders) {
    //Find all the touches and return the closest
    let touches=[];
    for(let i=0; i<roadBorders.length;i++) {
      const touch= getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      if(touch) {
        touches.push(touch);
      }
    }
    if(touches.length==0) {
      return null;
    } else {
      //Want all the offsets from all the touches
      const offsets=touches.map(e=>e.offset);
      //Now find the minimum onkeyup
      const minOffset=Math.min(...offsets);
      return touches.find(e=>e.offset==minOffset);
    }
  }

  #castRays(){
    this.rays=[];
    for(let i=0; i<this.rayCount; i++) {
      const rayAngle=lerp (
        this.raySpread/2,
        -this.raySpread/2,
        this.rayCount==1?0.5:i/(this.rayCount-1)
      )+this.car.angle;

      const start={x:this.car.x, y:this.car.y};
      const end={
        x:this.car.x- Math.sin(rayAngle)*this.rayLength,
        y:this.car.y- Math.cos(rayAngle)*this.rayLength

      };
      this.rays.push([start,end]);
      //console.log("made " + i + " angle " + rayAngle);
    }
    //console.log("done");
  }

  draw(ctx) {
    for(let i=0; i< this.rayCount; i++){
      let end=this.rays[i][1];
      if(this.readings[i]) {
        end=this.readings[i];
      }

      ctx.beginPath();
      ctx.lineWidth=2;
      ctx.strokeStyle="yellow";
      ctx.moveTo(
        this.rays[i][0].x,
        this.rays[i][0].y
      );
      ctx.lineTo (
        end.x,
        end.y
      );
      // console.log("draw " + i);
      // console.table(this.rays[i]);
      ctx.stroke();


      ctx.beginPath();
      ctx.lineWidth=2;
      ctx.strokeStyle="black";
      ctx.moveTo(
        this.rays[i][1].x,
        this.rays[i][1].y
      );
      ctx.lineTo (
        end.x,
        end.y
      );
      // console.log("draw " + i);
      // console.table(this.rays[i]);
      ctx.stroke();
    }
  }
}