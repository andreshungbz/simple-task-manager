// Filename: extractValidID.ts
// function that takes an Express request and returns a valid ID or null
// valid IDs are numbers that are positive and not 0

import { Request } from 'express';
import { NonNumberIDParamError } from '../lib/CustomErrors.js';

const extractValidID = (req: Request): number => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID and 0/negative values
  if (isNaN(taskID) || taskID < 1) {
    throw NonNumberIDParamError;
  }

  return taskID;
};

export default extractValidID;
