import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';

// 使用 nest g resource person 即可生成这样的 module
@Module({
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
