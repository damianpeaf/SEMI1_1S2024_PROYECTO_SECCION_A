import { CreateProject } from "@/components/projects/CreateProject";

export default function Home() {
  return (
    <section className="flex min-h-screen flex-col items-center mx-4 justify-center">
      <CreateProject />
    </section>
  );
}
