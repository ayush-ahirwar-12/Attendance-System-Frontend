import api from "@/config/axios";

export const getCourseStudents = async (courseId: string) => {
    const response = await api.get(`/teacher/courses/${courseId}/students`);
    return response.data;
};
