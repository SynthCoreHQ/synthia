const data = {
    id: process.env['NODE_ENV'] === 'production'
        ? process.env['CLIENT_ID']
        : process.env['ALPHA_CLIENT_ID'],
    token: process.env['NODE_ENV'] === 'production'
        ? process.env['CLIENT_TOKEN']
        : process.env['ALPHA_CLIENT_TOKEN'],
    secret: process.env['NODE_ENV'] === 'production'
        ? process.env['CLIENT_SECRET']
        : process.env['ALPHA_CLIENT_SECRET'],
    icon: process.env['NODE_ENV'] === 'production'
        ? process.env['CLIENT_ICON']
        : process.env['ALPHA_CLIENT_ICON'],
    invitationUrl: process.env['NODE_ENV'] === 'production'
        ? process.env['CLIENT_INVITE_URL']
        : process.env['ALPHA_CLIENT_INVITE_URL'],
    presenceStatus: '/ping',
    guild: {
        id: process.env['GUILD_ID'] || '',
        inviteCode: process.env['GUILD_INVITE_CODE'] || '',
    },
    developmentGuildId: process.env['DEV_GUILD_ID'] || '',
    developers: ['953235785782534174'],
    globalPrefix: process.env['COMMAND_PREFIX'] || '',
    deployGlobally: true,
    embeds: {
        title: 'Synthia | {text}',
        footer: 'Made with 💖 by {text}',
        color: 0x2b2d31,
        aestheticColor: 0xab60ff /* 0xe4aefc */,
    },
    logChannelId: '1113016576682246245',
    emotes: {
        right: '<:right:1110810621412380692>',
        wrong: '<:wrong:1110810698562404482>',
        info: '<:info:1110811846480510996>',
        discord: '<:discord:1110812352779128873>',
        github: '<:github:1110812410169786388>',
        website: '<:website:1110812561131192390>',
        loop: '<:music_loop:1113370128034316319>',
        next: '<:music_next:1113369612814393344>',
        pause: '<:music_pause:1113369849876463629>',
        previous: '<:music_previous:1113369552353501235>',
        stop: '<:music_stop:1113369676358090772>',
        autoplay: '<:music_autoplay:1113371677997416518>',
    },
    nodes: [
        {
            name: 'main',
            url: 'narco.buses.rocks:2269',
            auth: 'glasshost1984',
        },
        // {
        //     name: 'lava1',
        //     url: 'lava1.horizxon.studio:80',
        //     auth: 'horizxon.studio',
        // },
    ],
};

export { data };
