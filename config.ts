import { EventEmitterModuleOptions } from '@nestjs/event-emitter/dist/interfaces';
import { AxiosRequestConfig } from 'axios';
import { BackOffPolicy, RetryOptions } from 'typescript-retry-decorator';
import {
  ChannelNames,
  Licenses,
  ForumCategoryToDiscordChannelMap,
} from './src/types';

export const database = 'joy_dao';

// wg bot
export const channelNames: ChannelNames = {
  // Discussion
  general: '💬｜general',
  announcement: '📢｜announcements',
  techSupport: '💻｜tech-support',
  atlasFeedback: '🛫｜atlas-testing',
  offTopic: '🍻｜off-topic',
  // DAO
  // groups https://github.com/Joystream/joystream/blob/c57054eebe5da4f683134dbdaaecf50263ec7336/cli/src/Types.ts#L53-L63
  operationsWorkingGroupAlpha: '👷｜builders',
  validators: '✅｜validator',
  storageWorkingGroup: '💿｜storage-provider',
  distributionWorkingGroup: '🔌｜distributors',
  contentWorkingGroup: '▶｜content-curator',
  contentCreator: '💻｜content-creator',
  operationsWorkingGroupGamma: '📈｜marketing',
  operationsWorkingGroupBeta: '👨｜human-resources',
  forumWorkingGroup: '📋｜forum',
  council: '🏛｜council',
  proposals: '📋｜proposals',
  bounties: '💻｜active-bounties',
  app: '💾｜apps',
  // Work
  atlasGeneral: 'atlas-general',
  pioneerGeneral: 'pioneer-general',

  // BOTS
  videos: '🤖｜video-bot',
  forumBot: '🤖｜forum-bot',
};

export const identityValidatedRole = 'on-chain identity verified';
export const councilMemberRole = 'Council Member';
export const foundingMemberRole = 'founding member';

//mapping of group Id coming from Query node to server role name
export const wgToRoleMap: ChannelNames = {
  contentWorkingGroup: 'Content Worker',
  storageWorkingGroup: 'Storage Worker',
  forumWorkingGroup: 'Forum Worker',
  distributionWorkingGroup: 'Distribution Worker',
  operationsWorkingGroupAlpha: 'Builder Worker',
  operationsWorkingGroupGamma: 'Marketing Worker',
  operationsWorkingGroupBeta: 'HR Worker',
  contentWorkingGroupLead: 'Content Lead',
  storageWorkingGroupLead: 'Storage Lead',
  forumWorkingGroupLead: 'Forum Lead',
  distributionWorkingGroupLead: 'Distribution Lead',
  operationsWorkingGroupAlphaLead: 'Builder Lead',
  operationsWorkingGroupGammaLead: 'Marketing Lead',
  operationsWorkingGroupBetaLead: 'HR Lead',
  councilMemberRole,
  foundingMemberRole,
};

export const wgEvents = [
  'ApplicationTerminated',
  'ApplicationWithdrawn',
  'AppliedOnOpening',
  'LeaderSet',
  'LeaderUnset',
  'BudgetSet',
  'UpdatedWorkingGroupBudget', //unlike all others, this event comes in a dedicated section 'joystreamUtility'
  'OpeningAdded',
  'OpeningCanceled',
  'RewardPaid',
  'OpeningFilled',
  'StakeDecreased',
  'StakeIncreased',
  'StakeSlashed',
  'TerminatedLeader',
  'TerminatedWorker',
  'WorkerExited',
  'WorkerRewardAmountUpdated',
];

export const licenses: Licenses = {
  '1000': 'Custom',
  '1001': 'PDM',
  '1002': 'CC0',
  '1003': 'CC_BY',
  '1004': 'CC_BY_SA',
  '1005': 'CC_BY_ND',
  '1006': 'CC_BY_NC',
  '1007': 'CC_BY_NC_SA',
  '1008': 'CC_BY_NC_ND',
};

