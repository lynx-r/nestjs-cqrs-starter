import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PollReadRepository } from '../../../domain/repositories/poll-read.repository.js';
import { PollResultsDto } from '../dto/poll-details-view.dto.js';
import { GetPollResultsQuery } from '../impl/get-poll-results.query.js';

@QueryHandler(GetPollResultsQuery)
export class GetPollResultsHandler implements IQueryHandler<
  GetPollResultsQuery,
  PollResultsDto
> {
  constructor(private readonly pollReadRepository: PollReadRepository) {}

  async execute(query: GetPollResultsQuery): Promise<PollResultsDto> {
    const { pollId } = query;

    // Быстро запрашиваем уже предрассчитанные/готовые данные из Read-слоя
    const results = await this.pollReadRepository.getResults(pollId);

    if (!results) {
      throw new NotFoundException(`Опрос с ID ${pollId} не найден`);
    }

    return results;
  }
}
