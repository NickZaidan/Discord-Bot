const { SlashCommandBuilder, bold } = require('discord.js');
const fs = require('fs');

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('tft-ranked')
		.setDescription('Information about the options provided.')
		.addStringOption(option => option.setName('username').setDescription('The input to echo back'))
		
		
		
		,
	async execute(interaction) {
		
		const value = interaction.options.getString('username');
		if(!value) return interaction.reply('No option was provided!');

		let rawData = fs.readFileSync('./config.json');
		let token = JSON.parse(rawData).riotToken;
		
		const urlID = "https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + value + "?api_key=" + token;
		let id;
		
		await fetch(urlID)
		.then(res => res.json())
		.then((out) => {
			id = out.id;
		}).catch(err => console.error(err));
		

        const url = "https://oc1.api.riotgames.com/tft/league/v1/entries/by-summoner/" + id + "?api_key=" + token;
        
        console.log(url);

        let response; 
        

        await fetch(url)
		.then(res => res.json())
		.then((out) => {
			response = out;
		}).catch(err => console.error(err));
		

        if (isEmptyObject(response)) return (interaction.reply(value + " has no TFT rank."));

        let reply = bold("Username: ");
        reply = reply + response[0].summonerName + "\n";

        for(let x = 0; x < response.length; x++){
            
            switch(response[x].queueType){
                case "RANKED_TFT":
                    reply = reply + bold("TFT Rank: ");
                    reply = reply + response[x].tier[0]  + response[x].tier.substring(1).toLowerCase() + " " + response[x].rank + " " + response[x].leaguePoints + " LP\nWins: " + response[x].wins + " | Losses: " + response[x].losses + "\n\n";
                    break;
                
                case "RANKED_TFT_TURBO":
                    reply = reply + bold("HyperRoll Tier: ");
                    reply = reply + response[x].ratedTier[0] + response[x].ratedTier.substring(1).toLowerCase() + " " + response[x].ratedRating + " points\nWins: " + response[x].wins + " | Losses: " + response[x].losses + "\n\n";
                    break;

                default:
                    break;
            }
            
        }

        reply = reply.slice(0,-2);

		interaction.reply(`${reply}`);

		
	},
};