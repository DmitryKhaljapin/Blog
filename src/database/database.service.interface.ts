export interface IDatabaseService {
  client: unknown;

  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
