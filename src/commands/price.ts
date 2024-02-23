import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder,
} from 'discord.js';
import axios, {AxiosResponse} from 'axios';

const data = new SlashCommandBuilder()
  .setName('price')
  .setDescription('Gets the price of a supported token')
  .addStringOption((option) =>
    option
      .setName('token')
      .setDescription('The token to get the supply of')
      .setRequired(true)
      .addChoices({name: 'MRX', value: 'MRX'}, {name: 'gMRX', value: 'gMRX'})
  );

const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const token = interaction.options.getString('token');

  if (token) {
    try {
      const response: AxiosResponse<any> = await axios.get(
        `https://${
          process.env.NETWORK === 'MainNet' ? '' : 'test.'
        }metrixlgp.finance/api/${token}/price`
      );
      const data = response.data; // JSON data
      await interaction.reply(`1 ${token} = ${data} USD`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
};

export const price = {data, execute};
