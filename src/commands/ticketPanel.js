const {
    ButtonBuilder,
    EmbedBuilder,
    MessagePayload,
    ActionRowBuilder,
    ButtonStyle
} = require("discord.js")
const {
    CommandType
} = require("wokcommands");
module.exports = {
    category: 'Tickets',
    name: 'ticketpanel',
    description: 'Send panel for ticket selection',
    testOnly: true,
    type: CommandType.SLASH,
    ownerOnly: true,

    callback: async ({
        interaction,
        client
    }) => {

        const gensupButton = new ButtonBuilder()
            .setCustomId('gensup')
            .setEmoji('📩')
            .setLabel('General Support')
            .setStyle(ButtonStyle.Secondary)

        const row1 = new ActionRowBuilder()
            .addComponents(gensupButton)


        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Ticket Categories')
            .setThumbnail(interaction.guild.iconURL())
            .setDescription('>>> 🌟 Hey there! Having some trouble? \nOur support tickets are the best way to get in contact with the support team. A support ticket can be opened for any kind of issue. \n\n⏰ Our support team members handle tickets as quickly as they can. Unless it\'s urgent, please don\'t ping staff.')
            .setFooter({
                text: 'Ticket System'
            })
            .setTimestamp()


        let msg = MessagePayload.create(interaction.channel, {
            embeds: [embed],
            components: [row1]
        })

        await interaction.channel.send(msg)

    }
}