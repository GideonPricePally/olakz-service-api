import { User } from '@/api/user/entities/user.entity';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class UserSeeder1722335726360 implements Seeder {
  track = false;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const repository = dataSource.getRepository(User);

    const adminUser = await repository.findOneBy({ username: 'admin' });
    if (!adminUser) {
      await repository.insert(
        new User({
          username: 'admin',
          email: 'admin@example.com',
          password: '12345678',
          bio: "hello, i'm a backend developer",
          thumbnail: 'https://example.com/avatar.png',
          created_by: SYSTEM_USER_ID,
          updated_by: SYSTEM_USER_ID,
        }),
      );
    }

    const userFactory = factoryManager.get(User);
    await userFactory.saveMany(5);
  }
}
