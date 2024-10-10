const config = require('../utils/config.json')
const {
    EmbedBuilder,
    MessagePayload,
    ApplicationCommandOptionType,
    PermissionsBitField
} = require("discord.js");
const {
    CommandType
} = require("wokcommands");

module.exports = {
    category: 'Tickets',
    name: 'removerole',
    description: 'Removes a role from the ticket',
    testOnly: true,
    type: CommandType.SLASH,
    options: [{
        name: 'role',
        description: 'The role to remove from the ticket',
        required: true,
        type: ApplicationCommandOptionType.Role
    }],
    callback: async ({
        interaction,
        client
    }) => {

        const role = interaction.options.getRole('role')


        const success = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`<@&${role.id}> has been removed from the ticket!`)
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

            await interaction.channel.permissionOverwrites.edit(role.id, {
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