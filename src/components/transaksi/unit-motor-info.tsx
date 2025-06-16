import { Bike, Tag, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { UnitMotor } from "@/lib/types/unit-motor";

interface UnitMotorInfoProps {
  unitMotor: UnitMotor | undefined;
}


export function UnitMotorInfo({ unitMotor }: UnitMotorInfoProps) {
  if (!unitMotor) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unit Motor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 dark:text-neutral-400">
            Data unit motor tidak tersedia
          </p>
        </CardContent>
      </Card>
    );
  }

  const merk = unitMotor.jenis?.merk || "-";
  const cc = unitMotor.jenis?.cc || "-";
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Motor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                <Bike className="mr-2 h-4 w-4" />
                <span>Jenis Motor</span>
              </div>
              <p className="text-lg font-medium">
                {merk} ({cc} CC)
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                <Tag className="mr-2 h-4 w-4" />
                <span>Plat Nomor</span>
              </div>
              <p className="text-lg font-medium">
                {unitMotor.platNomor}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Harga Sewa / hari</span>
              </div>
              <p className="text-lg font-medium">
                {formatRupiah(unitMotor.hargaSewa)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 