import { PollRepository } from '#/polls/domain/repositories/poll.repository.js';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { CastVoteCommand } from '../impl/cast-vote.command.js';

@CommandHandler(CastVoteCommand)
export class CastVoteHandler implements ICommandHandler<CastVoteCommand> {
  constructor(
    private readonly pollRepository: PollRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CastVoteCommand): Promise<void> {
    const { pollId, userId, optionId } = command;

    // 1. Загружаем агрегат из базы данных записи
    const poll = await this.pollRepository.findById(pollId);
    if (!poll) {
      throw new NotFoundException(`Опрос с ID ${pollId} не найден`);
    }

    // 2. Генерируем ID для нового голоса (можно доверить БД, но в DDD лучше делать в приложении)
    const voteId = randomUUID();

    // 2. Связываем наш загруженный агрегат с контекстом событий NestJS
    const pollContext = this.publisher.mergeObjectContext(poll);

    // 3. Вызываем доменную логику. Если правила нарушены,
    // метод внутри poll.entity.ts сам выбросит ошибку (например, BadRequestException)
    const newVote = pollContext.castVote(voteId, userId, optionId);

    // 4. Сохраняем изменения в базу данных записи (Write DB)
    await this.pollRepository.saveVote(newVote);

    pollContext.commit();
  }
}
