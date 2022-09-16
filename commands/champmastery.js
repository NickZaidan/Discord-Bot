const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('champmastery')
		.setDescription('Get champion mastery for summoner.')
		.addStringOption(option => option.setName('username').setDescription('Enter summoner name'))
        .addIntegerOption(option => option.setName('amount').setDescription('Retrieval amount.'))
		
		
		
		,
	async execute(interaction) {
		
		const value = interaction.options.getString('username');
        const amount = interaction.options.getInteger('amount');

		if(!value || !amount) return interaction.reply('Please provide both options!');

        if(amount > 30) return interaction.reply('Please be kind, Riot API is slow!');
        
        
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
        
        
        const url = "https://oc1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + id +"?api_key=" + token;
        
		console.log(url);

        let champ;
	
        await fetch(url)
		    .then(res => res.json())
		    .then((out) => {
			    champ = out;
		}).catch(err => console.error(err));
        
        await interaction.deferReply();
        let reply = "";
        for(let x = 0; x < amount; x++){
            reply = reply + "Champion: " + champLookupJSON[champ[x].championId] + "\nMastery Level: " + champ[x].championLevel + " \nMastery Score: " + champ[x].championPoints.toLocaleString(undefined) + "\n\n";
        }
              
        interaction.editReply(`${reply}`);
				
	},
};