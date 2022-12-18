import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway(1011, { transports : ['websocket'] })
export class AppGateway {
    @WebSocketServer()
    server: any;
    connectedUsers: {} = {};

    usersAwaiting: string[] = [];

    @SubscribeMessage('user-connected')
    handleUserConnect(@MessageBody() data: string, @ConnectedSocket() client: any): string {
        const userId = uuidv4();
        this.connectedUsers[userId.toUpperCase()] = {
            name: data,
            client,
            id: userId
        };
        const userNames = Object.keys(this.connectedUsers).map((key: string) => {
            return this.connectedUsers[key].name;
        });

        client.emit('user-has-connected', {
            userName: data,
            userId: userId,
            connectedUsers: userNames
        });
        this.server.emit('refresh-connected-users', userNames);

        return data;
    }

    @SubscribeMessage('send-server-message')
    handleChatMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): string {
        const message = data.message;
        const userId = data.userId;
        if (message.startsWith('/start')) {
            if (this.usersAwaiting.includes(userId)) {
                client.emit('send-client-message', 'You are already on the queue list. Please wait more users.');
                return message;
            }

            if (this.usersAwaiting.length === 2) {
                client.emit('send-client-message', 'This game is full.');
                return message;
            }

            this.usersAwaiting.push(userId);
            client.emit('send-client-message', `Successfully registered, queued users: ${this.usersAwaiting.length}.`);
            this.handleGameStart();
            return message;
        }

        const user = this.connectedUsers[userId.toUpperCase()];

        // TODO: Create DTO for this...
        const clientMessage = {
            user: user?.name,
            message,
            time: new Date().toLocaleTimeString('pt-BR')
        }

        this.server.emit('send-client-message', clientMessage);
        return message;
    }

    handleGameStart() {
        if (this.usersAwaiting.length === 2) {
            const object = this.pickRandomObject();
            this.usersAwaiting.forEach((id: string) => {
                this.connectedUsers[id].client.emit('start-game', id);
                this.connectedUsers[id].client.emit('send-client-message', `Game has started, you should draw ${object}`);
                console.log('iniciando jogo para:', id);
            });
        }
    }

    handleDisconnect(client: any) {
        //console.log(`Client disconnected`);
    }

    pickRandomObject() : string {
        const objects = [
            'home',
            'sofa',
            'computer',
            'keyboard',
            'mouse'
        ];
        return objects[Math.floor(Math.random() * objects.length)];
    }
}
