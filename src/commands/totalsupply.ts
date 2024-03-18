import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder
} from 'discord.js';
import axios, { AxiosResponse } from 'axios';

const data = new SlashCommandBuilder()
  .setName('totalsupply')
  .setDescription('Get the total supply of a supported token')
  .addStringOption((option) =>
    option
      .setName('token')
      .setDescription('The token to get the supply of')
      .setRequired(true)
      .addChoices(
        { name: 'MRX', value: 'MRX' },
        { name: 'gMRX', value: 'gMRX' },
        { name: 'wMRX', value: 'wMRX' },
        { name: 'LGP-LP', value: 'LGP-LP' },
        { name: 'g', value: 'g' }
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
            await message.edit({ content: `${data} ${token}` });
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
            await message.edit({ content: `${data} ${token}` });
          }
          break;
        default:
          await message.edit({ content: `Invalid token provided.` });
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      await message.edit({
        content: `An unexpected error occurred. Please try again later.`
      });
    }
  } else {
    await message.edit({ content: `No token was provided.` });
  }
};

export const totalsupply = { data, execute };