export const forumCategoriesToChannels: ForumCategoryToDiscordChannelMap[] = [
  {
    category: {
      id: 1,
      name: 'Joystream General',
    },
    channels: [channelNames.forumBot],
  },
  {
    category: {
      id: 2,
      name: 'Governance',
    },
    channels: [channelNames.council],
  },
  {
    category: {
      id: 3,
      name: 'Joystream DApps',
    },
    channels: [channelNames.app],
  },
  {
    category: {
      id: 4,
      name: 'Technical Discussion',
    },
    channels: [channelNames.techSupport],
  },
  {
    category: {
      id: 7,
      name: 'Council Reports',
    },
    channels: [channelNames.council],
  },
  {
    category: {
      id: 8,
      name: 'Pre-proposals',
    },
    channels: [channelNames.proposals],
  },
  {
    category: {
      id: 10,
      name: 'Important Announcements',
    },
    channels: [channelNames.announcement],
  },
  {
    category: {
      id: 13,
      name: 'Gleev',
    },
    channels: [channelNames.app],
  },
  {
    category: {
      id: 14,
      name: 'l1.media',
    },
    channels: [channelNames.app],
  },
  {
    category: {
      id: 15,
      name: 'Atlas',
    },
    channels: [channelNames.atlasGeneral],
  },
  {
    category: {
      id: 16,
      name: 'Pioneer',
    },
    channels: [channelNames.pioneerGeneral],
  },
  {
    category: {
      id: 33,
      name: 'Working Groups (Technical)',
    },
    channels: [channelNames.council],
  },
  {
    category: {
      id: 34,
      name: 'Working Groups (Non-Technical)',
    },
    channels: [channelNames.council],
  },
  {
    category: {
      id: 35,
      name: 'Media Releases',
    },
    channels: [channelNames.operationsWorkingGroupGamma],
  },
  {
    category: {
      id: 36,
      name: 'Community Guide',
    },
    channels: [channelNames.techSupport],
  },
  {
    category: {
      id: 37,
      name: 'Off Topic',
    },
    channels: [channelNames.offTopic],
  },
  {
    category: {
      id: 38,
      name: 'Storage',
    },
    channels: [channelNames.storageWorkingGroup],
  },
  {
    category: {
      id: 39,
      name: 'Distribution',
    },
    channels: [channelNames.distributionWorkingGroup],
  },
  {
    category: {
      id: 40,
      name: 'Builders',
    },
    channels: [channelNames.operationsWorkingGroupAlpha],
  },
  {
    category: {
      id: 41,
      name: 'Apps WG',
    },
    channels: [channelNames.app],
  },
  {
    category: {
      id: 42,
      name: 'HR',
    },
    channels: [channelNames.operationsWorkingGroupBeta],
  },
  {
    category: {
      id: 44,
      name: 'Marketing',
    },
    channels: [channelNames.operationsWorkingGroupGamma],
  },
  {
    category: {
      id: 45,
      name: 'Forum',
    },
    channels: [channelNames.forumWorkingGroup],
  },
  {
    category: {
      id: 46,
      name: 'Content',
    },
    channels: [channelNames.contentWorkingGroup],
  },
  {
    category: {
      id: 47,
      name: 'Council Dialogue',
    },
    channels: [channelNames.council],
  },
  {
    category: {
      id: 48,
      name: 'Council Candidate Manifesto',
    },
    channels: [channelNames.council],
  },
  {
    category: {
      id: 49,
      name: 'Archives',
    },
    channels: [channelNames.forumWorkingGroup],
  },
  {
    category: {
      id: 50,
      name: 'Validators',
    },
    channels: [channelNames.validators],
  },
];

export const globalRetryConfig: RetryOptions = {
  maxAttempts: 3,
  backOffPolicy: BackOffPolicy.ExponentialBackOffPolicy,
  backOff: 1000,
  exponentialOption: { maxInterval: 4000, multiplier: 3 },
};

export const globalEventingConfig: EventEmitterModuleOptions = {
  global: true,
  wildcard: true,
  maxListeners: 32,
};

export const axiosConfig: AxiosRequestConfig = {
  timeout: 10000, // 10 sec in milliseconds
};

export const joystreamBlue = '#4038FF'; // official joystream blue, see https://www.joystream.org/brand/guides/
