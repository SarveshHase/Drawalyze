import conf from '../conf/conf';
import { Client, Account, ID, Models } from 'appwrite';

// Interface for the parameters of createAccount
interface CreateAccountParams {
    email: string;
    password: string;
    name: string;
}

// Interface for the parameters of login
interface LoginParams {
    email: string;
    password: string;
}

export class AuthService {
    client: Client;
    account: Account;

    constructor() {
        this.client = new Client()
            .setEndpoint(conf.appwriteUrl) // Set the Appwrite endpoint
            .setProject(conf.appwriteProjectId); // Set the Appwrite project ID
        this.account = new Account(this.client); // Initialize the Account service
    }

    // Create a new user account
    async createAccount({ email, password, name }: CreateAccountParams): Promise<Models.User<Models.Preferences> | void> {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                try {
                    // Login first to create a session
                    await this.login({ email, password });
                    // Then send verification email
                    const url = new URL('/verify', window.location.origin);
                    await this.account.createVerification(url.toString());
                    return userAccount;
                } catch (error) {
                    if (error instanceof Error) {
                        console.error('Login or verification failed:', error.message);
                    }
                    throw error; // Propagate the error
                }
            }
            return userAccount;
        } catch (error: any) {
            if ((error as any).code === 404) {
                console.error('Service endpoint not found:', error.message);
            }
            throw error;
        }
    }

    // Verify email
    async verifyEmail(userId: string, secret: string): Promise<Models.Token> {
        try {
            return await this.account.updateVerification(userId, secret);
        } catch (error) {
            console.error('Email verification failed:', error);
            throw error;
        }
    }

    // Check if email is verified
    async isEmailVerified(): Promise<boolean> {
        try {
            const user = await this.getCurrentUser();
            return user?.emailVerification || false;
        } catch (error) {
            console.error('Failed to check email verification:', error);
            return false;
        }
    }

    async login({ email, password }: LoginParams): Promise<Models.Session> {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error: any) {
            if (error.code === 404) {
                console.error('Authentication service not available:', error.message);
            }
            throw error;
        }
    }

    // Get the current logged-in user
    async getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
        try {
            const user = await this.account.get();
            return user;
        } catch (error: any) {
            console.log('Appwrite service :: getCurrentUser :: error', error);
            return null;
        }
    }

    // Check if user is authenticated and get user data
    async checkAuthStatus(): Promise<{
        isAuthenticated: boolean;
        user: Models.User<Models.Preferences> | null;
    }> {
        try {
            const user = await this.getCurrentUser();
            return {
                isAuthenticated: !!user,
                user
            };
        } catch (error) {
            return {
                isAuthenticated: false,
                user: null
            };
        }
    }

    // Log out the current user
    async logout(): Promise<void> {
        try {
            await this.account.deleteSessions(); // Delete all sessions
        } catch (error: any) {
            console.log('Appwrite service :: logout :: error', error);
        }
    }
}

// Create an instance of AuthService
const authService = new AuthService();

export default authService;
