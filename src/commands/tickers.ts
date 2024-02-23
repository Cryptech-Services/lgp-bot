import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder,
  GuildBasedChannel,
  Collection,
  ChannelType,
  OverwriteType,
  PermissionFlagsBits,
} from 'discord.js';

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
        {name: 'create', value: 'create'},
        {name: 'recreate', value: 'recreate'},
        {name: 'remove', value: 'remove'}
      )
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const action = interaction.options.getString('action');

  if (action) {
    const guild = interaction.guild;
    if (guild) {
      const channels = guild.channels.cache.filter(
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
        ) => value.parentId === channels.at(0)?.id
      );
      try {
        switch (action) {
          case 'create': {
            if (channels.size === 0) {
              console.log(`creating '📈 LGP Market Info'`);
              const category = await guild.channels.create({
                name: '📈 LGP Market Info',
                type: ChannelType.GuildCategory,
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
                      PermissionFlagsBits.Connect,
                    ],
                    id: interaction.applicationId,
                  },
                  {
                    type: OverwriteType.Role,
                    deny: [PermissionFlagsBits.Connect],
                    id: guild.roles.everyone.id,
                  },
                ],
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
                      PermissionFlagsBits.Connect,
                    ],
                    id: interaction.applicationId,
                  },
                  {
                    type: OverwriteType.Role,
                    deny: [PermissionFlagsBits.Connect],
                    id: guild.roles.everyone.id,
                  },
                ],
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
                      PermissionFlagsBits.Connect,
                    ],
                    id: interaction.applicationId,
                  },
                  {
                    type: OverwriteType.Role,
                    deny: [PermissionFlagsBits.Connect],
                    id: guild.roles.everyone.id,
                  },
                ],
              });
              category.setPosition(0);
            } else {
              throw new Error('Channels already exist');
            }

            break;
          }
          case 'remove': {
            for (const [id, channel] of children) {
              console.log(`removing ${channel.name}`);
              await channel.delete('tickers remove command executed');
            }
            console.log(`removing ${channels.at(0)?.name}`);
            await channels.at(0)?.delete();
            break;
          }
          case 'recreate': {
            for (const [id, channel] of children) {
              console.log(`removing ${channel.name}`);
              await channel.delete('tickers recreate command executed');
            }
            console.log(`removing ${channels.at(0)?.name}`);
            await channels.at(0)?.delete();

            console.log(`creating '📈 LGP Market Info'`);
            const category = await guild.channels.create({
              name: '📈 LGP Market Info',
              type: ChannelType.GuildCategory,
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
                    PermissionFlagsBits.Connect,
                  ],
                  id: interaction.applicationId,
                },
                {
                  type: OverwriteType.Role,
                  deny: [PermissionFlagsBits.Connect],
                  id: guild.roles.everyone.id,
                },
              ],
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
                    PermissionFlagsBits.Connect,
                  ],
                  id: interaction.applicationId,
                },
                {
                  type: OverwriteType.Role,
                  deny: [PermissionFlagsBits.Connect],
                  id: guild.roles.everyone.id,
                },
              ],
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
                    PermissionFlagsBits.Connect,
                  ],
                  id: interaction.applicationId,
                },
                {
                  type: OverwriteType.Role,
                  deny: [PermissionFlagsBits.Connect],
                  id: guild.roles.everyone.id,
                },
              ],
            });
            category.setPosition(0);
            break;
          }
          default:
            break;
        }
        interaction.reply(`Completed 'tickers ${action}'`);
      } catch (e) {
        console.log(e);
        interaction.reply(`Failed 'tickers ${action}'`);
      }
    }
  }
};

export const tickers = {data, execute};
