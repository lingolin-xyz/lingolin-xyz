import Title from "@/components/Title"
import { getRecentActivity } from "@/lib/postgres"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { timeSinceShorter } from "@/lib/time"
import { BsTranslate } from "react-icons/bs"
import { HiQuestionMarkCircle } from "react-icons/hi2"
import MiniAudioPlayer from "@/components/MiniAudioPlayer"
import Link from "next/link"

const ActivityLogPage = async () => {
  const recentActivity = await getRecentActivity()
  return (
    <div className="container mx-auto py-6">
      <Title>Recent Activity</Title>

      <div className="rounded-md border mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Type</TableHead>
              <TableHead>Extra</TableHead>
              <TableHead>Extra 2</TableHead>
              <TableHead>Extra 3</TableHead>
              <TableHead>Extra 4</TableHead>
              <TableHead>audio</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((activity: any) => (
              <TableRow key={activity.id}>
                <TableCell>
                  {getIconForActivityLogType(activity.event_type)}
                </TableCell>
                <TableCell>{activity.extra || "-"}</TableCell>
                <TableCell>
                  {/* type: {activity.event_type} */}
                  {activity.event_type === "transcribe-image" ? (
                    <div className="min-w-44">
                      <Link
                        href={activity.extra2}
                        target="_blank"
                        className="hover:opacity-80 transition-opacity active:opacity-60"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={activity.extra2}
                          alt="image"
                          className="h-12 rounded-md"
                        />
                      </Link>
                    </div>
                  ) : (
                    <>{activity.extra2 || "-"}</>
                  )}
                </TableCell>
                <TableCell>{activity.extra3 || "-"}</TableCell>
                <TableCell>{activity.extra4 || "-"}</TableCell>
                <TableCell>
                  {activity.extra5 && <MiniAudioPlayer src={activity.extra5} />}
                </TableCell>
                <TableCell className="text-right">
                  {timeSinceShorter(new Date(activity.created_at).getTime())}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ActivityLogPage

const getIconForActivityLogType = (type: string) => {
  if (type.startsWith("translation") || type.startsWith("save_voice_note"))
    return <BsTranslate />
  return <HiQuestionMarkCircle />
}
