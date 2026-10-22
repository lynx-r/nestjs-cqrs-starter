import { Poll } from '#/polls/domain/models/poll.aggregate.js';
import { Vote } from '#/polls/domain/models/vote.value-object.js';
import { PollRepository } from '#/polls/domain/repositories/poll.repository.js';
import { OptionId, PollId } from '#/types/poll.types.js';
import { Injectable } from '@nestjs/common';
import { InMemoryDataStore } from './in-memory-data.store.js';

@Injectable()
export class InMemoryPollRepository implements PollRepository {
  constructor(private readonly store: InMemoryDataStore) {}

  async findById(id: string): Promise<Poll | null> {
    const poll = this.store.writePolls.get(id);
    return poll || null;
  }

  async saveVote(vote: Vote): Promise<void> {
    // Сохраняем голос в "таблицу" голосов на стороне записи
    this.store.writeVotes.push(vote);
  }

  // Временный метод синхронизации (замена брокера сообщений/ивентов для In-Memory)
  public synchronizeReadModel(vote: { pollId: PollId; optionId: OptionId }) {
    const readModel = this.store.readPollResults.get(vote.pollId);
    if (!readModel) {
      return;
    }

    const option = readModel.options.find((o) => o.id === vote.optionId);
    if (option) {
      option.votesCount += 1;
      readModel.totalVotes += 1;

      // Пересчитываем проценты на стороне чтения
      readModel.options.forEach((opt) => {
        opt.percentage =
          readModel.totalVotes > 0
            ? Math.round((opt.votesCount / readModel.totalVotes) * 100)
            : 0;
      });
    }
  }
}
