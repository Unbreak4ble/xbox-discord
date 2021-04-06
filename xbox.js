const xl = require('app-xbox-live');
const dc = require('discord.js');
const db = require("<database>");
//Use a secure database that does not expose data.

const proPrint = require("./utils/proPrint.js");
const acPrint = require("./utils/acPrint.js");


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
		
				if (args[0] === 'profile') {
					let ad = {};
					const result = await xlj.people.find(text, 1);
					
	
					if(result.people.length <= 0){
					message.channel.send("Player not found.")
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
                                else if (args[0] === "presence")
				{
					
				const result = await xlj.people.find(text, 1);
					
	
					if(result.people.length <= 0){
					message.channel.send("Player not found.")
						return;
					}
          
					const xuid = result.people[0];
					
					
					xlj.people.presence.get(xuid.xuid).then(async user =>{
						
						let opts = {
							gamertag: xuid.gamertag
						}
						
						if(xuid["realName"])
						opts["name"] = xuid.realName;
						else
            opts["name"] = "";
            
         
            
            opts["image"] = xuid.displayPicRaw;
            
            opts["state"] = user[0].state;
            
            try{
            if(user[0].state.toLowerCase() !== "offline"){
            	if(user[0]["devices"]){
           // 		message.channel.send(JSON.stringify(user[0]));
            		
            		let dn = user[0].devices.length - 1;
            		let tn = user[0].devices[dn].titles.length - 1;
            		
            		let titlepre = user[0].devices[dn].titles[tn];
            		
            		
            		if(titlepre["activity"] && titlepre["activity"]["richPresence"])
            		opts["lastSeen"] = titlepre.name + " - " + titlepre.activity.richPresence;
            		else
            		opts["lastSeen"] = titlepre.name;
           
            	}else
              opts["lastSeen"] = user[0].state;
            }else{
            if(user[0]["lastSeen"]){
            	
            if(user[0].lastSeen["timestamp"]){
            	
      	function timeDistance(date1, date2){
  let distance = Math.abs(date1 - date2);
  const hours = Math.floor(distance / 3600000);
  distance -= hours * 3600000;
  const minutes = Math.floor(distance / 60000);
  distance -= minutes * 60000;
  const seconds = Math.floor(distance / 1000);

 if(hours > 24)
  return {
  num: Math.floor(hours/24),
  type: "day"
  }
  else if(hours > 0 && hours <= 24)
  return {
  num: hours.toString(),
  type: "hour"
  }
  else if(hours <= 0)
  return {
  num: ('0' + minutes).slice(-2),
  type: "minute"
  }
  else if(minutes <=0)
  return {
  num: ('0' + seconds).slice(-2),
  type: "second"
  }
  else if(seconds <= 0)
  return {
  	num: ('0' + seconds).slice(-2),
  	type: "mili"
  }
  else
  return {
  num: "0",
  type: "second"
  }
};
            	
            let gtime = timeDistance(Number(new Date(user[0].lastSeen.timestamp)), new Date)
           let time = "";
           if(gtime.type === "day")
           time = ` ${gtime.num}d ago`;
           else if(gtime.type === "hour")
           time = ` ${gtime.num}h ago`;
          else if(gtime.type === "minute")
           time = ` ${gtime.num}m ago`;
          else if(gtime.type === "second")
           time = ` ${gtime.num}s ago`;
          else if(gtime.type === "mili")
           time = ` ${gtime.num}mm ago`;
            	
            	
            	
            	
            	
            	opts["lastSeen"] = "Last seen"+time+": "+user[0].lastSeen.titleName;
         
         
            }else{
            	opts["lastSeen"] = "Last seen: "+user[0].lastSeen.titleName;
            }
            	
            }else{
            opts["lastSeen"] = user[0].state;
            }
            }
            }catch(err4){
            	opts["lastSeen"] = user[0].state;
            	console.log(err4)
            }
            
						acPrint.run(message, opts);
					});
				
				}
			}
		} catch (err) {
			console.log(err)
			try {
				if (err.toLowerCase().includes('invalid token.')) {
					message.channel.send('Failed, please try again.');

					const token = await provideToken();

					await db.set('xl_token', `XBL3.0 x=${token[1]};${token[0]}`);
				}else console.log(err);
				
			} catch(errr){
				
			 console.log(errr);
			}
			
		}
	} else {
		console.log('providing new token...');
		message.channel.send('Failed, please try again');

		const token = await provideToken();

		await db.set('xl_token', `XBL3.0 x=${token[1]};${token[0]}`);

		console.log('token successfully provided.');
	}
	}catch(err){console.log(err)}
};
