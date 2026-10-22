import { UserId } from '#/types/author.types.js';
import { OptionId, PollId } from '#/types/poll.types.js';
import { Command } from '@nestjs/cqrs';

export class CastVoteCommand extends Command<void> {
  constructor(
    public readonly pollId: PollId,
    public readonly userId: UserId,
    public readonly optionId: OptionId,
  ) {
    super();
  }
}
