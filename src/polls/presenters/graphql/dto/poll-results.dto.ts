import type { OptionId, PollId, PollStatus } from '#/types/poll.types.js';
import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class ReadPollResultsDto {
  @Field(() => ID)
  id: PollId;

  @Field()
  @IsString()
  question: string;

  @Field()
  @IsString()
  status: PollStatus;

  @Field(() => Int)
  @IsString()
  totalVotes: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsString()
  expiresAt: Date;

  @Field(() => [PollOptionDto])
  @IsString()
  options: PollOptionDto[];
}

@ObjectType()
export class PollOptionDto {
  @Field(() => ID)
  id: OptionId;

  @Field()
  @IsString()
  answer: string;

  @Field(() => Int)
  @IsString()
  votesCount: number;

  @Field(() => Int)
  @IsString()
  percentage: number;
}
