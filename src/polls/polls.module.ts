/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { CastVoteHandler } from './application/commands/handlers/cast-vote.handler.js';
import { GetPollResultsHandler } from './application/queries/handlers/get-poll-results.handler.js';
import { VoteCastEventHandler } from './application/queries/handlers/vote-cast-event.handler.js';
import { PollReadRepository } from './domain/repositories/poll-read.repository.js';
import { PollRepository } from './domain/repositories/poll.repository.js';
import { InMemoryDataStore } from './infrastructure/repositories/in-memory/in-memory-data.store.js';
import { InMemoryPollReadRepository } from './infrastructure/repositories/in-memory/in-memory-poll-read.repository.js';
import { InMemoryPollRepository } from './infrastructure/repositories/in-memory/in-memory-poll.repository.js';
import { PollResolver } from './presenters/graphql/polls.resolver.js';
import { PollsController } from './presenters/http/polls.controller.js';

const CommandHandlers = [CastVoteHandler];
const QueryHandlers = [GetPollResultsHandler];
const EventHandlers = [VoteCastEventHandler];

@Module({
  imports: [],
  controllers: [PollsController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    PollResolver,
    InMemoryDataStore,
    {
      provide: PollRepository,
      useClass: InMemoryPollRepository,
    },
    {
      provide: PollReadRepository,
      useClass: InMemoryPollReadRepository,
    },
  ],
})
export class PollsModule {}
