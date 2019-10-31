import { Column } from 'typeorm';

export default abstract class Account {
  @Column({name: 'first_name', type: 'varchar', length: 255})
  firstName: string;

  @Column({name: 'last_name', type: 'varchar', length: 255})
  lastName: string;

  @Column({name: 'email', type: 'varchar', unique: true, length: 255 })
  email: string;
}
