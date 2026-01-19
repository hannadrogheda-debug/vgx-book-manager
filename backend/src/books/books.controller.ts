import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { Book } from './book.entity';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Listar livros (com busca opcional por título/autor/descrição)

  @Get()
  findAll(@Query('search') search?: string): Promise<Book[]> {
    return this.booksService.findAll(search);
  }

  // Criar livro 
  @Post('create')
  create(@Body() dto: CreateBookDto): Promise<Book> {
    return this.booksService.create(dto);
  }

  
  @Post()
  createAlias(@Body() dto: CreateBookDto): Promise<Book> {
    return this.booksService.create(dto);
  }

  // Buscar por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return this.booksService.findOne(id);
  }

  // Atualizar por ID
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, dto);
  }

  // Remover por ID
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ ok: true }> {
    return this.booksService.remove(id);
  }
}
