var horizon;
let speed = 0.005
let tracker = 0;
var carImg,obstacleImg;
let obcarImages = []
let cars = []
let coins = []
let obstacles = []
let repair_boxes = []
let nitros = []
let score = 0
let xp = 100

let origspeed;
let boosted = false

let PLAY = 1
let END = 0
let gameState = PLAY

const gameModal = document.getElementById('gameModal')

function preload(){
    carImg = loadImage("./images/main_rear.png")
    obcarImages.push(loadImage("./images/y_front.png"))
    obcarImages.push(loadImage("./images/g_front.png"))
    obcarImages.push(loadImage("./images/b_front.png"))
    obstacleImg = loadImage("./images/obstacle_crate.png")

}


function setup(){
    new Canvas(windowWidth, windowHeight)
    horizon = height*0.4

    car = new Sprite(width/2, horizon*2, 100,35)
    car.image = carImg
    car.scale = 1.3

     modalButton.addEventListener('click', ()=>{

            for(let carP of cars){
                carP.remove();
            }

            for(let coinP of coins){
                coinP.remove();
            }

            for(let obstacleP of obstacles){
                obstacleP.remove();
            }

            for(let repboxP of repair_boxes){
                repboxP.remove();
            }

            for(let nitroP of nitros){
                nitroP.remove();
            }

            cars = []
            coins = []
            obstacles = []
            repair_boxes = []
            nitros = []
            score = 0
            xp = 100
            car.x = width/2
            car.y = horizon*2

            if(boosted === true){
                speed = origspeed
                boosted = false
            }

            gameModal.classList.remove('flex')
            gameModal.classList.add('hidden')
            gameState = PLAY 
    })
}

function draw(){
    background(135, 206, 250)

    textSize(20)
    fill('black')
    text("Score: "+ score, width-100, 30)
    text("XP: "+ xp, width-200, 30)


    noStroke()
    fill(43, 98, 3) 
    rect(0,horizon,width,height-horizon)

    fill(24, 26, 27)
    let roadLowerW = 700 
    let roadUpperW = 30
    quad(
        width/2 - roadUpperW, horizon,
        width/2 + roadUpperW, horizon,
        width/2 + roadLowerW, height,
        width/2 - roadLowerW, height
    )

    if (gameState === PLAY){

        tracker += speed*10; //to advance things per frame 
        spawnMovingRoad();

        //main car control
        if(keyIsDown(37) && car.x>=350){
            car.x -= 10
        }

        if(keyIsDown(39) && car.x<=1200){
            car.x += 10
        }

        speed += 0.00000001

         opCarSpawn();

        if(boosted === true){
            if(millis()-start>=5000){
                speed = origspeed;
                boosted = false
            }
        }

        if(xp <= 0){
            gameState = END
        }

    }


    if(gameState === END){
        spawnConstRoad();

        gameModal.classList.remove('hidden')
        gameModal.classList.add('flex')
    }

}


