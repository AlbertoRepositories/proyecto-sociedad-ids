import {
  createClient,
  SupabaseClient,
} from "@supabase/supabase-js";
import configService from "../utils/config.service";
import { Logger } from "../logger/logger";

const Status = Object.freeze({
  DISCONNECTED: "disconnected",
  CONNECTED: "connected",
  ERROR: "error",
});

export class DatabaseUnavailableError extends Error {
  constructor(message = "La base de datos no está disponible.") {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

class Database {
  static instance: Database;

  status: string = Status.DISCONNECTED;
  supabase: SupabaseClient | null = null;

  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

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
        throw new DatabaseUnavailableError(
          "Faltan las variables de configuración de Supabase."
        );
      }

      this.supabase = createClient(
        supabaseUrl,
        supabaseKey
      );

      this.status = Status.CONNECTED;

      Logger.info(
        "Supabase client initialized successfully."
      );

      return this.supabase;
    } catch (error: unknown) {
      this.status = Status.ERROR;

      Logger.error(
        `Error connecting to Supabase: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`
      );

      if (error instanceof DatabaseUnavailableError) {
        throw error;
      }

      throw new DatabaseUnavailableError();
    }
  }

  async checkConnection(
    client: SupabaseClient
  ): Promise<void> {
    try {
      const { error } = await client
        .from("Blog")
        .select("id")
        .limit(1);

      if (error) {
        throw new Error(error.message);
      }

      this.status = Status.CONNECTED;
    } catch (error: unknown) {
      this.status = Status.ERROR;

      Logger.error(
        `Database health check failed: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`
      );

      throw new DatabaseUnavailableError();
    }
  }

  setupListeners(): void {
    process.on("SIGINT", () => {
      this.status = Status.DISCONNECTED;
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      this.status = Status.DISCONNECTED;
      process.exit(0);
    });
  }
}

const database = new Database();

export default database;