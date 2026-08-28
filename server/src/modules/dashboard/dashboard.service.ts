// dashboard.service.ts

import { Types } from "mongoose";
import { Issue } from "../issue/issue.modal.js";
import { convertGroupsToObject, getCount } from "../../utils/helper.js";

export const getDashboardStats = async (workspaceId: string) => {
  const workspaceObjectId = new Types.ObjectId(workspaceId);
  const currentDate = new Date();

  const [result] = await Issue.aggregate([
    {
      $match: {
        workspace: workspaceObjectId,
      },
    },
    {
      $facet: {
        totalIssues: [
          {
            $count: "count",
          },
        ],

        byStatus: [
          {
            $group: {
              _id: "$status",
              count: {
                $sum: 1,
              },
            },
          },
        ],

        byPriority: [
          {
            $group: {
              _id: "$priority",
              count: {
                $sum: 1,
              },
            },
          },
        ],

        assignedIssues: [
          {
            $match: {
              assignee: {
                $ne: null,
              },
            },
          },
          {
            $count: "count",
          },
        ],

        unassignedIssues: [
          {
            $match: {
              $or: [{ assignee: null }, { assignee: { $exists: false } }],
            },
          },
          {
            $count: "count",
          },
        ],

        overdueIssues: [
          {
            $match: {
              dueDate: {
                $lt: currentDate,
              },
              status: {
                $ne: "done",
              },
            },
          },
          {
            $count: "count",
          },
        ],
      },
    },
  ]);

return {
  totalIssues: getCount(result?.totalIssues),

  byStatus: convertGroupsToObject(result?.byStatus),

  byPriority: convertGroupsToObject(result?.byPriority),

  assignedIssues: getCount(result?.assignedIssues),

  unassignedIssues: getCount(result?.unassignedIssues),

  overdueIssues: getCount(result?.overdueIssues),
};
};
