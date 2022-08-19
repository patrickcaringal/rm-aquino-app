export const getMyForApprovalAppointments = ({ data }) => {
  const res = data.reduce((acc, i) => {
    if (!i.approved && !i.rejected) {
      return {
        ...acc,
        [i.date]: !!acc[i.date] ? [...acc[i.date], i.startTime] : [i.startTime],
      };
    }

    return acc;
  }, {});

  return res;
};

export const getMyApprovedAppointments = (data) => {
  const res = data.filter((i) => i.approved);
  return res;
};
