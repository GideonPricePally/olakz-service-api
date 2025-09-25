import { User } from '@/api/user/entities/user.entity';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(User, (fake) => {
  const user = new User();

  const firstName = fake.person.firstName();
  const lastName = fake.person.lastName();
  user.username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
  user.email = fake.internet.email({ firstName, lastName });
  user.password = '12345678';
  user.bio = fake.lorem.sentence();
  user.thumbnail = fake.image.avatar();
  user.created_by = SYSTEM_USER_ID;
  user.updated_by = SYSTEM_USER_ID;

  return user;
});
