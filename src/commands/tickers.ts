import axios, { AxiosResponse } from 'axios';
import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder,
  GuildBasedChannel,
  Collection,
  ChannelType,
  OverwriteType,
  PermissionFlagsBits,
  Guild
} from 'discord.js';
import { formatLargeNumber } from '../util/number';

const data = new SlashCommandBuilder()
  .setName('tickers')
  .setDescription(
    'Creates the ticker channels or recreates them if they already exist'
  )
  .addStringOption((option) =>
    option
      .setName('action')
      .setDescription('The action for the tickers')
      .setRequired(true)
      .addChoices(
        { name: 'create', value: 'create' },
        { name: 'recreate', value: 'recreate' },
        { name: 'remove', value: 'remove' }
      )
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const action = interaction.options.getString('action');
  const message = await interaction.reply({
    ephemeral: true,
    content: `Working on 'tickers ${action}'`
  });
  if (action) {
    const guild = interaction.guild;
    if (guild) {
      try {
        switch (action) {
          case 'create': {
            const channels = guild.channels.cache.filter(
              (
                value: GuildBasedChannel,
                key: string,
                collection: Collection<string, GuildBasedChannel>
              ) =>
                value.type === ChannelType.GuildCategory &&
                value.name === '📈 LGP Market Info'
            );
            await message.edit({ content: `Creating tickers...` });
            await createTickers(interaction, guild, channels);
            await message.edit({ content: `Updating tickers...` });
            await updateTickers(guild);
            break;
          }
          case 'remove': {
            const channels = guild.channels.cache.filter(
              (
                value: GuildBasedChannel,
                key: string,
                collection: Collection<string, GuildBasedChannel>
              ) =>
                value.type === ChannelType.GuildCategory &&
                value.name === '📈 LGP Market Info'
            );
            await message.edit({ content: `Removing tickers...` });
            await removeTickers(guild, channels);
            break;
          }
          case 'recreate': {
            let channels = guild.channels.cache.filter(
              (
                value: GuildBasedChannel,
                key: string,
                collection: Collection<string, GuildBasedChannel>
              ) =>
                value.type === ChannelType.GuildCategory &&
                value.name === '📈 LGP Market Info'
            );
            if (channels.size === 0) {
              await message.edit({ content: `No channels to recreate` });
              return;
            }
            await message.edit({ content: `Removing tickers...` });
            await removeTickers(guild, channels);
            await message.edit({ content: `Creating tickers...` });
            channels = guild.channels.cache.filter(
              (
                value: GuildBasedChannel,
                key: string,
                collection: Collection<string, GuildBasedChannel>
              ) =>
                value.type === ChannelType.GuildCategory &&
                value.name === '📈 LGP Market Info'
            );
            await createTickers(interaction, guild, channels);
            await message.edit({ content: `Updating tickers...` });
            await updateTickers(guild);
            break;
          }
          default:
            break;
        }
        message.edit({ content: `Completed 'tickers ${action}'` });
      } catch (e) {
        console.log(e);

        message.edit({
          content: `Failed 'tickers ${action}'`
        });
      }
    }
  } else {
    await message.edit({ content: `No action provided` });
  }
};

const removeTickers = async (
  guild: Guild,
  channels: Collection<string, GuildBasedChannel>
) => {
  const children = guild.channels.cache.filter(
    (
      value: GuildBasedChannel,
      key: string,
      collection: Collection<string, GuildBasedChannel>
    ) => value.parentId === channels.at(0)?.id
  );
  for (const [id, channel] of children) {
    console.log(`removing ${channel.name}`);
    await channel.delete('tickers remove command executed');
  }
  console.log(`removing ${channels.at(0)?.name}`);
  await channels.at(0)?.delete();
};

const createTickers = async (
  interaction: ChatInputCommandInteraction<CacheType>,
  guild: Guild,
  channels: Collection<string, GuildBasedChannel>
) => {
  if (channels.size === 0) {
    console.log(`creating '📈 LGP Market Info'`);
    const category = await guild.channels.create({
      name: '📈 LGP Market Info',
      type: ChannelType.GuildCategory
    });
    console.log(`creating '------- Price -------'`);
    await guild.channels.create({
      name: '------- Price -------',
      parent: category.id,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          type: OverwriteType.Member,
          allow: [
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.Connect
          ],
          id: interaction.applicationId
        },
        {
          type: OverwriteType.Role,
          deny: [PermissionFlagsBits.Connect],
          id: guild.roles.everyone.id
        }
      ]
    });
    console.log(`creating 'MRX - ⏳'`);
    await guild.channels.create({
      name: 'MRX - ⏳',
      parent: category.id,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          type: OverwriteType.Member,
          allow: [
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.Connect
          ],
          id: interaction.applicationId
        },
        {
          type: OverwriteType.Role,
          deny: [PermissionFlagsBits.Connect],
          id: guild.roles.everyone.id
        }
      ]
    });
    console.log(`creating 'gMRX - ⏳'`);
    await guild.channels.create({
      name: 'gMRX - ⏳',
      parent: category.id,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          type: OverwriteType.Member,
          allow: [
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.Connect
          ],
          id: interaction.applicationId
        },
        {
          type: OverwriteType.Role,
          deny: [PermissionFlagsBits.Connect],
          id: guild.roles.everyone.id
        }
      ]
    });
    console.log(`creating '--- Market Stats ---'`);
    await guild.channels.create({
      name: '--- Market Stats ---',
      parent: category.id,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          type: OverwriteType.Member,
          allow: [
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.Connect
          ],
          id: interaction.applicationId
        },
        {
          type: OverwriteType.Role,
          deny: [PermissionFlagsBits.Connect],
          id: guild.roles.everyone.id
        }
      ]
    });
    console.log(`creating '24h Volume - ⏳'`);
    await guild.channels.create({
      name: '24h Volume - ⏳',
      parent: category.id,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          type: OverwriteType.Member,
          allow: [
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.Connect
          ],
          id: interaction.applicationId
        },
        {
          type: OverwriteType.Role,
          deny: [PermissionFlagsBits.Connect],
          id: guild.roles.everyone.id
        }
      ]
    });
    console.log(`creating 'TVL - ⏳'`);
    await guild.channels.create({
      name: 'TVL - ⏳',
      parent: category.id,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          type: OverwriteType.Member,
          allow: [
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.Connect
          ],
          id: interaction.applicationId
        },
        {
          type: OverwriteType.Role,
          deny: [PermissionFlagsBits.Connect],
          id: guild.roles.everyone.id
        }
      ]
    });
    console.log(`creating 'Market Cap - ⏳'`);
    await guild.channels.create({
      name: 'Market Cap - ⏳',
      parent: category.id,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          type: OverwriteType.Member,
          allow: [
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.Connect
          ],
          id: interaction.applicationId
        },
        {
          type: OverwriteType.Role,
          deny: [PermissionFlagsBits.Connect],
          id: guild.roles.everyone.id
        }
      ]
    });
    category.setPosition(0);
  } else {
    throw new Error('Channels already exist');
  }
};

const updateTickers = async (guild: Guild) => {
  let mrxPrice = 0;
  let gmrxPrice = 0;
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
        `Market Cap - ${formatLargeNumber(Number(marketcap.toFixed(2)))} USD`
      );
    } else if (channel.name.startsWith('24h Volume -')) {
      await channel.setName(
        `24h Volume - ${formatLargeNumber(Number(volume.toFixed(2)))} USD`
      );
    }
  }
};

export const tickers = { data, execute };
