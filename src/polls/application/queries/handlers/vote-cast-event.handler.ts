import { VoteCastEvent } from '#/polls/domain/events/vote-cast.event.js';
import { PollRepository } from '#/polls/domain/repositories/poll.repository.js';
import { InMemoryPollRepository } from '#/polls/infrastructure/repositories/in-memory/in-memory-poll.repository.js';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(VoteCastEvent)
export class VoteCastEventHandler implements IEventHandler<VoteCastEvent> {
  constructor(private readonly pollRepository: PollRepository) {}

  handle(event: VoteCastEvent) {
    const { pollId } = event;

    if (this.pollRepository instanceof InMemoryPollRepository) {
      this.pollRepository.synchronizeReadModel(event);
    }

    console.log(
      `[EventBus] Успешно обновлена Read-модель для опроса ${pollId} после голоса пользователя ${event.userId}`,
    );
  }
}
