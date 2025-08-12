import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { getOrCreateClient } from './ClientManager';

export class DiscordSelf implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Discord Self',
    name: 'discordSelf',
    group: ['transform'],
    version: 1,
    description: '最小可用操作：发送消息到频道',
    defaults: {
      name: 'Discord Self',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'discordSelfApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'sendMessage',
        options: [{ name: 'Send Message', value: 'sendMessage' }],
      },
      {
        displayName: 'Channel ID',
        name: 'channelId',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Content',
        name: 'content',
        type: 'string',
        default: '',
        required: true,
        typeOptions: { rows: 4 },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const credentials = (await this.getCredentials('discordSelfApi')) as unknown as {
      token: string;
    };
    const token = credentials.token;
    const client = await getOrCreateClient(token);

    const returnItems: INodeExecutionData[] = [];

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      try {
        const channelId = this.getNodeParameter('channelId', itemIndex, '') as string;
        const content = this.getNodeParameter('content', itemIndex, '') as string;

        if (!channelId || !content) {
          throw new NodeOperationError(this.getNode(), 'Channel ID 与 Content 均为必填');
        }

        const channel: any = await (client as any).channels.fetch(channelId);
        if (!channel || typeof channel.send !== 'function') {
          throw new NodeOperationError(this.getNode(), '指定的 Channel 不支持发送消息');
        }

        const sent: any = await channel.send(content);
        returnItems.push({
          json: {
            id: sent?.id,
            url: sent?.url ?? null,
            channelId: channelId,
            content,
          },
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnItems.push({ json: { error: (error as Error).message } });
        } else {
          throw error;
        }
      }
    }

    return [returnItems];
  }
}


