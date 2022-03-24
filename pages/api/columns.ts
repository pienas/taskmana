import { getColumns } from "@lib/db";
import { NextApiRequest, NextApiResponse } from "next";

const result = async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const { columns } = await getColumns();
    res.status(200).json({ columns });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default result;