function opCarSpawn(){
    //opposite car spawn
    //also, coin spawn
    //also,obstacle spawn
    //also, repair box spawn
    //also, nitro spawn
        let random1 = {
            x_ini: width/2 + 5,
            x_fin: width/2 + 200
        }

        let random2 = {
            x_ini: width/2 + 15,
            x_fin: width/2 + 500
        }

        let random3 = {
            x_ini: width/2 - 5,
            x_fin: width/2 - 200
        }

        let random4 = {
            x_ini: width/2 - 15,
            x_fin: width/2 - 500
        }

        let random_opcar_pos = [random1, random2, random3, random4]

        //obstacle cars
        if(frameCount % 180 == 0){
            obCar = new Sprite(0,0, 50, 25)
            obCar.image = random(obcarImages)
            obCar.progress = 0
            obCar.object = random(random_opcar_pos)
            cars.push(obCar)
            
        }

        for(let carP of cars){
                
                carP.progress += speed
                let Progress = carP.progress * carP.progress
                let ycoord = lerp(horizon, height, Progress)
                let xcoord = lerp(carP.object.x_ini,carP.object.x_fin,Progress)
                let scaling = lerp(0.2,2.5,Progress)

                carP.x = xcoord
                carP.y = ycoord
                carP.scale = scaling

                //to check collision between opp cars and main car
                if(car.overlaps(carP)){
                    gameState = END
                }

                if(carP.y==height){
                    carP.remove()
                }

            }

        //coins
        if(frameCount % 50 == 0 && frameCount%180 != 0){
            coin0 =new Sprite(0,0,20,20)
            coin0.addAni("spin","./images/coin_frames/tile000.png","./images/coin_frames/tile001.png","./images/coin_frames/tile002.png","./images/coin_frames/tile003.png","./images/coin_frames/tile004.png","./images/coin_frames/tile005.png","./images/coin_frames/tile006.png","./images/coin_frames/tile007.png","./images/coin_frames/tile008.png")
            coin0.progress = 0
            coin0.object = random(random_opcar_pos)
            coins.push(coin0)
        }

        for(let coinP of coins){
                
                coinP.progress += speed
                let Progress = coinP.progress * coinP.progress
                let ycoord = lerp(horizon, height, Progress)
                let xcoord = lerp(coinP.object.x_ini,coinP.object.x_fin,Progress)
                let scaling = lerp(0.3,2.7,Progress)

                coinP.x = xcoord
                coinP.y = ycoord
                coinP.scale = scaling

                //to check collision between coins and main car
                if(coinP.overlaps(car)){
                    score += 10
                    coinP.remove()
                }

                if(coinP.y==height){
                    coinP.remove()
                }

            }  

        //obstacles
        if(frameCount % 50 != 0 && frameCount%180 != 0 && frameCount%260 == 0){
            obstacle0 =new Sprite(0,0,30,30)
            obstacle0.image = obstacleImg
            obstacle0.progress = 0
            obstacle0.object = random(random_opcar_pos)
            obstacles.push(obstacle0)
        }

        for(let obstacleP of obstacles){
                
                obstacleP.progress += speed
                let Progress = obstacleP.progress * obstacleP.progress
                let ycoord = lerp(horizon, height, Progress)
                let xcoord = lerp(obstacleP.object.x_ini,obstacleP.object.x_fin,Progress)
                let scaling = lerp(0.3,2.7,Progress)

                obstacleP.x = xcoord
                obstacleP.y = ycoord
                obstacleP.scale = scaling

                //to check collision between coins and main car
                if(obstacleP.overlaps(car)){
                    xp -= 50
                    obstacleP.remove()
                }

                if(obstacleP.y==height){
                    obstacleP.remove()
                }

            }  

        //repair boxes  
        if(frameCount % 50 != 0 && frameCount%180 != 0 && frameCount%260 != 0 && frameCount%583 == 0){
            repbox0 =new Sprite(0,0,15,15)
            repbox0.addAni("repbox","./images/chest_repair/frame0000.png","./images/chest_repair/frame0001.png","./images/chest_repair/frame0002.png","./images/chest_repair/frame0003.png","./images/chest_repair/frame0004.png","./images/chest_repair/frame0005.png","./images/chest_repair/frame0006.png")
            repbox0.progress = 0
            repbox0.object = random(random_opcar_pos)
            repair_boxes.push(repbox0)
        }

        for(let repboxP of repair_boxes){
                
                repboxP.progress += speed
                let Progress = repboxP.progress * repboxP.progress
                let ycoord = lerp(horizon, height, Progress)
                let xcoord = lerp(repboxP.object.x_ini,repboxP.object.x_fin,Progress)
                let scaling = lerp(1.5,4,Progress)

                repboxP.x = xcoord
                repboxP.y = ycoord
                repboxP.scale = scaling

                //to check collision between repair boxes and main car
                if(repboxP.overlaps(car)){
                    if(xp<=60){
                        xp += 40
                    } else {
                        xp = 100
                    }
                    repboxP.remove()
                }

                if(repboxP.y==height){
                    repboxP.remove()
                }

            }    

        //nitro
        if(frameCount % 50 != 0 && frameCount%180 != 0 && frameCount%260 != 0 && frameCount%583 != 0 && frameCount % 913 == 0){
            nitro0 =new Sprite(0,0,20,20)
            nitro0.addAni("nitroboost","./images/gem_power/frame0000.png","./images/gem_power/frame0001.png","./images/gem_power/frame0002.png","./images/gem_power/frame0003.png","./images/gem_power/frame0004.png","./images/gem_power/frame0005.png","./images/gem_power/frame0006.png")
            nitro0.progress = 0
            nitro0.object = random(random_opcar_pos)
            nitros.push(nitro0)
        }

        for(let nitroP of nitros){
                
                nitroP.progress += speed
                let Progress = nitroP.progress * nitroP.progress
                let ycoord = lerp(horizon, height, Progress)
                let xcoord = lerp(nitroP.object.x_ini,nitroP.object.x_fin,Progress)
                let scaling = lerp(0.7,2.1,Progress)

                nitroP.x = xcoord
                nitroP.y = ycoord
                nitroP.scale = scaling

                //to check collision between nitro and main car
                if(nitroP.overlaps(car)){
                    origspeed = speed
                    speed = speed*2
                    start = millis()
                    nitroP.remove()
                    boosted = true
                }

                if(nitroP.y==height){
                    nitroP.remove()
                }

            }    

          
}


