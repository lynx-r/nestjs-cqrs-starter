import { OptionId } from '#/types/poll.types.js';

export class PollOption {
  constructor(
    public readonly id: OptionId,
    public readonly answer: string,
  ) {}
}
