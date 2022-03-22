import { getTasks } from "@lib/db";
import { NextApiRequest, NextApiResponse } from "next";

const result = async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const { tasks } = await getTasks();
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default result;
