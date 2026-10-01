import { ConfirmDeleteButton } from "@/components/confirm-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { Badge } from "@/components/ui/badge";

export function CourseTable() {
  const courses = useEnrollmentStore((s) => s.courses);
  const removeCourse = useEnrollmentStore((s) => s.removeCourse);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสวิชา</TableHead>
            <TableHead>ชื่อวิชา</TableHead>
            <TableHead>หลักสูตร</TableHead>
            <TableHead>ภาคการศึกษา</TableHead>
            <TableHead>รายละเอียด</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead>รับข่าวสารทางอีเมล</TableHead>
            <TableHead className="w-20">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-20 text-center text-muted-foreground"
              >
                ยังไม่มีวิชาที่เปิดสอน
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              <TableCell>{course.courseId}</TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell>{course.program}</TableCell>
              <TableCell>{course.semester === "1" ?
              (
                <span>ภาคการศึกษาที่ 1</span>
              ) : (course.semester === "2" ? (
                <span>ภาคการศึกษาที่ 2</span>
              ) : (
                <span>ภาคฤดูร้อน</span>
              ))}
              </TableCell>
              <TableCell>{course.description?.length === 0 ? (
                <span className="text-muted-foreground">—</span>
              ) : (
                course.description
              )}
              </TableCell>
              <TableCell className="p-2 align-middle whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    {course.instructors.map((i) => (
                    <div key={i.email} className="leading-tight">
                      <div>{i.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {i.email}
                      </div>
                    </div>
                    ))}
                  </div>
              </TableCell>
              <TableCell>{course.notifyByEmail === true ? (
                <Badge variant="default">รับ</Badge>
              ) : (
                <Badge variant="secondary">ไม่รับ</Badge>
              )}
              </TableCell>
              <TableCell>
                <ConfirmDeleteButton
                  label={`ลบวิชา ${course.courseId}`}
                  title="ลบวิชา?"
                  description={`ลบ ${course.courseId} — ${course.courseTitle} ออกจากรายวิชาที่เปิดสอน พร้อมการลงทะเบียนทั้งหมดของวิชานี้`}
                  onConfirm={() => removeCourse(course.courseId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}