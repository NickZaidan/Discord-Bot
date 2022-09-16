const { SlashCommandBuilder, bold } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('options-info')
		.setDescription('Information abot the commands.'),
	async execute(interaction) {
		
		return 	interaction.reply(
			bold("account ") + "(username): Gets basic account information such as your ID and level\n" +
			bold("champmastery ") + "(username, amount): Gets your top champion masteries based off your username and amount wanted to retrieve.\n" + 
			bold("champmasteryspecific ") + "(username, champion): Get your champion masteries for a specific champion.\n" + 
			bold("livegame ") + "(username): Gets the list of users and their champions for a currently running game.\n" +
			bold("lol-ranked ") + "(username): Gets League of Legends ranked data for username.\n" +
			bold("option-info ") + "(): Gets descriptions for bot options.\n" +
			bold("tft-ranked ") + "(): Gets League of Legends ranked data for username\n"
		);
	},
};