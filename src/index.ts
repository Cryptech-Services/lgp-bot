import dotenv from 'dotenv';
import {
  REST,
  Routes,
  Client,
  GatewayIntentBits,
  ActivityType,
  Collection,
  Guild,
  GuildBasedChannel,
  ChannelType
} from 'discord.js';
import { reserves } from './commands/reserves';
import { network } from './commands/network';
import { totalsupply } from './commands/totalsupply';
import { tvl } from './commands/tvl';
import { price } from './commands/price';
import { marketcap } from './commands/marketcap';
import { tickers } from './commands/tickers';
import axios, { AxiosResponse } from 'axios';
import { formatLargeNumber } from './util/number';

dotenv.config();

const commands = [
  marketcap.data.toJSON(),
  network.data.toJSON(),
  price.data.toJSON(),
  reserves.data.toJSON(),
  tickers.data.toJSON(),
  totalsupply.data.toJSON(),
  tvl.data.toJSON()
];

const cooldowns = new Collection<string, Collection<string, number>>();
for (const command of commands) {
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection<string, number>());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);

const start = async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID as string),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  const tickersLoop = async () => {
    const activeTickerGuild = client.guilds.cache.filter(
      (value: Guild, key: string, collection: Collection<string, Guild>) =>
        value.channels.cache.filter(
          (
            value: GuildBasedChannel,
            key: string,
            collection: Collection<string, GuildBasedChannel>
          ) =>
            value.name === '📈 LGP Market Info' &&
            value.type === ChannelType.GuildCategory
        ).size > 0
    );
    let mrxPrice = 0;
    let gmrxPrice = 0;

    if (activeTickerGuild.size > 0) {
      try {
        const response1: AxiosResponse<any> = await axios.get(
          `https://${
            process.env.NETWORK === 'MainNet' ? '' : 'test.'
          }metrixlgp.finance/api/mrx/price`
        );
        mrxPrice = response1.data;
        const response2: AxiosResponse<any> = await axios.get(
          `https://${
            process.env.NETWORK === 'MainNet' ? '' : 'test.'
          }metrixlgp.finance/api/gmrx/price`
        );
        gmrxPrice = response2.data;
        const response3: AxiosResponse<any> = await axios.get(
          `https://${
            process.env.NETWORK === 'MainNet' ? '' : 'test.'
          }metrixlgp.finance/api/liquidity/reserves`
        );

        const response4: AxiosResponse<any> = await axios.get(
          `https://${
            process.env.NETWORK === 'MainNet' ? '' : 'test.'
          }metrixlgp.finance/api/gmrx/marketcap`
        );
        const response5: AxiosResponse<any> = await axios.get(
          `https://${
            process.env.NETWORK === 'MainNet' ? '' : 'test.'
          }metrixlgp.finance/api/volume`
        );
        const volume = response5.data; // JSON data
        const { wmrx, gmrx, lp } = response3.data;
        const tvl = wmrx * mrxPrice + gmrx * gmrxPrice;
        const marketcap = response4.data;
        for (const [gid, guild] of activeTickerGuild) {
          const categories = guild.channels.cache.filter(
            (
              value: GuildBasedChannel,
              key: string,
              collection: Collection<string, GuildBasedChannel>
            ) =>
              value.type === ChannelType.GuildCategory &&
              value.name === '📈 LGP Market Info'
          );

          const children = guild.channels.cache.filter(
            (
              value: GuildBasedChannel,
              key: string,
              collection: Collection<string, GuildBasedChannel>
            ) => value.parentId === categories.at(0)?.id
          );
          for (const [cid, channel] of children) {
            if (channel.name.startsWith('MRX -')) {
              await channel.setName(`MRX - ${mrxPrice} USD`);
              if (mrxPrice > gmrxPrice) {
                await channel.edit({ position: 1 });
              }
            } else if (channel.name.startsWith('gMRX -')) {
              await channel.setName(`gMRX - ${gmrxPrice} USD`);
              if (gmrxPrice > mrxPrice) {
                await channel.edit({ position: 1 });
              }
            } else if (channel.name.startsWith('TVL -')) {
              await channel.setName(
                `TVL - ${formatLargeNumber(Number(tvl.toFixed(2)))} USD`
              );
            } else if (channel.name.startsWith('Market Cap -')) {
              await channel.setName(
                `Market Cap - ${formatLargeNumber(
                  Number(marketcap.toFixed(2))
                )} USD`
              );
            } else if (channel.name.startsWith('24h Volume -')) {
              await channel.setName(
                `24h Volume - ${formatLargeNumber(
                  Number(volume.toFixed(2))
                )} USD`
              );
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    tickersLoop();
    setInterval(() => {
      tickersLoop();
    }, 90000);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const defaultCooldownDuration = 30;
    const cooldownAmount = defaultCooldownDuration * 1000;
    const now = Date.now();
    const timestamps =
      cooldowns.get(interaction.commandName) ||
      new Collection<string, number>();
    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id)! + cooldownAmount;
      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        await interaction.reply({
          content: `Please wait, you are on a cooldown for \`${interaction.commandName}\`. You can use it again <t:${expiredTimestamp}:R>.`,
          ephemeral: true
        });
        return;
      }
    }
    timestamps.set(interaction.user.id, now);
    switch (interaction.commandName) {
      case 'price':
        await price.execute(interaction);
        break;
      case 'network':
        await network.execute(interaction);
        break;
      case 'marketcap':
        await marketcap.execute(interaction);
        break;
      case 'reserves':
        await reserves.execute(interaction);
        break;
      case 'tickers':
        await tickers.execute(interaction);
        break;
      case 'totalsupply':
        await totalsupply.execute(interaction);
        break;
      case 'tvl':
        await tvl.execute(interaction);
        break;
      default:
        break;
    }
  });

  await client.login(process.env.TOKEN as string);
  client.user?.setActivity(`${process.env.NETWORK} Metrix LGP`, {
    type: ActivityType.Watching
  });

  const handleShutdown = async (signal: string) => {
    console.log(`Received ${signal}. Logging out...`);
    await client.destroy();
    process.exit(0);
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGUSR1', () => handleShutdown('SIGUSR1'));
};

start();
