const { SlashCommandBuilder, bold} = require('discord.js');
const fs = require('fs');

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('livegamefull')
		.setDescription('Get champion mastery for summoner.')
		.addStringOption(option => option.setName('username').setDescription('Enter summoner name'))
		
		
		
		,
	async execute(interaction) {
		
		const value = interaction.options.getString('username');
        

		if(!value) return interaction.reply('Please provide both options!');
        
        const rawData = fs.readFileSync('./config.json');
        const champLookup = fs.readFileSync('./champs.json');

		const token = JSON.parse(rawData).riotToken;
		const champLookupJSON = JSON.parse(champLookup);
        
		const urlID = "https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + value + "?api_key=" + token;
		
        let id;
		
		await fetch(urlID)
        .then(res => res.json())
        .then((out) => {
            id = out.id;
		}).catch(err => console.error(err));
        
        
        const url = "https://oc1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + id + "?api_key=" + token;
        
		console.log(url);

        let match;
	
        await fetch(url)
		    .then(res => res.json())
		    .then((out) => {
			    match = out;
		}).catch(err => console.error(err));

        let reply = "";
        reply = reply + bold("Game Mode:");

        switch(match.gameQueueConfigId){
            case 400:
                reply = reply + " Normal\n\n";
                break;
          
            case 450:
                reply = reply  + " ARAM\n\n";
                break;
            
            case 420:
                reply = reply + " Ranked Solo/Duo\n\n";
                break;

            case 1400:
                reply = reply + " Ultimate Spellbook\n\n";
                break;
          
            default:
                return interaction.reply(value + " is not in game");
        }


        reply = reply + bold("Blue Side:");
        reply = reply + "\n"        


        await interaction.deferReply();


        for(let i = 0; i < match.participants.length; i++){
            let summoner = bold(match.participants[i].summonerName);
            let id = match.participants[i].summonerId;
            let userRankURL = "https://oc1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + id + "?api_key=" + token;     
            let userRankResponse;
            
            await fetch(userRankURL)
		    .then(res => res.json())
		    .then((out) => {
			    userRankResponse = out;
    		}).catch(err => console.error(err));
            
            switch(!isEmptyObject(userRankResponse)){
                case true:
                    for(let x = 0; x < userRankResponse.length; x++){
            
                        switch(userRankResponse[x].queueType){
                            case "RANKED_SOLO_5x5":
                                reply = reply + summoner + "\nRanked Solo/Duo: ";
                                reply = reply + userRankResponse[x].tier[0]  + userRankResponse[x].tier.substring(1).toLowerCase() + " " + userRankResponse[x].rank + " " + userRankResponse[x].leaguePoints + " LP. Playing: " + champLookupJSON[match.participants[i].championId] + "\n";
                                break;
                            
                            case "RANKED_FLEX_SR":
                                if(userRankResponse.length == 1){
                                    reply = reply + summoner + "\nRanked Flex: ";
                                    reply = reply + userRankResponse[x].tier[0]  + userRankResponse[x].tier.substring(1).toLowerCase() + " " + userRankResponse[x].rank + " " + userRankResponse[x].leaguePoints + " LP. Playing: " + champLookupJSON[match.participants[i].championId] + "\n";
                                }
                                break;
            
                            default:
                                reply = reply + summoner + "\nUnranked. Playing: " + champLookupJSON[match.participants[i].championId] + "\n";
                                break;
                        }
                    }
                    //reply = reply + summoner + ": " + userRankResponse[0].tier[0] + userRankResponse[0].tier.substring(1).toLowerCase() + " " + userRankResponse[0].rank + " " + userRankResponse[0].leaguePoints + " LP. Playing: " + champLookupJSON[match.participants[i].championId] + "\n";
                    break;
                case false:
                    reply = reply + summoner + "\nUnranked. Playing: " + champLookupJSON[match.participants[i].championId] + "\n";
                    break;    
            }

            if(i == 4){
                reply = reply + "\n\n";
                reply = reply + bold("Red Side:");
                reply = reply + "\n";
            }
            
        }
          
             
        interaction.editReply(`${reply}`);
		

		
	},
};