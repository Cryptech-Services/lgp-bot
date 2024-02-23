import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder,
} from 'discord.js';
import axios, {AxiosResponse} from 'axios';

const data = new SlashCommandBuilder()
  .setName('marketcap')
  .setDescription('Gets the market cap of a supported token')
  .addStringOption((option) =>
    option
      .setName('token')
      .setDescription('The token to get the marketcap of')
      .setRequired(true)
      .addChoices({name: 'MRX', value: 'MRX'}, {name: 'gMRX', value: 'gMRX'})
  );

const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const token = interaction.options.getString('token');

  if (token) {
    try {
      const response1: AxiosResponse<any> = await axios.get(
        `https://${
          process.env.NETWORK === 'MainNet' ? '' : 'test.'
        }metrixlgp.finance/api/${token}/price`
      );
      const price = response1.data; // JSON data
      const response2: AxiosResponse<any> = await axios.get(
        token === 'MRX'
          ? `https://${
              process.env.NETWORK === 'MainNet' ? '' : 'testnet-'
            }explorer.metrixcoin.com/api/circulating-supply`
          : `https://${
              process.env.NETWORK === 'MainNet' ? '' : 'test.'
            }metrixlgp.finance/api/${token}/supply`
      );
      const supply = response2.data; // JSON data
      await interaction.reply(
        `${token} Market Cap: ${(supply * price).toFixed(2)} USD`
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
};

export const marketcap = {data, execute};
