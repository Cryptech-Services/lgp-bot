import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder,
} from 'discord.js';
import axios, {AxiosResponse} from 'axios';

const data = new SlashCommandBuilder()
  .setName('totalsupply')
  .setDescription('Get the total supply of a supported token')
  .addStringOption((option) =>
    option
      .setName('token')
      .setDescription('The token to get the supply of')
      .setRequired(true)
      .addChoices(
        {name: 'MRX', value: 'MRX'},
        {name: 'gMRX', value: 'gMRX'},
        {name: 'wMRX', value: 'wMRX'},
        {name: 'LGP-LP', value: 'LGP-LP'},
        {name: 'g', value: 'g'}
      )
  );

const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const token = interaction.options.getString('token');

  if (token) {
    try {
      switch (token) {
        case 'MRX':
          {
            const response: AxiosResponse<any> = await axios.get(
              `https://${
                process.env.NETWORK === 'MainNet' ? '' : 'testnet-'
              }explorer.metrixcoin.com/api/circulating-supply
              `
            );
            const data = response.data; // JSON data
            interaction.reply(`${data} ${token}`);
          }
          break;
        case 'gMRX':
        case 'wMRX':
        case 'LGP-LP':
        case 'g':
          {
            const response: AxiosResponse<any> = await axios.get(
              `https://${
                process.env.NETWORK === 'MainNet' ? '' : 'test.'
              }metrixlgp.finance/api/${token}/supply`
            );
            const data = response.data; // JSON data
            interaction.reply(`${data} ${token}`);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
};

export const totalsupply = {data, execute};
