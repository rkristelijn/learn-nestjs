import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// export class EventEntity {} // we want 'entity' in the db so rename

// Composite index that contains Multiple columns
// @Index(['name', 'type']) // <--
@Entity() // if you forget this, you will get this error:
// No repository for "Event" was found. Looks like this entity
//   is not registered in current "default" connection?
export class Event {
  @PrimaryGeneratedColumn() id: number;
  @Column() type: string;
  @Index()
  @Column()
  name: string;
  @Column('json') payload: Record<string, any>;
}
