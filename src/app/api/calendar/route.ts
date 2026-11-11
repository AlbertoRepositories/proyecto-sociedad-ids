import { NextRequest } from "next/server";
import { withDatabase } from "../../../middlewares/database.middleware";
import {
  withAdministrator,
  withAuthenticatedUser,
} from "../route.helpers";
import { CalendarController } from "../../../controllers/calendar.controller";

export const GET = withDatabase(
  withAuthenticatedUser((request, db) =>
    CalendarController.displayEvents(request, db)
  )
);

export const POST = withDatabase(
  withAdministrator((request: NextRequest, db) =>
    CalendarController.registerEvent(request, db)
  )
);
