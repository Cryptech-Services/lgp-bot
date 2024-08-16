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
  const name = pkg && pkg.name ? pkg.name : 'Unknown';
  const version = pkg && pkg.version ? pkg.version : 'Unknown';
  interaction.reply({
    ephemeral: true,
    content: `${name} v${version}`
  });
};

export const version = { data, execute };
