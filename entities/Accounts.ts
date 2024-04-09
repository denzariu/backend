import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Accounts extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username?: string;

  @Column()
  password!: string;

  @Column()
  email!: string;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column()
  token?: string;

  @Column()
  token_expire?: number;

  @Column()
  picture_url?: string;
}