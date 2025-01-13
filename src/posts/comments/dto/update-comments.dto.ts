import { CreateCommentsDto } from './create-comments.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCommentsDto extends PartialType(CreateCommentsDto) {}
