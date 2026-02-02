const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=500;

const carCtx=carCanvas.getContext("2d");
const networkCtx=networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=1;
const cars=generateCars(N);
let bestCar=cars[0];

if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

let traffic=[];
let lastSpawnY=0;
const LANE_COUNT=3;
const SPAWN_GAP=200;

for(let i=1;i<=8;i++){
    traffic.push(
        new Car(
            road.getLaneCenter(i%3),
            -i*200,
            30,
            50,
            "DUMMY",
            2,
            getRandomColor()
        )
    );
}

animate();

function save(){
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=0;i<N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function addTraffic(){
    const spawnY=bestCar.y-600;
    const occupied=new Set();

    for(const car of traffic){
        if(Math.abs(car.y-spawnY)<SPAWN_GAP){
            occupied.add(car.x);
        }
    }

    if(occupied.size>=LANE_COUNT-1) return;

    const freeLanes=[];
    for(let i=0;i<LANE_COUNT;i++){
        const laneX=road.getLaneCenter(i);
        if(!occupied.has(laneX)){
            freeLanes.push(laneX);
        }
    }

    const laneX=freeLanes[Math.floor(Math.random()*freeLanes.length)];

    traffic.push(
        new Car(
            laneX,
            spawnY,
            30,
            50,
            "DUMMY",
            2,
            getRandomColor()
        )
    );
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    bestCar=cars.find(c=>c.y===Math.min(...cars.map(c=>c.y)));

    if(bestCar.y<lastSpawnY-200){
        addTraffic();
        lastSpawnY=bestCar.y;
    }

    traffic=traffic.filter(c=>c.y<bestCar.y+500);

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);

    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }

    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;

    bestCar.draw(carCtx,true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);

    requestAnimationFrame(animate);
}


