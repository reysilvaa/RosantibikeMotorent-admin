import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface TransaksiHeaderProps {
  title: string;
  description: string;
}

export function TransaksiHeader({ title, description }: TransaksiHeaderProps) {
  const router = useRouter();
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-neutral-500 dark:text-neutral-400">{description}</p>
      </div>
      <Button
        className="hidden sm:flex"
        onClick={() => router.push("/dashboard/transaksi/tambah")}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Tambah Transaksi
      </Button>
    </div>
  );
} 