const {
    EmbedBuilder,
    ChannelType,
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    MessagePayload
} = require("discord.js");
const {client} = require("../index");
const config = require('../utils/config.json');
const {addTicket} = require('../database/queries/ticketQuery')
module.exports = async (instance, message) => {

    
    client.on('interactionCreate', async (interaction) => {

        const genSupOpened = new EmbedBuilder()
        .setColor('Aqua')
        .setTitle('General Support Ticket')
        .setDescription('>>> Thank you for contacting the support team. \nPlease tell us how we can help and await a response!')
        .setTimestamp()
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({
            text: 'Ticket System'
        })

        if (!interaction.isButton()) return;

        // ?GENERAL SUPPORT 
        if (interaction.customId === 'gensup') {

            let channelName = `support-${interaction.user.tag}`
            let parent = config.TICKET_CATEGORY

            let newTicket = await interaction.guild.channels.create({
                name: channelName,
                parent: parent,
                topic: `${interaction.user.id}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [{
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.SendMessages]
                    },
                    {
                        id: config.STAFF_ID,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.SendMessages]
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    }
                ],

            }).then(async channel => {
                const closeButton = new ButtonBuilder()
                    .setCustomId('close')
                    .setEmoji('🔒')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger)

                const claimButton = new ButtonBuilder()
                    .setCustomId('claim')
                    .setEmoji('🤚🏻')
                    .setLabel('Claim')
                    .setStyle(ButtonStyle.Primary)

                const row1 = new ActionRowBuilder()
                    .addComponents(closeButton, claimButton)

                await interaction.reply({
                    content: `Your ticket has been made at <#${channel.id}>`,
                    ephemeral: true
                })

                await addTicket(interaction.user.id, Date.now().toLocaleString())
                await channel.send({embeds: [genSupOpened], components: [row1]})
            })

        } // *END

    })
}