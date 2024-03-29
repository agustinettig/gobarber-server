import { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity('notifications')
class Notification {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    content: string;

    @Column('uuid')
    recipientId: string;

    @Column({ default: false })
    read: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export default Notification;
