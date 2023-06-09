const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");


const road=new Road(carCanvas.width/2, carCanvas.width*0.9);

//Hyper parameters
const MUTATION_RATE = 0.02; //How much the brain changes from the last timeout
const N = 100; //The number of cars being generated for the mutation
const CAR_SPEED = 4; //How fast the car is going

//const car=new Car(road.getLaneCenter(3),100,30,50,"AI","blue");

//Generate many cars
const cars=generateCars(N);
let bestCar = cars[0]; //Use let because it is changing
if(localStorage.getItem("bestBrain")) {
  for(let i=0; i < cars.length; i++) {
    cars[i].brain= JSON.parse(
      localStorage.getItem("bestBrain"));
      if(i != 0) {
          NeuralNetwork.mutate(cars[i].brain,MUTATION_RATE);
      }
  }
}

const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2,getRandomColor()),

    new Car(road.getLaneCenter(1),-900,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-1100,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-900,30,50,"DUMMY",2.1,getRandomColor()),
];

animate();

function save() {
  localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars=[];
  for(let i=0; i< N; i++) {
    cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI", CAR_SPEED));
  }
  return cars;
}

function animate(time) {
  for(let i=0; i<traffic.length;i++) {
    traffic[i].update(road.borders,[]);
  }

  //car.update(road.borders, traffic);
  for(let i=0; i<cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  //syntax to put only the y.s into an array
  bestCar=cars.find(
    c=>c.y==Math.min(
      ...cars.map(c=>c.y)
    ));


  carCanvas.height=window.innerHeight;
  networkCanvas.height=window.innerHeight;

  carCtx.save();
  carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
  road.draw(carCtx);
  for(let i=0; i< traffic.length; i++) {
    traffic[i].draw(carCtx);
  }

  //car.draw(carCtx);


  carCtx.globalAlpha = 0.2; //make semi transparent
  for(let i=0; i< cars.length; i++) {
    cars[i].draw(carCtx);
  }
  carCtx.globalAlpha = 1; //making it normal so it won't effect the look elsewhere
  bestCar.draw(carCtx, true);

  carCtx.restore();

  networkCtx.lineDashOffset=-time/50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
