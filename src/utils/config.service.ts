class ConfigService {
    PORT!: string | number;
    SUPABASE_URL!: string;
    SUPABASE_KEY!: string;
    SECRET!: string;
    PRODUCTION!: boolean;
    HOST!: string;


    /**
     * Change this to correct variables in .env file
    */
    constructor(){
        this.PORT = process.env.PORT || 3000;
        this.SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        this.SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
        this.SECRET = process.env.SECRET!;
        this.PRODUCTION = process.env.ENTORNO === 'PRODUCTION';
        this.HOST = this.PRODUCTION ? '0.0.0.0' : process.env.HOST!;
    }
}

const configService = new ConfigService();

export default configService;