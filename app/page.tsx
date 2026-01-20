import Image from "next/image";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <div> 
    </div>
  );
}
