import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransaksiFormStore } from "@/lib/store/transaksi-form-store";

export function FasilitasForm() {
  const { formData, setFormValue } = useTransaksiFormStore();

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: "helm" | "jasHujan") => {
    const value = e.target.value;
    setFormValue(field, value === "" ? 0 : parseInt(value, 10));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasilitas Tambahan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="helm">Jumlah Helm</Label>
            <Input
              type="number"
              id="helm"
              name="helm"
              min={0}
              value={formData?.helm || 0}
              onChange={(e) => handleNumberChange(e, "helm")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jasHujan">Jumlah Jas Hujan</Label>
            <Input
              type="number"
              id="jasHujan"
              name="jasHujan"
              min={0}
              value={formData?.jasHujan || 0}
              onChange={(e) => handleNumberChange(e, "jasHujan")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 