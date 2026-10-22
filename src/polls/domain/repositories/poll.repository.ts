import { PollId } from '#/types/poll.types.js';
import { Poll } from '../models/poll.aggregate.js';
import { Vote } from '../models/vote.value-object.js';

export abstract class PollRepository {
  abstract findById(id: PollId): Promise<Poll | null>;
  abstract saveVote(vote: Vote): Promise<void>;
}
