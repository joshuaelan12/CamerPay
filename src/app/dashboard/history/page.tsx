import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Completed and pending transactions will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
