const {
    EmbedBuilder,
    MessagePayload,
    ApplicationCommandOptionType,
    PermissionsBitField
} = require("discord.js");
const {CommandType} = require("wokcommands");
const config = require('../utils/config.json')

module.exports = {
    category: 'Tickets',
    name: 'remove',
    description: 'Removes a user from the ticket',
    testOnly: true,
    type: CommandType.SLASH,
    options: [{
        name: 'user',
        description: 'The user to remove from the ticket',
        required: true,
        type: ApplicationCommandOptionType.User
    }],
    callback: async ({
        interaction,
        client
    }) => {

        const auser = interaction.options.getMember('user')

        const success = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`<@${auser.user.id}> has been removed from the ticket!`)
            .setTimestamp()

            const errorEmbed = new EmbedBuilder()
            .setTitle('Permission Error')
            .setDescription('You do not have permission to do this. You need \`MANAGE_TICKETS\` permissions.')
            .setColor('Red')
            .setTimestamp()

            if (!interaction.member.roles.cache.has(config.ADMIN_ID)) {  // ! MANAGE TICKET PERMISSIONS

            interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            })

        } else {

            await interaction.channel.permissionOverwrites.edit(auser.user.id, {
                ViewChannel: false,
                ReadMessageHistory: false,
                EmbedLinks: false,
                AttachFiles: false,
                SendMessages: false
            })

            let msg = MessagePayload.create(interaction.channel, {
                embeds: [success]
            })

            await interaction.reply(msg)

        }
    }
}