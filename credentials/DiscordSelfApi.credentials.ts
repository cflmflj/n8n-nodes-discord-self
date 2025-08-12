import type { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class DiscordSelfApi implements ICredentialType {
  name = 'discordSelfApi';
  displayName = 'Discord Self API';

  documentationUrl = 'https://discordjs-self-v13.netlify.app/#/';

  properties: INodeProperties[] = [
    {
      displayName: 'Token',
      name: 'token',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'Discord 用户令牌（风险自担，使用自用号违反 Discord TOS）',
    },
    {
      displayName: 'Status',
      name: 'status',
      type: 'options',
      default: 'online',
      options: [
        { name: 'Online', value: 'online' },
        { name: 'Idle', value: 'idle' },
        { name: 'Do Not Disturb', value: 'dnd' },
        { name: 'Invisible', value: 'invisible' },
      ],
      description: '可选：登录后设置的在线状态',
    },
    {
      displayName: 'Custom Status Text',
      name: 'customStatusText',
      type: 'string',
      default: '',
      description: '可选：自定义状态文本',
    },
    {
      displayName: 'Auto Reconnect',
      name: 'autoReconnect',
      type: 'boolean',
      default: true,
      description: '断线时自动重连',
    },
    {
      displayName: 'TOTP Secret',
      name: 'totpSecret',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: '如账号启用 2FA，可提供 TOTP Secret 以便自动登录（视上游库支持而定）',
    },
  ];

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://discord.com',
      url: '/',
    },
  };
}


