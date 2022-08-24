export const getMyForApprovalAppointments = ({ id, data }) => {
  const res = data.reduce((acc, i) => {
    if (i.patientId === id && !i.approved && !i.rejected) {
      return {
        ...acc,
        [i.date]: !!acc[i.date] ? [...acc[i.date], i.startTime] : [i.startTime],
      };
    }

    return acc;
  }, {});

  return res;
};

export const getMyAppointments = ({ id, data }) => {
  const res = data.reduce(
    (acc, i) => {
      const { date, startTime, patientId, approved, rejected } = i;

      if (patientId === id) {
        if (!approved && !rejected) {
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
