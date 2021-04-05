const xl = require('app-xbox-live');
const dc = require('discord.js');
const db = require("<database>");
//Use a secure database that does not expose data.

const proPrint = require("./proPrint.js");


function provideToken() {
	return new Promise(async resolve => {

		const token = await xl.Token(
			"<email>",
			"<password>"
		);
                //Hide your email and password.

		resolve(token);
	});
}

module.exports.run = async (client, message, args) => {
	try{
	const te = await db.get('xl_token');
 

	if (te) {
		try {
			const xlj = new xl.Account(te);


			const text = args.slice(1).join(' ');
	
			if (text.length) {
		
				if (args[0] === 'find') {
					let ad = {};
					const result = await xlj.people.find(text, 1);
					
	
					if(result.people.length <= 0){
					message.channel.send("Nada encontrado")
						return;
					}

					const xuid = result.people[0];
				
			
			 xlj.people.profile.get(xuid.xuid).then(user =>{
			 	const datas = user.profileUsers[0].settings;
			 	ad["color"] = "#"+xuid.preferredColor.primaryColor;
			 	ad["followers"] = xuid.detail.followerCount;
			 	ad["friends"] = xuid.detail.followingCount;
			 	
			 	
			 	for(let d in datas){
			 		let data = datas[d];
			 	  let id = data.id;
			 	  let valor = data.value;
			 	  
			 	  if(id === "Gamertag")
			 	  ad["gamertag"] = valor;
			 	  else if(id === "Gamerscore")
			 	  ad["score"] = valor;
			 	  else if(id === "GameDisplayPicRaw")
			 	  ad["image"] = valor;
			 	  else if(id === "Bio")
			 	  ad["bio"] = valor;
			 	  else if(id === "Location")
			 	  ad["address"] = valor;
			 	  else if(id === "RealName")
			 	  ad["name"] = valor;
			 	}
			 	
			 	
			 	proPrint.run(message, ad);
			 });
					
				}
			}
		} catch (err) {
			console.log(err)
			try {
				if (err.toLowerCase().includes('invalid token.')) {
					message.channel.send('Falha, tente novamente.');

					const token = await provideToken();

					await db.set('xl_token', `XBL3.0 x=${token[1]};${token[0]}`);
				}else console.log(err);
				
			} catch(errr){
				
			 console.log(errr);
			}
			
		}
	} else {
		console.log('providing new token...');
		message.channel.send('Falha, tente novamente');

		const token = await provideToken();

		await db.set('xl_token', `XBL3.0 x=${token[1]};${token[0]}`);

		console.log('token successfully provided.');
	}
	}catch(err){console.log(err)}
};
