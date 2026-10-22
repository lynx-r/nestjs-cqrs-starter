import { PollResultsDto } from '#/polls/application/queries/dto/poll-details-view.dto.js';
import { PollReadRepository } from '#/polls/domain/repositories/poll-read.repository.js';
import { Injectable } from '@nestjs/common';
import { InMemoryDataStore } from './in-memory-data.store.js';

@Injectable()
export class InMemoryPollReadRepository implements PollReadRepository {
  constructor(private readonly store: InMemoryDataStore) {}

  async getResults(pollId: string): Promise<PollResultsDto | null> {
    const results = this.store.readPollResults.get(pollId);
    return results || null;
  }
}
