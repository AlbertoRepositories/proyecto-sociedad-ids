import { NextRequest } from "next/server";
import { withDatabase } from "../../../../middlewares/database.middleware";
import { withAdministrator } from "../../route.helpers";
import { CalendarController } from "../../../../controllers/calendar.controller";

interface Context {
  params: Promise<{ postId: string }>;
}

export async function PATCH(request: NextRequest, context: Context) {
  const { postId } = await context.params;

  return withDatabase(
    withAdministrator((currentRequest, db) =>
      CalendarController.editEvent(currentRequest, db, postId)
    )
  )(request);
}

export async function DELETE(request: NextRequest, context: Context) {
  const { postId } = await context.params;

  return withDatabase(
    withAdministrator(async (currentRequest, db) => {
      const body = new NextRequest(
        new Request(currentRequest.url, {
          method: "POST",
          body: JSON.stringify({ eventId: postId }),
        })
      );

      return CalendarController.deleteEvent(body, db);
    })
  )(request);
}
