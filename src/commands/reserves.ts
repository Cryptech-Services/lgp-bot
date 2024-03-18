import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder
} from 'discord.js';
import axios, { AxiosResponse } from 'axios';

const data = new SlashCommandBuilder()
  .setName('reserves')
  .setDescription('Gets the reserves of the built in liquidity pool');

const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const message = await interaction.reply({
    ephemeral: true,
    content: 'Fetching data...'
  });
  try {
    const response: AxiosResponse<any> = await axios.get(
      `https://${
        process.env.NETWORK === 'MainNet' ? '' : 'test.'
      }metrixlgp.finance/api/liquidity/reserves`
    );
    const data = response.data; // JSON data
    await message.edit({
      content: `<:wmrx:1209756611598352414> wMRX: ${data.wmrx}\n<:gmrx:1209756607970279484> gMRX: ${data.gmrx}\nLocked LGP-LP: ${data.lp}`
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    await message.edit({
      content: `An unexpected error occurred. Please try again later.`
    });
  }
};

export const reserves = { data, execute };
