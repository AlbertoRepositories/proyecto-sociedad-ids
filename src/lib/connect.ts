import { createClient, SupabaseClient } from "@supabase/supabase-js";
import configService from "../utils/config.service";
import { Logger } from "../logger/logger";

const Status = Object.freeze({
  DISCONNECTED: "disconnected",
  CONNECTED: "connected",
  ERROR: "error",
});

class Database {
  static instance: Database;

  status: string = Status.DISCONNECTED;
  supabase: SupabaseClient | null = null;

  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.status = Status.DISCONNECTED;
    this.supabase = null;
    Database.instance = this;

    this.setupListeners();
  }

  async connect(): Promise<SupabaseClient> {
    if (this.status === Status.CONNECTED && this.supabase) {
      return this.supabase;
    }

    try {
      const supabaseUrl = configService.SUPABASE_URL;
      const supabaseKey = configService.SUPABASE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error(
          "Supabase URL or Key are missing in configuration."
        );
      }

      this.supabase = createClient(
        supabaseUrl,
        supabaseKey
      );

      Logger.info(
        "Supabase client initialized successfully."
      );

      this.status = Status.CONNECTED;

      return this.supabase;
    } catch (error: unknown) {
      Logger.error(
        `Error connecting to Supabase: ${
          error instanceof Error ? error.message : String(error)
        }`
      );

      this.status = Status.ERROR;

      throw error;
    }
  }

async checkConnection(client: SupabaseClient): Promise<void> {
  const { error } = await client
    .from("Blog")
    .select("id")
    .limit(1);

  if (error) {
    this.status = Status.ERROR;

    Logger.error(
      `Database health check failed: ${error.message}`
    );

    throw new Error(
      "La base de datos no está disponible."
    );
  }

  this.status = Status.CONNECTED;
}

  setupListeners(): void {
    process.on("SIGINT", () => {
      Logger.info(
        "Shutting down gracefully (SIGINT)..."
      );

      this.status = Status.DISCONNECTED;

      process.exit(0);
    });

    process.on("SIGTERM", () => {
      Logger.info(
        "Shutting down the service (SIGTERM)..."
      );

      this.status = Status.DISCONNECTED;

      process.exit(0);
    });
  }
}

const database = new Database();

export default database;