import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import "reflect-metadata"


@Entity()
export class Accounts extends BaseEntity {
  
  @PrimaryGeneratedColumn({
    type: "int"
  })
  id!: number;

  @Column({
    type: 'varchar',
    nullable: true
  })
  username?: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  password!: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  email!: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  first_name!: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  last_name!: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  token?: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  token_expire?: number;

  @Column({
    type: 'varchar',
    nullable: true
  })
  picture_url?: string;
}