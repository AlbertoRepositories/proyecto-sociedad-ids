import { SupabaseClient } from "@supabase/supabase-js";
import {
  UserInput,
  UserUpdateInput,
} from "../types/crud.types";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  static async create(
    db: SupabaseClient,
    input: UserInput
  ) {
    if (
      !input.name.trim() ||
      !input.username.trim() ||
      !input.email.trim()
    ) {
      throw new Error(
        "Name, username and email are required."
      );
    }

    return UserRepository.create(db, {
      id: input.id ?? crypto.randomUUID(),
      name: input.name.trim(),
      username: input.username.trim(),
      email: input.email.trim().toLowerCase(),
      externalAuthProvider: input.externalAuthProvider,
      type: input.type,
      notificationsEnabled: input.notificationsEnabled ?? false,
      seed: input.seed?.trim() || input.username.trim(),
    });
  }

  static async findById(
    db: SupabaseClient,
    userId: string
  ) {
    return UserRepository.findById(db, userId);
  }

  static async update(
    db: SupabaseClient,
    userId: string,
    changes: UserUpdateInput
  ) {
    if (
      changes.username !== undefined &&
      !changes.username.trim()
    ) {
      throw new Error("Username cannot be empty.");
    }

    return UserRepository.update(db, userId, {
      ...changes,
      username: changes.username?.trim(),
    });
  }

  static async delete(
    db: SupabaseClient,
    userId: string
  ) {
    return UserRepository.delete(db, userId);
  }
}