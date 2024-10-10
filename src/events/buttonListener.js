const {
    client
} = require("../index");
const {
    ActionRowBuilder,
    EmbedBuilder,
    MessagePayload,
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const transcripts = require('discord-html-transcripts');
const config = require('../utils/config.json')
module.exports = async (interaction) => {

    client.on('interactionCreate', async (interaction) => {

        if (!interaction.isButton()) return; 

        if (interaction.customId === 'close') {

            if (!interaction.member.roles.cache.has(config.STAFF_ID)) { // ! MANAGE TICKETS PERMISSION

                interaction.reply({
                    content: 'You do not have permission to close tickets',
                    ephemeral: true
                })

            } else {


                interaction.channel.permissionOverwrites.set([{
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: interaction.channel.topic,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                        deny: [PermissionsBitField.Flags.SendMessages]
                    },
                    {
                        id: '1186428626137264190',
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.SendMessages]
                    }
                ])


                const reopenButton = new ButtonBuilder()
                    .setCustomId('re-open')
                    .setEmoji('🔓')
                    .setLabel('Re-Open')
                    .setStyle(ButtonStyle.Secondary)



                const deleteButton = new ButtonBuilder()
                    .setCustomId('delete')
                    .setEmoji('🗑️')
                    .setLabel('Delete')
                    .setStyle(ButtonStyle.Danger)



                const row1 = new ActionRowBuilder()
                    .addComponents(reopenButton, deleteButton)

                const closedEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Ticket Closed')
                    .setDescription(`This ticket was closed by <@${interaction.user.id}> (${interaction.user.tag})`)
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setTimestamp()

                let closedMsg = MessagePayload.create(interaction.channel, {
                    embeds: [closedEmbed],
                    components: [row1]
                })

                interaction.channel.send(closedMsg)


            }

        }

        if (interaction.customId === 're-open') {

            await interaction.deferUpdate()

            interaction.channel.permissionOverwrites.set([{
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.channel.topic,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.SendMessages],
                },
                {
                    id: '1186428626137264190',
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.SendMessages]
                },
                {
                    id: '1195160064399527976',
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.SendMessages]
                }
            ])

            const reopenedEmbed = new EmbedBuilder()
                .setColor('Orange')
                .setTitle('Ticket Re-Opened')
                .setDescription(`This ticket was re-opened by <@${interaction.user.id}> (${interaction.user.tag})`)
                .setFooter({
                    text: interaction.user.tag,
                    iconURL: interaction.user.avatarURL()
                })
                .setTimestamp()

            let closedMsg = MessagePayload.create(interaction.channel, {
                embeds: [reopenedEmbed]
            })

            await interaction.channel.send(closedMsg)

        }

        if (interaction.customId === 'claim') {

            if (!interaction.member.roles.cache.has(config.STAFF_ID)) {
                interaction.reply({
                    content: 'You do not have permission to claim tickets',
                    ephemeral: true
                })
            } else {
                interaction.deferUpdate()
                const success = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`This ticket has been successfully claimed by <@${interaction.user.id}>`)

                let logMsg = MessagePayload.create(interaction.channel, {
                    embeds: [success]
                })

                // await interaction.channel.setName(`${interaction.user.tag}-doing`).then(interaction.channel.send(logMsg))
                await interaction.channel.send(logMsg)
            }


        }


        if (interaction.customId === 'delete') {

            if (!interaction.member.roles.cache.has(config.STAFF_ID)) {

                interaction.reply({
                    content: 'You do not have permission to delete tickets',
                    ephemeral: true
                })

            } else {

                var sendGuild = await client.guilds.fetch('1250913735024054335')
                var sendChannel = await sendGuild.channels.fetch('1267605763816423445')

                const attachment = await transcripts.createTranscript(interaction.channel, {
                    limit: 10000,
                    returnType: 'attachment',
                    fileName: `${interaction.channel.name}.html`,
                    saveImages: true
                });

                

                try {
                    const user = await client.users.fetch(interaction.channel.topic).catch(() => null);
                    let saveddEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('New Transcript')
                    .setDescription(`Ticket transcript for ${interaction.channel.name}. Ticket closed by ${interaction.user.tag}`)
                    .setTimestamp()

                let transcriptmsg = MessagePayload.create(interaction.channel, {
                    embeds: [saveddEmbed],
                    files: [attachment]
                })
                    user.send(transcriptmsg)

                } catch (err) {
                    interaction.channel.send('The ticket creator has their DMS disabled. They will not receive a copy of the transcript')
                }

                let tchannel = interaction.guild.channels.cache.find(c => c.id === '1186472270252736593')

                let tembed = new EmbedBuilder()
                    .setColor('Yellow')
                    .setTitle('Transcript Saved')
                    .setDescription(`The ticket transcript has been saved by <@${interaction.user.id}> (${interaction.user.tag})`)

                let tmsg = MessagePayload.create(interaction.channel, {
                    embeds: [tembed]
                })

                await interaction.channel.send(tmsg)

                let savedEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('New Transcript')
                    .setDescription(`Ticket transcript for ${interaction.channel.name}. Ticket closed by ${interaction.user.tag}`)
                    .setTimestamp()

                let transcriptmsg = MessagePayload.create(sendChannel, {
                    embeds: [savedEmbed],
                    files: [attachment]
                })

                await sendChannel.send(transcriptmsg)

                const deleting = new EmbedBuilder()
                    .setColor('Yellow')
                    .setDescription("This ticket will be deleted in 10 seconds")

                let deleteMsg = MessagePayload.create(interaction.channel, {
                    embeds: [deleting]
                })

                await interaction.channel.send(deleteMsg).then(
                    interaction.deferUpdate().then(
                        setTimeout(() => {
                            interaction.channel.delete()

                        }, 10000)
                    ))

            }

        }

    })
}