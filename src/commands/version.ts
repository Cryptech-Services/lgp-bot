import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder
} from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('version')
  .setDescription('Gets the version of the LGP bot');

const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const pkg = require('../../package.json');
  const version = pkg && pkg.version ? pkg.version : 'Unknown';
  interaction.reply({
    ephemeral: true,
    content: version
  });
};

export const version = { data, execute };
