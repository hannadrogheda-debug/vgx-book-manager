import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Book } from './book.entity';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(dto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(dto);
    return this.bookRepository.save(book);
  }

  async findAll(search?: string): Promise<Book[]> {
    if (search && search.trim().length > 0) {
      const q = search.trim();

      return this.bookRepository.find({
        where: [
          { title: ILike(`%${q}%`) },
          { author: ILike(`%${q}%`) },
          { description: ILike(`%${q}%`) },
        ],
        order: { id: 'DESC' },
      });
    }

    return this.bookRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async update(id: number, dto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, dto);
    return this.bookRepository.save(book);
  }

  async remove(id: number): Promise<{ ok: true }> {
    const result = await this.bookRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Book ${id} not found`);
    return { ok: true };
  }
}

