import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PayBillsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay Bills</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Users can choose the type of bill to pay here.</p>
      </CardContent>
    </Card>
  );
}
