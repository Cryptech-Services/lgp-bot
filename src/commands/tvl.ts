import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder,
} from 'discord.js';
import axios, {AxiosResponse} from 'axios';

const data = new SlashCommandBuilder()
  .setName('tvl')
  .setDescription('Gets the TVL of the built in liquidity pool');

const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  try {
    const response1: AxiosResponse<any> = await axios.get(
      `https://${
        process.env.NETWORK === 'MainNet' ? '' : 'test.'
      }metrixlgp.finance/api/liquidity/reserves`
    );
    const {wmrx, gmrx, lp} = response1.data; // JSON data
    const response2: AxiosResponse<any> = await axios.get(
      `https://${
        process.env.NETWORK === 'MainNet' ? '' : 'test.'
      }metrixlgp.finance/api/mrx/price`
    );
    const mrxPrice = response2.data; // JSON data
    const response3: AxiosResponse<any> = await axios.get(
      `https://${
        process.env.NETWORK === 'MainNet' ? '' : 'test.'
      }metrixlgp.finance/api/gmrx/price`
    );
    const gmrxPrice = response3.data; // JSON data
    const tvl = wmrx * mrxPrice + gmrx * gmrxPrice;
    await interaction.reply(`LGP Pool TVL: ${tvl.toFixed(2)} USD`);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const tvl = {data, execute};
