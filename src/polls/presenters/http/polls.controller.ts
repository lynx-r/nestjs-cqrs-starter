import { CastVoteCommand } from '#/polls/application/commands/impl/cast-vote.command.js';
import { PollResultsDto } from '#/polls/application/queries/dto/poll-details-view.dto.js';
import { GetPollResultsQuery } from '#/polls/application/queries/impl/get-poll-results.query.js';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { VoteDto } from './dto/vote.dto.js';

@Controller('polls')
export class PollsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(':id/vote')
  @HttpCode(HttpStatus.OK) // Для команд модификации обычно возвращают 200 OK или 202 Accepted
  async castVote(
    @Param('id') pollId: string,
    @Body() dto: VoteDto,
  ): Promise<void> {
    // Отправляем команду в шину. NestJS сам найдет нужный CastVoteHandler
    await this.commandBus.execute(
      new CastVoteCommand(pollId, dto.userId, dto.optionId),
    );
  }

  @Get(':id/results')
  async getResults(@Param('id') pollId: string): Promise<PollResultsDto> {
    // Отправляем запрос в шину запросов. NestJS вернет PollResultsDto
    return await this.queryBus.execute<GetPollResultsQuery, PollResultsDto>(
      new GetPollResultsQuery(pollId),
    );
  }
}
