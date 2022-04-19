import { getColumns, getTasks } from "@lib/db";
import { NextApiRequest, NextApiResponse } from "next";

const result = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { projectId } = req.query;
    const { columns } = await getColumns(projectId as string);
    if (columns)
      await Promise.all(
        columns?.map(async (column) => {
          const { tasks } = await getTasks(projectId as string, column.id);
          column.cards = tasks;
        })
      );
    res.status(200).json(columns);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default result;
