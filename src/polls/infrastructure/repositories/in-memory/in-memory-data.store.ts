import { PollResultsDto } from '#/polls/application/queries/dto/poll-details-view.dto.js';
import { PollOption } from '#/polls/domain/models/poll-option.value-object.js';
import { Poll } from '#/polls/domain/models/poll.aggregate.js';
import { Vote } from '#/polls/domain/models/vote.value-object.js';
import { User } from '#/types/author.types.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryDataStore {
  // База данных Записи (Write DB) - хранит сырые сущности и историю
  public readonly writePolls: Map<string, Poll> = new Map();
  public readonly writeVotes: Vote[] = [];

  // База данных Чтения (Read DB) - хранит плоские DTO, готовые для выдачи
  public readonly readPollResults: Map<string, PollResultsDto> = new Map();

  // Добавьте этот конструктор внутрь InMemoryDataStore
  constructor() {
    const pollId = 'test-poll-123';
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Опрос закроется через сутки

    const options: PollOption[] = [
      { id: 'opt-1', answer: 'TypeScript' },
      { id: 'opt-2', answer: 'Go' },
      { id: 'opt-3', answer: 'Rust' },
    ];

    const author: User = {
      id: 'user-1',
    };

    // 1. Заполняем Write Side (Агрегат)
    // Используем фабричный метод из Шага 1
    const pollAggregate = Poll.create(
      pollId,
      'Какой язык программирования вы предпочитаете?',
      options,
      author,
      expiresAt,
    );
    this.writePolls.set(pollId, pollAggregate);

    // 2. Заполняем Read Side (Предрассчитанное DTO для UI)
    const pollResultsDto: PollResultsDto = {
      id: pollId,
      question: 'Какой язык программирования вы предпочитаете?',
      status: 'open',
      totalVotes: 0,
      expiresAt: expiresAt,
      options: [
        { id: 'opt-1', answer: 'TypeScript', votesCount: 0, percentage: 0 },
        { id: 'opt-2', answer: 'Go', votesCount: 0, percentage: 0 },
        { id: 'opt-3', answer: 'Rust', votesCount: 0, percentage: 0 },
      ],
    };
    this.readPollResults.set(pollId, pollResultsDto);
  }
}
