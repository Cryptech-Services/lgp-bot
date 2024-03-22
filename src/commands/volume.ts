import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder
} from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import { formatLargeNumber } from '../util/number';

const timeframes = {
  '1d': '24 Hours',
  '1w': '7 Days',
  '1m': '30 Days',
  '1y': '1 Year',
  all: 'All Time'
};

const data = new SlashCommandBuilder()
  .setName('volume')
  .setDescription('Gets the volume of the built in liquidity pool')
  .addStringOption((option) =>
    option
      .setName('timeframe')
      .setDescription('The timeframe to get the volume of')
      .setRequired(true)
      .addChoices(
        { name: '24 Hours', value: '1d' },
        { name: '7 Days', value: '1w' },
        { name: '30 Days', value: '1m' },
        { name: '1 Year', value: '1y' },
        { name: 'All Time', value: 'all' }
      )
  );

const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const timeframe = interaction.options.getString('timeframe');
  const message = await interaction.reply({
    ephemeral: true,
    content: 'Fetching data...'
  });
  if (timeframe) {
    try {
      const response: AxiosResponse<any> = await axios.get(
        `https://${
          process.env.NETWORK === 'MainNet' ? '' : 'test.'
        }metrixlgp.finance/api/volume/${timeframe}`
      );
      const data = response.data; // JSON data
      await message.edit({
        content: `${formatLargeNumber(data)} USD ${
          timeframe === 'all'
            ? `in all time volume`
            : `in volume over the last ${
                timeframes[timeframe as keyof typeof timeframes]
              }`
        }`
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      await message.edit({
        content: `An unexpected error occurred. Please try again later.`
      });
    }
  } else {
    await message.edit({
      content: `Invalid timeframe provided.`
    });
  }
};

export const volume = { data, execute };
