import { UserProfileForm } from "@/components/profile/user-profile-form";

export default function AdminProfilePage() {
  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-7">
          <p className="mb-1 text-sm font-medium text-[#a28d97]">
            Account settings
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#352a31] sm:text-3xl">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-[#8e7e86]">
            Manage your personal information and profile picture.
          </p>
        </div>
        <UserProfileForm />
      </div>
    </div>
  );
}
