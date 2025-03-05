import { Controller } from '@nestjs/common';
import { RecipientService } from './recipient.service';

@Controller('recipient')
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}
}
