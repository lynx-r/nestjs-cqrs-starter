import { PollId } from '#/types/poll.types.js';
import { PollResultsDto } from '../../application/queries/dto/poll-details-view.dto.js';

export abstract class PollReadRepository {
  abstract getResults(pollId: PollId): Promise<PollResultsDto | null>;
}
