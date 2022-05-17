import { TransformPipe } from '@discord-nestjs/common';
import {
  Command,
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import { Inject, Logger } from '@nestjs/common';
import { CacheType, CommandInteraction, ContextMenuInteraction } from 'discord.js';
import { PendingVerification } from 'src/db/pendingverification.entity';
import { DaoMembership } from 'src/db/daomembership.entity';
import { SolveDto } from './solve.dto';
import { signatureVerify } from '@polkadot/util-crypto';

@Command({
  name: 'solve',
  description: 'Finish claiming an on-chain identity',
})
@UsePipes(TransformPipe)
export class SolveChallengeCommand implements DiscordTransformedCommand<SolveDto> {
  private readonly logger = new Logger(SolveChallengeCommand.name);

  constructor(
    @Inject('PENDING_VERIFICATION_REPOSITORY')
    private readonly pendingVerificationRepository: typeof PendingVerification,
    @Inject('DAO_MEMBERSHIP_REPOSITORY')
    private readonly daoMembershipRepository: typeof DaoMembership,
  ) {}

  async handler(@Payload() dto: SolveDto, context: TransformedCommandExecutionContext) {

    // length check
    if(dto.challenge.length !== 130) {
      context.interaction.reply({
        content: `Signed challenge must be exactly 130 symbols. You sent a string with ${dto.challenge.length} symbols`,
        ephemeral: true
      });
    }
    // existing pending verification check
    // TODO how to make sure only one pending verification exist for a given user? 
    const verification = await this.pendingVerificationRepository.findOne(
      {
        where: {
          startedByDiscordHandle: this.buildHandle(context.interaction)
        }, 
        raw: true
      });

    if(verification) {
      this.logger.debug(`Verifying that challenge '${verification.challenge}' signature '${dto.challenge}' was signed by address '${verification.claimedAccountAddress}'`);
      const { isValid } = signatureVerify(verification.challenge, dto.challenge, verification.claimedAccountAddress);

      // verify that this address isn't yet claimed
      const existingBinding = await this.daoMembershipRepository.findOne(
        {
          where: {
            membership: verification.claimedMembership
          }, 
          raw: true
        });
      
      if(existingBinding) {
        this.logger.log(`Identity '${existingBinding.membership}' already claimed by '${existingBinding.discordHandle}'`);
        context.interaction.reply({
          content: `🤔 This identity seems to be already claimed`,
          ephemeral: true
        });
      } else {
        const created = await this.daoMembershipRepository.create(
          { 
            membership: verification.claimedMembership, 
            accountAddress: verification.claimedAccountAddress,
            discordHandle: this.buildHandle(context.interaction)
          });
        if(created) {
          this.logger.log(`${this.buildHandle(context.interaction)} claimed identity '${verification.claimedMembership}'`);
          // clean up the pending verification records
          await this.pendingVerificationRepository.destroy(
            {
              where: {
                startedByDiscordHandle: this.buildHandle(context.interaction)
              }
            }
          );

          // assign 'identity verified' server role 
          context.interaction.reply({
            content: `Congrats! You have successfully claimed the identity. Your on-chain roles should show up within 30 minutes`,
            ephemeral: true
          })
        } else {
          this.logger.log(`Creating record failed.`);
          context.interaction.reply({
            content: `Well, this is embarassing, but I have to ask you to try again later.`,
            ephemeral: true
          })
        }
      }

      context.interaction.reply({
        content: `Status: ${isValid}`,
        ephemeral: true
      });
    }
  }

  buildHandle(interaction: CommandInteraction<CacheType> | ContextMenuInteraction<CacheType>): string {
    return `${interaction.user.username}#${interaction.user.discriminator}`;
  }

}