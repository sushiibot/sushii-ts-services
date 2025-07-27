import { UserProfile } from "../entities/UserProfile";

export interface UserProfileRepository {
  getUserProfile(userId: string): Promise<UserProfile>;
}
