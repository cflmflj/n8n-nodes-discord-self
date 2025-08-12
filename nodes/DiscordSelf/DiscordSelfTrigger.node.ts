import type {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  ITriggerFunctions,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { getOrCreateClient } from './ClientManager';

export class DiscordSelfTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Discord Self Trigger',
    name: 'discordSelfTrigger',
    group: ['trigger'],
    version: 1,
    description: '触发来自 Discord 自用号的事件（最小实现：messageCreate）',
    defaults: {
      name: 'Discord Self Trigger',
    },
    inputs: [],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'discordSelfApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        default: 'messageCreate',
        options: [{ name: 'Message Created', value: 'messageCreate' }],
      },
      {
        displayName: 'Channel IDs',
        name: 'channelIds',
        type: 'string',
        default: '',
        description: '可选，逗号分隔的频道ID列表。为空表示全部频道',
      },
      {
        displayName: 'Only DMs',
        name: 'onlyDMs',
        type: 'boolean',
        default: false,
        description: 'Whether to listen to direct messages only',
      },
      {
        displayName: 'Only Mentions Me',
        name: 'onlyMentions',
        type: 'boolean',
        default: false,
        description: 'Whether to trigger only when the authenticated user is mentioned',
      },
      {
        displayName: 'Ignore Self Messages',
        name: 'ignoreSelf',
        type: 'boolean',
        default: true,
        description: 'Whether to ignore messages sent by the authenticated user',
      },
    ],
  };

  async trigger(this: ITriggerFunctions) {
    const credentials = (await this.getCredentials('discordSelfApi')) as unknown as {
      token: string;
    };
    const token = credentials.token;
    const channelIdsRaw = (this.getNodeParameter('channelIds', 0) as string) || '';
    const onlyDMs = (this.getNodeParameter('onlyDMs', 0) as boolean) || false;
    const onlyMentions = (this.getNodeParameter('onlyMentions', 0) as boolean) || false;
    const ignoreSelf = (this.getNodeParameter('ignoreSelf', 0) as boolean) ?? true;

    const client = await getOrCreateClient(token);

    const handler = (message: any) => {
      try {
        // DMs filter
        if (onlyDMs && message?.guild) return;

        // Ignore self
        if (ignoreSelf && message?.author?.id && client.user?.id && message.author.id === client.user.id) return;

        // Channel allow-list
        if (channelIdsRaw) {
          const allowIds = channelIdsRaw
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
          if (allowIds.length > 0 && !allowIds.includes(message?.channel?.id)) return;
        }

        // Mentions filter
        if (onlyMentions && client.user?.id) {
          const mentioned = Boolean(message?.mentions?.users?.has?.(client.user.id));
          if (!mentioned) return;
        }
        const data = {
          id: message?.id,
          content: message?.content ?? '',
          authorId: message?.author?.id ?? null,
          authorUsername: message?.author?.username ?? null,
          channelId: message?.channel?.id ?? null,
          guildId: message?.guild?.id ?? null,
          createdTimestamp: message?.createdTimestamp ?? null,
        };
        const items: INodeExecutionData[] = this.helpers.returnJsonArray([data]);
        this.emit([items]);
      } catch (e) {
        // swallow to avoid breaking trigger loop
      }
    };

    client.on('messageCreate', handler);

    return {
      closeFunction: async () => {
        client.off('messageCreate', handler);
      },
    };
  }
}


