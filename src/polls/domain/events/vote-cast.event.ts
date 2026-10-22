import { UserId } from '#/types/author.types.js';
import { OptionId, PollId, VoteId } from '#/types/poll.types.js';

export class VoteCastEvent {
  constructor(
    public readonly voteId: VoteId,
    public readonly pollId: PollId,
    public readonly userId: UserId,
    public readonly optionId: OptionId,
    public readonly createdAt: Date,
  ) {}
}
