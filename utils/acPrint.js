const Canvas = require('canvas');
const Discord = require('discord.js');
Canvas.registerFont('./ARIALUNI.TTF', { family: 'ArSaSe' });
require('./stringProperties.js');

module.exports.run = async (message, config) => {
	new Promise(async (resolve, reject) => {
		try {
			/*
		let config = {
			gamertag: "Diego",
			name: "rafa",
			state: "Offlin",
			last: null
		};
		*/
		
		let imagePre = config.image.match(/url=.*?&/g)[0].replace(/url=/g, '').replace(/&$/g, '');
	
	let imageUrl = `http://images-eds.xboxlive.com/image?url=${imagePre}&format=png`


  let gms = await Canvas.loadImage(imageUrl);
  

			const globalColor = '#1f1f1f';

			let image = Canvas.createCanvas(700, 200);
			let imagectx = image.getContext('2d');

	

			imagectx.fillStyle = globalColor;
			imagectx.fillRect(0, 0, 700, 200);

			//here

			imagectx.fillStyle = '#b4b4b2';
			imagectx.font = '30px "ArSaSe"';

    
    if(!config.lastSeen && !config.lastSeen.length)
			imagectx.fillText(config.state, 185, 135);
      else
      imagectx.fillText(config.lastSeen, 185, 135);


			if (config['name']) {
				let wid = imagectx.measureText(config.gamertag).width;

				imagectx.font = '25px "ArSaSe"';
				imagectx.fillText(config.name, wid + 195, 90);
			}

			imagectx.fillStyle = 'white';
			imagectx.font = '30px "ArSaSe"';
			imagectx.fillText(config.gamertag, 185, 90);

			if (config.state.toLowerCase() !== 'offline') {
				const yy = 50;
				const xx = 25;
				const circumferencee = 10;
				imagectx.beginPath();
				imagectx.arc(xx, yy, circumferencee, 0, Math.PI * 2, false);
				imagectx.stroke();

				imagectx.closePath();

				imagectx.fillStyle = '#0add08';
				imagectx.fill();
			}

			const y = 100;
			const x = 100;
			const circumference = 60;
			imagectx.beginPath();
			imagectx.arc(x, y, circumference, 0, Math.PI * 2, false);
			imagectx.strokeStyle = globalColor;
			imagectx.lineWidth = 3;
			imagectx.stroke();

			imagectx.closePath();

			imagectx.clip();

			imagectx.globalAlpha = 0.5;
			imagectx.fillStyle = globalColor;
			imagectx.fillRect(0, 0, 300, 300);

			imagectx.globalAlpha = 1;

			imagectx.drawImage(gms, 40, 40, 120, 120);

			const eximg = new Discord.MessageAttachment(
				image.toBuffer(),
				'xbox_presence.png'
			);

			message.channel.send(eximg).then(msg => {
				return resolve();
			});
		} catch (err) {
			console.log(err);
		}
	});
};
