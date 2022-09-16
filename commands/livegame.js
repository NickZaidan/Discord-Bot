const { SlashCommandBuilder, bold} = require('discord.js');
const fs = require('fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('livegame')
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
                return interaction.reply(value + " is not in league game");
        }


        reply = reply + bold("Blue Side:");
        reply = reply + "\n"        

        for(let i = 0; i < match.participants.length; i++){
            let summoner = bold(match.participants[i].summonerName);
            reply = reply + summoner + ": " + champLookupJSON[match.participants[i].championId] + "\n";

            if(i == 4){
                reply = reply + "\n\n";
                reply = reply + bold("Red Side:");
                reply = reply + "\n";
            }
            
        }
          
             
        interaction.reply(`${reply}`);
		

		
	},
};