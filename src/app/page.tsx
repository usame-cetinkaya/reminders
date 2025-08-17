import { UserNav } from "@/components/user-nav";

export default async function Home() {
  return (
    <>
      <header>
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-2xl">Reminders</h1>
            <div className="ml-auto leading-none">
              <UserNav />
            </div>
          </div>
        </div>
      </header>
      <main></main>
    </>
  );
}
