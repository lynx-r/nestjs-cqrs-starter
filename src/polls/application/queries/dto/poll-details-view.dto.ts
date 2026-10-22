// TODO: why use that folder struct?

import { OptionId, PollId, PollStatus } from '#/types/poll.types.js';

export interface PollResultsDto {
  id: PollId;
  question: string;
  status: PollStatus;
  totalVotes: number;
  expiresAt: Date;
  options: PollOptionDto[];
}

export class PollOptionDto {
  id: OptionId;
  answer: string;
  votesCount: number;
  percentage: number;
}
