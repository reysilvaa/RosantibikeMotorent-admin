import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FasilitasTambahanProps {
  helm?: number;
  jasHujan?: number;
}

export function FasilitasTambahan({ helm, jasHujan }: FasilitasTambahanProps) {
  if (!helm && !jasHujan) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasilitas Tambahan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {helm && helm > 0 && (
            <div
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span>Helm ({helm} unit)</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          {jasHujan && jasHujan > 0 && (
            <div
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span>Jas Hujan ({jasHujan} unit)</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 