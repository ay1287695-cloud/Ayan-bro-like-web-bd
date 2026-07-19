/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LikesResponse {
  status: number;
  LikesGivenByAPI?: number;
  LikesafterCommand?: number;
  LikesbeforeCommand?: number;
  PlayerNickname?: string;
  UID?: number | string;
  remains?: string;
  message?: string;
  error?: string;
}

export interface HistoryItem {
  id: string;
  uid: string;
  serverName: string;
  playerNickname: string;
  likesSent: number;
  likesBefore: number;
  likesAfter: number;
  timestamp: number;
  status: 'success' | 'failed';
  message?: string;
}

export interface PlayerInfo {
  basicInfo?: {
    accountId: string;
    nickname: string;
    region: string;
    level: number;
    liked: number;
    rankingPoints: number;
    csRankingPoints: number;
    hasElitePass: boolean;
    badgeCnt: number;
    releaseVersion: string;
    createAt?: string;
  };
  clanBasicInfo?: {
    clanName: string;
    clanLevel: number;
    memberNum: number;
    capacity: number;
  };
  socialInfo?: {
    signature: string;
    language: string;
  };
  creditScoreInfo?: {
    creditScore: number;
  };
}

export type ServerRegion = 'bd' | 'ind' | 'sg' | 'pk' | 'br' | 'us' | 'id' | 'me' | 'eu';

export interface ServerOption {
  code: ServerRegion;
  name: string;
  flag: string;
}

export const SERVER_OPTIONS: ServerOption[] = [
  { code: 'bd', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'ind', name: 'India', flag: '🇮🇳' },
  { code: 'sg', name: 'Singapore', flag: '🇸🇬' },
  { code: 'pk', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'br', name: 'Brazil', flag: '🇧🇷' },
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'me', name: 'Middle East', flag: '🇦🇪' },
  { code: 'eu', name: 'Europe', flag: '🇪🇺' }
];
