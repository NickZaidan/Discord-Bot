const fs = require('fs');

async function sorter(){
    const champurl = "http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/champion.json";
        
    let champs;

    await fetch(champurl)
	    .then(res => res.json())
		.then((out) => {
		    
            champs = out.data;

		}).catch(err => console.error(err));
    
    let x = "{\n";
    for (const [key, value] of Object.entries(champs)) {
        x = x + `\"${value.key}\": \"${value.name}\",\n`;
    }
    x = x.slice(0,-2);
    x = x + "\n}"
    console.log(x);

    
    
    
    
    //console.log("Name: " + champs.id + " | Key: " + champs.key);
    //console.log(typeof(champs));
}

	


return sorter();