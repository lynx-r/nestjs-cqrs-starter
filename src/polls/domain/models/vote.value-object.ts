import { UserId } from '#/types/author.types.js';
import { OptionId, PollId, VoteId } from '#/types/poll.types.js';

export class Vote {
  constructor(
    public readonly id: VoteId,
    public readonly userId: UserId,
    public readonly pollId: PollId,
    public readonly optionId: OptionId,
    public readonly createdAt: Date,
  ) {}
}
