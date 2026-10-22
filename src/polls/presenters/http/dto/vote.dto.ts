import type { UserId } from '#/types/author.types.js';
import type { OptionId } from '#/types/poll.types.js';
import { IsString } from 'class-validator';

export class VoteDto {
  @IsString()
  optionId: OptionId;

  @IsString()
  userId: UserId;
}
