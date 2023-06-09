import { Player } from 'discord-player';

export class MusicPlayer extends Player {
    constructor(DiscordjsClient) {
        super(DiscordjsClient);
    }

    _clearQueue(musicQueue) {
    }
}
