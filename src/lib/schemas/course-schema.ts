import { z } from "zod";

import type { Course } from "@/lib/types";

export const MAX_EMAILS = 3;
export const MAX_LENGTH = 100;

export const courseFormSchema = z.object({
    courseId: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก"),
    courseTitle: z
        .string()
        .trim()
        .min(1, "กรอกชื่อวิชา")
        .max(100, "ชื่อวิชาความยาวไม่เกิน 100 ตัวอักษร"),
    instructors: z
        .array(z.object({
            name: z.string().trim().min(1, "กรอกชื่อผู้สอน"),
            email: z.email({
                pattern: /@cmu\.ac\.th$/,
                error: "อีเมลไม่ถูกต้อง"})
        }))
        .min(1, "ต้องมีอีเมลอย่างน้อย 1 อีเมล")
        .max(MAX_EMAILS, `มีอีเมลได้ไม่เกิน ${MAX_EMAILS} อีเมล`)
        .refine((items) => 
            new Set(items.map((i) => i.email.toLowerCase())).size ===
        items.length,
        "อีเมลซ้ำกัน",),
    program: z.enum(["CPE", "ISNE"], { message: "เลือกหลักสูตร" }),
    semester: z.enum(["1", "2", "3"], { message: "เลือกเทอม" }),
    description: z.string().max(MAX_LENGTH, ""),
    notifyByEmail: z.boolean(),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;

export function createCourseFormSchema(existingCourse: Course[]) {
    return courseFormSchema.refine(
        (data) => !existingCourse.some((c) => c.courseId === data.courseId),
        { message: "รหัสวิชานี้มีอยู่แล้ว", path: ["courseId"] },
    )
}