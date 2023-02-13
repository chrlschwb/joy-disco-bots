import { TextChannel } from 'discord.js';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ForumPostId } from '@joystream/types/primitives';

import { getNewPostEmbed } from './forum.embeds';
import { PostByIdQuery } from 'src/qntypes';
import { EventWithBlock } from 'src/types';
import { BaseEventHandler } from './base.event.handler';

@Injectable()
export class PostCreatedHandler extends BaseEventHandler {
  private readonly logger = new Logger(PostCreatedHandler.name);

  @OnEvent('forum.PostAdded')
  async handlePostCreatedEvent(payload: EventWithBlock) {
    const { data } = payload.event.event;
    const postId = data[0] as ForumPostId;
    const post = await this.queryNodeClient.postById(postId.toString());
    const serverChannels = this.findChannelsByPost(post);
    serverChannels.forEach((ch) => {
      this.logger.debug(
        `Sending to channel [${ch.id.toString()}] [${ch.name}]`,
      );
      ch.send({
        embeds: [getNewPostEmbed(post, payload.block, payload.event)],
      });
    });
  }

  findChannelsByPost(post: PostByIdQuery): TextChannel[] {
    if (!post.forumPostByUniqueInput) return [];

    const { id, parentId } = post.forumPostByUniqueInput.thread.category;

    this.logger.debug(id, parentId);

    return this.findChannelsByCategoryId(
      parseInt(id, 10),
      parentId ? parseInt(parentId, 10) : undefined,
    );
  }

  getLogger(): Logger {
    return this.logger;
  }
}
