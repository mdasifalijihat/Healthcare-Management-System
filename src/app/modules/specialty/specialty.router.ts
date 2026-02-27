import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post('/', SpecialtyController.createSpecialty)
router.get('/',checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR, Role.PATIENT), SpecialtyController.getAllSpecialties)
router.patch('/:id', SpecialtyController.updateSpecialties)
router.delete('/:id', SpecialtyController.deleteSpecialties)

export const SpecialtyRouter = router; 