import { getUserProfile } from "@/lib/store";
import ProfileForm from "./ProfileForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthRequiredGuard } from "@/components/AuthRequiredGuard";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <AuthRequiredGuard 
        pageName="Personal Profile & Identity"
        description="Your personal applicant profile, CGPA, university credentials, skills, and encrypted details are protected under zero-trust privacy. Please authenticate to view or update your profile."
      />
    );
  }

  const userEmail = session.user.email || undefined;
  const profile = await getUserProfile(userEmail);

  if (!profile) {
    return (
      <div className="animate-fade-in">
        <h1>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>No profile data found. Please set up your profile.</p>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Profile</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <ProfileForm initialProfile={profile} />
    </div>
  );
}
