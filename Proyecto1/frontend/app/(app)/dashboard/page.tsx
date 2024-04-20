import { ProfileInfo } from "@/components/profile/ProfileInfo";

export default function Dashboard() {
  return (
    <article className="flex-grow flex flex-col gap-y-4 mt-4">
      <h3 className="text-3xl font-bold text-center text-primary-500">
        Bienvenido.
      </h3>
      <div className="flex justify-center items-center flex-grow">
        <ProfileInfo />
      </div>
    </article>
  );
}
