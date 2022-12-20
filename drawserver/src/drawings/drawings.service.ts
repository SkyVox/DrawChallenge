import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { ClientMessageDto, ServerMessageDto } from './dto/MessageDto';
import { SubmitBoard } from './dto/SubmitBoardDto';
import { ConnectedUser } from './interfaces/ConnectedUser.interface';
import { GameState, GameStatus } from './interfaces/GameStatus.interface';
import { User } from './interfaces/User.interface';
import { words } from './utils/words';

@Injectable()
export class DrawingsService {
    private gameTime = 20;
    private viewBoardTimeMS = 5000;

    private users: ConnectedUser = {} as ConnectedUser;
    private queuedUsers: Array<string> = [];
    private gameStatus: GameStatus = {
        time: 5,
        gameState: GameState.WAITING,
        object: null
    };

    sendMessage(client: Socket, message: ClientMessageDto) {
        client.emit('send-client-message', message);
    }

    broadcastMessage(server: any, message: ClientMessageDto) {
        server.emit('send-client-message', message);
    }

    handleUserConnect(userName: string, client: Socket, server: any) {
        const userId = this.buildId();

        this.users[userId] = {
            name: userName,
            client: client,
            id: userId,
            boardImage: null,
            votes: 0
        };

        const connectedUsers = this.getConnectedUserNames();

        client.emit('user-has-connected', {
            userName,
            userId,
            connectedUsers: connectedUsers
        });
        server.emit('refresh-connected-users', connectedUsers);

        if (this.gameStatus.gameState === GameState.STARTED) {
            server.emit('game-status', this.gameStatus.gameState);
        }
    }

    handleChatMessage(data: ServerMessageDto, client: Socket, server: any) {
        const user = this.users[data.userId];

        if (data.message.startsWith('/start')) {
            const message: ClientMessageDto = {
                user: 'SERVER',
                message: null,
                time: new Date().toLocaleTimeString('pt-BR')
            }

            if (this.queuedUsers.includes(data.userId)) {
                message['message'] = 'You are already on the queue list. Please wait more users.';
                this.sendMessage(client, message);
                return;
            }

            if (this.queuedUsers.includes(data.userId)) {
                message['message'] = 'This game is full.';
                this.sendMessage(client, message);
                return;
            }

            this.queuedUsers.push(data.userId);
            message['message'] = `Successfully registered, queued users: ${this.queuedUsers.length}.`;
            this.sendMessage(client, message);
            this.handleGameStart(server);
            return;
        }

        const message: ClientMessageDto = {
            user: user?.name,
            message: data.message,
            time: new Date().toLocaleTimeString('pt-BR')
        }

        this.broadcastMessage(server, message);
    }

    handleSubmitBoard(data: SubmitBoard) {
        this.users[data.userId]['boardImage'] = data.boardImageUrl;
    }

    handleGameStart(server: any) {
        if (this.queuedUsers.length >= 2) {
            const object = this.pickRandomObject();

            this.gameStatus = {
                time: this.gameTime,
                gameState: GameState.STARTED,
                object
            }

            this.queuedUsers.forEach((id: string) => {
                this.users[id].client.emit('start-game', this.gameStatus);
                this.sendMessage(this.users[id].client, {
                    user: 'SERVER',
                    message: `Game has started, you should draw ${object}`,
                    time: new Date().toLocaleTimeString('pt-BR')
                });
            });

            setTimeout(async () => {
                // End Game.
                this.queuedUsers.forEach((id: string) => this.users[id].client.emit('end-game', id));

                for (const id of this.queuedUsers) {
                    const boardImage = this.users[id].boardImage;

                    Object.keys(this.users).map((key: string) => {
                        this.users[key].client.emit('vote-board', boardImage);
                    });

                    await this.timer(this.viewBoardTimeMS);
                }

                this.gameStatus = {
                    time: this.gameTime,
                    gameState: GameState.WAITING,
                    object: null
                }

                const winner = this.getWinner();

                server.emit('game-status', this.gameStatus.gameState);
                server.emit('game-winner', {
                    boardImage: winner.boardImage
                });
                this.broadcastMessage(server, {
                    user: 'SERVER',
                    message: `${winner.name} won the game with ${winner.votes} votes!`,
                    time: new Date().toLocaleTimeString('pt-BR')
                });
                this.queuedUsers = [];
            }, this.gameTime * 1000);
        }
    }

    getWinner(): User {
        let ret: User = null;

        Object.keys(this.users).forEach((key: string) => {
            const user = this.users[key];

            if (!ret || user.votes > ret.votes) ret = user;
        });

        return ret;
    }

    getConnectedUserNames(): Array<string> {
        return Object.keys(this.users).map((key: string) => this.users[key]?.name);
    }

    pickRandomObject = (): string => words[Math.floor(Math.random() * words.length)];

    buildId = (): string => uuidv4();

    timer = (ms: number) => new Promise(res => setTimeout(res, ms));
}
