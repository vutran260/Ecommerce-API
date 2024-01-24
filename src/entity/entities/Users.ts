import { Column, Entity, Index } from "typeorm";

@Index("users_pkey", ["id"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
  @Column("character varying", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "user_name", nullable: true })
  userName: string | null;

  @Column("character varying", { name: "gender", nullable: true })
  gender: string | null;

  @Column("timestamp without time zone", {
    name: "date_of_birth",
    nullable: true,
  })
  dateOfBirth: Date | null;

  @Column("character varying", { name: "email", nullable: true })
  email: string | null;

  @Column("character varying", { name: "status", nullable: true })
  status: string | null;

  @Column("character varying", { name: "phone", nullable: true })
  phone: string | null;

  @Column("text", { name: "fcm_token", nullable: true })
  fcmToken: string | null;

  @Column("character varying", { name: "password", nullable: true })
  password: string | null;

  @Column("timestamp without time zone", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;
}
