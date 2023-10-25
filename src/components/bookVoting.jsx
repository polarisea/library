/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Rate, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { VOTING_VALUES } from "../constants";
import { vote as requestVote } from "../slices/book";

function BookVoting({ bookId }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.book.loading);
  const error = useSelector((state) => state.book.error);

  const [value, setValue] = useState(3);

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message) => {
    api[message.type]({
      message: message.title,
      description: message.content,
      placement: "topRight",
    });
  };

  useEffect(() => {
    if (loading == false && value != 0) {
      if (error) {
        openNotification({
          title: "Thông báo",
          type: "error",
          content: "Vote thất bại.",
        });
        return;
      }
      openNotification({
        title: "Thông báo",
        type: "success",
        content: "Vote thành không.",
      });
    }
  }, [loading]);

  const vote = (value) => {
    setValue(value);
    dispatch(requestVote({ value: VOTING_VALUES[value - 1], book: bookId }));
  };
  return (
    <>
      {contextHolder}
      <span>
        <Rate
          tooltips={VOTING_VALUES}
          onChange={vote}
          value={value}
          defaultValue="3"
        />
        {value ? (
          <span className="ant-rate-text">{VOTING_VALUES[value - 1]}</span>
        ) : (
          ""
        )}
      </span>
    </>
  );
}

export default BookVoting;
