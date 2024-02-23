import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder,
} from 'discord.js';
import axios, {AxiosResponse} from 'axios';

const data = new SlashCommandBuilder()
  .setName('reserves')
  .setDescription('Gets the reserves of the built in liquidity pool');

const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `https://${
        process.env.NETWORK === 'MainNet' ? '' : 'test.'
      }metrixlgp.finance/api/liquidity/reserves`
    );
    const data = response.data; // JSON data
    interaction.reply(
      `<:wmrx:1209756611598352414> wMRX: ${data.wmrx}\n<:gmrx:1209756607970279484> gMRX: ${data.gmrx}\nLocked LGP-LP: ${data.lp}`
    );
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const reserves = {data, execute};
