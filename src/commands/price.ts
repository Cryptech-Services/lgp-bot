import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder
} from 'discord.js';
import axios, { AxiosResponse } from 'axios';

const data = new SlashCommandBuilder()
  .setName('price')
  .setDescription('Gets the price of a supported token')
  .addStringOption((option) =>
    option
      .setName('token')
      .setDescription('The token to get the supply of')
      .setRequired(true)
      .addChoices(
        { name: 'MRX', value: 'MRX' },
        { name: 'gMRX', value: 'gMRX' }
      )
  );

const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const token = interaction.options.getString('token');
  const message = await interaction.reply({
    ephemeral: true,
    content: 'Fetching data...'
  });
  if (token) {
    try {
      const response: AxiosResponse<any> = await axios.get(
        `https://${
          process.env.NETWORK === 'MainNet' ? '' : 'test.'
        }metrixlgp.finance/api/${token}/price`
      );
      const data = response.data; // JSON data
      await message.edit({
        content: `${token} Price: ${data} USD`
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      await message.edit({
        content: `An unexpected error occurred. Please try again later.`
      });
    }
  }
};

export const price = { data, execute };
