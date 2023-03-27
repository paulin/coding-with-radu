class Road{
  constructor(x,width,landCount=3){
    this.x=x;
    this.width=width;
    this.landCount=landCount;

    this.left=x-width/2;
    this.right=x+width/2;

    const infinity=1000000;
    this.top=-infinity;
    this.bottom=infinity;
  }

  draw(ctx) {
    ctx.lineWidth=5;
    ctx.strokeStyle="white";

    for(let i=0; i<=this.landCount; i++) {
      const x=lerp(
        this.left,
        this.right,
        i/this.landCount
      )
      if(i>0 && i<this.landCount) {
        ctx.setLineDash([20,20]);
      }else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
  }
}
