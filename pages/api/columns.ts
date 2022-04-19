import { getColumns, getTasks } from "@lib/db";
import { NextApiRequest, NextApiResponse } from "next";

const result = async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const { columns } = await getColumns();
    if (columns)
      await Promise.all(
        columns?.map(async (column) => {
          const { tasks } = await getTasks(column.id);
          column.cards = tasks;
        })
      );
    res.status(200).json(columns);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default result;
