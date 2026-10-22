import { PollResultsDto } from '#/polls/application/queries/dto/poll-details-view.dto.js';
import { GetPollResultsQuery } from '#/polls/application/queries/impl/get-poll-results.query.js';
import type { PollId } from '#/types/poll.types.js';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ReadPollResultsDto } from './dto/poll-results.dto.js';

@Resolver()
export class PollResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => ReadPollResultsDto)
  async results(
    @Args('id', { type: () => String }) pollId: PollId,
  ): Promise<ReadPollResultsDto> {
    // Отправляем запрос в шину запросов. NestJS вернет PollResultsDto
    return await this.queryBus.execute<GetPollResultsQuery, PollResultsDto>(
      new GetPollResultsQuery(pollId),
    );
  }
}
