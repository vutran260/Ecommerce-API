import { Column, Entity, Index } from "typeorm";

@Index("admins_pkey", ["id"], { unique: true })
@Entity("admins", { schema: "public" })
export class Admins {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "email", nullable: true })
  email: string | null;

  @Column("character varying", { name: "phone", nullable: true })
  phone: string | null;

  @Column("character varying", { name: "password", nullable: true })
  password: string | null;

  @Column("character varying", { name: "username", nullable: true })
  username: string | null;

  @Column("character varying", { name: "fullname", nullable: true })
  fullname: string | null;

  @Column("text", { name: "image_url", nullable: true })
  imageUrl: string | null;

  @Column("text", { name: "reset_token", nullable: true })
  resetToken: string | null;

  @Column("timestamp without time zone", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;
}
