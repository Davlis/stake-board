import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Odds } from 'infrastructure/database/entities/odds.entity';
import { Game } from 'infrastructure/database/entities/game.entity';
import { OddsRepository } from 'infrastructure/database/repositories/odds.repository';
import { GameRepository } from 'infrastructure/database/repositories/game.repository';
import { IOddsRepository } from '@/domain/repositories/IOddsRepository';
import { IGameRepository } from '@/domain/repositories/IGameRepository';

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

    TypeOrmModule.forFeature([Odds, Game]),
  ],
  providers: [
    {
      provide: IOddsRepository,
      useClass: OddsRepository,
    },
    {
      provide: IGameRepository,
      useClass: GameRepository,
    },
  ],
  exports: [IOddsRepository, IGameRepository],
})
export class DatabaseModule {}
