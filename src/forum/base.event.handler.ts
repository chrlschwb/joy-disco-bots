import { Client, TextChannel } from 'discord.js';
import { InjectDiscordClient, Once } from '@discord-nestjs/core';
import { Injectable, Logger, Optional } from '@nestjs/common';

import { forumCategoriesToChannels } from 'config';
import { RetryablePioneerClient } from 'src/gql/pioneer.client';
import { DiscordChannels } from 'src/types';
import { getDiscordChannels } from 'src/util';

@Injectable()
export abstract class BaseEventHandler {
  constructor(
    protected readonly queryNodeClient: RetryablePioneerClient,
    @InjectDiscordClient()
    protected readonly client: Client,
    @Optional()
    protected channels: DiscordChannels,
  ) {}

  @Once('ready')
  async onReady(): Promise<void> {
    this.channels = await getDiscordChannels(this.client);
  }

  findChannelsByCategoryId(
    categoryId: number,
    parentCategoryId?: number,
  ): TextChannel[] {
    const mappedChannels = forumCategoriesToChannels.find(
      (mapping) => mapping.category.id == categoryId,
    )?.channels;
    if (!mappedChannels) {
      this.getLogger().log(
        `Mapped channels not found for categoryId=${categoryId}, parentCategory=${parentCategoryId}`,
      );
      return [];
    }
    const oneD = [] as TextChannel[];
    for (const row of Object.values(this.channels))
      for (const e of row) oneD.push(e);
    return oneD.filter((ch: TextChannel) => mappedChannels.includes(ch.name));
  }

  abstract getLogger(): Logger;
}
