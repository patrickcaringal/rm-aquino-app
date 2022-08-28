import { REQUEST_STATUS } from "../../../../components/shared";

export const getMyAppointments = ({ id, data }) => {
  const res = data
    .filter((i) => !i.rejected)
    .reduce(
      (acc, i) => {
        const { date, startTime, patientId, status } = i;

        if (patientId === id) {
          // for approval
          if (status === REQUEST_STATUS.forapproval) {
            return {
              ...acc,
              forApproval: {
                ...acc?.forApproval,
                [date]: acc?.forApproval?.[date]
                  ? [...acc?.forApproval?.[date], startTime]
                  : [startTime],
              },
            };
          }

          // approved
          return {
            ...acc,
            mine: {
              ...acc?.mine,
              [date]: acc?.mine?.[date]
                ? [...acc?.mine?.[date], startTime]
                : [startTime],
            },
          };
        }

        // others
        return {
          ...acc,
          others: {
            ...acc?.others,
            [date]: acc?.others?.[date]
              ? [...acc?.others?.[date], startTime]
              : [startTime],
          },
        };
      },
      { mine: {}, forApproval: {}, others: {} }
    );

  return [res.mine, res.forApproval, res.others];
};
