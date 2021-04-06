module.exports = String.prototype.foreachLineCanvas = function(imagectx, length){
	const strings = [];
	let div = 0;

	let letters = [];
	let text = this;
	

	async function starts(){
		
		loop:
	for(let i =0; i < text.length; i++){
	
	
		div += imagectx.measureText(text.charAt(i)).width;
		
		if(imagectx.measureText(text).width > length){
	  if(div < length){
	  	letters.push(text.charAt(i));
	  }else{
	  	div = 0;
	  	const letter = letters.join("");
	  	text = text.substring(i, text.length);
	  	
	  	strings.push(letter);
	  	
	  	letters = [];
	  	
	  	starts();
	  }
		
	}else{
		strings.push(text);
		
		break loop;
	}
	}
	
	};
	starts();
	
	
	
	return strings;
};




module.exports = String.prototype.foreach = function(length){
	const strings = [];
	let div = 0;

	let letters = [];
	let text = this;
	
	async function starts(){
		loop:
	for(let i =0; i < text.length; i++){
		if(text.length > length){
		if(i < length){
			letters.push(text.charAt(i));
		}else{
			div++;
			text = text.substr(length, text.length);
			
		
			const letter = letters.join("");
			strings.push(letter);
			
			letters = [];
			
			starts();
		}
		}else{
			strings.push(text);
			break loop;
		}
	}
	};
	starts();
	
	
	return strings;
};