function spawnConstRoad(){
        //lanes of road: yellow colored
        fill(204, 153, 0)

        //mid lane
        for(i=1; i<11; i++){

            let ProgressUpper = (i*i)/100
            let ProgressBottom = ((i + 0.6)*(i + 0.6))/100

            let dashTopY = lerp(horizon, height, ProgressUpper)
            let dashBottomY = lerp(horizon, height, ProgressBottom)

            let dashTopWidth = lerp(2,20,ProgressUpper)
            let dashBottomWidth = lerp(2,20,ProgressBottom)

            quad(
                width/2 - dashTopWidth/2, dashTopY,
                width/2 + dashTopWidth/2, dashTopY,
                width/2 + dashBottomWidth/2, dashBottomY,
                width/2 - dashBottomWidth/2, dashBottomY,
            )

            

        }

        //left lane
        let u1 = width/2 - 300

        for(i=1; i<11; i++){

            let ProgressUpper = (i*i)/100
            let ProgressBottom = ((i + 0.6)*(i + 0.6))/100

            let dashTopY = lerp(horizon, height, ProgressUpper)
            let dashBottomY = lerp(horizon, height, ProgressBottom)

            let dashTopWidth = lerp(2,20,ProgressUpper)
            let dashBottomWidth = lerp(2,20,ProgressBottom)

            let roadTopX = lerp(width/2 - 7.5,u1, ProgressUpper)
            let roadBottomX = lerp(width/2 - 7.5,u1, ProgressBottom)

            quad(
                roadTopX-dashTopWidth, dashTopY,
                roadTopX, dashTopY,
                roadBottomX, dashBottomY,
                roadBottomX-dashBottomWidth, dashBottomY,
            )

        }

        //right lane
        let u2 = width/2 + 300

        for(i=1; i<11; i++){
            let ProgressUpper = (i*i)/100
            let ProgressBottom = ((i + 0.6)*(i + 0.6))/100

            let dashTopY = lerp(horizon, height, ProgressUpper)
            let dashBottomY = lerp(horizon, height, ProgressBottom)

            let dashTopWidth = lerp(2,20,ProgressUpper)
            let dashBottomWidth = lerp(2,20,ProgressBottom)

            let roadTopX = lerp(width/2 + 7.5,u2, ProgressUpper)
            let roadBottomX = lerp(width/2 + 7.5,u2, ProgressBottom)

            quad(
                roadTopX, dashTopY,
                roadTopX+dashTopWidth, dashTopY,
                roadBottomX+dashBottomWidth, dashBottomY,
                roadBottomX, dashBottomY,
            )

        }

        //borders of road: white
        fill(255, 255, 255)

        //right border of road
        let l2 = width/2 + 700

        for(i=1; i<11; i++){
            let ProgressUpper = (i*i)/100
            let ProgressBottom = ((i + 0.6)*(i + 0.6))/100

            let dashTopY = lerp(horizon, height, ProgressUpper)
            let dashBottomY = lerp(horizon, height, ProgressBottom)

            let dashTopWidth = lerp(2,20,ProgressUpper)
            let dashBottomWidth = lerp(2,20,ProgressBottom)

            let roadTopX = lerp(width/2 + 30,l2, ProgressUpper)
            let roadBottomX = lerp(width/2 + 30,l2, ProgressBottom)

            quad(
                roadTopX, dashTopY,
                roadTopX+dashTopWidth, dashTopY,
                roadBottomX+dashBottomWidth, dashBottomY,
                roadBottomX, dashBottomY,
            )

        }

        //left border of road
        let l1 = width/2 - 700

        for(i=1; i<11; i++){
            let ProgressUpper = (i*i)/100
            let ProgressBottom = ((i + 0.6)*(i + 0.6))/100

            let dashTopY = lerp(horizon, height, ProgressUpper)
            let dashBottomY = lerp(horizon, height, ProgressBottom)

            let dashTopWidth = lerp(2,20,ProgressUpper)
            let dashBottomWidth = lerp(2,20,ProgressBottom)

            let roadTopX = lerp(width/2 - 30,l1, ProgressUpper)
            let roadBottomX = lerp(width/2 - 30,l1, ProgressBottom)

            quad(
                roadTopX-dashTopWidth, dashTopY,
                roadTopX, dashTopY,
                roadBottomX, dashBottomY,
                roadBottomX-dashBottomWidth, dashBottomY,
            )

        }
}

