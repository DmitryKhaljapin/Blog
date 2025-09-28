import { PrismaClient } from '@prisma/client';
import { IDatabaseService } from './database.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.service';

@injectable()
export class PrismaService implements IDatabaseService {
  client: PrismaClient;

  constructor(@inject(TYPES.LoggerService) private logger: ILogger) {
    this.client = new PrismaClient();
  }

  public async connect(): Promise<void> {
    try {
      await this.client.$connect();

      this.logger.log('[PrismaService] Connected to the database');
    } catch (error) {
      if (error) {
        this.logger.error(
          '[PrismaService] Error connecting to the database' + error,
        );
      }
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}
