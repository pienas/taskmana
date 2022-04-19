import { getProjects } from "@lib/db";
import { NextApiRequest, NextApiResponse } from "next";

const result = async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const { projects } = await getProjects();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default result;
