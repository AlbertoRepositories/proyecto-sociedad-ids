import { createClient, SupabaseClient } from "@supabase/supabase-js";
import configService from "../utils/config.service";

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

      console.log("Supabase client initialized successfully");

      this.status = Status.CONNECTED;

      return this.supabase;
    } catch (error: unknown) {
      console.error("Error connecting to Supabase:", error);

      this.status = Status.ERROR;

      throw error;
    }
  }

  setupListeners(): void {
    process.on("SIGINT", () => {
      console.log("Shutting down gracefully (SIGINT)...");

      this.status = Status.DISCONNECTED;

      process.exit(0);
    });

    process.on("SIGTERM", () => {
      console.log("Shutting down the service (SIGTERM)...");

      this.status = Status.DISCONNECTED;

      process.exit(0);
    });
  }
}

const database = new Database();

export default database;