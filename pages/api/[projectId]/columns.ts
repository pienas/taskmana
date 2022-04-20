import { getColumns, getProjects, getTasks, verifyProjectOwner } from "@lib/db";
import { auth } from "@lib/firebaseAdmin";
import { NextApiRequest, NextApiResponse } from "next";

const result = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { uid } = await auth.verifyIdToken(req.headers.token as string);
    const { projectId } = req.query;
    const isOwner = await verifyProjectOwner(uid, projectId as string);
    if (isOwner) {
      const { columns } = await getColumns(projectId as string);
      if (columns)
        await Promise.all(
          columns?.map(async (column) => {
            const { tasks } = await getTasks(projectId as string, column.id);
            column.cards = tasks;
          })
        );
      res.status(200).json(columns);
    } else {
      res
        .status(500)
        .json({ error: "You are not authorized to view this project" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default result;
