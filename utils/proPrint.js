const Canvas = require("canvas");
const Discord = require("discord.js");
Canvas.registerFont('./ARIALUNI.TTF', { family: 'ArSaSe' });
require("./stringProperties.js");


module.exports.run = async(message, args) => {
	try{
	let colorBack = args.color;
	let gamertag = args.gamertag;
	let username = args.name;
	let score = args.score;
	let friCount = args.friends;
	let follCount = args.followers;
	let bio = args.bio;
	let address = args.address;
	
	
	let imagePre = args.image.match(/url=.*?&/g)[0].replace(/url=/g, '').replace(/&$/g, '');
	

	
	let imageUrl = `http://images-eds.xboxlive.com/image?url=${imagePre}&format=png`

  let gms = await Canvas.loadImage("./gamerscore.png");


  
	let x = 512;
	let y = 900;
	
	let xx = 0;
  let yy = 0;
	
	
	let image = Canvas.createCanvas(x, y);
	let imagectx = image.getContext('2d');
	
	let bg;
	try{
		bg = await Canvas.loadImage(imageUrl);
	}catch{};
	

	imagectx.fillStyle = colorBack;
	imagectx.fillRect(0, 0, x, y);

imagectx.fillStyle = "white";
	imagectx.font = '30px "ArSaSe"';

	//	imagectx.drawImage(bg, 0, 0, 100, 100);
	
	const wcText = gamertag;
	const width = imagectx.measureText(wcText).width;
	
	
	imagectx.beginPath();
imagectx.globalAlpha = 0.5;
	imagectx.fillStyle = "black";
	imagectx.fillRect(0,0, x, 100);
	imagectx.globalAlpha = 1;
	imagectx.closePath();
	
	var X = 250;
var Y = 380;
var R = 180;
imagectx.beginPath();
imagectx.arc(X, Y, R, 0, 2 * Math.PI, true);
imagectx.lineWidth = 1;
imagectx.strokeStyle = colorBack;
imagectx.stroke();

	
	
	imagectx.fillStyle = "white";
	imagectx.font = '30px "ArSaSe"';

	imagectx.fillText(wcText, (x - width)/2, 50);

const width1 = imagectx.measureText("info").width;

imagectx.fillStyle = "grey";
	imagectx.font = '20px "ArSaSe"';

	imagectx.fillText("Info", (x - width1)/2, 80);

  //imagectx.fillRect(150,50,150,50);
  
  
  
  
  	
		
	imagectx.fillStyle = "white";
	imagectx.font = '25px "ArSaSe"';

  if(username && username !== ""){
  imagectx.fillText(username, 25, 150)
  
  imagectx.drawImage(gms, 15, 165, 30, 30);
  imagectx.fillText(score, 50, 190);
  }else{
  
  imagectx.drawImage(gms, 15, 125, 30, 30);
  imagectx.fillText(score, 50, 150);
  }
  
  
  imagectx.globalAlpha = 0.7;
  imagectx.fillText("Followers", 25, 600);
  imagectx.fillText("Friends", 300, 600);
  
  if(address && address !== "")
  imagectx.fillText("Location", 25, 700);
  
  if(bio && bio !== "")
  imagectx.fillText("Bio", 25, 800);
  
  imagectx.globalAlpha = 1;
  
  imagectx.fillText(follCount, 25, 630);
  imagectx.fillText(friCount, 300, 630);
  imagectx.fillText(address, 25, 730);
  
  const lines = bio.foreachLineCanvas(imagectx, 450);
	let width2 = 830;

	for(let line of lines){
	imagectx.fillText(line, 25, width2);
	width2+=30;
	}
	
	
	imagectx.clip();


  
  
 //imagectx.fillRect(100, 220, 300, 300);
 
	imagectx.fillStyle = "black";
	if(bg)
  imagectx.drawImage(bg, 70, 200, 360, 360);
  
 // imagectx.drawImage(bg, 10, 20, 100, 100);
  
  
	const xlp = new Discord.MessageAttachment(image.toBuffer(), 'xbox_profile.png'); 
	
	
	message.channel.send(xlp);
  
	}catch(err){console.log(err)}
}
