// Filename: extractValidID.ts
// function that takes an Express request and returns a valid ID or null
// valid IDs are numbers that are positive and not 0

import { Request } from 'express';

const extractValidID = (req: Request): number | null => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID and 0/negative values
  return isNaN(taskID) || taskID < 1 ? null : taskID;
};

export default extractValidID;