function spawnMovingRoad(){
        //lanes of road: yellow colored
        fill(204, 153, 0)

        //mid lane
        for(i=1; i<11; i++){
            let position = (i + tracker)%10;

            let ProgressUpper = (position*position)/100
            let ProgressBottom = ((position + 0.6)*(position + 0.6))/100

            let dashTopY = lerp(horizon, height, ProgressUpper)
            let dashBottomY = lerp(horizon, height, ProgressBottom)

            let dashTopWidth = lerp(2,20,ProgressUpper)
            let dashBottomWidth = lerp(2,20,ProgressBottom)

            quad(
                width/2 - dashTopWidth/2, dashTopY,
                width/2 + dashTopWidth/2, dashTopY,
                width/2 + dashBottomWidth/2, dashBottomY,
                width/2 - dashBottomWidth/2, dashBottomY,
            )

            

        }

        //left lane
        let u1 = width/2 - 300

        for(i=1; i<11; i++){
            let position = (i + tracker)%10;

            let ProgressUpper = (position*position)/100
            let ProgressBottom = ((position + 0.6)*(position + 0.6))/100

            let dashTopY = lerp(horizon, height, ProgressUpper)
            let dashBottomY = lerp(horizon, height, ProgressBottom)

            let dashTopWidth = lerp(2,20,ProgressUpper)
            let dashBottomWidth = lerp(2,20,ProgressBottom)

            let roadTopX = lerp(width/2 - 7.5,u1, ProgressUpper)
            let roadBottomX = lerp(width/2 - 7.5,u1, ProgressBottom)

            quad(
                roadTopX-dashTopWidth, dashTopY,
                roadTopX, dashTopY,
                roadBottomX, dashBottomY,
                roadBottomX-dashBottomWidth, dashBottomY,
            )

        }

        //right lane
        let u2 = width/2 + 300

        for(i=1; i<11; i++){
            let position = (i + tracker)%10;

            let ProgressUpper = (position*position)/100
            let ProgressBottom = ((position + 0.6)*(position + 0.6))/100

            let dashTopY = lerp(horizon, height, ProgressUpper)
            let dashBottomY = lerp(horizon, height, ProgressBottom)

            let dashTopWidth = lerp(2,20,ProgressUpper)
            let dashBottomWidth = lerp(2,20,ProgressBottom)

            let roadTopX = lerp(width/2 + 7.5,u2, ProgressUpper)
            let roadBottomX = lerp(width/2 + 7.5,u2, ProgressBottom)

            quad(
                roadTopX, dashTopY,
                roadTopX+dashTopWidth, dashTopY,
                roadBottomX+dashBottomWidth, dashBottomY,
                roadBottomX, dashBottomY,
            )

        }

        //borders of road: white
        fill(255, 255, 255)

        //right border of road
        let l2 = width/2 + 700

        for(i=1; i<11; i++){
            let position = (i + tracker)%10;

            let ProgressUpper = (position*position)/100
            let ProgressBottom = ((position + 0.6)*(position + 0.6))/100

            let dashTopY = lerp(horizon, height, ProgressUpper)
            let dashBottomY = lerp(horizon, height, ProgressBottom)

            let dashTopWidth = lerp(2,20,ProgressUpper)
            let dashBottomWidth = lerp(2,20,ProgressBottom)

            let roadTopX = lerp(width/2 + 30,l2, ProgressUpper)
            let roadBottomX = lerp(width/2 + 30,l2, ProgressBottom)

            quad(
                roadTopX, dashTopY,
                roadTopX+dashTopWidth, dashTopY,
                roadBottomX+dashBottomWidth, dashBottomY,
                roadBottomX, dashBottomY,
            )

        }

        //left border of road
        let l1 = width/2 - 700

        for(i=1; i<11; i++){
            let position = (i + tracker)%10;

            let ProgressUpper = (position*position)/100
            let ProgressBottom = ((position + 0.6)*(position + 0.6))/100

            let dashTopY = lerp(horizon, height, ProgressUpper)
            let dashBottomY = lerp(horizon, height, ProgressBottom)

            let dashTopWidth = lerp(2,20,ProgressUpper)
            let dashBottomWidth = lerp(2,20,ProgressBottom)

            let roadTopX = lerp(width/2 - 30,l1, ProgressUpper)
            let roadBottomX = lerp(width/2 - 30,l1, ProgressBottom)

            quad(
                roadTopX-dashTopWidth, dashTopY,
                roadTopX, dashTopY,
                roadBottomX, dashBottomY,
                roadBottomX-dashBottomWidth, dashBottomY,
            )

        }
}