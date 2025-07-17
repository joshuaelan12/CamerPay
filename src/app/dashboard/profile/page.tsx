import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p>User settings, phone number, email, etc. will be here.</p>
      </CardContent>
    </Card>
  );
}
