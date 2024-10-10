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
    name: 'addrole',
    description: 'Adds a role to the ticket',
    testOnly: true,
    type: CommandType.SLASH,
    options: [{
        name: 'role',
        description: 'The role to add to the ticket',
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
            .setDescription(`<@&${role.id}> has been added to the ticket!`)
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

            await interaction.channel.permissionOverwrites.edit(role.id, {
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