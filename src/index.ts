import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { RedisClient } from 'redis'

function callback<T>(resolve: (value?: T) => void, reject: (reason?: any) => void) {
  return (err: Error | null, reply: T) => {
    if (err) {
      reject(err)
    } else {
      resolve(reply)
    }
  }
}

export class RedisDataSource<TContext = any> extends DataSource<TContext> {
  private client: RedisClient
  protected context!: TContext

  public constructor(client: RedisClient) {
    super()
    this.client = client
  }

  initialize(config: DataSourceConfig<TContext>) {
    this.context = config.context
  }
  
  public get(key: string) {
    return new Promise<string>((resolve, reject) => {
      this.client.get(key, callback<string>(resolve, reject))
    })
  }

  public set(key: string, value: string) {
    return new Promise<'OK'>((resolve, reject) => {
      this.client.set(key, value, callback<'OK'>(resolve, reject))
    })
  }

  public incr(key: string) {
    return new Promise<number>((resolve, reject) => {
      this.client.incr(key, callback<number>(resolve, reject))
    })
  }
}
