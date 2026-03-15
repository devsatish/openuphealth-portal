import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Monitor, MapPin, Video, X, RefreshCw, FileText } from "lucide-react";

const mockAppointment = {
  id: "1",
  therapistName: "Dr. Emily Chen",
  therapistCredentials: "Ph.D., LCSW",
  date: "2026-03-12",
  time: "10:00 AM",
  duration: "50 minutes",
  modality: "Virtual",
  status: "CONFIRMED",
  sessionNotes: null,
  videoLink: "https://meet.openuphealth.com/session/abc123",
};

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-red-100 text-red-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

export default async function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appointment = { ...mockAppointment, id };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Link href="/app/appointments" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to Appointments
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Appointment Details</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Session #{appointment.id}</p>
      </div>

      {/* Main Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Session Information</CardTitle>
            <span className={`text-sm px-2.5 py-1 rounded-full font-medium ${statusColors[appointment.status]}`}>
              {appointment.status.charAt(0) + appointment.status.slice(1).toLowerCase()}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Therapist</p>
              <p className="font-medium text-foreground text-sm">{appointment.therapistName}</p>
              <p className="text-xs text-muted-foreground">{appointment.therapistCredentials}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date & Time</p>
              <p className="font-medium text-foreground text-sm flex items-center gap-1">
                <Calendar className="size-3" /> {appointment.date}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" /> {appointment.time} ({appointment.duration})
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Format</p>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="outline" className="gap-1 text-xs">
                  {appointment.modality === "Virtual" ? <Monitor className="size-3" /> : <MapPin className="size-3" />}
                  {appointment.modality}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {appointment.status === "CONFIRMED" && (
              <>
                <a href={appointment.videoLink} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">
                    <Video className="size-4" /> Join Session
                  </Button>
                </a>
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="size-4" /> Reschedule
                </Button>
                <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                  <X className="size-4" /> Cancel
                </Button>
              </>
            )}
            {appointment.status === "COMPLETED" && (
              <Button variant="outline" className="gap-2">
                <FileText className="size-4" /> Download Receipt
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="size-4" /> Session Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointment.status === "COMPLETED" && appointment.sessionNotes ? (
            <p className="text-sm text-muted-foreground leading-relaxed">{appointment.sessionNotes}</p>
          ) : appointment.status === "COMPLETED" ? (
            <p className="text-sm text-muted-foreground">No notes available for this session.</p>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="size-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Session notes will be available after your appointment.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help */}
      <Card className="bg-muted/30">
        <CardContent className="pt-5">
          <p className="text-sm text-muted-foreground">
            Need to make changes? Contact your therapist via{" "}
            <Link href="/app/messages" className="text-primary hover:underline">Messages</Link>{" "}
            or reach our care team at{" "}
            <a href="mailto:support@openuphealth.com" className="text-primary hover:underline">support@openuphealth.com</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
