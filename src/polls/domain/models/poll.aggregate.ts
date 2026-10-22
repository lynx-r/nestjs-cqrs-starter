import { User, UserId } from '#/types/author.types.js';
import { BadRequestException } from '@nestjs/common';

import { OptionId, PollId, PollStatus, VoteId } from '#/types/poll.types.js';
import { AggregateRoot } from '@nestjs/cqrs';
import { VoteCastEvent } from '../events/vote-cast.event.js';
import { PollOption } from './poll-option.value-object.js';
import { Vote } from './vote.value-object.js';

export class Poll extends AggregateRoot {
  constructor(
    public readonly id: PollId,
    public readonly question: string,
    private status: PollStatus,
    public readonly options: PollOption[],
    public readonly author: User,
    public readonly expiresAt: Date,
    private readonly votes: Map<string, Vote> = new Map(),
  ) {
    super();
  }

  // Фабричный метод для создания нового опроса с базовой валидацией
  static create(
    id: PollId,
    question: string,
    options: PollOption[],
    author: User,
    expiresAt: Date,
  ): Poll {
    if (!question || question.trim().length < 5) {
      throw new BadRequestException('Вопрос слишком короткий');
    }
    if (!options || options.length < 2) {
      throw new BadRequestException(
        'Опрос должен содержать минимум 2 варианта ответа',
      );
    }
    if (expiresAt <= new Date()) {
      throw new BadRequestException(
        'Дата окончания опроса должна быть в будущем',
      );
    }

    return new Poll(id, question, 'open', options, author, expiresAt);
  }

  // Бизнес-метод (Команда): Оставить голос
  public castVote(voteId: VoteId, userId: UserId, optionId: OptionId): Vote {
    // Инвариант 1: Опрос должен быть открыт
    if (this.status === 'closed' || this.isExpired()) {
      throw new BadRequestException('Голосование в этом опросе уже завершено');
    }

    // Инвариант 2: Вариант ответа должен существовать в этом опросе
    const optionExists = this.options.some((opt) => opt.id === optionId);
    if (!optionExists) {
      throw new BadRequestException('Указанного варианта ответа не существует');
    }

    // Инвариант 3: Пользователь не должен голосовать повторно
    if (this.votes.has(userId)) {
      throw new BadRequestException('Вы уже проголосовали в этом опросе');
    }

    const newVote = new Vote(voteId, userId, this.id, optionId, new Date());
    this.votes.set(userId, newVote);

    this.apply(
      new VoteCastEvent(
        newVote.id,
        newVote.pollId,
        newVote.userId,
        newVote.optionId,
        newVote.createdAt,
      ),
    );

    return newVote;
  }

  // Бизнес-метод (Команда): Принудительно закрыть опрос автором
  public close(): void {
    this.status = 'closed';
  }

  public getStatus(): PollStatus {
    if (this.isExpired()) {
      return 'closed';
    }
    return this.status;
  }

  private isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
