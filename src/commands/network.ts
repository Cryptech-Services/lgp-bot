import {NetworkType} from '@metrixcoin/metrilib';
import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder,
} from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('network')
  .setDescription('Gets the network of the LGP bot');

const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  interaction.reply({
    ephemeral: true,
    content: process.env.NETWORK as NetworkType,
  });
};

export const network = {data, execute};
