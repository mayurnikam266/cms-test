import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AnnouncementStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  imageKey: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: AnnouncementStatus.ACTIVE,
  })
  status: AnnouncementStatus;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
