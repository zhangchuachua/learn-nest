import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

// *这里 @Controller 传入的参数就是这个 API 的前缀，这个参数的名字也就是 prefix; 所以要想访问这个 Controller 的 api 那么就要在前面添加一个 person
@Controller('person')
// *路径的匹配是从上至下的，所以需要注意 api 的顺序；
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  // 表示一个 Post 请求
  @Post()
  // *@Body 会解析 body; 解析的格式或者说解析出来的对象类型，就是 CreatePersonDto 其中 Dto 就是 data transfer Object 数据传输对象；
  // !虽然 CreatePersonDto 是一个 class 类，但是我定义了 constructor 函数，发现并没有被调用，也就是说并没有实例化这个 Class 并且 static 静态函数也不能使用； 应该只是作为类型使用
  // *application/x-www-form-urlencoded 与 application/json 都是使用 @Body 进行解析； nest 会根据 Content-Type 进行不同的解析
  create(@Body() createPersonDto: CreatePersonDto) {
    console.log(createPersonDto);
    return `post: ${JSON.stringify(createPersonDto)}`;
  }

  @Post('/form-data')
  // *要想接收上传的文件就要使用拦截器，也就是 UseInterceptors
  // *AnyFilesInterceptor 用来处理上传的文件；处理方式和需要的参数都与 multer 差不多；也就是上传文件学到的那部分内容
  // *并且解析也差不多，将分成两部分，文件和其他参数；
  @UseInterceptors(AnyFilesInterceptor({ dest: 'upload/' })) // 这里的 dest 是相对于根路径的，所以 upload/ 就是 root/upload/
  formData(
    @UploadedFiles() files: Array<Express.Multer.File>, // 经过测试，参数的顺序没有关系；与装饰器有关系；这里是 @Body 那么就是其他数据；是 @UploadedFiles 就是文件；
    @Body() createPersonDto: CreatePersonDto,
  ) {
    console.log(files);

    return `body: ${JSON.stringify(createPersonDto)}`;
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }

  // *这个 api 必须放在 /:id 的上面，不然会直接匹配到 /:id
  @Get('/query')
  findOneUsingQuery(@Query('name') name: string, @Query('age') age: number) {
    return `name: ${name}, age: ${age}`;
  }

  // 这里传入的参数就是 API 的路径，所以这个 api 的路径就是 /person/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(+id);
  }

  // *目前看来前面加 / 与不加 / 是差不多的效果；都会正常匹配到 /person/url-param/:id
  @Get('/url-param/:id')
  findOneUsingUrlParam(@Param('id') id: string) {
    const toNumber = +id;
    return `toNumber: ${toNumber}`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
