const {
    EmbedBuilder,
    MessagePayload,
    ApplicationCommandOptionType,
    PermissionsBitField
} = require("discord.js");
const {CommandType} = require("wokcommands");
const config = require('../../utils/config.json')
module.exports = {
    category: 'Tickets',
    name: 'add',
    description: 'Adds a user to the ticket',
    testOnly: true,
    type: CommandType.SLASH,
    options: [{
        name: 'user',
        description: 'The user to add to the ticket',
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
            .setDescription(`<@${auser.user.id}> has been added to the ticket!`)
            .setTimestamp()

            const errorEmbed = new EmbedBuilder()
            .setTitle('Permission Error')
            .setDescription('You do not have permission to do this. You need \`MANAGE_TICKETS\` permissions.')
            .setColor('Red')
            .setTimestamp()

        if (!interaction.member.roles.cache.has(config.ADMIN_ID)) { //! MANAGE TICKETS PERMISSION

            interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            })

        } else {

            await interaction.channel.permissionOverwrites.edit(auser.user.id, {
                ViewChannel: true,
                ReadMessageHistory: true,
                EmbedLinks: true,
                AttachFiles: true,
                SendMessages: true
            })

            let msg = MessagePayload.create(interaction.channel, {
                embeds: [success]
            })

            await interaction.reply(msg)
        }

    }
}