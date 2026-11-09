import { NextRequest } from "next/server";
import { withDatabase } from "../../../middlewares/database.middleware";
import { withAdministrator, withAuthenticatedUser } from "../route.helpers";
import { NotificationController } from "../../../controllers/notification.controller";

export const POST = withDatabase(
  withAdministrator((request: NextRequest, db) =>
    NotificationController.notify(request, db)
  )
);

export const GET = withDatabase(
  withAuthenticatedUser((request, db) =>
    NotificationController.displayInSystem(request, db)
  )
);
