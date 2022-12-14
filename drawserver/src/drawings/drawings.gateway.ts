import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { DrawingsService } from './drawings.service';
import { CastVoteDto } from './dto/CastVoteDto';
import { ServerMessageDto } from './dto/MessageDto';
import { SubmitBoard } from './dto/SubmitBoardDto';

@WebSocketGateway(1011, { transports : ['websocket'] })
export class DrawingsGateway {
  @WebSocketServer()
  server: any;

  constructor(private readonly drawService: DrawingsService) {}

  @SubscribeMessage('user-connected')
  handleUserConnect(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    this.drawService.handleUserConnect(data, client, this.server);
  }

  @SubscribeMessage('game-submit-board')
  handleBoardSubmit(@MessageBody() data: SubmitBoard) {
    this.drawService.handleSubmitBoard(data);
  }

  @SubscribeMessage('send-server-message')
  handleChatMessage(@MessageBody() data: ServerMessageDto, @ConnectedSocket() client: Socket) {
    this.drawService.handleChatMessage(data, client, this.server);
  }

  @SubscribeMessage('cast-vote')
  handleCastVote(@MessageBody() data: CastVoteDto, @ConnectedSocket() client: Socket) {
    this.drawService.handleCastVote(data, client);
  }

  @SubscribeMessage('user-disconnect')
  hahahehe(@MessageBody() userId: string) {
    this.drawService.handleUserDisconnect(userId, this.server);
  }
}
