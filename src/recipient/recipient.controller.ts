import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { RecipientService } from './recipient.service';

@Controller('recipient')
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.recipientService.getAllRecipientTypes();
  }
}
