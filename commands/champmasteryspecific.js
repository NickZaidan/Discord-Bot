const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('champmasteryspecific')
		.setDescription('Gets champion mastery for summoner.')
		.addStringOption(option => option.setName('username').setDescription('Enter summoner name.'))
        .addStringOption(option => option.setName('champion').setDescription('Enter champion name.'))
		
		
		
		,
	async execute(interaction) {
		
		const value = interaction.options.getString('username');
        let champion = interaction.options.getString('champion');


        if(!value || !champion) return interaction.reply('Please provide both options!');

        champion = champion.split(" ");

        
        let championFixed = "";

        for (let i = 0; i < champion.length; i++) {
            champion[i] = champion[i][0].toUpperCase() + champion[i].substr(1);
        }
        
        for (let i = 0; i < champion.length; i++) {
            championFixed = championFixed + champion[i] + " ";
        }
        
        championFixed = championFixed.slice(0,-1);
       
        
        const rawData = fs.readFileSync('./config.json');
        const champLookup = fs.readFileSync('./champ.json');

		const token = JSON.parse(rawData).riotToken;
		const champNamesJSON = JSON.parse(champLookup);
        
		const urlID = "https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + value + "?api_key=" + token;
		
        let id;
		
		await fetch(urlID)
        .then(res => res.json())
        .then((out) => {
            id = out.id;
		}).catch(err => console.error(err));
        
        const champID = champNamesJSON[championFixed];
        
        if (!champID) return interaction.reply('Not a real champ. Just like your dad!'); 
        
        const url = "https://oc1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + id + "/by-champion/" + champID +"?api_key=" + token;
        
        console.log(url);

        let champ;
	
        await fetch(url)
		    .then(res => res.json())
		    .then((out) => {
			    champ = out;
		}).catch(err => console.error(err));
        
        
        
        interaction.editReply(`Champion: ${reply}\nMastery Level: ${champ.championLevel}\nMastery Score: ${champ.championPoints.toLocaleString(undefined)}\n`);      
		

		
	},
};