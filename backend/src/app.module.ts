import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppDataSource } from './database/database.config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { ContactsModule } from './contacts/contacts.module';
import { QuotesModule } from './quotes/quotes.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { DatabaseInitService } from './database/database-init.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '3306'),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
      ssl: false,
    }),
    AuthModule,
    ProductsModule,
    CategoriesModule,
    UsersModule,
    UploadModule,
    ContactsModule,
    QuotesModule,
    AnnouncementsModule,
  ],
  providers: [DatabaseInitService],
})
export class AppModule {}
