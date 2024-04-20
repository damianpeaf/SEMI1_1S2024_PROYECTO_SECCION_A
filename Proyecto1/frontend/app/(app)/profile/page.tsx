import { LoginForm } from "@/components/auth/LoginForm";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { Card } from "@nextui-org/react";

export default function Profile() {
  return (
    <article className="flex-grow flex flex-col sm:flex-row gap-4 mx-4 md:mx-8 mt-6">
      <div className="flex justify-center sm:justify-start items-start">
        <ProfileInfo />
      </div>
      <div className="flex justify-center items-start flex-grow">
        <ProfileForm />
      </div>
    </article>
  );
}
