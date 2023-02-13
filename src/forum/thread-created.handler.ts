import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TextChannel } from 'discord.js';
import { getNewThreadEmbed } from './forum.embeds';
import { ForumThreadByIdQuery } from 'src/qntypes';
import { EventWithBlock } from 'src/types';
import { BaseEventHandler } from './base.event.handler';
import { ForumThreadId } from '@joystream/types/primitives';

@Injectable()
export class ThreadCreatedHandler extends BaseEventHandler {
  private readonly logger = new Logger(ThreadCreatedHandler.name);

  @OnEvent('forum.ThreadCreated')
  async handleThreadCreatedEvent(payload: EventWithBlock) {
    const { data } = payload.event.event;
    const threadId = data[1] as ForumThreadId;
    const thread = await this.queryNodeClient.forumThreadById(
      threadId.toString(),
    );
    const serverChannels = this.findChannelsByThread(thread);
    serverChannels?.forEach((ch: TextChannel) => {
      this.logger.debug(
        `Sending to channel [${ch.id.toString()}] [${ch.name}]`,
      );
      ch.send({
        embeds: [getNewThreadEmbed(thread, payload.block, payload.event)],
      });
    });
  }

  findChannelsByThread(thread: ForumThreadByIdQuery): TextChannel[] {
    if (!thread.forumThreadByUniqueInput) return [];

    const { id, parentId } = thread.forumThreadByUniqueInput.category;
    return this.findChannelsByCategoryId(
      parseInt(id, 10),
      parentId ? parseInt(parentId, 10) : undefined,
    );
  }

  getLogger(): Logger {
    return this.logger;
  }
}
