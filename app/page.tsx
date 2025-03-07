import Navbar from "@/app/components/navbar";
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <main className="flex min-h-screen items-center justify-center bg-amber-100 text-white">
        <div className="w-full max-w-4xl m-8 p-8 rounded-lg bg-slate-500 shadow-lg">
          <div className="text-center">
            <Link href="/shop">Shop</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
