import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Bet } from 'infrastructure/database/entities/bet.entity';
import { BetRepository } from 'infrastructure/database/repositories/bet.repository';
import { IBetRepository } from 'domain/repositories/IBetRepository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),

    TypeOrmModule.forFeature([Bet]),
  ],
  providers: [
    {
      provide: IBetRepository,
      useClass: BetRepository,
    },
  ],
  exports: [IBetRepository],
})
export class DatabaseModule {}
