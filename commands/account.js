const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('account')
		.setDescription('Information about the options provided.')
		.addStringOption(option => option.setName('input').setDescription('The input to echo back'))
		
		
		
		,
	async execute(interaction) {
		
		const value = interaction.options.getString('input');
		if(!value) return interaction.reply('No option was provided!');

		let rawData = fs.readFileSync('./config.json');
		let token = JSON.parse(rawData).riotToken;
		
		const url = "https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + value + "?api_key=" + token;
		let output;
		console.log(url);
		await fetch(url)
		.then(res => res.json())
		.then((out) => {
			output = out;
		}).catch(err => console.error(err));
		
		//Removed await, may need to readd
		interaction.reply("Username: " + output.name +"\nLevel: " + output.summonerLevel + "\nAccount ID: " + output.id + "\nPUUID: " + output.puuid);

		
	},
};