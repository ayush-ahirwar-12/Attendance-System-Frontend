export * from "./auth/login";
export * from "./auth/register";
export * from "./user/update";
export * from "./auth/verify"
export * from "./auth/logout"

export * from "./class/getClasses";
export * from "./class/createClass";
export * from "./class/updateClass";
export * from "./class/deleteClass";

export * from "./course/getCourses";
export * from "./course/createCourse";
export * from "./course/updateCourse";
export * from "./course/deleteCourse";

export * from "./user/getTeachers";
export * from "./user/getAllUsers";
export * from "./user/updateRole";
export * from "./user/getStudents";


export * from "./enrollment/enrollStudent";
export * from "./enrollment/getEnrollments";   // exports getEnrollmentsByClass
export * from "./enrollment/updateEnrollment";
export * from "./enrollment/deleteEnrollment";

export * from "./lecture/createRequest";
export * from "./lecture/generateLectures";
export * from "./lecture/getMyRequests";
export * from "./lecture/getPendingRequests";
export * from "./lecture/getTodaySchedule";
export * from "./lecture/getWeekSchedule";
export * from "./lecture/reviewRequest";
export * from "./lecture/updateTopic";

export * from "./attendance/getMyAttendance";
export * from "./attendance/manualMark";
export * from "./attendance/markAttendance";
export * from "./attendance/overrideRecord";

export * from "./session/closeSession";
export * from "./session/getLiveSession";
export * from "./session/startSession";

export * from "./course/getTeacherCourses";
export * from "./course/getCourseStudents";
