import { Router } from "express";
import { SpecialtyRouter } from "../modules/specialty/specialty.router";
import { AuthRouters } from "../modules/auth/auth.router";
import { UserRouters } from "../modules/user/user.router";
import { DoctorRouter } from "../modules/doctor/doctor.router";
import { AdminRoutes } from "../modules/admin/admin.route";
import { scheduleRoutes } from "../modules/schedule/schedule.route";
import { DoctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.route";
import { AppointmentRoutes } from "../modules/appointment/appointment.route";
import { PatientRoutes } from "../modules/patient/patient.router";
import { ReviewRoutes } from "../modules/review/review.route";
import { StatsRoutes } from "../modules/stats/stats.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { PrescriptionRoutes } from "../modules/prescription/prescription.route";

const router = Router();

router.use("/auth", AuthRouters);
router.use("/specialties", SpecialtyRouter);
router.use("/users", UserRouters);
router.use("/doctors", DoctorRouter);
router.use("/admins", AdminRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/doctor-schedules", DoctorScheduleRoutes);
router.use("/appointments", AppointmentRoutes);
router.use("/patients", PatientRoutes);
router.use("/reviews", ReviewRoutes);
router.use("/stats", StatsRoutes);
router.use("/payments", PaymentRoutes);
router.use("/prescriptions", PrescriptionRoutes);

export const IndexRoutes = router;
