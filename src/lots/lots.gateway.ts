import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../shared/logger.service';

interface WebsocketResponseInterface {
  message: string;
  params?: {};
}

@Injectable()
@WebSocketGateway()
export class LotsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly loggerService: LoggerService,
  ) {}

  @WebSocketServer()
  private server;

  afterInit(server: Server) {
     this.loggerService.log('LotsGateway websocket has been initialized.');
  }

  // ping-pong functionality
  @SubscribeMessage('checkServerConnection')
  checkServerConnection(client: Socket): void {
    const resp = 'Server time: ' + moment().format('DD MMM YYYY, hh:mm:ss');
    client.emit('checkBrowserConnection', {message: resp });
  }

  handleConnection(client: any, ...args): any {
    client.emit('connection');
    this.loggerService.log('LotsGateway handleConnection method.');
  }

  handleDisconnect(client: any): void {
    this.loggerService.log('LotsGateway handleDisconnect method.');
  }

  bidsUpdate(response: WebsocketResponseInterface) {
    this.server.emit('bidsUpdated', response);
    this.loggerService.log(`WS. Bids Updated. ${response.message}`);
  }
}
