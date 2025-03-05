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
                <TableCell>{activity.extra2 || "-"}</TableCell>
                <TableCell>{activity.extra3 || "-"}</TableCell>
                <TableCell>{activity.extra4 || "-"}</TableCell>
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
  if (type.startsWith("translation")) return <BsTranslate />
  return <HiQuestionMarkCircle />
}
