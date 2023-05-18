const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;
var fruit_con_3;
var rope3;

var bg_img;
var food;
var rabbit;

var button,button2,button3;
var bunny;
var blink,eat,sad;
var mute_btn;

var fr;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;

var starsfixer

var star, star1, starcount, starcount1Img, starcount2Img, starcount3Img, starImg;

var balloon;

var milisecondshandler, miliseccal;

var bunnyxside

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');
  starImg = loadImage('star.png');
  starcount1Img = loadAnimation('empty.png');
  starcount2Img = loadAnimation('one_star.png');
  starcount3Img = loadAnimation('stars.png');
  
  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");


  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() 
{
  createCanvas(600,700);
  frameRate(80);


  bk_song.play();
  bk_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  //btn 1
  button = createImg('cut_btn.png');
  button.position(100,90);
  button.size(50,50);
  button.mouseClicked(drop);

   //btn 2
   button2 = createImg('cut_btn.png');
   button2.position(450,90);
   button2.size(50,50);
   button2.mouseClicked(drop2);

   balloon = createImg('baloon2.png');
   balloon.position(260,370);
   balloon.size(120,120);
   balloon.mouseClicked(airblow);
 
   rope = new Rope(7,{x:120,y:90});
   rope2 = new Rope(7,{x:490,y:90});


  mute_btn = createImg('mute.png');
  mute_btn.position(width-50,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);
  
  ground = new Ground(250,height,width,20);
  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(120,620,100,100);
  bunny.scale = 0.2;

  star = createSprite(320,50,20,20);
  star.addImage(starImg);
  star.scale = 0.02

  starcount = createSprite(50,20,30,30);
  starcount.scale = 0.2
  starcount.addAnimation('empty',starcount1Img);
  starcount.addAnimation('onestar',starcount2Img);
  starcount.addAnimation('fullstar',starcount3Img);
  starcount.changeAnimation('empty');
  
  star1 = createSprite(50,370,20,20);
  star1.addImage(starImg);
  star1.scale = 0.02

  star
  

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');

  
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con_2 = new Link(rope2,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  

  starsfixer = 0
  bunnyxside = 1
}

function draw() 
{
  background(51);
  image(bg_img,0,0,width,height);

  push();
  imageMode(CENTER);
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  if (bunnyxside==1) {
    bunny.x = bunny.x+1;
  }
else if (bunnyxside==2) {
 bunny.x = bunny.x-1;
}

  if (bunny.x==550) {
    bunnyxside = 2;

  }

  if (bunny.x==50) {
    bunnyxside = 1;
  }


  rope.show();
  rope2.show();

  Engine.update(engine);
  ground.show();

  drawSprites();

  if(collide(fruit,bunny,80)==true)
  {
    World.remove(engine.world,fruit);
    fruit = null;
    bunny.changeAnimation('eating');
    eating_sound.play()
    alert_popup("win");
  }

  if(fruit!=null && fruit.position.y>=650)
  {
    bunny.changeAnimation('crying');
    bk_song.stop();
    sad_sound.play();
    fruit=null;
    alert_popup("loose");
   }

   if (collide(fruit,star,20)==true) {
    star.visible = false;
    starcount.changeAnimation('onestar');
   }

   if (collide(fruit,star1,20)==true) {
    star1.visible = false;
    starcount.changeAnimation('fullstar');

   }
  
  }

function drop()
{
  cut_sound.play();
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
}


function drop2()
{
  cut_sound.play();
  rope2.break();
  fruit_con_2.dettach();
  fruit_con_2 = null;
}

function collide(body,sprite,x)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=x)
            {
               return true; 
            }
            else{
              return false;
            }
         }
}


function mute()
{
  if(bk_song.isPlaying())
     {
      bk_song.stop();
     }
     else{
      bk_song.play();
     }
}

function airblow() {
  Matter.Body.applyForce(fruit, {x: 0, y: 0},{x: 0, y: -0.03});
}

function counting(seconds) {
 miliseccal = seconds*1000;
}

function alert_popup(endgame) {
  if (endgame=="loose") {
    if (confirm("You Lost! Do you want to try again?")) {
      window.location.reload();
    } else {

    }
  } else if (endgame=="win") {
    if (confirm("You Won! Do you want to play again?")) {
      window.location.reload();
    } else {

    }
  }
}
